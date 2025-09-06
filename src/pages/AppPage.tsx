import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  WalletIcon,
  ChartBarIcon,
  CubeTransparentIcon,
  SparklesIcon,
  FireIcon,
  TrophyIcon,
  RocketLaunchIcon,
  LinkIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import XConnection from '../components/XConnection';
import SocialDashboard from '../components/SocialDashboard';
import WalletNotification from '../components/WalletNotification';
import { useAuth } from '../contexts/AuthContext';

const AppPage: React.FC = () => {
  const { isConnected, connectWallet, loading, isCorrectNetwork, switchToSomnia, showWalletNotification, setShowWalletNotification } = useAuth();

  const FloatingIcon = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: [0.4, 1, 0.4],
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
      className="absolute text-purple-400/30"
    >
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-500/20 rounded-full"
              animate={{
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: Math.random() * 8 + 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="relative z-10 border-b border-white/5 backdrop-blur-sm">
        <Navbar />
      </div>
      
      <main className="relative z-10 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {!isConnected ? (
            <motion.div
              key="connect"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="text-center relative"
            >
              {/* Floating Icons */}
              <div className="relative">
                <FloatingIcon delay={0}>
                  <ChartBarIcon className="w-16 h-16" style={{ left: '10%', top: '20%' }} />
                </FloatingIcon>
                <FloatingIcon delay={1}>
                  <CubeTransparentIcon className="w-12 h-12" style={{ right: '15%', top: '15%' }} />
                </FloatingIcon>
                <FloatingIcon delay={2}>
                  <SparklesIcon className="w-14 h-14" style={{ left: '20%', bottom: '20%' }} />
                </FloatingIcon>
                <FloatingIcon delay={1.5}>
                  <TrophyIcon className="w-10 h-10" style={{ right: '20%', bottom: '25%' }} />
                </FloatingIcon>
              </div>

              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-8"
                >
                  <div className="flex justify-center mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-6"
                    >
                      <LinkIcon className="w-10 h-10 text-white" />
                    </motion.div>
                  </div>
                  
                  <h1 className="text-5xl md:text-6xl font-bold mb-8">
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                      Welcome to SoRe
                    </span>
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-gray-100 leading-relaxed mb-8 max-w-2xl mx-auto">
                    Connect your wallet to start building your reputation and join the KOL marketplace on Somnia blockchain
                  </p>
                </motion.div>

                {/* Time Marketplace Feature Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-8 max-w-3xl mx-auto mb-12"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ 
                        boxShadow: [
                          "0 0 20px rgb(168 85 247 / 0.4)",
                          "0 0 30px rgb(168 85 247 / 0.6)", 
                          "0 0 20px rgb(168 85 247 / 0.4)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    >
                      <ClockIcon className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                        Time Marketplace
                      </span>
                    </h3>
                    <p className="text-gray-100 mb-6 text-lg">
                      Book one-on-one sessions with top KOLs and industry experts
                    </p>
                    
                    <Link to="/marketplace">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                      >
                        <span className="flex items-center justify-center">
                          <ClockIcon className="w-5 h-5 mr-2" />
                          Explore Marketplace
                          <RocketLaunchIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <motion.div
                          className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 max-w-md mx-auto"
                >
                  <div className="flex items-center justify-center mb-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center"
                    >
                      <WalletIcon className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h3>
                  <p className="text-gray-300 mb-6">
                    Secure connection to the Somnia network to start your reputation journey
                  </p>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={connectWallet}
                    disabled={loading}
                    className="w-full group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center justify-center">
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <RocketLaunchIcon className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                          Connect MetaMask
                        </>
                      )}
                    </span>
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.02 }}
                    />
                  </motion.button>
                </motion.div>

                {/* Features Preview */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {[
                    {
                      icon: FireIcon,
                      title: "Build Reputation",
                      description: "Track social metrics and on-chain activity",
                      gradient: "from-red-500 to-pink-500"
                    },
                    {
                      icon: CubeTransparentIcon,
                      title: "Earn NFTs",
                      description: "Level up from Bronze to Diamond tier",
                      gradient: "from-yellow-500 to-orange-500"
                    },
                    {
                      icon: TrophyIcon,
                      title: "Monetize Time",
                      description: "Sell consultation slots to your community",
                      gradient: "from-green-500 to-emerald-500"
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center"
                    >
                      <motion.div
                        className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mx-auto mb-4`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <feature.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-300 text-sm">{feature.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-4">
                  <motion.div
                    animate={{ 
                      boxShadow: [
                        "0 0 20px rgb(147 51 234 / 0.3)",
                        "0 0 30px rgb(147 51 234 / 0.5)", 
                        "0 0 20px rgb(147 51 234 / 0.3)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center"
                  >
                    <LinkIcon className="w-8 h-8 text-white" />
                  </motion.div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    SoRe Dashboard
                  </span>
                </h1>
                <p className="text-xl text-gray-300">
                  Track your reputation, connect socials, and monetize your influence
                </p>
                
                {/* Network Status Banner */}
                {isConnected && !isCorrectNetwork && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 max-w-2xl mx-auto"
                  >
                    <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <motion.div
                          className="w-3 h-3 bg-yellow-400 rounded-full mr-3"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                        <span className="text-yellow-300 font-medium">
                          Please switch to Somnia Testnet to continue
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={switchToSomnia}
                        className="px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors duration-200"
                      >
                        Switch Network
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* X Connection Section with enhanced styling */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-2xl mx-auto"
              >
                <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-white/10 rounded-3xl p-1">
                  <div className="bg-slate-900/50 backdrop-blur-sm rounded-3xl p-6">
                    <XConnection />
                  </div>
                </div>
              </motion.div>

              {/* Social Dashboard with enhanced styling */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="bg-gradient-to-br from-purple-900/10 to-blue-900/10 backdrop-blur-sm border border-white/5 rounded-3xl p-1">
                  <div className="bg-slate-900/30 backdrop-blur-sm rounded-3xl p-6">
                    <SocialDashboard />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Wallet Installation Notification */}
      <WalletNotification 
        isVisible={showWalletNotification}
        onClose={() => setShowWalletNotification(false)}
      />
    </div>
  );
};

export default AppPage;