import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { apiService, XStatus } from '../services/api';

interface AuthContextType {
  walletAddress: string | null;
  isConnected: boolean;
  xStatus: XStatus | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  connectX: () => Promise<void>;
  disconnectX: () => Promise<void>;
  refreshXStatus: () => Promise<void>;
  loading: boolean;
  chainId: string | null;
  isCorrectNetwork: boolean;
  switchToSomnia: () => Promise<void>;
  showWalletNotification: boolean;
  setShowWalletNotification: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// Somnia Testnet Configuration - Official from chainid.network
const SOMNIA_TESTNET = {
  chainId: '0xc488', // 50312 in hex (verified from RPC)
  chainName: 'Somnia Testnet',
  nativeCurrency: {
    name: 'STT',
    symbol: 'STT',
    decimals: 18,
  },
  rpcUrls: ['https://dream-rpc.somnia.network'],
  blockExplorerUrls: ['https://somnia-testnet.socialscan.io'],
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [xStatus, setXStatus] = useState<XStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [chainId, setChainId] = useState<string | null>(null);
  const [showWalletNotification, setShowWalletNotification] = useState(false);

  const isConnected = !!walletAddress;
  const isCorrectNetwork = chainId === SOMNIA_TESTNET.chainId;

  const connectWallet = async () => {
    setLoading(true);
    try {
      // Debug: Log what's available
      console.log('Window ethereum object:', window.ethereum);
      console.log('Is MetaMask installed?', window.ethereum?.isMetaMask);
      console.log('Available providers:', window.ethereum?.providers);
      console.log('Ethereum object keys:', Object.keys(window.ethereum || {}));

      // Check if any Ethereum provider is available
      if (!window.ethereum) {
        console.log('No ethereum provider found');
        setShowWalletNotification(true);
        return;
      }

      // Special handling for Nightly wallet conflict
      if (!window.ethereum.isMetaMask && !window.ethereum.providers) {
        console.error('Detected non-MetaMask wallet without providers array - likely Nightly conflict');
        toast.error('🚨 Wallet Conflict Detected! Nightly wallet is interfering with MetaMask. Please disable Nightly extension and keep only MetaMask enabled.', { autoClose: 8000 });
        return;
      }

      // Wait a bit for wallets to initialize
      await new Promise(resolve => setTimeout(resolve, 200));

      // Check if we're dealing with multiple providers
      let provider = window.ethereum;
      
      // If there are multiple providers, try to use MetaMask specifically
      if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
        console.log('Multiple providers detected:', window.ethereum.providers.map(p => ({ isMetaMask: p.isMetaMask, constructor: p.constructor.name })));
        const metamaskProvider = window.ethereum.providers.find(
          (p: any) => p.isMetaMask === true
        );
        if (metamaskProvider) {
          console.log('Using MetaMask provider from providers array');
          provider = metamaskProvider;
        } else {
          console.log('No MetaMask found in providers, using first available');
          provider = window.ethereum.providers[0];
        }
      } else if (window.ethereum.isMetaMask === true) {
        console.log('Using single MetaMask provider');
        provider = window.ethereum;
      } else {
        console.warn('No MetaMask detected, using available provider');
        provider = window.ethereum;
      }

      console.log('Selected provider:', { 
        isMetaMask: provider.isMetaMask, 
        constructor: provider.constructor?.name,
        chainId: provider.chainId
      });

      // Verify the provider has the required methods
      if (!provider.request) {
        throw new Error('Selected wallet provider does not support required methods');
      }

      // Check if MetaMask is unlocked
      try {
        const accounts = await provider.request({ method: 'eth_accounts' });
        console.log('Already connected accounts:', accounts);
      } catch (err) {
        console.log('Wallet might be locked:', err);
      }

      // Request account access
      console.log('Requesting account access...');
      const accounts = await provider.request({ 
        method: 'eth_requestAccounts' 
      });
      
      console.log('Received accounts:', accounts);
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from wallet');
      }

      const address = accounts[0];
      setWalletAddress(address);

      // Get current chain ID
      const currentChainId = await provider.request({ 
        method: 'eth_chainId' 
      });
      console.log('Current chain ID:', currentChainId);
      setChainId(currentChainId);

      // Try to switch to Somnia Testnet if not already connected
      if (currentChainId !== SOMNIA_TESTNET.chainId) {
        console.log('Switching to Somnia Testnet...');
        await switchToSomnia();
      }
      
      // Check X status after wallet connection
      await refreshXStatus();
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      console.error('Error details:', {
        name: error?.name,
        message: error?.message,
        code: error?.code,
        stack: error?.stack,
        toString: error?.toString?.()
      });
      
      // Convert error to string to catch cases where error properties are undefined
      const errorString = error?.toString?.() || String(error);
      const errorMessage = error?.message || errorString;
      
      // Handle different types of errors with specific messages
      if (error?.code === 4001) {
        toast.error('Wallet connection was rejected by user. Please try again and approve the connection.');
      } else if (errorString.includes('not initialized') || errorString.includes('Nightly')) {
        toast.error('🚨 Nightly Wallet Conflict! Please disable Nightly wallet extension and keep only MetaMask enabled.', { autoClose: 8000 });
      } else if (errorString.includes('User rejected')) {
        toast.error('Connection request was rejected. Please try again and approve the connection in your wallet.');
      } else if (error?.code === -32002) {
        toast.error('MetaMask is already processing a request. Please check your MetaMask popup or wait a moment before trying again.');
      } else if (errorString.includes('does not support')) {
        toast.error('The selected wallet does not support required features. Please make sure you have MetaMask installed and enabled.');
      } else {
        toast.error(`Failed to connect wallet: ${errorMessage}. Please make sure MetaMask is installed, unlocked, and you approve the connection request.`, { autoClose: 5000 });
      }
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setXStatus(null);
    setChainId(null);
  };

