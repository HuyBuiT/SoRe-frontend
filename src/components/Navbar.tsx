import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  LinkIcon, 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  UserCircleIcon,
  WalletIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isConnected, walletAddress, connectWallet, disconnectWallet, loading, isCorrectNetwork, switchToSomnia } = useAuth();

  return (
    <nav className="relative bg-slate-900/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
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
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
              <Link 
                to="/" 
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-200"
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                Home
              </Link>
              <Link 
                to="/marketplace" 
                className="flex items-center text-purple-300 hover:text-purple-100 transition-colors duration-200 relative group"
              >
                <ClockIcon className="w-5 h-5 mr-2" />
                <span className="font-semibold">Time Marketplace</span>
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </Link>
              <Link 
                to="/app" 
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-200"
              >
                <UserCircleIcon className="w-5 h-5 mr-2" />
                Dashboard
              </Link>
            </nav>

            {/* Wallet Connection */}
            <div className="flex items-center space-x-3">
              {isConnected ? (
                <div className="flex items-center space-x-3">
                  {/* Network Status */}
                  {!isCorrectNetwork && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={switchToSomnia}
                      className="px-3 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-sm font-medium flex items-center hover:bg-yellow-500/30 transition-all duration-200"
                    >
                      <motion.div
                        className="w-2 h-2 bg-yellow-400 rounded-full mr-2"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      Switch to Somnia
                    </motion.button>
                  )}
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`px-3 py-2 ${isCorrectNetwork ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-red-500/20 border-red-500/30 text-red-400'} border rounded-full text-sm font-medium flex items-center`}
                  >
                    <motion.div
                      className={`w-2 h-2 ${isCorrectNetwork ? 'bg-green-400' : 'bg-red-400'} rounded-full mr-2`}
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={disconnectWallet}
                    className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-all duration-200"
                  >
                    Disconnect
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={connectWallet}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                  ) : (
                    <WalletIcon className="w-4 h-4 mr-2" />
                  )}
                  {loading ? 'Connecting...' : 'Connect Wallet'}
                </motion.button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isMenuOpen ? 1 : 0, 
          height: isMenuOpen ? 'auto' : 0 
        }}
        transition={{ duration: 0.2 }}
        className="md:hidden overflow-hidden bg-slate-800/95 backdrop-blur-sm border-t border-white/10"
      >
        <div className="px-4 pt-2 pb-3 space-y-3">
          <Link 
            to="/" 
            className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            <HomeIcon className="w-5 h-5 mr-3" />
            Home
          </Link>
          <Link 
            to="/marketplace" 
            className="flex items-center px-3 py-2 text-purple-300 hover:text-purple-100 hover:bg-purple-900/30 rounded-md transition-colors duration-200 relative"
            onClick={() => setIsMenuOpen(false)}
          >
            <ClockIcon className="w-5 h-5 mr-3" />
            <span className="font-semibold">Time Marketplace</span>
            <motion.div
              className="absolute top-2 right-3 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </Link>
          <Link 
            to="/app" 
            className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            <UserCircleIcon className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          
          {/* Mobile Wallet Connection */}
          <div className="pt-3 border-t border-gray-600">
            {isConnected ? (
              <div className="space-y-2">
                {/* Mobile Network Status */}
                {!isCorrectNetwork && (
                  <button
                    onClick={switchToSomnia}
                    className="w-full px-3 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-md text-yellow-400 text-sm font-medium flex items-center hover:bg-yellow-500/30 transition-all duration-200"
                  >
                    <motion.div
                      className="w-2 h-2 bg-yellow-400 rounded-full mr-2"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    Switch to Somnia Testnet
                  </button>
                )}
                
                <div className={`px-3 py-2 ${isCorrectNetwork ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-red-500/20 border-red-500/30 text-red-400'} border rounded-md text-sm font-medium flex items-center`}>
                  <motion.div
                    className={`w-2 h-2 ${isCorrectNetwork ? 'bg-green-400' : 'bg-red-400'} rounded-full mr-2`}
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                </div>
                <button
                  onClick={disconnectWallet}
                  className="w-full text-left px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
                >
                  Disconnect Wallet
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={loading}
                className="w-full flex items-center px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-md hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                ) : (
                  <WalletIcon className="w-4 h-4 mr-2" />
                )}
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;