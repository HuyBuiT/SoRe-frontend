// KOL Service for API calls
const API_BASE_URL = 'http://localhost:3000/api';

export interface KOL {
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
  pricePerSlot: number;
  availableSlots: number;
  description: string;
  tags: string[];
  bookedSlots: number;
}

export interface KOLResponse {
  success: boolean;
  data: KOL[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
}

// For now, use mock data that matches the backend structure
const mockKOLData: KOL[] = [
  {
    id: '1',
    kol: {
      name: 'Alex Chen',
      username: '@alexchen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4&clothesColor=262e33&skinColor=ae5d29',
      reputation: 2850,
      level: 'Diamond',
      followers: 125000,
      completedSessions: 89,
      rating: 4.9,
      expertise: ['DeFi', 'Trading', 'NFTs']
    },
    pricePerSlot: 150,
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
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=ffd93d&clothesColor=3c4858&skinColor=d08b5b',
      reputation: 1950,
      level: 'Gold',
      followers: 87000,
      completedSessions: 67,
      rating: 4.8,
      expertise: ['NFTs', 'Art', 'Community']
    },
    pricePerSlot: 120,
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
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=a7f3d0&clothesColor=25262b&skinColor=fdbcb4',
      reputation: 1420,
      level: 'Silver',
      followers: 45000,
      completedSessions: 34,
      rating: 4.7,
      expertise: ['Gaming', 'P2E', 'Metaverse']
    },
    pricePerSlot: 100,
    availableSlots: 7,
    description: 'Dive deep into Play-to-Earn mechanics, guild strategies, and upcoming gaming opportunities.',
    tags: ['P2E Gaming', 'Guild Building', 'Metaverse'],
    bookedSlots: 5
  },
  {
    id: '4',
    kol: {
      name: 'Luna Chen',
      username: '@lunacrypto',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&backgroundColor=ddd6fe&clothesColor=0f172a&skinColor=f3d2c1',
      reputation: 3200,
      level: 'Diamond',
      followers: 180000,
      completedSessions: 127,
      rating: 4.95,
      expertise: ['Web3', 'Blockchain', 'Smart Contracts']
    },
    pricePerSlot: 200,
    availableSlots: 2,
    description: 'Expert in smart contract development and Web3 architecture. Get insights on building scalable dApps.',
    tags: ['Smart Contracts', 'dApp Development', 'Security'],
    bookedSlots: 18
  },
  {
    id: '5',
    kol: {
      name: 'Raj Patel',
      username: '@rajdefi',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raj&backgroundColor=fed7d7&clothesColor=1e3a8a&skinColor=eab308',
      reputation: 2100,
      level: 'Gold',
      followers: 95000,
      completedSessions: 73,
      rating: 4.85,
      expertise: ['DeFi', 'Yield Farming', 'Tokenomics']
    },
    pricePerSlot: 130,
    availableSlots: 4,
    description: 'Specialized in DeFi protocols and yield optimization strategies. Learn about advanced farming techniques.',
    tags: ['Yield Farming', 'LP Strategies', 'Risk Assessment'],
    bookedSlots: 11
  }
];

export const kolService = {
  // Get KOLs with pagination, sorting, and filtering
  async getKOLs(page: number = 1, limit: number = 3, sortBy: string = 'reputation', filter: string = 'all'): Promise<KOLResponse> {
    try {
      // Try to fetch from backend first
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        filter
      });
      const response = await fetch(`${API_BASE_URL}/kols?${queryParams}`);
      
      if (response.ok) {
        return await response.json();
      }
      
      // If backend fails, fall back to mock data with pagination
      console.warn('Backend unavailable, using mock data');
      return this.getMockKOLs(page, limit, sortBy, filter);
    } catch (error) {
      console.warn('Backend unavailable, using mock data:', error);
      return this.getMockKOLs(page, limit, sortBy, filter);
    }
  },

  // Apply sorting to mock data
  sortMockData(data: KOL[], sortBy: string): KOL[] {
    const sorted = [...data];
    switch (sortBy) {
      case 'price':
        return sorted.sort((a, b) => a.pricePerSlot - b.pricePerSlot);
      case 'rating':
        return sorted.sort((a, b) => b.kol.rating - a.kol.rating);
      case 'reputation':
      default:
        return sorted.sort((a, b) => b.kol.reputation - a.kol.reputation);
    }
  },

  // Apply filtering to mock data
  filterMockData(data: KOL[], filter: string): KOL[] {
    if (filter === 'all') return data;
    return data.filter(kol => 
      kol.kol.expertise.some(expertise => 
        expertise.toLowerCase().includes(filter.toLowerCase())
      )
    );
  },

  // Mock data pagination for development
  getMockKOLs(page: number = 1, limit: number = 3, sortBy: string = 'reputation', filter: string = 'all'): KOLResponse {
    // Apply filtering and sorting
    let filteredData = this.filterMockData(mockKOLData, filter);
    let sortedData = this.sortMockData(filteredData, sortBy);
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = sortedData.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedData,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(sortedData.length / limit),
        total_items: sortedData.length,
        items_per_page: limit
      }
    };
  },

  // Seed backend data (development only)
  async seedKOLs(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/kols/seed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        return await response.json();
      }
      
      throw new Error('Failed to seed data');
    } catch (error) {
      console.error('Error seeding KOL data:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};