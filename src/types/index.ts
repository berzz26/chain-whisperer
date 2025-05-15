
// Network types
export type NetworkChain = 'solana' | 'ethereum' | 'arbitrum' | 'polygon';

export interface Network {
  id: NetworkChain;
  name: string;
  icon: string; // Icon identifier (to be used with lucide-react icons)
  color: string; // CSS color for network
  accent: string; // Secondary CSS color
}

// Message types
export interface CrossChainMessage {
  id: string;
  fromChain: NetworkChain;
  toChain: NetworkChain;
  message: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  txHash?: string;
  confirmedAt?: number;
}

// Token types
export interface Token {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
  chains: NetworkChain[];
}

export interface TokenBalance {
  token: Token;
  chain: NetworkChain;
  balance: string;
}

// Transaction types
export interface CrossChainTransaction {
  id: string;
  fromChain: NetworkChain;
  toChain: NetworkChain;
  token: Token;
  amount: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  txHash?: string;
  confirmedAt?: number;
}
