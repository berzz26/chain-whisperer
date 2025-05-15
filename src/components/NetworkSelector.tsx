
import React from 'react';
import { cn } from '@/lib/utils';
import { Network, NetworkChain } from '@/types';
import { networks } from '@/data/networks';
import NetworkNode from './NetworkNode';

interface NetworkSelectorProps {
  selectedNetwork?: NetworkChain;
  excludeNetwork?: NetworkChain;
  onSelectNetwork: (network: NetworkChain) => void;
  label?: string;
  className?: string;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({
  selectedNetwork,
  excludeNetwork,
  onSelectNetwork,
  label = 'Select Network',
  className
}) => {
  // Filter out the excluded network
  const availableNetworks = networks.filter(n => n.id !== excludeNetwork);

  return (
    <div className={cn('space-y-2', className)}>
      {label && <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>}
      <div className="flex flex-wrap gap-3">
        {availableNetworks.map((network) => (
          <button
            key={network.id}
            className={cn(
              'flex flex-col items-center p-2 rounded-lg transition-all',
              selectedNetwork === network.id ? 'bg-secondary/40' : 'hover:bg-secondary/20'
            )}
            onClick={() => onSelectNetwork(network.id as NetworkChain)}
          >
            <NetworkNode 
              network={network.id as NetworkChain} 
              active={selectedNetwork === network.id}
              size="sm"
            />
            <span className="mt-1 text-xs font-medium">{network.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NetworkSelector;
