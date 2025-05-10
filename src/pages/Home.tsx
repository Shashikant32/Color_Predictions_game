import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-violet-500/20 to-green-500/20 z-0"></div>
          <div className="container mx-auto px-4 py-24 relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Predict & Win with <span className="text-violet-400">ColorPredict</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                The most exciting color prediction game. Choose Red, Green, or Violet and win big in just 60 seconds!
              </p>
              <button
                onClick={() => navigate(isAuthenticated ? '/game' : '/register')}
                className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105 flex items-center justify-center mx-auto"
              >
                {isAuthenticated ? 'Play Now' : 'Get Started'}
                <ArrowRight className="ml-2" size={20} />
              </button>
            </div>
          </div>
        </section>
        
        {/* How to Play Section */}
        <section className="py-16 bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              How to Play
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: '1. Choose a Color',
                  description: 'Select from Red, Green, or Violet for the upcoming round.'
                },
                {
                  title: '2. Place Your Bet',
                  description: 'Decide how much to wager from your wallet balance.'
                },
                {
                  title: '3. Collect Your Winnings',
                  description: 'If your prediction is correct, you win 2x your bet amount!'
                }
              ].map((step, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-violet-400 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-300">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Color Showcase */}
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Pick Your Winning Color
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { color: 'Red', bgClass: 'bg-red-600', hoverClass: 'hover:bg-red-700' },
                { color: 'Green', bgClass: 'bg-green-600', hoverClass: 'hover:bg-green-700' },
                { color: 'Violet', bgClass: 'bg-violet-600', hoverClass: 'hover:bg-violet-700' }
              ].map((item) => (
                <div 
                  key={item.color}
                  className={`
                    ${item.bgClass} ${item.hoverClass} rounded-lg p-8 shadow-lg 
                    text-center text-white font-bold text-2xl
                    transition-all transform hover:scale-105 cursor-pointer
                  `}
                  onClick={() => navigate(isAuthenticated ? '/game' : '/register')}
                >
                  {item.color}
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Game Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Quick Rounds',
                  description: 'Each game round lasts just 60 seconds - perfect for quick play.'
                },
                {
                  title: 'Secure Wallet',
                  description: 'Your game credits are safely stored in your digital wallet.'
                },
                {
                  title: 'Real-time Results',
                  description: 'Watch live as the winning color is revealed after each round.'
                },
                {
                  title: 'Refer & Earn',
                  description: 'Invite friends and earn a commission on their bets.'
                }
              ].map((feature, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-6 shadow-lg hover:bg-gray-600 transition-colors">
                  <h3 className="text-xl font-semibold text-violet-400 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-violet-900 to-indigo-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Test Your Luck?
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-8">
              Join thousands of players making predictions and winning big with ColorPredict.
            </p>
            <button
              onClick={() => navigate(isAuthenticated ? '/game' : '/register')}
              className="bg-white text-violet-900 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105"
            >
              {isAuthenticated ? 'Play Now' : 'Create Account'}
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;