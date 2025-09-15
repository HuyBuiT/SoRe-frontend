import React, { useState, useEffect } from 'react';
import { FaTimes, FaCoins, FaInfoCircle } from 'react-icons/fa';

interface SetPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newPrice: number) => void;
  currentPrice: number;
  kolId: string;
  isLoading?: boolean;
}

export const SetPriceModal: React.FC<SetPriceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentPrice,
  kolId: _kolId,
  isLoading = false
}) => {
  const [price, setPrice] = useState(currentPrice.toString());
  const [error, setError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setPrice(currentPrice.toString());
      setError('');
    }
  }, [isOpen, currentPrice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const newPrice = Number(price);
    
    if (isNaN(newPrice) || newPrice <= 0) {
      setError('Please enter a valid price greater than 0');
      return;
    }

    if (newPrice > 10000) {
      setError('Price cannot exceed 10,000 STT per slot');
      return;
    }

    onSave(newPrice);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrice(value);
    if (error) setError(''); // Clear error when user types
  };

  const suggestedPrices = [10, 25, 50, 100, 200, 500];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-500 p-2 rounded-lg">
              <FaCoins className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Set Your Price</h2>
              <p className="text-gray-400 text-sm">Price per 30-minute slot</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
              Price (STT per slot)
            </label>
            <div className="relative">
              <input
                type="number"
                id="price"
                value={price}
                onChange={handlePriceChange}
                disabled={isLoading}
                step="0.01"
                min="0.01"
                max="10000"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                placeholder="Enter price..."
                autoFocus
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <span className="text-gray-400 text-sm font-medium">STT</span>
              </div>
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-2 flex items-center">
                <FaInfoCircle className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
          </div>

          {/* Current Price Display */}
          <div className="mb-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Current Price:</span>
              <span className="text-green-400 font-semibold">{currentPrice} STT</span>
            </div>
          </div>

          {/* Suggested Prices */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-300 mb-3">Quick Select:</p>
            <div className="grid grid-cols-3 gap-2">
              {suggestedPrices.map((suggestedPrice) => (
                <button
                  key={suggestedPrice}
                  type="button"
                  onClick={() => setPrice(suggestedPrice.toString())}
                  disabled={isLoading}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    price === suggestedPrice.toString()
                      ? 'bg-purple-600 text-white border border-purple-500'
                      : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600 hover:text-white'
                  } disabled:opacity-50`}
                >
                  {suggestedPrice} STT
                </button>
              ))}
            </div>
          </div>

          {/* Price Info */}
          <div className="mb-6 p-4 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-700">
            <div className="flex items-start space-x-3">
              <FaInfoCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-100">
                <p className="font-medium mb-1">Pricing Tips:</p>
                <ul className="space-y-1 text-blue-200">
                  <li>• Consider your expertise level and market demand</li>
                  <li>• Higher prices may reduce booking frequency</li>
                  <li>• You can always adjust your price later</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !price || price === currentPrice.toString()}
              className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </div>
              ) : (
                'Update Price'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetPriceModal;