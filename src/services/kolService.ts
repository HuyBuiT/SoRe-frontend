// KOL Service for API calls
import { formatEther } from 'ethers';
import { web3Service } from './web3Service';
import { KOLRegistrationData } from '../components/BecomeKOLModal';

export const API_BASE_URL = 'http://localhost:3000/api';

export interface ReputationData {
  totalScore: number;
  onchainScore: number;
  socialScore: number;
  tokenHoldingScore: number;
  level: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  transactionCount: number;
  volumeTraded: string;
  bookingsCompleted: number;
  averageRating: number;
  lastUpdated: number;
  isKOL: boolean;
}

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
    walletAddress?: string; // Blockchain wallet address for KOL
    reputationData?: ReputationData; // On-chain reputation data
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
      expertise: ['DeFi', 'Trading', 'NFTs'],
      walletAddress: '0x742d35Cc6F739Ee9c5Cc9C3BE5e7a4DE5e0e2e07'
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
      expertise: ['NFTs', 'Art', 'Community'],
      walletAddress: '0x8ba1f109551bD432803012645Hac136c22C57B44'
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
      expertise: ['Gaming', 'P2E', 'Metaverse'],
      walletAddress: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
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
      expertise: ['Web3', 'Blockchain', 'Smart Contracts'],
      walletAddress: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'
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
      expertise: ['DeFi', 'Yield Farming', 'Tokenomics'],
      walletAddress: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'
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
  },

  // Get reputation data from blockchain for a KOL
  async getReputationData(walletAddress: string): Promise<ReputationData | null> {
    try {
      const { reputationNFTContract } = await web3Service.getContracts();
      if (!reputationNFTContract) return null;

      // First check if the address has any NFTs
      const hasNFT = await reputationNFTContract.balanceOf(walletAddress);
      if (hasNFT.toString() === '0') {
        // No NFTs for this address - this is normal, not an error
        return null;
      }

      // Try to get the first token - if this fails, the user likely has no reputation NFT yet
      const tokenId = await reputationNFTContract.tokenOfOwnerByIndex(walletAddress, 0);
      const reputationData = await reputationNFTContract.getReputationData(tokenId);

      return {
        totalScore: parseInt(reputationData.totalScore.toString()),
        onchainScore: parseInt(reputationData.onchainScore.toString()),
        socialScore: parseInt(reputationData.socialScore.toString()),
        tokenHoldingScore: parseInt(reputationData.tokenHoldingScore.toString()),
        level: ['Bronze', 'Silver', 'Gold', 'Diamond'][reputationData.level] as 'Bronze' | 'Silver' | 'Gold' | 'Diamond',
        transactionCount: parseInt(reputationData.transactionCount.toString()),
        volumeTraded: formatEther(reputationData.volumeTraded),
        bookingsCompleted: parseInt(reputationData.bookingsCompleted.toString()),
        averageRating: parseInt(reputationData.averageRating.toString()) / 100, // Convert from basis points
        lastUpdated: parseInt(reputationData.lastUpdated.toString()),
        isKOL: reputationData.isKOL
      };
    } catch (error) {
      // Most errors here are expected (user has no reputation NFT yet)
      // Only log if it's not a common "execution reverted" error
      if (error instanceof Error && !error.message.includes('execution reverted')) {
        console.warn('Unexpected error fetching reputation data:', error.message);
      }
      return null;
    }
  },

  // Update KOL data with blockchain reputation
  async getKOLsWithReputation(page: number = 1, limit: number = 3, sortBy: string = 'reputation', filter: string = 'all'): Promise<KOLResponse> {
    const kolsResponse = await this.getKOLs(page, limit, sortBy, filter);
    
    // Fetch reputation data for each KOL with wallet address
    const updatedKOLs = await Promise.all(
      kolsResponse.data.map(async (kol) => {
        if (kol.kol.walletAddress) {
          const reputationData = await this.getReputationData(kol.kol.walletAddress);
          if (reputationData) {
            return {
              ...kol,
              kol: {
                ...kol.kol,
                reputationData,
                // Update level and reputation from blockchain data
                level: reputationData.level,
                reputation: reputationData.totalScore,
                completedSessions: reputationData.bookingsCompleted,
                rating: reputationData.averageRating
              }
            };
          }
        }
        return kol;
      })
    );

    return {
      ...kolsResponse,
      data: updatedKOLs
    };
  },

  // Initialize reputation NFT for a KOL
  async initializeKOLReputation(walletAddress: string, isKOL: boolean = true): Promise<{ success: boolean; txHash?: string; tokenId?: number; error?: string }> {
    try {
      console.log('Initializing reputation for:', walletAddress);
      
      // Initialize web3 service first
      await web3Service.initialize();
      
      const { reputationNFTContract, signer } = await web3Service.getContracts();
      console.log('Got contracts:', { 
        reputationNFTContract: !!reputationNFTContract, 
        signer: !!signer 
      });
      
      if (!reputationNFTContract) {
        console.error('ReputationNFT contract not found. Check contract addresses.');
        return { success: false, error: 'ReputationNFT contract not found. Check contract addresses.' };
      }
      
      if (!signer) {
        console.error('Signer not found. Make sure wallet is connected.');
        return { success: false, error: 'Signer not found. Make sure wallet is connected.' };
      }

      // Check if user already has an NFT
      const hasNFT = await reputationNFTContract.balanceOf(walletAddress);
      console.log('Current NFT balance:', hasNFT.toString());
      
      if (hasNFT.toString() !== '0') {
        console.log('Reputation NFT already exists for this address');
        return { success: true, error: 'You already have a reputation NFT!' };
      }

      console.log('Minting new reputation NFT...');
      const tx = await reputationNFTContract.connect(signer).mintReputationNFT(walletAddress);
      console.log('Transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Transaction confirmed');
      
      // Get the token ID from the transaction receipt
      let tokenId: number | undefined;
      try {
        const transferEvent = receipt.logs?.find((log: any) => 
          log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' // Transfer event
        );
        if (transferEvent && transferEvent.topics[3]) {
          tokenId = parseInt(transferEvent.topics[3], 16);
        }
      } catch (e) {
        console.log('Could not parse token ID from receipt');
      }
      
      // Note: KOL profile registration is now handled separately by registerKOLWithProfile
      
      console.log('Reputation NFT initialized successfully for:', walletAddress);
      return { 
        success: true, 
        txHash: tx.hash,
        tokenId
      };
    } catch (error) {
      console.error('Error initializing reputation NFT:', error);
      console.error('Error details:', error.message || error);
      return { success: false, error: error.message || 'Unknown error occurred' };
    }
  },

  // Register a new KOL with their wallet address
  async registerNewKOL(walletAddress: string): Promise<boolean> {
    try {
      // Generate a basic KOL profile from wallet address
      const response = await fetch(`${API_BASE_URL}/kols`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `KOL ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
          username: `@${walletAddress.slice(-6)}`,
          walletAddress,
          pricePerSlot: 50,
          expertise: ['Blockchain', 'DeFi'],
          description: 'On-chain verified KOL with reputation tracking'
        })
      });

      if (response.ok) {
        console.log('New KOL registered successfully');
        return true;
      }
    } catch (error) {
      console.error('Error registering new KOL:', error);
    }
    
    // Add to local mock data as fallback
    const newKOL: KOL = {
      id: `kol_${Date.now()}`,
      kol: {
        name: `KOL ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        username: `@${walletAddress.slice(-6)}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${walletAddress}`,
        reputation: 100,
        level: 'Bronze',
        followers: 0,
        completedSessions: 0,
        rating: 0,
        expertise: ['Blockchain', 'DeFi'],
        walletAddress
      },
      pricePerSlot: 50,
      availableSlots: 10,
      description: 'On-chain verified KOL with reputation tracking',
      tags: ['New KOL', 'Verified'],
      bookedSlots: 0
    };
    
    // Add to mock data
    mockKOLData.push(newKOL);
    return true;
  },

  // Register a new KOL with detailed profile information
  async registerKOLWithProfile(walletAddress: string, profileData: KOLRegistrationData): Promise<{ success: boolean; error?: string }> {
    try {
      // Try to register with backend first
      const response = await fetch(`${API_BASE_URL}/kols`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: profileData.name,
          username: profileData.username,
          walletAddress,
          pricePerSlot: profileData.pricePerSlot,
          expertise: profileData.categories, // Using categories as expertise
          description: profileData.description,
          bio: profileData.bio,
          socialLinks: profileData.socialLinks,
          availableSlots: 10 // Default available slots
        })
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('KOL profile registered successfully with backend:', responseData);
        return { success: true };
      } else {
        const errorData = await response.json();
        console.warn('Backend registration failed with status:', response.status, errorData);
        
        // If it's a conflict (409), the user already exists - this is actually success
        if (response.status === 409) {
          return { success: true };
        }
        
        return { success: false, error: errorData.message || `Backend error: ${response.status}` };
      }
    } catch (error) {
      console.warn('Backend registration failed, using mock data fallback:', error);
    }
    
    // Add to local mock data as fallback
    const newKOL: KOL = {
      id: `kol_${Date.now()}`,
      kol: {
        name: profileData.name,
        username: profileData.username || `@${profileData.name.toLowerCase().replace(/\s+/g, '')}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.name}`,
        reputation: 100,
        level: 'Bronze',
        followers: 0,
        completedSessions: 0,
        rating: 0,
        expertise: profileData.categories,
        walletAddress
      },
      pricePerSlot: profileData.pricePerSlot,
      availableSlots: 10,
      description: profileData.description,
      tags: profileData.categories.slice(0, 3), // Use first 3 categories as tags
      bookedSlots: 0
    };
    
    // Add to mock data
    mockKOLData.push(newKOL);
    console.log('New KOL profile added to mock data:', newKOL);
    return { success: true };
  },

  // Update KOL pricing
  async updateKOLPricing(kolId: string, pricePerSlot: number): Promise<{ success: boolean; error?: string; data?: any }> {
    console.log(`🚀 Starting price update for KOL ${kolId} to ${pricePerSlot} SOMI`);
    
    try {
      const url = `${API_BASE_URL}/kols/${kolId}/pricing`;
      const payload = { pricePerSlot: pricePerSlot };
      
      console.log('📡 Making PUT request to:', url);
      console.log('📦 Payload:', payload);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('📥 Response received:', response.status, response.statusText);

      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ KOL pricing updated successfully:', responseData);
        return { success: true, data: responseData };
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }
        console.error('❌ Failed to update pricing:', response.status, errorData);
        return { success: false, error: errorData.message || `API error: ${response.status}` };
      }
    } catch (error) {
      console.error('💥 Error updating KOL pricing:', error);
      
      if (error.name === 'AbortError') {
        return { success: false, error: 'Request timeout - please try again' };
      }
      
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
};