import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaClock, FaMoneyBillWave, FaCog, FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import { bookingService, Booking, UpdateBookingStatusRequest, KOLPricingUpdate } from '../services/bookingService';
import Navbar from '../components/Navbar';

// Mock KOL ID - in a real app, this would come from auth context
const CURRENT_KOL_ID = '1';

const BookingCard: React.FC<{ booking: Booking; onStatusUpdate: (bookingId: number, status: UpdateBookingStatusRequest) => void }> = ({ booking, onStatusUpdate }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleAccept = () => {
    onStatusUpdate(booking.id, { status: 'accepted' });
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onStatusUpdate(booking.id, { status: 'rejected', rejectionReason });
      setShowRejectModal(false);
      setRejectionReason('');
    }
  };

  return (
    <motion.div
      className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-colors"
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={booking.client?.avatarUrl}
            alt={booking.client?.displayName}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="text-white font-semibold">{booking.client?.displayName}</h3>
            <p className="text-gray-400 text-sm">{new Date(booking.bookingDate).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${bookingService.getStatusColor(booking.status)}20`,
              color: bookingService.getStatusColor(booking.status),
              border: `1px solid ${bookingService.getStatusColor(booking.status)}40`
            }}
          >
            {booking.status.toUpperCase()}
          </span>
          <span className="text-green-400 font-bold">${booking.price}</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-gray-300">
          <FaClock className="w-4 h-4" />
          <span>{booking.startTime} - {booking.endTime} ({booking.durationMinutes} min)</span>
        </div>
        <p className="text-gray-400 text-sm">
          <strong>Reason:</strong> {booking.reason}
        </p>
      </div>

      {booking.status === 'pending' && (
        <div className="flex space-x-3">
          <button
            onClick={handleAccept}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
          >
            <FaCheck className="w-4 h-4" />
            <span>Accept</span>
          </button>
          <button
            onClick={() => setShowRejectModal(true)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
          >
            <FaTimes className="w-4 h-4" />
            <span>Reject</span>
          </button>
        </div>
      )}

      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">Reject Booking</h3>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                className="w-full h-24 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none resize-none"
                required
              />
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Reject
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const PricingSettings: React.FC<{ onPricingUpdate: (pricing: KOLPricingUpdate) => void }> = ({ onPricingUpdate }) => {
  const [pricingForm, setPricingForm] = useState({
    pricePerSlot: 50,
    hourlyRate: 100,
    isAvailable: true,
    minBookingDuration: 30,
    maxBookingDuration: 240,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPricingUpdate(pricingForm);
  };

  return (
    <motion.div
      className="bg-gray-800 border border-gray-700 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
        <FaCog className="w-5 h-5" />
        <span>Pricing Settings</span>
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Price per Slot ($)
            </label>
            <input
              type="number"
              value={pricingForm.pricePerSlot}
              onChange={(e) => setPricingForm(prev => ({ ...prev, pricePerSlot: Number(e.target.value) }))}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Hourly Rate ($)
            </label>
            <input
              type="number"
              value={pricingForm.hourlyRate}
              onChange={(e) => setPricingForm(prev => ({ ...prev, hourlyRate: Number(e.target.value) }))}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Min Duration (minutes)
            </label>
            <input
              type="number"
              value={pricingForm.minBookingDuration}
              onChange={(e) => setPricingForm(prev => ({ ...prev, minBookingDuration: Number(e.target.value) }))}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              min="15"
              step="15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Max Duration (minutes)
            </label>
            <input
              type="number"
              value={pricingForm.maxBookingDuration}
              onChange={(e) => setPricingForm(prev => ({ ...prev, maxBookingDuration: Number(e.target.value) }))}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              min="30"
              step="15"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isAvailable"
            checked={pricingForm.isAvailable}
            onChange={(e) => setPricingForm(prev => ({ ...prev, isAvailable: e.target.checked }))}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="isAvailable" className="text-gray-300">
            Available for bookings
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Update Pricing
        </button>
      </form>
    </motion.div>
  );
};

export const KOLDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'pricing'>('pending');

  useEffect(() => {
    loadBookings();
    loadPendingCount();
  }, []);

  const loadBookings = async () => {
    try {
      const { bookings } = await bookingService.getKOLBookings(CURRENT_KOL_ID);
      setBookings(bookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingCount = async () => {
    try {
      const { count } = await bookingService.getPendingBookings(CURRENT_KOL_ID);
      setPendingCount(count);
    } catch (error) {
      console.error('Error loading pending count:', error);
    }
  };

  const handleStatusUpdate = async (bookingId: number, statusData: UpdateBookingStatusRequest) => {
    try {
      await bookingService.updateBookingStatus(bookingId, statusData);
      await loadBookings();
      await loadPendingCount();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const handlePricingUpdate = async (pricingData: KOLPricingUpdate) => {
    try {
      await bookingService.updateKOLPricing(CURRENT_KOL_ID, pricingData);
      alert('Pricing updated successfully!');
    } catch (error) {
      console.error('Error updating pricing:', error);
      alert('Failed to update pricing');
    }
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const acceptedBookings = bookings.filter(b => b.status === 'accepted');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">KOL Dashboard</h1>
          <p className="text-gray-400">Manage your bookings and pricing</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-gray-800 border border-gray-700 rounded-xl p-6"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Requests</p>
                <p className="text-3xl font-bold text-yellow-400">{pendingCount}</p>
              </div>
              <FaBell className="w-8 h-8 text-yellow-400" />
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800 border border-gray-700 rounded-xl p-6"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Accepted Bookings</p>
                <p className="text-3xl font-bold text-green-400">{acceptedBookings.length}</p>
              </div>
              <FaCheck className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800 border border-gray-700 rounded-xl p-6"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-blue-400">{bookings.length}</p>
              </div>
              <FaClock className="w-8 h-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800 border border-gray-700 rounded-xl p-6"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Potential Earnings</p>
                <p className="text-3xl font-bold text-purple-400">
                  ${acceptedBookings.reduce((sum, b) => sum + b.price, 0)}
                </p>
              </div>
              <FaMoneyBillWave className="w-8 h-8 text-purple-400" />
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          {[
            { id: 'pending' as const, label: 'Pending Requests', count: pendingCount },
            { id: 'all' as const, label: 'All Bookings', count: bookings.length },
            { id: 'pricing' as const, label: 'Pricing Settings', count: null }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'pending' && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pendingBookings.length > 0 ? (
                  pendingBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <FaBell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No Pending Requests</h3>
                    <p className="text-gray-500">You're all caught up!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'all' && (
            <motion.div
              key="all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <FaClock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No Bookings Yet</h3>
                    <p className="text-gray-500">Your booking requests will appear here</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'pricing' && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="max-w-2xl">
                <PricingSettings onPricingUpdate={handlePricingUpdate} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default KOLDashboard;