import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  LinkIcon, 
  SparklesIcon, 
  CubeTransparentIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  TrophyIcon,
  StarIcon,
  ArrowRightIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import WalletNotification from '../components/WalletNotification';
import { useAuth } from '../contexts/AuthContext';

const LandingPage: React.FC = () => {
  const { showWalletNotification, setShowWalletNotification } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full"
              animate={{
                x: [0, Math.random() * 1000],
                y: [0, Math.random() * 1000],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
            />
          ))}
        </div>
        
        {/* Blockchain Network Animation */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 1000 1000" className="w-full h-full">
            <defs>
              <linearGradient id="chainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
            {[...Array(8)].map((_, i) => (
              <g key={i}>
                <circle
                  cx={200 + (i % 4) * 200}
                  cy={200 + Math.floor(i / 4) * 400}
                  r="30"
                  fill="none"
                  stroke="url(#chainGradient)"
                  strokeWidth="2"
                />
                <motion.circle
                  cx={200 + (i % 4) * 200}
                  cy={200 + Math.floor(i / 4) * 400}
                  r="5"
                  fill="#8B5CF6"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                />
              </g>
            ))}
          </svg>
        </motion.div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center"
              >
                <LinkIcon className="w-6 h-6 text-white" />
              </motion.div>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              SoRe
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <Link 
              to="/app"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
            >
              Launch App
            </Link>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.h1 
              className="text-6xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Tokenize Your
              </span>
              <br />
              <span className="text-white">Reputation</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              The first blockchain-powered <span className="text-purple-300 font-semibold">time marketplace</span> for KOLs. 
              Book one-on-one sessions with experts, build your social capital, and monetize your expertise.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                to="/marketplace"
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center">
                  <ClockIcon className="w-5 h-5 mr-2" />
                  Book Time with KOLs
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.05 }}
                />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </Link>
              
              <Link
                to="/app" 
                className="px-8 py-4 border-2 border-purple-500/50 text-purple-300 font-semibold rounded-full hover:border-purple-400 hover:text-purple-200 transform hover:scale-105 transition-all duration-300"
              >
                Build Reputation
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Time Marketplace Feature Section */}
      <section className="relative z-10 px-6 py-20 bg-gradient-to-b from-purple-900/20 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgb(168 85 247 / 0.3)",
                    "0 0 30px rgb(168 85 247 / 0.5)", 
                    "0 0 20px rgb(168 85 247 / 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center"
              >
                <ClockIcon className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Time Marketplace
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              The world's first blockchain-powered platform where KOLs can sell their time directly to their community. 
              Book one-on-one sessions, get personalized advice, and learn from the best.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Features */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {[
                {
                  icon: UserGroupIcon,
                  title: "500+ Expert KOLs",
                  description: "Access top influencers and experts across DeFi, NFTs, Gaming, and Trading"
                },
                {
                  icon: StarIcon,
                  title: "Verified Reputation",
                  description: "All KOLs are verified through our on-chain reputation system with transparent ratings"
                },
                {
                  icon: SparklesIcon,
                  title: "Instant Booking",
                  description: "Book sessions instantly with smart contracts - secure, transparent, and automated"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Right side - Mock KOL Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" 
                    alt="KOL"
                    className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/50"
                  />
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-white">Alex Chen</h3>
                    <p className="text-purple-300">@alexchen</p>
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-cyan-500/20 border-cyan-500/30 text-cyan-400 mt-2">
                      <TrophyIcon className="w-3 h-3 mr-1" />
                      Diamond Tier
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">4.9</div>
                    <div className="text-sm text-gray-400">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">89</div>
                    <div className="text-sm text-gray-400">Sessions</div>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6">
                  Get personalized DeFi strategies and portfolio review. Expert in yield farming and risk management.
                </p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="flex items-center text-purple-300">
                    <ClockIcon className="w-5 h-5 mr-1" />
                    30 min
                  </span>
                  <span className="flex items-center text-green-400 font-bold">
                    <span className="mr-1">💎</span>
                    150 STT
                  </span>
                </div>
                
                <Link to="/marketplace">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
                  >
                    Book Session
                  </motion.button>
                </Link>
              </div>
              
              {/* Floating elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center"
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-white text-sm">🔥</span>
              </motion.div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-16"
          >
            <Link to="/marketplace">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 relative group"
              >
                <span className="flex items-center">
                  <ClockIcon className="w-6 h-6 mr-3" />
                  Explore Time Marketplace
                  <ArrowRightIcon className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Your Reputation,{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Quantified
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Multi-dimensional scoring system that tracks your on-chain activity, social metrics, and token holdings
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: CubeTransparentIcon,
                title: "NFT Reputation Tokens",
                description: "Your reputation evolves into unique NFTs with Bronze, Silver, Gold, and Diamond tiers",
                gradient: "from-yellow-500 to-orange-500"
              },
              {
                icon: UserGroupIcon,
                title: "Social Integration",
                description: "Connect your X (Twitter) account and track followers, engagement, and social influence",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: CalendarDaysIcon,
                title: "Time Marketplace",
                description: "Monetize your expertise by selling consultation time slots to your community",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: SparklesIcon,
                title: "On-Chain Analytics",
                description: "Track trading volume, transactions, gas usage, and staking activity automatically",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: TrophyIcon,
                title: "Leaderboards",
                description: "Compete with other KOLs and climb the rankings based on comprehensive metrics",
                gradient: "from-red-500 to-rose-500"
              },
              {
                icon: StarIcon,
                title: "Point System",
                description: "Earn points through volume, transactions, staking, and social activity daily",
                gradient: "from-indigo-500 to-purple-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative"
              >
                <div className="h-full p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
                  <motion.div
                    className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "50%", label: "On-Chain Activity Weight", delay: 0 },
                { number: "40%", label: "Social Metrics Weight", delay: 0.2 },
                { number: "10%", label: "Holdings Weight", delay: 0.4 },
                { number: "4", label: "Reputation Tiers", delay: 0.6 }
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: stat.delay }}
                  className="group"
                >
                  <motion.div 
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-gray-300 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Level Up Your{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Influence?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the future of reputation-based marketplaces on Somnia blockchain
            </p>
            <Link
              to="/app"
              className="inline-block px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
            >
              Launch SoRe App
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">SoRe</span>
          </div>
          <p className="text-gray-400">
            Built on Somnia • Powered by Reputation • Secured by Blockchain
          </p>
        </div>
      </footer>
      
      {/* Wallet Installation Notification */}
      <WalletNotification 
        isVisible={showWalletNotification}
        onClose={() => setShowWalletNotification(false)}
      />
    </div>
  );
};

export default LandingPage;