import React from 'react';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface WalletNotificationProps {
  isVisible: boolean;
  onClose: () => void;
}

const WalletNotification: React.FC<WalletNotificationProps> = ({ isVisible, onClose }) => {
  const installMetaMask = () => {
    window.open('https://metamask.io/download/', '_blank');
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gradient-to-br from-slate-900 to-purple-900/30 border border-white/10 rounded-3xl p-8 max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Warning icon */}
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 20px rgb(251 191 36 / 0.3)",
                "0 0 30px rgb(251 191 36 / 0.5)", 
                "0 0 20px rgb(251 191 36 / 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center"
          >
            <ExclamationTriangleIcon className="w-8 h-8 text-white" />
          </motion.div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Wallet Required
          </span>
        </h2>

        {/* Description */}
        <p className="text-gray-300 text-center mb-6 leading-relaxed">
          To connect to SoRe and access the Somnia blockchain, you need a Web3 wallet like MetaMask installed in your browser.
        </p>

        {/* Action buttons */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={installMetaMask}
            className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
          >
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Install MetaMask
            <ArrowTopRightOnSquareIcon className="w-5 h-5 ml-2" />
          </motion.button>

          <button
            onClick={onClose}
            className="w-full px-6 py-3 border border-gray-600 text-gray-300 font-semibold rounded-2xl hover:border-gray-500 hover:text-white transition-all duration-300"
          >
            I'll install it later
          </button>
        </div>

        {/* Additional info */}
        <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
          <p className="text-sm text-gray-400 text-center">
            MetaMask is a secure crypto wallet that lets you interact with blockchain applications. 
            It's free and trusted by millions of users worldwide.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WalletNotification;