  const switchToSomnia = async () => {
    if (!window.ethereum) {
      throw new Error('No Ethereum wallet detected');
    }

    // Get the current provider (handle multiple providers)
    let provider = window.ethereum;
    if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
      const metamaskProvider = window.ethereum.providers.find(
        (p: any) => p.isMetaMask
      );
      if (metamaskProvider) {
        provider = metamaskProvider;
      } else {
        provider = window.ethereum.providers[0];
      }
    }

    try {
      // Try to switch to Somnia Testnet
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SOMNIA_TESTNET.chainId }],
      });
      setChainId(SOMNIA_TESTNET.chainId);
    } catch (switchError: any) {
      // If the chain doesn't exist in wallet, add it
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [SOMNIA_TESTNET],
          });
          setChainId(SOMNIA_TESTNET.chainId);
        } catch (addError: any) {
          console.error('Failed to add Somnia Testnet:', addError);
          toast.error(`Failed to add Somnia Testnet to your wallet: ${addError.message || 'Unknown error'}`);
          throw addError;
        }
      } else if (switchError.code === 4001) {
        toast.error('Network switch was rejected by user. Please manually switch to Somnia Testnet in your wallet.');
        throw switchError;
      } else {
        console.error('Failed to switch to Somnia Testnet:', switchError);
        toast.error(`Failed to switch network: ${switchError.message || 'Unknown error'}`);
        throw switchError;
      }
    }
  };

  const refreshXStatus = async () => {
    if (!walletAddress) return;
    
    try {
      const status = await apiService.getXStatus(walletAddress);
      setXStatus(status);
    } catch (error) {
      console.error('Failed to fetch X status:', error);
      setXStatus({ connected: false, username: null, socialStats: null });
    }
  };

  const connectX = async () => {
    if (!walletAddress) throw new Error('Wallet not connected');
    
    setLoading(true);
    try {
      const { authUrl } = await apiService.connectX(walletAddress);
      
      // Redirect to X OAuth URL
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to connect X:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const disconnectX = async () => {
    if (!walletAddress) return;
    
    setLoading(true);
    try {
      await apiService.disconnectX(walletAddress);
      await refreshXStatus();
    } catch (error) {
      console.error('Failed to disconnect X:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Listen for account and chain changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setWalletAddress(accounts[0]);
      }
    };

    const handleChainChanged = (newChainId: string) => {
      setChainId(newChainId);
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    // Cleanup listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          // Get the current provider (handle multiple providers)
          let provider = window.ethereum;
          if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
            const metamaskProvider = window.ethereum.providers.find(
              (p: any) => p.isMetaMask
            );
            if (metamaskProvider) {
              provider = metamaskProvider;
            } else {
              provider = window.ethereum.providers[0];
            }
          }

          const accounts = await provider.request({ 
            method: 'eth_accounts' 
          });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            const currentChainId = await provider.request({ 
              method: 'eth_chainId' 
            });
            setChainId(currentChainId);
          }
        } catch (error) {
          console.error('Failed to check wallet connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  // Check for OAuth callback parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const connected = urlParams.get('connected');
    const username = urlParams.get('username');
    const error = urlParams.get('error');

    if (connected === 'true' && username) {
      // OAuth success - refresh status
      if (walletAddress) {
        refreshXStatus();
      }
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      console.error('OAuth error:', error);
      toast.error('Failed to connect X account. Please try again.');
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [walletAddress]);

  // Refresh X status when wallet changes
  useEffect(() => {
    if (walletAddress) {
      refreshXStatus();
    }
  }, [walletAddress]);

  const value: AuthContextType = {
    walletAddress,
    isConnected,
    xStatus,
    connectWallet,
    disconnectWallet,
    connectX,
    disconnectX,
    refreshXStatus,
    loading,
    chainId,
    isCorrectNetwork,
    switchToSomnia,
    showWalletNotification,
    setShowWalletNotification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};