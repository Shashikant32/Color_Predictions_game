import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-violet-400">ColorPredict</h3>
            <p className="text-gray-400">
              The exciting color prediction game where you can test your luck and win big!
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-violet-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/game" className="text-gray-400 hover:text-violet-400 transition-colors">
                  Play Game
                </Link>
              </li>
              <li>
                <Link to="/referrals" className="text-gray-400 hover:text-violet-400 transition-colors">
                  Referral Program
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-3">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-violet-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-violet-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/responsible-gaming" className="text-gray-400 hover:text-violet-400 transition-colors">
                  Responsible Gaming
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} ColorPredict. All rights reserved.</p>
          <p className="mt-2 text-sm">
            This is a demonstration game. No real money is involved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;