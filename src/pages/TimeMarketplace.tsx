import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClockIcon,
  StarIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  FireIcon,
  TrophyIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

interface TimeSlot {
  id: string;
  kol: {
    name: string;
    username: string;
    avatar: string;
    reputation: number;
    level: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
    followers: number;
    completedSessions: number;
    rating: number;
    expertise: string[];
  };
  duration: number; // in minutes
  price: number; // in STT
  availableSlots: number;
  description: string;
  tags: string[];
  bookedSlots: number;
}

const mockTimeSlots: TimeSlot[] = [
  {
    id: '1',
    kol: {
      name: 'Alex Chen',
      username: '@alexchen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      reputation: 2850,
      level: 'Diamond',
      followers: 125000,
      completedSessions: 89,
      rating: 4.9,
      expertise: ['DeFi', 'Trading', 'NFTs']
    },
    duration: 30,
    price: 150,
    availableSlots: 3,
    description: 'Get personalized DeFi strategies and portfolio review. I\'ll analyze your positions and suggest optimizations.',
    tags: ['Strategy', 'Portfolio', 'Risk Management'],
    bookedSlots: 12
  },
  {
    id: '2',
    kol: {
      name: 'Sarah Kumar',
      username: '@sarahk',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b96e8f90?w=400',
      reputation: 1950,
      level: 'Gold',
      followers: 87000,
      completedSessions: 67,
      rating: 4.8,
      expertise: ['NFTs', 'Art', 'Community']
    },
    duration: 45,
    price: 120,
    availableSlots: 5,
    description: 'Learn NFT creation, marketing strategies, and how to build a sustainable art business in Web3.',
    tags: ['NFT Creation', 'Marketing', 'Art Business'],
    bookedSlots: 8
  },
  {
    id: '3',
    kol: {
      name: 'Michael Rodriguez',
      username: '@mikerodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      reputation: 1420,
      level: 'Silver',
      followers: 45000,
      completedSessions: 34,
      rating: 4.7,
      expertise: ['Gaming', 'P2E', 'Metaverse']
    },
    duration: 60,
    price: 100,
    availableSlots: 7,
    description: 'Dive deep into Play-to-Earn mechanics, guild strategies, and upcoming gaming opportunities.',
    tags: ['P2E Gaming', 'Guild Building', 'Metaverse'],
    bookedSlots: 5
  }
];

