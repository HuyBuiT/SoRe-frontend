import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const XConnection: React.FC = () => {
  const { walletAddress, isConnected, xStatus, connectX, disconnectX, loading } = useAuth();
  const [actionLoading, setActionLoading] = useState(false);

  const handleConnect = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    setActionLoading(true);
    try {
      await connectX();
    } catch (error) {
      console.error('Failed to connect X:', error);
      toast.error('Failed to connect X account. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setActionLoading(true);
    try {
      await disconnectX();
    } catch (error) {
      console.error('Failed to disconnect X:', error);
      toast.error('Failed to disconnect X account. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          Please connect your wallet to link your X (Twitter) account.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">X (Twitter) Connection</h3>
        <div className="flex items-center">
          {xStatus?.connected ? (
            <div className="flex items-center text-green-600">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Connected
            </div>
          ) : (
            <div className="flex items-center text-gray-500">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Not Connected
            </div>
          )}
        </div>
      </div>

      {xStatus?.connected ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-black mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <div>
                <p className="text-sm font-medium text-green-800">
                  Connected as @{xStatus.username}
                </p>
                {xStatus.socialStats && (
                  <div className="text-sm text-green-600 mt-1">
                    {xStatus.socialStats.followers.toLocaleString()} followers • {' '}
                    {xStatus.socialStats.totalPosts.toLocaleString()} posts
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleDisconnect}
            disabled={loading || actionLoading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {actionLoading ? 'Disconnecting...' : 'Disconnect X Account'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm text-blue-800">
              Connect your X (Twitter) account to track your social activity and build your reputation score.
            </p>
          </div>

          <button
            onClick={handleConnect}
            disabled={loading || actionLoading}
            className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
          >
            {actionLoading ? (
              'Connecting...'
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Connect X Account
              </>
            )}
          </button>
        </div>
      )}

      {walletAddress && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </p>
        </div>
      )}
    </div>
  );
};

export default XConnection;