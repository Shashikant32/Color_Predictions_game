/*
  # Admin Functions for Game Management
  
  1. Functions
    - Create new game round
    - End game round with result
    - Manage user wallets
    - Process referral commissions
*/

-- Function to create a new game round
CREATE OR REPLACE FUNCTION create_game_round(
  p_admin_id uuid,
  p_start_time timestamptz DEFAULT now(),
  p_duration interval DEFAULT interval '1 minute'
)
RETURNS uuid AS $$
DECLARE
  v_round_id uuid;
  v_round_number bigint;
BEGIN
  -- Check if admin
  IF NOT EXISTS (
    SELECT 1 FROM users 
    WHERE id = p_admin_id AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;
  
  -- Get next round number
  SELECT COALESCE(MAX(round_number), 0) + 1
  INTO v_round_number
  FROM game_rounds;
  
  -- Create new round
  INSERT INTO game_rounds (
    round_number,
    start_time,
    end_time,
    status,
    created_by
  )
  VALUES (
    v_round_number,
    p_start_time,
    p_start_time + p_duration,
    'waiting',
    p_admin_id
  )
  RETURNING id INTO v_round_id;
  
  RETURN v_round_id;
END;
$$ LANGUAGE plpgsql;

-- Function to end a game round
CREATE OR REPLACE FUNCTION end_game_round(
  p_admin_id uuid,
  p_round_id uuid,
  p_winning_color text
)
RETURNS void AS $$
BEGIN
  -- Check if admin
  IF NOT EXISTS (
    SELECT 1 FROM users 
    WHERE id = p_admin_id AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;
  
  -- Update round
  UPDATE game_rounds
  SET 
    status = 'ended',
    winning_color = p_winning_color
  WHERE id = p_round_id;
  
  -- Process bet results
  PERFORM process_bet_results(p_round_id, p_winning_color);
END;
$$ LANGUAGE plpgsql;

-- Function to adjust user wallet balance
CREATE OR REPLACE FUNCTION adjust_wallet_balance(
  p_admin_id uuid,
  p_user_id uuid,
  p_amount decimal,
  p_type text,
  p_description text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  -- Check if admin
  IF NOT EXISTS (
    SELECT 1 FROM users 
    WHERE id = p_admin_id AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;
  
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
    ABS(p_amount),
    p_type,
    'completed',
    COALESCE(p_description, 'Admin adjustment')
  );
  
  -- Update user balance
  UPDATE users
  SET wallet_balance = wallet_balance + p_amount
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to process referral commission
CREATE OR REPLACE FUNCTION process_referral_commission(
  p_bet_id uuid,
  p_commission_rate decimal DEFAULT 0.1
)
RETURNS void AS $$
DECLARE
  v_referrer_id uuid;
  v_commission decimal;
BEGIN
  -- Get referrer for bet user
  SELECT u2.id INTO v_referrer_id
  FROM bets b
  JOIN users u1 ON b.user_id = u1.id
  JOIN users u2 ON u1.referred_by = u2.referral_code
  WHERE b.id = p_bet_id;
  
  IF v_referrer_id IS NOT NULL THEN
    -- Calculate commission
    SELECT b.amount * p_commission_rate INTO v_commission
    FROM bets b
    WHERE b.id = p_bet_id;
    
    -- Create referral transaction
    INSERT INTO transactions (
      user_id,
      amount,
      type,
      status,
      description
    )
    VALUES (
      v_referrer_id,
      v_commission,
      'referral',
      'completed',
      'Referral commission from bet ' || p_bet_id
    );
    
    -- Update referrer balance
    UPDATE users
    SET wallet_balance = wallet_balance + v_commission
    WHERE id = v_referrer_id;
    
    -- Update referral record
    INSERT INTO referrals (
      referrer_id,
      referred_id,
      commission,
      status
    )
    SELECT
      v_referrer_id,
      b.user_id,
      v_commission,
      'completed'
    FROM bets b
    WHERE b.id = p_bet_id;
  END IF;
END;
$$ LANGUAGE plpgsql;