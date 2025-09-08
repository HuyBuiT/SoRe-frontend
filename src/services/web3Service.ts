import { BrowserProvider, parseEther, formatEther, Contract } from 'ethers';

// Contract addresses - these will be filled after deployment
export const SOMNIA_TESTNET_CONFIG = {
  chainId: '0xC468', // 50312 in hex (correct)
  chainName: 'Somnia Testnet',
  nativeCurrency: {
    name: 'STT',
    symbol: 'STT',
    decimals: 18
  },
  rpcUrls: [import.meta.env.VITE_SOMNIA_RPC_URL || 'https://dream-rpc.somnia.network'],
  blockExplorerUrls: ['https://shannon-explorer.somnia.network']
};

// Contract addresses (fill these after deployment)
export const CONTRACT_ADDRESSES = {
  TIME_BOOKING: import.meta.env.VITE_TIME_BOOKING_CONTRACT_ADDRESS || '',
  BOOKING_TICKET_NFT: import.meta.env.VITE_BOOKING_TICKET_NFT_CONTRACT_ADDRESS || '',
  REPUTATION_NFT: import.meta.env.VITE_REPUTATION_NFT_CONTRACT_ADDRESS || '',
  REPUTATION_TRACKER: import.meta.env.VITE_REPUTATION_TRACKER_CONTRACT_ADDRESS || ''
};

// Smart contract ABIs (simplified versions)
export const TIME_BOOKING_ABI = [
  // Read functions
  "function getBooking(uint256 _bookingId) view returns (tuple(uint256 bookingId, uint256 tokenId, address buyer, address kol, uint256 pricePerSlot, uint256 totalSlots, uint256 totalAmount, uint256 fromTime, uint256 toTime, string reason, uint8 status, uint256 createdAt, uint256 updatedAt, uint256 sessionEndTime, bool disputeReported))",
  "function getBuyerBookings(address _buyer) view returns (uint256[])",
  "function getKOLBookings(address _kol) view returns (uint256[])",
  "function getTotalBookings() view returns (uint256)",
  "function canAutoComplete(uint256 _bookingId) view returns (bool)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function platformFeePercent() view returns (uint256)",
  
  // Write functions
  "function createBooking(address _kol, uint256 _pricePerSlot, uint256 _totalSlots, uint256 _fromTime, uint256 _toTime, string memory _reason, string memory _tokenURI) payable",
  "function acceptBooking(uint256 _bookingId)",
  "function rejectBooking(uint256 _bookingId)",
  "function cancelBooking(uint256 _bookingId)",
  "function completeSession(uint256 _bookingId)",
  "function reportDispute(uint256 _bookingId, string memory _reason)",
  "function releasePayment(uint256 _bookingId)",
  "function handleExpiredBooking(uint256 _bookingId)",
  
  // Events
  "event BookingCreated(uint256 indexed bookingId, uint256 indexed tokenId, address indexed buyer, address kol, uint256 totalAmount, uint256 fromTime, uint256 toTime)",
  "event BookingStatusChanged(uint256 indexed bookingId, uint8 oldStatus, uint8 newStatus, address changedBy)",
  "event PaymentReleased(uint256 indexed bookingId, address indexed recipient, uint256 amount)",
  "event DisputeReported(uint256 indexed bookingId, address indexed reporter, string reason)"
];

// Reputation NFT ABI
export const REPUTATION_NFT_ABI = [
  // Read functions
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function getReputationData(uint256 tokenId) view returns (tuple(uint256 totalScore, uint256 onchainScore, uint256 socialScore, uint256 tokenHoldingScore, uint8 level, uint256 transactionCount, uint256 volumeTraded, uint256 bookingsCompleted, uint256 averageRating, uint256 lastUpdated, bool isKOL))",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  
  // Write functions
  "function mintReputationNFT(address to) returns (uint256)",
  "function updateReputation(uint256 tokenId, uint256 newOnchainScore, uint256 newSocialScore, uint256 newTokenHoldingScore, uint256 newTransactionCount, uint256 newVolumeTraded, uint256 newBookingsCompleted, uint256 newAverageRating)",
  
  // Events
  "event ReputationUpdated(uint256 indexed tokenId, uint256 oldTotalScore, uint256 newTotalScore, uint8 oldLevel, uint8 newLevel)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

// Reputation Tracker ABI
export const REPUTATION_TRACKER_ABI = [
  // Read functions
  "function getOnchainScore(address user) view returns (uint256)",
  "function getTransactionCount(address user) view returns (uint256)",
  "function getVolumeTraded(address user) view returns (uint256)",
  "function getBookingsCompleted(address user) view returns (uint256)",
  
  // Write functions
  "function trackTransaction(address user, uint256 value)",
  "function trackBookingCreated(address user, uint256 bookingId)",
  "function trackBookingCompleted(address kol, address buyer, uint256 bookingId, uint256 rating)",
  
  // Events
  "event TransactionTracked(address indexed user, uint256 value, uint256 newScore)",
  "event BookingTracked(address indexed user, uint256 indexed bookingId, uint256 newScore)"
];

// Booking status enum (matches smart contract)
export enum BookingStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  Completed = 3,
  Cancelled = 4,
  Disputed = 5,
  Expired = 6
}

export interface SmartContractBooking {
  bookingId: number;
  tokenId: number;
  buyer: string;
  kol: string;
  pricePerSlot: string;
  totalSlots: number;
  totalAmount: string;
  fromTime: number;
  toTime: number;
  reason: string;
  status: BookingStatus;
  createdAt: number;
  updatedAt: number;
  sessionEndTime: number;
  disputeReported: boolean;
}

class Web3Service {
  private provider: BrowserProvider | null = null;
  private signer: any | null = null;
  private timeBookingContract: Contract | null = null;
  private reputationNFTContract: Contract | null = null;
  private reputationTrackerContract: Contract | null = null;

  // Initialize provider and contracts
  async initialize() {
    if (!window.ethereum) {
      throw new Error('MetaMask or compatible wallet not found');
    }

    this.provider = new BrowserProvider(window.ethereum);
    this.signer = await this.provider.getSigner();

    // Initialize contracts
    if (CONTRACT_ADDRESSES.TIME_BOOKING) {
      this.timeBookingContract = new Contract(
        CONTRACT_ADDRESSES.TIME_BOOKING,
        TIME_BOOKING_ABI,
        this.signer
      );
    }

    if (CONTRACT_ADDRESSES.REPUTATION_NFT) {
      this.reputationNFTContract = new Contract(
        CONTRACT_ADDRESSES.REPUTATION_NFT,
        REPUTATION_NFT_ABI,
        this.signer
      );
    }

    if (CONTRACT_ADDRESSES.REPUTATION_TRACKER) {
      this.reputationTrackerContract = new Contract(
        CONTRACT_ADDRESSES.REPUTATION_TRACKER,
        REPUTATION_TRACKER_ABI,
        this.signer
      );
    }
  }

  // Get all contracts (for external services)
  async getContracts() {
    if (!this.provider || !this.signer) {
      await this.initialize();
    }

    return {
      provider: this.provider,
      signer: this.signer,
      timeBookingContract: this.timeBookingContract,
      reputationNFTContract: this.reputationNFTContract,
      reputationTrackerContract: this.reputationTrackerContract
    };
  }

  // Check if user is connected to Somnia testnet
  async checkNetwork(): Promise<boolean> {
    if (!this.provider) return false;
    
    const network = await this.provider.getNetwork();
    return network.chainId === BigInt(50312); // Somnia testnet
  }