const TimeMarketplace: React.FC = () => {
  const { isConnected, walletAddress } = useAuth();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('price');

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Diamond': return 'from-cyan-400 to-blue-400';
      case 'Gold': return 'from-yellow-400 to-orange-400';
      case 'Silver': return 'from-gray-300 to-gray-500';
      default: return 'from-orange-400 to-red-400';
    }
  };

  const getLevelBg = (level: string) => {
    switch (level) {
      case 'Diamond': return 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400';
      case 'Gold': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'Silver': return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
      default: return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
    }
  };

  const handleBookSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setShowBookingModal(true);
  };

  const BookingModal = () => {
    if (!selectedSlot) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setShowBookingModal(false)}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-gradient-to-br from-slate-900 to-purple-900/30 border border-white/10 rounded-3xl p-8 max-w-2xl w-full relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={() => setShowBookingModal(false)}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* KOL Info */}
          <div className="flex items-center mb-6">
            <img 
              src={selectedSlot.kol.avatar} 
              alt={selectedSlot.kol.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/50"
            />
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-white">{selectedSlot.kol.name}</h3>
              <p className="text-purple-300">{selectedSlot.kol.username}</p>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getLevelBg(selectedSlot.kol.level)} mt-2`}>
                <TrophyIcon className="w-4 h-4 mr-1" />
                {selectedSlot.kol.level} Tier
              </div>
            </div>
          </div>

          {/* Session Details */}
          <div className="bg-white/5 rounded-2xl p-6 mb-6">
            <h4 className="text-lg font-bold text-white mb-4">Session Details</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-gray-300">
                <ClockIcon className="w-5 h-5 mr-2 text-purple-400" />
                {selectedSlot.duration} minutes
              </div>
              <div className="flex items-center text-gray-300">
                <CurrencyDollarIcon className="w-5 h-5 mr-2 text-green-400" />
                {selectedSlot.price} STT
              </div>
            </div>
            <p className="text-gray-300 mb-4">{selectedSlot.description}</p>
            <div className="flex flex-wrap gap-2">
              {selectedSlot.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Booking Actions */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowBookingModal(false)}
              className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-2xl hover:border-gray-500 hover:text-white transition-all duration-200"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!isConnected}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!isConnected ? 'Connect Wallet to Book' : `Book for ${selectedSlot.price} STT`}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-500/20 rounded-full"
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
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
              className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center"
            >
              <ClockIcon className="w-10 h-10 text-white" />
            </motion.div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Time Marketplace
            </span>
          </h1>
          
          <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto">
            Book one-on-one sessions with top KOLs. Get personalized advice, strategies, and insights directly from industry experts.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { number: "500+", label: "Expert KOLs", icon: UserGroupIcon },
              { number: "10k+", label: "Sessions Completed", icon: CheckCircleIcon },
              { number: "4.9", label: "Average Rating", icon: StarIcon }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-gray-200 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex gap-3">
              {['all', 'DeFi', 'NFTs', 'Gaming', 'Trading'].map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    filter === category 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{ backgroundColor: '#1e293b' }}
            >
              <option value="price" style={{ backgroundColor: '#1e293b', color: 'white' }}>Sort by Price</option>
              <option value="rating" style={{ backgroundColor: '#1e293b', color: 'white' }}>Sort by Rating</option>
              <option value="reputation" style={{ backgroundColor: '#1e293b', color: 'white' }}>Sort by Reputation</option>
            </select>
          </div>
        </motion.div>

        {/* Time Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTimeSlots.map((slot, index) => (
            <motion.div
              key={slot.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:border-purple-500/50 transition-all duration-300 group"
            >
              {/* KOL Header */}
              <div className="flex items-center mb-4">
                <img 
                  src={slot.kol.avatar} 
                  alt={slot.kol.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/50"
                />
                <div className="ml-3 flex-1">
                  <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">
                    {slot.kol.name}
                  </h3>
                  <p className="text-sm text-gray-400">{slot.kol.username}</p>
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-medium border ${getLevelBg(slot.kol.level)}`}>
                  {slot.kol.level}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center text-sm text-gray-100">
                  <StarIcon className="w-4 h-4 mr-1 text-yellow-400" />
                  {slot.kol.rating}
                </div>
                <div className="flex items-center text-sm text-gray-100">
                  <UserGroupIcon className="w-4 h-4 mr-1 text-blue-400" />
                  {slot.kol.followers.toLocaleString()}
                </div>
                <div className="flex items-center text-sm text-gray-100">
                  <CheckCircleIcon className="w-4 h-4 mr-1 text-green-400" />
                  {slot.kol.completedSessions} sessions
                </div>
                <div className="flex items-center text-sm text-gray-100">
                  <TrophyIcon className="w-4 h-4 mr-1 text-purple-400" />
                  {slot.kol.reputation} points
                </div>
              </div>

              {/* Session Info */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center text-purple-300">
                    <ClockIcon className="w-5 h-5 mr-1" />
                    {slot.duration} min
                  </div>
                  <div className="flex items-center text-green-400 font-bold">
                    <CurrencyDollarIcon className="w-5 h-5 mr-1" />
                    {slot.price} STT
                  </div>
                </div>
                <p className="text-gray-100 text-sm line-clamp-2 mb-3">
                  {slot.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {slot.kol.expertise.slice(0, 3).map((skill, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-purple-300 text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-200">Available Slots</span>
                  <span className="text-white font-medium">{slot.availableSlots} left</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(slot.bookedSlots / (slot.bookedSlots + slot.availableSlots)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Book Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBookSlot(slot)}
                disabled={slot.availableSlots === 0}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-lg"
              >
                {slot.availableSlots === 0 ? 'Fully Booked' : 'Book Session'}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && <BookingModal />}
      </AnimatePresence>
    </div>
  );
};

export default TimeMarketplace;