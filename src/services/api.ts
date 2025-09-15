const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface SocialStats {
  followers: number;
  totalPosts: number;
  totalLikes: number;
  lastUpdated?: string;
}

export interface XStatus {
  connected: boolean;
  username: string | null;
  socialStats: SocialStats | null;
}

export interface LeaderboardEntry {
  rank: number;
  walletAddress: string;
  username: string;
  followers: number;
  totalPosts: number;
  totalLikes: number;
  pricePerSlot: number;
}

export interface ReputationData {
  walletAddress: string;
  username: string;
  reputationScore: number;
  level: string;
  breakdown: {
    onChainScore: number;
    socialScore: number;
    holdingsScore: number;
    totalScore: number;
  };
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // X (Twitter) Authentication
  async connectX(walletAddress: string): Promise<{ authUrl: string; message: string }> {
    return this.request('/auth/connect-x', {
      method: 'POST',
      body: JSON.stringify({ walletAddress }),
    });
  }

  async disconnectX(walletAddress: string): Promise<{ message: string }> {
    return this.request('/auth/disconnect-x', {
      method: 'POST',
      body: JSON.stringify({ walletAddress }),
    });
  }

  async getXStatus(walletAddress: string): Promise<XStatus> {
    return this.request(`/auth/x/status?walletAddress=${encodeURIComponent(walletAddress)}`);
  }

  // Social Metrics
  async refreshSocialStats(walletAddress: string): Promise<{ message: string; stats: SocialStats }> {
    return this.request('/social/refresh-stats', {
      method: 'POST',
      body: JSON.stringify({ walletAddress }),
    });
  }

  async getSocialStats(walletAddress: string): Promise<{
    walletAddress: string;
    username: string;
    socialStats: SocialStats | null;
  }> {
    return this.request(`/social/stats?walletAddress=${encodeURIComponent(walletAddress)}`);
  }

  async getLeaderboard(limit: number = 10, sortBy: 'followers' | 'totalPosts' | 'totalLikes' = 'followers'): Promise<{
    leaderboard: LeaderboardEntry[];
    sortedBy: string;
    totalCount: number;
  }> {
    return this.request(`/social/leaderboard?limit=${limit}&sortBy=${sortBy}`);
  }

  async getReputationScore(walletAddress: string): Promise<ReputationData> {
    return this.request(`/social/reputation?walletAddress=${encodeURIComponent(walletAddress)}`);
  }
}

export const apiService = new ApiService();