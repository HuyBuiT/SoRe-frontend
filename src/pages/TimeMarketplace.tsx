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
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { kolService, KOL, KOLResponse } from '../services/kolService';

// Use KOL interface from service
type TimeSlot = KOL;

// BookingModal Component - moved outside to prevent re-creation
interface BookingModalProps {
  selectedSlot: TimeSlot | null;
  bookingForm: any;
  onClose: () => void;
  onBookingFormChange: (field: string, value: string) => void;
  generateTimeOptions: () => string[];
  getLevelBg: (level: string) => string;
  isConnected: boolean;
}

const BookingModal = React.memo(({ 
  selectedSlot, 
  bookingForm, 
  onClose, 
  onBookingFormChange, 
  generateTimeOptions, 
  getLevelBg, 
  isConnected 
}: BookingModalProps) => {
  if (!selectedSlot) return null;

  const handleBackdropClick = React.useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleModalClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const timeOptions = React.useMemo(() => generateTimeOptions(), [generateTimeOptions]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gradient-to-br from-slate-900 to-purple-900/30 border border-white/10 rounded-3xl p-8 max-w-2xl w-full relative"
        onClick={handleModalClick}
      >
        {/* Close button */}
        <button
          onClick={onClose}
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
              30 min per slot
            </div>
            <div className="flex items-center text-gray-300">
              <CurrencyDollarIcon className="w-5 h-5 mr-2 text-green-400" />
              {selectedSlot.pricePerSlot} SOMI per slot
            </div>
          </div>
          <p className="text-gray-300 mb-4">{selectedSlot.description}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedSlot.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {/* Booking Form */}
          <h5 className="text-md font-bold text-white mb-4">Book Your Session</h5>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
              <input
                type="date"
                value={bookingForm.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  e.stopPropagation();
                  onBookingFormChange('date', e.target.value);
                }}
                className="w-full px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">From Time (UTC)</label>
                <select
                  value={bookingForm.fromTime}
                  onChange={(e) => {
                    e.stopPropagation();
                    onBookingFormChange('fromTime', e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select time</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time} UTC
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">To Time (UTC)</label>
                <select
                  value={bookingForm.toTime}
                  onChange={(e) => {
                    e.stopPropagation();
                    onBookingFormChange('toTime', e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select time</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time} UTC
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-blue-300 text-sm">
                📅 All times are in UTC. Please convert from your local timezone.
                <br />
                ⏰ Time slots are available in 15-minute intervals (00, 15, 30, 45).
                <br />
                📊 Minimum booking: 30 minutes (1 slot).
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Reason for Booking</label>
              <textarea
                value={bookingForm.reason}
                onChange={(e) => {
                  e.stopPropagation();
                  onBookingFormChange('reason', e.target.value);
                }}
                placeholder="Describe what you'd like to discuss or learn..."
                className="w-full px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-20 resize-none"
              />
            </div>
            
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <div className="flex justify-between items-center text-white mb-2">
                <span>Total Slots ({bookingForm.totalSlots} × 30 min):</span>
                <span className="font-bold">{bookingForm.totalSlots * 30} minutes</span>
              </div>
              <div className="flex justify-between items-center text-white">
                <span>Total Price:</span>
                <span className="font-bold text-green-400">{bookingForm.totalPrice} SOMI</span>
              </div>
              {bookingForm.totalSlots < 1 && (
                <p className="text-red-400 text-sm mt-2">Minimum booking is 30 minutes (1 slot)</p>
              )}
            </div>
          </div>
        </div>

        {/* Booking Actions */}
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-2xl hover:border-gray-500 hover:text-white transition-all duration-200"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!isConnected || bookingForm.totalSlots < 1 || !bookingForm.date || !bookingForm.fromTime || !bookingForm.toTime || !bookingForm.reason.trim()}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!isConnected 
              ? 'Connect Wallet to Book' 
              : `Book for ${bookingForm.totalPrice} SOMI`}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
});

const TimeMarketplace: React.FC = () => {
  const { isConnected, walletAddress } = useAuth();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('price');
  
  // KOL data and pagination state
  const [kolData, setKolData] = useState<KOL[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 3;
  
  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    date: '',
    fromTime: '',
    toTime: '',
    reason: '',
    totalSlots: 1,
    totalPrice: 0
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Diamond': return 'from-cyan-400 to-blue-400';
      case 'Gold': return 'from-yellow-400 to-orange-400';
      case 'Silver': return 'from-gray-300 to-gray-500';
      default: return 'from-orange-400 to-red-400';
    }
  };

  const getLevelBg = React.useCallback((level: string) => {
    switch (level) {
      case 'Diamond': return 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400';
      case 'Gold': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'Silver': return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
      default: return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
    }
  }, []);

  const calculateSlots = (fromTime: string, toTime: string) => {
    if (!fromTime || !toTime) return 0;
    
    const from = new Date(`1970-01-01T${fromTime}`);
    const to = new Date(`1970-01-01T${toTime}`);
    
    if (to <= from) return 0;
    
    const diffMs = to.getTime() - from.getTime();
    const diffMinutes = diffMs / (1000 * 60);
    
    // Each slot is 30 minutes, round up to ensure minimum 30 min booking
    return Math.ceil(diffMinutes / 30);
  };

  const generateTimeOptions = React.useCallback(() => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  }, []);

  const handleBookSlot = React.useCallback((slot: TimeSlot) => {
    setSelectedSlot(slot);
    const today = new Date().toISOString().split('T')[0];
    setBookingForm({
      date: today,
      fromTime: '',
      toTime: '',
      reason: '',
      totalSlots: 1,
      totalPrice: slot.pricePerSlot
    });
    setShowBookingModal(true);
  }, []);

  const handleBookingFormChange = React.useCallback((field: string, value: string) => {
    const newForm = { ...bookingForm, [field]: value };
    
    if (field === 'fromTime' || field === 'toTime') {
      const slots = calculateSlots(newForm.fromTime, newForm.toTime);
      newForm.totalSlots = Math.max(1, slots);
      newForm.totalPrice = selectedSlot ? selectedSlot.pricePerSlot * newForm.totalSlots : 0;
    }
    
    setBookingForm(newForm);
  }, [bookingForm, selectedSlot]);

  // Fetch KOL data with sorting and filtering
  const fetchKOLs = async (page: number = 1, sortField: string = 'reputation', filterCategory: string = 'all') => {
    setLoading(true);
    try {
      const response: KOLResponse = await kolService.getKOLs(page, itemsPerPage, sortField, filterCategory);
      setKolData(response.data);
      setCurrentPage(response.pagination.current_page);
      setTotalPages(response.pagination.total_pages);
      setTotalItems(response.pagination.total_items);
    } catch (error) {
      console.error('Failed to fetch KOLs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change with animation
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      fetchKOLs(newPage, sortBy, filter);
    }
  };

  // Handle filter change
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page
    fetchKOLs(1, sortBy, newFilter);
  };

  // Handle sort change
  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1); // Reset to first page
    fetchKOLs(1, newSort, filter);
  };

  // Load KOLs on component mount
  useEffect(() => {
    fetchKOLs(1, sortBy, filter);
  }, []);

  // Create stable callback references
  const handleCloseModal = React.useCallback(() => {
    setShowBookingModal(false);
  }, []);

  return (
    <div className="min-h-screen bg-black relative">
      {/* Dark Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-90"></div>
      
      {/* Blockchain Grid Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_rgba(59,130,246,0.1)_0%,_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,_rgba(147,51,234,0.1)_0%,_transparent_50%)]"></div>
        <div className="absolute inset-0 opacity-20" 
             style={{
               backgroundImage: `linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px), 
                                linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)`,
               backgroundSize: '50px 50px'
             }}>
        </div>
      </div>

      {/* Animated Blockchain Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          {/* Floating Data Blocks */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`block-${i}`}
              className="absolute w-3 h-3 bg-blue-500/30 border border-blue-400/50 rounded-sm"
              animate={{
                x: [0, Math.random() * 300 - 150],
                y: [0, Math.random() * 300 - 150],
                rotate: [0, 360],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Infinity,
                delay: Math.random() * 8,
                ease: "easeInOut"
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
            />
          ))}
          
          {/* Glowing Orbs */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`orb-${i}`}
              className="absolute w-2 h-2 bg-purple-400/40 rounded-full blur-sm"
              animate={{
                x: [0, Math.random() * 400 - 200],
                y: [0, Math.random() * 400 - 200],
                scale: [0.5, 1.5, 0.5],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: Math.random() * 12 + 8,
                repeat: Infinity,
                delay: Math.random() * 6,
                ease: "easeInOut"
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
            />
          ))}
          
          {/* Moving Network Lines */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`line-${i}`}
              className="absolute w-px h-20 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"
              animate={{
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
                opacity: [0, 0.6, 0],
                scaleY: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: Math.random() * 10 + 6,
                repeat: Infinity,
                delay: Math.random() * 4,
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
                  onClick={() => handleFilterChange(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    filter === category 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white/10 text-white hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
            <select 
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
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
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {loading ? (
              // Loading skeleton
              [...Array(3)].map((_, index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-6 animate-pulse"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
                    <div className="ml-3 flex-1">
                      <div className="h-4 bg-gray-600 rounded mb-2"></div>
                      <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-600 rounded"></div>
                    <div className="h-3 bg-gray-600 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-600 rounded-2xl mt-4"></div>
                  </div>
                </motion.div>
              ))
            ) : (
              kolData.map((slot, index) => (
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
                  <p className="text-sm text-gray-300">{slot.kol.username}</p>
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-medium border ${getLevelBg(slot.kol.level)}`}>
                  {slot.kol.level}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center text-sm text-white">
                  <StarIcon className="w-4 h-4 mr-1 text-yellow-400" />
                  {slot.kol.rating}
                </div>
                <div className="flex items-center text-sm text-white">
                  <UserGroupIcon className="w-4 h-4 mr-1 text-blue-400" />
                  {slot.kol.followers.toLocaleString()}
                </div>
                <div className="flex items-center text-sm text-white">
                  <CheckCircleIcon className="w-4 h-4 mr-1 text-green-400" />
                  {slot.kol.completedSessions} sessions
                </div>
                <div className="flex items-center text-sm text-white">
                  <TrophyIcon className="w-4 h-4 mr-1 text-purple-400" />
                  {slot.kol.reputation} points
                </div>
              </div>

              {/* Session Info */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center text-purple-300">
                    <ClockIcon className="w-5 h-5 mr-1" />
                    30 min/slot
                  </div>
                  <div className="flex items-center text-green-400 font-bold">
                    <CurrencyDollarIcon className="w-5 h-5 mr-1" />
                    {slot.pricePerSlot} SOMI
                  </div>
                </div>
                <p className="text-white text-sm line-clamp-2 mb-3">
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
                  <span className="text-white">Available Slots</span>
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
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex justify-center items-center space-x-4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="p-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </motion.button>

            <div className="flex space-x-2">
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <motion.button
                    key={pageNum}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={loading}
                    className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
                      currentPage === pageNum
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                    } disabled:cursor-not-allowed`}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="p-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        {/* Pagination Info */}
        {totalItems > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-gray-300 text-sm"
          >
            Showing {kolData.length} of {totalItems} KOLs • Page {currentPage} of {totalPages}
          </motion.div>
        )}
      </main>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <BookingModal
            selectedSlot={selectedSlot}
            bookingForm={bookingForm}
            onClose={handleCloseModal}
            onBookingFormChange={handleBookingFormChange}
            generateTimeOptions={generateTimeOptions}
            getLevelBg={getLevelBg}
            isConnected={isConnected}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimeMarketplace;