# 🎯 SoRe Frontend - Decentralized KOL Booking Platform

A modern React-based frontend for the SoRe (Social Reputation) platform - connecting users with Key Opinion Leaders (KOLs) through blockchain-powered time booking and NFT ticketing system.

![Version](https://img.shields.io/badge/version-0.0.0-blue.svg?cacheSeconds=2592000)
![React](https://img.shields.io/badge/react-18.3.1-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.2.2-blue.svg)
![Vite](https://img.shields.io/badge/vite-5.3.4-purple.svg)
![Somnia](https://img.shields.io/badge/blockchain-Somnia_Testnet-green.svg)

## 🌟 Features

### 🎫 NFT Booking System
- **Book KOL Sessions**: Reserve time slots with Key Opinion Leaders
- **NFT Tickets**: Each booking generates a unique NFT as proof of purchase
- **Real-time Status**: Track booking status (Pending → Accepted → Completed)
- **Blockchain Integration**: All transactions secured on Somnia blockchain

### 👤 User Experience
- **Wallet Integration**: MetaMask and Web3 wallet support
- **KOL Discovery**: Browse and filter available KOLs by expertise, price, rating
- **Social Authentication**: Connect Twitter/X accounts for reputation tracking
- **Responsive Design**: Mobile-first design with dark theme

### 🎯 KOL Features  
- **KOL Registration**: Mint reputation NFTs to become a verified KOL
- **Price Management**: Set custom pricing per 30-minute slot
- **Booking Dashboard**: Accept/reject incoming booking requests
- **Earnings Tracking**: Monitor completed sessions and earnings

### 💰 Payment & Reputation
- **STT Token Payments**: Native integration with Somnia's STT tokens
- **Reputation System**: On-chain reputation tracking via NFTs
- **Social Verification**: Twitter/X integration for social proof
- **Automatic Escrow**: Smart contract-powered payment security

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- MetaMask or compatible Web3 wallet
- Somnia testnet SOMI tokens ([Get from faucet](https://faucet.somnia.network/))

### 1. Installation
```bash
cd SoRe-frontend
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

Update `.env` with deployed contract addresses:
```bash
# Smart Contract Addresses (Somnia Testnet)
VITE_TIME_BOOKING_CONTRACT_ADDRESS=0x6800a3bc30B5B29036B1776d325cCC25855a15E5
VITE_BOOKING_TICKET_NFT_CONTRACT_ADDRESS=0x313bB71ff6eB838365423A83c41ccb3b93a78790
VITE_REPUTATION_NFT_CONTRACT_ADDRESS=0xE7df053ee7EC4123C810187514Fa0Bf3a226752B
VITE_REPUTATION_TRACKER_CONTRACT_ADDRESS=0xEbA56A30462CD10aC4b7b0da4f8bda33fa

# Network Configuration
VITE_SOMNIA_RPC_URL=https://dream-rpc.somnia.network
VITE_CHAIN_ID=50312
```

### 3. Development Server
```bash
npm run dev
```
🚀 Open [http://localhost:5173](http://localhost:5173)

### 4. Build for Production  
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/           # Reusable React components
│   ├── Navbar.tsx       # Main navigation bar
│   ├── BecomeKOLModal.tsx # KOL registration modal
│   ├── SetPriceModal.tsx # Price setting interface
│   ├── SocialDashboard.tsx # Social stats display
│   └── ...
├── contexts/            # React Context providers
│   └── AuthContext.tsx  # Authentication & wallet state
├── pages/              # Main application pages
│   ├── LandingPage.tsx  # Homepage with hero section
│   ├── TimeMarketplace.tsx # Main marketplace for booking
│   ├── KOLDashboard.tsx # KOL management interface
│   └── AppPage.tsx      # Main app wrapper
├── services/           # Business logic & API calls
│   ├── web3Service.ts   # Blockchain interactions
│   ├── kolService.ts    # KOL-related operations
│   ├── bookingService.ts # Booking management
│   └── api.ts          # Backend API integration
└── styles/             # CSS & styling files
```

## 🛠 Core Technologies

### Frontend Stack
- **React 18.3.1** - UI library with hooks and modern patterns
- **TypeScript 5.2.2** - Type-safe development
- **Vite 5.3.4** - Fast build tool and dev server
- **Tailwind CSS 3.4.10** - Utility-first CSS framework
- **Framer Motion 12.23** - Smooth animations and transitions

### Blockchain Integration  
- **Ethers.js 6.15.0** - Ethereum library for Web3 interactions
- **MetaMask Integration** - Wallet connection and transaction signing
- **Somnia Network** - Layer-1 blockchain for fast, low-cost transactions

### UI Components
- **Heroicons 2.2.0** - Beautiful SVG icons
- **React Icons 5.5.0** - Comprehensive icon library
- **Headless UI 2.2.7** - Unstyled, accessible UI components
- **React Toastify 11.0.5** - Elegant toast notifications


## 🔧 Configuration & Customization

### Environment Variables
```bash
# Required - Contract addresses from deployment
VITE_TIME_BOOKING_CONTRACT_ADDRESS=0x...
VITE_BOOKING_TICKET_NFT_CONTRACT_ADDRESS=0x...
VITE_REPUTATION_NFT_CONTRACT_ADDRESS=0x...
VITE_REPUTATION_TRACKER_CONTRACT_ADDRESS=0x...

# Required - Network configuration  
VITE_SOMNIA_RPC_URL=https://dream-rpc.somnia.network
VITE_CHAIN_ID=50312

# Optional - API endpoints
VITE_BACKEND_API_URL=http://localhost:3000
VITE_FRONTEND_URL=http://localhost:5173
```

### Adding New KOL Categories
```typescript
// src/services/kolService.ts
const expertiseOptions = [
  "DeFi", "Trading", "NFTs", "Gaming", 
  "Metaverse", "Web3", "AI", "Blockchain"
  // Add new categories here
];
```

## 🧪 Testing & Development

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Code Quality Tools
- **ESLint** - JavaScript/TypeScript linting
- **TypeScript** - Static type checking
- **Prettier** - Code formatting (configured)
- **Husky** - Git hooks for quality control

### Browser Developer Tools
- **React Developer Tools** - Component debugging
- **MetaMask** - Blockchain transaction testing
- **Console Logging** - Extensive debug information

## 🔐 Security Features

### Frontend Security
- **Type Safety** - Full TypeScript coverage
- **Input Validation** - Form validation and sanitization  
- **XSS Protection** - React's built-in XSS prevention
- **Environment Isolation** - Secure environment variable handling

### Web3 Security  
- **Transaction Verification** - Double-check all transactions
- **Contract Address Validation** - Verify deployed contracts
- **Wallet Integration** - Secure MetaMask connection
- **Error Handling** - Comprehensive error boundaries

## 📈 Performance Optimizations

### Bundle Optimization
- **Vite Code Splitting** - Automatic chunk optimization
- **Tree Shaking** - Dead code elimination
- **Asset Optimization** - Image and CSS optimization
- **Lazy Loading** - Component-level code splitting

### React Performance
- **Memoization** - React.memo and useMemo optimization
- **Virtual Scrolling** - Efficient large list rendering
- **State Management** - Optimized context usage
- **Event Optimization** - Debounced search and filters

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
```bash
# Vercel
vercel --prod

# Netlify  
npm run build && netlify deploy --prod --dir=dist
```

### Environment Configuration
Ensure all contract addresses and RPC URLs are configured for the target network (testnet/mainnet).

## 🐛 Troubleshooting

### Common Issues

#### Wallet Connection Problems
- Ensure MetaMask is installed and unlocked
- Add Somnia testnet to MetaMask manually if needed
- Check network configuration in `.env`

#### Transaction Failures
- Verify sufficient SOMI balance for gas fees
- Confirm contract addresses are correct
- Check Somnia network status

#### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Type check errors
npm run type-check
```

## 📚 Resources

### Documentation
- [React Documentation](https://reactjs.org/)
- [Vite Guide](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Ethers.js Docs](https://docs.ethers.org/)
- [Somnia Network](https://somnia.network/)

### Smart Contracts
- [Backend Program README](/SoRe-backend/program/README.md)
- [Contract Source Code](/SoRe-backend/program/contracts/)
- [Deployment Info](/SoRe-backend/program/deployment-info.json)


## 📄 License

This project is part of the SoRe hackathon submission. For production use, please review and establish appropriate licensing.

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **Backend API**: [SoRe Backend Repository](/SoRe-backend/)
- **Smart Contracts**: [Program Directory](/SoRe-backend/program/)
- **Somnia Testnet**: [https://dream-rpc.somnia.network](https://dream-rpc.somnia.network)
- **Block Explorer**: [Somnia Explorer](https://explorer.somnia.network/)

---

Built with ❤️ by the SoRe team for the decentralized future of professional networking.

*Connect. Book. Earn. All on the blockchain.*