  // Switch to Somnia testnet
  async switchToSomniaTestnet(): Promise<boolean> {
    if (!window.ethereum) return false;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SOMNIA_TESTNET_CONFIG.chainId }],
      });
      return true;
    } catch (switchError: any) {
      // Chain not added to MetaMask yet
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SOMNIA_TESTNET_CONFIG],
          });
          return true;
        } catch (addError) {
          console.error('Error adding Somnia testnet:', addError);
          return false;
        }
      } else {
        console.error('Error switching to Somnia testnet:', switchError);
        return false;
      }
    }
  }

  // Create a new booking on the blockchain
  async createBooking(
    kolAddress: string,
    pricePerSlot: string,
    totalSlots: number,
    fromTime: number,
    toTime: number,
    reason: string
  ): Promise<{ success: boolean; txHash?: string; bookingId?: number; tokenId?: number; error?: string }> {
    try {
      if (!this.timeBookingContract) {
        await this.initialize();
      }

      if (!this.timeBookingContract) {
        throw new Error('Contract not initialized. Please deploy contracts first.');
      }

      const pricePerSlotWei = parseEther(pricePerSlot);
      const totalAmount = pricePerSlotWei * BigInt(totalSlots);
      
      // Generate simple NFT metadata
      const tokenURI = this.generateTokenURI(kolAddress, fromTime, toTime, reason);

      // Send transaction
      const tx = await this.timeBookingContract.createBooking(
        kolAddress,
        pricePerSlotWei,
        totalSlots,
        fromTime,
        toTime,
        reason,
        tokenURI,
        { value: totalAmount }
      );

      console.log('Transaction sent:', tx.hash);

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      // Parse events to get booking ID and token ID
      const bookingCreatedEvent = receipt.logs?.find(
        (log: any) => log.fragment?.name === 'BookingCreated'
      );

      if (bookingCreatedEvent) {
        const decodedEvent = this.timeBookingContract.interface.parseLog(bookingCreatedEvent);
        return {
          success: true,
          txHash: tx.hash,
          bookingId: Number(decodedEvent?.args.bookingId || 0),
          tokenId: Number(decodedEvent?.args.tokenId || 0)
        };
      } else {
        return {
          success: true,
          txHash: tx.hash
        };
      }

    } catch (error: any) {
      console.error('Error creating booking:', error);
      return {
        success: false,
        error: error.message || 'Failed to create booking'
      };
    }
  }

  // Accept a booking (KOL function)
  async acceptBooking(bookingId: number): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      if (!this.timeBookingContract) {
        await this.initialize();
      }

      const tx = await this.timeBookingContract!.acceptBooking(bookingId);
      await tx.wait();

      return {
        success: true,
        txHash: tx.hash
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to accept booking'
      };
    }
  }

  // Reject a booking (KOL function)
  async rejectBooking(bookingId: number): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      if (!this.timeBookingContract) {
        await this.initialize();
      }

      const tx = await this.timeBookingContract!.rejectBooking(bookingId);
      await tx.wait();

      return {
        success: true,
        txHash: tx.hash
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to reject booking'
      };
    }
  }

  // Get booking details
  async getBooking(bookingId: number): Promise<SmartContractBooking | null> {
    try {
      if (!this.timeBookingContract) {
        await this.initialize();
      }

      const booking = await this.timeBookingContract!.getBooking(bookingId);
      
      return {
        bookingId: Number(booking.bookingId),
        tokenId: Number(booking.tokenId),
        buyer: booking.buyer,
        kol: booking.kol,
        pricePerSlot: formatEther(booking.pricePerSlot),
        totalSlots: Number(booking.totalSlots),
        totalAmount: formatEther(booking.totalAmount),
        fromTime: Number(booking.fromTime),
        toTime: Number(booking.toTime),
        reason: booking.reason,
        status: booking.status,
        createdAt: Number(booking.createdAt),
        updatedAt: Number(booking.updatedAt),
        sessionEndTime: Number(booking.sessionEndTime),
        disputeReported: booking.disputeReported
      };
    } catch (error) {
      console.error('Error fetching booking:', error);
      return null;
    }
  }

  // Get user's bookings (as buyer)
  async getBuyerBookings(buyerAddress: string): Promise<number[]> {
    try {
      if (!this.timeBookingContract) {
        await this.initialize();
      }

      const bookingIds = await this.timeBookingContract!.getBuyerBookings(buyerAddress);
      return bookingIds.map((id: any) => Number(id));
    } catch (error) {
      console.error('Error fetching buyer bookings:', error);
      return [];
    }
  }

  // Get KOL's bookings
  async getKOLBookings(kolAddress: string): Promise<number[]> {
    try {
      if (!this.timeBookingContract) {
        await this.initialize();
      }

      const bookingIds = await this.timeBookingContract!.getKOLBookings(kolAddress);
      return bookingIds.map((id: any) => Number(id));
    } catch (error) {
      console.error('Error fetching KOL bookings:', error);
      return [];
    }
  }

  // Generate simple NFT metadata
  private generateTokenURI(kolAddress: string, fromTime: number, toTime: number, reason: string): string {
    const metadata = {
      name: `SoRe Booking Ticket #${Date.now()}`,
      description: `Time booking session: ${reason}`,
      image: "https://example.com/ticket-image.png", // Replace with actual image
      attributes: [
        { trait_type: "KOL", value: kolAddress },
        { trait_type: "Session Time", value: new Date(fromTime * 1000).toISOString() },
        { trait_type: "Duration", value: `${(toTime - fromTime) / 60} minutes` },
        { trait_type: "Reason", value: reason }
      ]
    };

    // In a real implementation, you'd upload this to IPFS
    // For demo, return a data URL
    return `data:application/json,${encodeURIComponent(JSON.stringify(metadata))}`;
  }

  // Get current user address
  async getCurrentAddress(): Promise<string | null> {
    try {
      if (!this.signer) {
        await this.initialize();
      }
      
      return await this.signer!.getAddress();
    } catch (error) {
      console.error('Error getting current address:', error);
      return null;
    }
  }

  // Get user's SOMI balance
  async getBalance(address?: string): Promise<string> {
    try {
      if (!this.provider) {
        await this.initialize();
      }

      const userAddress = address || await this.getCurrentAddress();
      if (!userAddress) return '0';

      const balance = await this.provider!.getBalance(userAddress);
      return formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }

  // Listen to contract events
  onBookingCreated(callback: (bookingId: number, tokenId: number, buyer: string, kol: string) => void) {
    if (this.timeBookingContract) {
      this.timeBookingContract.on('BookingCreated', (bookingId, tokenId, buyer, kol) => {
        callback(Number(bookingId), Number(tokenId), buyer, kol);
      });
    }
  }

  onBookingStatusChanged(callback: (bookingId: number, oldStatus: number, newStatus: number) => void) {
    if (this.timeBookingContract) {
      this.timeBookingContract.on('BookingStatusChanged', (bookingId, oldStatus, newStatus) => {
        callback(Number(bookingId), oldStatus, newStatus);
      });
    }
  }

  // Cleanup event listeners
  removeAllListeners() {
    if (this.timeBookingContract) {
      this.timeBookingContract.removeAllListeners();
    }
  }

  // Helper function to get status text
  static getStatusText(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.Pending: return 'Pending';
      case BookingStatus.Accepted: return 'Accepted';
      case BookingStatus.Rejected: return 'Rejected';
      case BookingStatus.Completed: return 'Completed';
      case BookingStatus.Cancelled: return 'Cancelled';
      case BookingStatus.Disputed: return 'Disputed';
      case BookingStatus.Expired: return 'Expired';
      default: return 'Unknown';
    }
  }

  // Helper function to get status color
  static getStatusColor(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.Pending: return '#f59e0b';
      case BookingStatus.Accepted: return '#10b981';
      case BookingStatus.Rejected: return '#ef4444';
      case BookingStatus.Completed: return '#6366f1';
      case BookingStatus.Cancelled: return '#6b7280';
      case BookingStatus.Disputed: return '#f59e0b';
      case BookingStatus.Expired: return '#6b7280';
      default: return '#6b7280';
    }
  }
}

export const web3Service = new Web3Service();
export default web3Service;