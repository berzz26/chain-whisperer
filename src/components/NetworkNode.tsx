
import React from 'react';
import { cn } from '@/lib/utils';
import { NetworkChain } from '@/types';
import { getNetwork } from '@/data/networks';
import NetworkIcon from './NetworkIcon';

interface NetworkNodeProps {
  network: NetworkChain;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  className?: string;
}

const NetworkNode: React.FC<NetworkNodeProps> = ({ 
  network, 
  size = 'md', 
  active = false,
  className 
}) => {
  const networkData = getNetwork(network);
  
  // Size mappings
  const sizeMap = {
    sm: { container: 'w-8 h-8', icon: 16 },
    md: { container: 'w-12 h-12', icon: 24 },
    lg: { container: 'w-16 h-16', icon: 32 },
  };

  // Extract size values
  const { container: containerSize, icon: iconSize } = sizeMap[size];

  return (
    <div 
      className={cn(
        'network-node rounded-full flex items-center justify-center bg-card',
        containerSize,
        active ? 'ring-1 ring-opacity-50 animate-fade-in-subtle' : '', // More subtle ring and new animation
        className
      )}
      style={{
        '--node-color-1': networkData.color,
        '--node-color-2': networkData.accent,
      } as React.CSSProperties}
    >
      <NetworkIcon 
        network={network} 
        size={iconSize} 
        withPulse={active}
      />
    </div>
  );
};

export default NetworkNode;
