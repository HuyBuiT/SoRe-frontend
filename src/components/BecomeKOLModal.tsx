import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface BecomeKOLModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
  onSubmit: (kolData: KOLRegistrationData) => Promise<void>;
}

export interface KOLRegistrationData {
  name: string;
  username: string;
  description: string;
  pricePerSlot: number;
  expertise: string[];
  categories: string[];
  bio: string;
  socialLinks: {
    twitter?: string;
    discord?: string;
    telegram?: string;
  };
}

const AVAILABLE_CATEGORIES = [
  'DeFi', 'NFTs', 'Gaming', 'Trading', 'Web3', 'Blockchain', 'Metaverse', 
  'DAO', 'Layer 2', 'Smart Contracts', 'Investment', 'Education', 
  'Community Building', 'Marketing', 'Development', 'Art & Design'
];

export const BecomeKOLModal: React.FC<BecomeKOLModalProps> = ({
  isOpen,
  onClose,
  walletAddress,
  onSubmit
}) => {
  const [formData, setFormData] = useState<KOLRegistrationData>({
    name: '',
    username: '',
    description: '',
    pricePerSlot: 50,
    expertise: [],
    categories: [],
    bio: '',
    socialLinks: {}
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (field: keyof KOLRegistrationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }));
  };

  const toggleCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || formData.categories.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting KOL registration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-gradient-to-br from-slate-900 to-purple-900/30 border border-white/10 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">🚀 Become a KOL</h2>
              <p className="text-gray-300 text-sm">Step {currentStep} of 3</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Basic Info</span>
              <span>Categories & Pricing</span>
              <span>Social & Bio</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                initial={{ width: "33%" }}
                animate={{ width: `${(currentStep / 3) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your display name"
                  className="w-full px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="@username"
                  className="w-full px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Short Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of what you offer..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Wallet Address (Connected)
                </label>
                <input
                  type="text"
                  value={walletAddress}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 cursor-not-allowed"
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Categories & Pricing */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Categories & Pricing</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Your Expertise Categories * (Max 4)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {AVAILABLE_CATEGORIES.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      disabled={!formData.categories.includes(category) && formData.categories.length >= 4}
                      className={`p-2 rounded-lg text-sm font-medium transition-all ${
                        formData.categories.includes(category)
                          ? 'bg-purple-600 text-white border-purple-500'
                          : 'bg-slate-700 text-gray-300 border-gray-600 hover:bg-slate-600'
                      } border disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Selected: {formData.categories.length}/4
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price per 30-minute slot (SOMI) *
                </label>
                <input
                  type="number"
                  value={formData.pricePerSlot}
                  onChange={(e) => handleInputChange('pricePerSlot', Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="w-full px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Set your consultation rate per 30-minute session
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Social & Bio */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Social Links & Bio</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Detailed Bio (Optional)
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell people more about your background and expertise..."
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Twitter (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.socialLinks.twitter || ''}
                    onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                    placeholder="@username"
                    className="w-full px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Discord (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.socialLinks.discord || ''}
                    onChange={(e) => handleSocialLinkChange('discord', e.target.value)}
                    placeholder="username#1234"
                    className="w-full px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Telegram (Optional)
                </label>
                <input
                  type="text"
                  value={formData.socialLinks.telegram || ''}
                  onChange={(e) => handleSocialLinkChange('telegram', e.target.value)}
                  placeholder="@username"
                  className="w-full px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.name || !formData.description || formData.categories.length === 0}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all font-semibold"
              >
                {isSubmitting ? 'Creating...' : '🚀 Become a KOL'}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};