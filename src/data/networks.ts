
import { Network } from '../types';

export const networks: Network[] = [
  {
    id: 'solana',
    name: 'Solana',
    icon: 'circle',
    color: 'rgb(20, 241, 149)',
    accent: 'rgb(126, 36, 231)',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    icon: 'hexagon',
    color: 'rgb(114, 131, 165)',
    accent: 'rgb(98, 126, 234)',
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    icon: 'triangle',
    color: 'rgb(40, 160, 240)',
    accent: 'rgb(41, 55, 97)',
  },
  {
    id: 'polygon',
    name: 'Polygon',
    icon: 'pentagon',
    color: 'rgb(130, 71, 229)',
    accent: 'rgb(130, 71, 229)',
  },
];

export const getNetwork = (id: string): Network => {
  const network = networks.find(n => n.id === id);
  if (!network) {
    throw new Error(`Network ${id} not found`);
  }
  return network;
};
