import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UsersIcon, 
  DocumentTextIcon, 
  HeartIcon, 
  TrophyIcon,
  SparklesIcon,
  ArrowPathIcon,
  StarIcon,
  CubeTransparentIcon,
  FireIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { apiService, SocialStats, ReputationData, LeaderboardEntry } from '../services/api';

const SocialDashboard: React.FC = () => {
  const { walletAddress, xStatus } = useAuth();
  const [socialStats, setSocialStats] = useState<SocialStats | null>(null);
  const [reputation, setReputation] = useState<ReputationData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (!walletAddress) return;
    try {
      // Fetch social stats and reputation in parallel
      const [statsResult, reputationResult, leaderboardResult] = await Promise.allSettled([
        apiService.getSocialStats(walletAddress),
        apiService.getReputationScore(walletAddress),
        apiService.getLeaderboard(10, 'followers')
      ]);

      if (statsResult.status === 'fulfilled') {
        setSocialStats(statsResult.value.socialStats);
      }

      if (reputationResult.status === 'fulfilled') {
        setReputation(reputationResult.value);
      }

      if (leaderboardResult.status === 'fulfilled') {
        setLeaderboard(leaderboardResult.value.leaderboard);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const handleRefreshStats = async () => {
    if (!walletAddress) return;

    setRefreshing(true);
    try {
      await apiService.refreshSocialStats(walletAddress);
      await fetchData();
    } catch (error) {
      console.error('Failed to refresh stats:', error);
      alert('Failed to refresh social stats. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [walletAddress, xStatus?.connected]);

  if (!walletAddress) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center"
        >
          <ShieldCheckIcon className="w-8 h-8 text-white" />
        </motion.div>
        <p className="text-gray-300">Please connect your wallet to view your social dashboard.</p>
      </motion.div>
    );
  }

  const getTierColor = (level: string) => {
    switch (level) {
      case 'Diamond': return 'from-blue-400 to-cyan-400';
      case 'Gold': return 'from-yellow-400 to-orange-400';
      case 'Silver': return 'from-gray-400 to-slate-400';
      case 'Bronze': return 'from-orange-600 to-red-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getTierIcon = (level: string) => {
    switch (level) {
      case 'Diamond': return CubeTransparentIcon;
      case 'Gold': return TrophyIcon;
      case 'Silver': return StarIcon;
      case 'Bronze': return FireIcon;
      default: return SparklesIcon;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center"
          >
            <ChartBarIcon className="w-5 h-5 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white">
            Reputation{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h2>
        </div>
        
        {xStatus?.connected && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefreshStats}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50"
          >
            <motion.div
              animate={refreshing ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: "linear" }}
            >
              <ArrowPathIcon className="w-4 h-4 mr-2" />
            </motion.div>
            {refreshing ? 'Syncing...' : 'Refresh Data'}
          </motion.button>
        )}
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Social Metrics Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="group"
        >
          <div className="h-full bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Social Metrics</h3>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center"
              >
                <UsersIcon className="w-5 h-5 text-white" />
              </motion.div>
            </div>
            
            {socialStats ? (
              <div className="space-y-4">
                {[
                  { label: 'Followers', value: socialStats.followers, icon: UsersIcon, color: 'from-blue-500 to-cyan-500' },
                  { label: 'Posts', value: socialStats.totalPosts, icon: DocumentTextIcon, color: 'from-green-500 to-emerald-500' },
                  { label: 'Likes', value: socialStats.totalLikes, icon: HeartIcon, color: 'from-red-500 to-pink-500' }
                ].map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 bg-gradient-to-r ${metric.color} rounded-lg flex items-center justify-center`}>
                        <metric.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-300">{metric.label}</span>
                    </div>
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      className="font-bold text-white text-lg"
                    >
                      {metric.value.toLocaleString()}
                    </motion.span>
                  </motion.div>
                ))}
                
                {socialStats.lastUpdated && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xs text-gray-400 mt-4 text-center bg-white/5 rounded-lg p-2"
                  >
                    Last updated: {new Date(socialStats.lastUpdated).toLocaleString()}
                  </motion.div>
                )}
              </div>
            ) : (
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="space-y-3"
              >
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />
                ))}
                <p className="text-gray-400 text-center">
                  {xStatus?.connected ? 'Loading social stats...' : 'Connect X to view metrics'}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Reputation Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="group"
        >
          <div className="h-full bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Reputation NFT</h3>
              {reputation && (
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`w-10 h-10 bg-gradient-to-r ${getTierColor(reputation.level)} rounded-xl flex items-center justify-center`}
                >
                  {React.createElement(getTierIcon(reputation.level), { className: "w-5 h-5 text-white" })}
                </motion.div>
              )}
            </div>
            
            {reputation ? (
              <div className="space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ 
                      boxShadow: [
                        "0 0 20px rgb(147 51 234 / 0.3)",
                        "0 0 30px rgb(147 51 234 / 0.5)", 
                        "0 0 20px rgb(147 51 234 / 0.3)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block p-6 bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-2xl border border-purple-500/30"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`text-4xl font-bold bg-gradient-to-r ${getTierColor(reputation.level)} bg-clip-text text-transparent`}
                    >
                      {reputation.reputationScore}
                    </motion.div>
                    <div className="text-sm text-gray-400 mt-1">Reputation Score</div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold mt-3 bg-gradient-to-r ${getTierColor(reputation.level)} text-white shadow-lg`}
                    >
                      {React.createElement(getTierIcon(reputation.level), { className: "w-4 h-4 mr-1" })}
                      {reputation.level} Tier
                    </motion.div>
                  </motion.div>
                </motion.div>

                <div className="space-y-3">
                  {[
                    { label: 'Social Score', value: reputation.breakdown.socialScore, color: 'from-blue-500 to-cyan-500', weight: '40%' },
                    { label: 'On-Chain Score', value: reputation.breakdown.onChainScore, color: 'from-green-500 to-emerald-500', weight: '50%' },
                    { label: 'Holdings Score', value: reputation.breakdown.holdingsScore, color: 'from-yellow-500 to-orange-500', weight: '10%' }
                  ].map((score, index) => (
                    <motion.div
                      key={score.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="bg-white/5 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 text-sm">{score.label}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">({score.weight})</span>
                          <span className="font-bold text-white">{score.value.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(score.value, 100)}%` }}
                          transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                          className={`h-2 bg-gradient-to-r ${score.color} rounded-full`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center"
                >
                  <SparklesIcon className="w-8 h-8 text-white" />
                </motion.div>
                <p className="text-gray-400">Calculating reputation...</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Actions & Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="group"
        >
          <div className="h-full bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-green-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Quick Actions</h3>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center"
              >
                <RocketLaunchIcon className="w-5 h-5 text-white" />
              </motion.div>
            </div>
            
            <div className="space-y-4">
              {xStatus?.connected ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4"
                  >
                    <div className="flex items-center justify-center text-green-400 text-sm font-medium">
                      <motion.div
                        className="w-2 h-2 bg-green-400 rounded-full mr-2"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      X Account Connected
                    </div>
                    <div className="text-center text-white font-bold mt-1">
                      @{xStatus.username}
                    </div>
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRefreshStats}
                    disabled={refreshing}
                    className="w-full group relative px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50"
                  >
                    <span className="flex items-center justify-center">
                      <motion.div
                        animate={refreshing ? { rotate: 360 } : {}}
                        transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: "linear" }}
                      >
                        <ArrowPathIcon className="w-4 h-4 mr-2" />
                      </motion.div>
                      {refreshing ? 'Syncing Data...' : 'Sync Social Stats'}
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.open(`https://x.com/${xStatus.username}`, '_blank')}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 text-white font-medium rounded-xl hover:bg-black/70 hover:border-gray-500 transition-all duration-300"
                  >
                    <span className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      View X Profile
                    </span>
                  </motion.button>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-4"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center"
                  >
                    <SparklesIcon className="w-6 h-6 text-white" />
                  </motion.div>
                  <p className="text-gray-400 text-sm">Connect X account to unlock actions</p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-slate-900/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center"
              >
                <TrophyIcon className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-white">KOL Leaderboard</h3>
                <p className="text-sm text-gray-400">Top influencers by followers</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <AnimatePresence>
            {leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((entry, index) => (
                  <motion.div
                    key={entry.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/10"
                  >
                    <div className="flex items-center space-x-4">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                          entry.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-yellow-500/25' :
                          entry.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-800' :
                          entry.rank === 3 ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white' :
                          'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        }`}
                      >
                        {entry.rank <= 3 ? (
                          <TrophyIcon className="w-5 h-5" />
                        ) : (
                          entry.rank
                        )}
                      </motion.div>
                      <div>
                        <div className="font-bold text-white flex items-center">
                          @{entry.username}
                          {entry.rank <= 3 && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                            >
                              <StarIcon className="w-4 h-4 ml-2 text-yellow-400" />
                            </motion.div>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">
                          {entry.walletAddress.slice(0, 8)}...{entry.walletAddress.slice(-6)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="font-bold text-white text-lg"
                      >
                        {entry.followers.toLocaleString()}
                      </motion.div>
                      <div className="text-sm text-gray-400">followers</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center"
                >
                  <TrophyIcon className="w-8 h-8 text-white" />
                </motion.div>
                <p className="text-gray-400">Loading leaderboard...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SocialDashboard;