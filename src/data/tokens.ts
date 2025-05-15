
import { Token } from '../types';

export const tokens: Token[] = [
  {
    id: 'usdc',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: '/tokens/usdc.svg',
    chains: ['solana', 'ethereum', 'arbitrum', 'polygon'],
  },
  {
    id: 'sol',
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    logoURI: '/tokens/sol.svg',
    chains: ['solana'],
  },
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logoURI: '/tokens/eth.svg',
    chains: ['ethereum', 'arbitrum'],
  },
  {
    id: 'matic',
    symbol: 'MATIC',
    name: 'Polygon',
    decimals: 18,
    logoURI: '/tokens/matic.svg',
    chains: ['polygon'],
  },
];

export const getToken = (id: string): Token => {
  const token = tokens.find(t => t.id === id);
  if (!token) {
    throw new Error(`Token ${id} not found`);
  }
  return token;
};
