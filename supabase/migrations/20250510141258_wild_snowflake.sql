/*
  # Initial Schema Setup for Color Prediction Game

  1. New Tables
    - `users`
      - Extends Supabase auth.users with additional user data
      - Stores wallet balance, referral info, and admin status
    - `game_rounds`
      - Tracks each game round
      - Stores round timing and results
    - `bets`
      - Records user bets for each round
      - Tracks bet amount and outcome
    - `transactions`
      - Logs all wallet transactions
      - Includes deposits, withdrawals, bets, and winnings
    - `referrals`
      - Tracks referral relationships and commissions
      
  2. Security
    - Enable RLS on all tables
    - Set up policies for user access
    - Admin-specific policies for management
*/

-- Users table extending auth.users
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text UNIQUE NOT NULL,
  wallet_balance decimal(10,2) DEFAULT 0.00 CHECK (wallet_balance >= 0),
  referral_code text UNIQUE NOT NULL,
  referred_by text REFERENCES users(referral_code),
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Game rounds table
CREATE TABLE IF NOT EXISTS game_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  round_number bigint UNIQUE NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  winning_color text CHECK (winning_color IN ('red', 'green', 'violet')),
  status text DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'ended')),
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id)
);

ALTER TABLE game_rounds ENABLE ROW LEVEL SECURITY;

-- Bets table
CREATE TABLE IF NOT EXISTS bets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  round_id uuid REFERENCES game_rounds(id) NOT NULL,
  color_prediction text NOT NULL CHECK (color_prediction IN ('red', 'green', 'violet')),
  amount decimal(10,2) NOT NULL CHECK (amount > 0),
  potential_win decimal(10,2) NOT NULL,
  won boolean,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  amount decimal(10,2) NOT NULL,
  type text NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'bet', 'win', 'referral')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES users(id) NOT NULL,
  referred_id uuid REFERENCES users(id) NOT NULL,
  commission decimal(10,2) DEFAULT 0.00,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "Admins can update users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
  ));

-- Game rounds policies
CREATE POLICY "Anyone can read active game rounds"
  ON game_rounds
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert game rounds"
  ON game_rounds
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "Admins can update game rounds"
  ON game_rounds
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
  ));

-- Bets policies
CREATE POLICY "Users can read own bets"
  ON bets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bets"
  ON bets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can read all bets"
  ON bets
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
  ));

-- Transactions policies
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can read all transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "Admins can update transactions"
  ON transactions
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
  ));

-- Referrals policies
CREATE POLICY "Users can read own referrals"
  ON referrals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Admins can read all referrals"
  ON referrals
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
  ));

-- Functions

-- Function to process bet results
CREATE OR REPLACE FUNCTION process_bet_results(round_id uuid, winning_color text)
RETURNS void AS $$
BEGIN
  -- Update bets with win/loss status
  UPDATE bets
  SET won = (color_prediction = winning_color)
  WHERE round_id = $1;
  
  -- Create win transactions for winning bets
  INSERT INTO transactions (user_id, amount, type, status, description)
  SELECT 
    user_id,
    potential_win,
    'win',
    'completed',
    'Won bet on ' || color_prediction
  FROM bets
  WHERE round_id = $1 AND color_prediction = winning_color;
  
  -- Update user wallet balances for winners
  UPDATE users u
  SET wallet_balance = wallet_balance + b.potential_win
  FROM bets b
  WHERE b.round_id = $1 
    AND b.color_prediction = winning_color 
    AND b.user_id = u.id;
END;
$$ LANGUAGE plpgsql;

-- Function to place a bet
CREATE OR REPLACE FUNCTION place_bet(
  p_user_id uuid,
  p_round_id uuid,
  p_color text,
  p_amount decimal
)
RETURNS uuid AS $$
DECLARE
  v_bet_id uuid;
  v_user_balance decimal;
  v_round_status text;
BEGIN
  -- Check user balance
  SELECT wallet_balance INTO v_user_balance
  FROM users
  WHERE id = p_user_id;
  
  IF v_user_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient wallet balance';
  END IF;
  
  -- Check round status
  SELECT status INTO v_round_status
  FROM game_rounds
  WHERE id = p_round_id;
  
  IF v_round_status != 'active' THEN
    RAISE EXCEPTION 'Round is not active';
  END IF;
  
  -- Create bet
  INSERT INTO bets (
    user_id,
    round_id,
    color_prediction,
    amount,
    potential_win
  )
  VALUES (
    p_user_id,
    p_round_id,
    p_color,
    p_amount,
    p_amount * 2
  )
  RETURNING id INTO v_bet_id;
  
  -- Create transaction
  INSERT INTO transactions (
    user_id,
    amount,
    type,
    status,
    description
  )
  VALUES (
    p_user_id,
    p_amount,
    'bet',
    'completed',
    'Bet placed on ' || p_color
  );
  
  -- Update user balance
  UPDATE users
  SET wallet_balance = wallet_balance - p_amount
  WHERE id = p_user_id;
  
  RETURN v_bet_id;
END;
$$ LANGUAGE plpgsql;