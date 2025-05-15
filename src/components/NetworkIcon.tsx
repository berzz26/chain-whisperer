
import React from 'react';
import { cn } from '@/lib/utils';
import { getNetwork } from '@/data/networks';
import { NetworkChain } from '@/types';
import { Circle, Hexagon, Pentagon, Triangle } from 'lucide-react';

interface NetworkIconProps {
  network: NetworkChain;
  size?: number;
  className?: string;
  withPulse?: boolean;
}

const NetworkIcon: React.FC<NetworkIconProps> = ({ 
  network, 
  size = 24, 
  className,
  withPulse = false
}) => {
  const networkData = getNetwork(network);
  const iconProps = { 
    size, 
    className: cn(
      'text-current',
      withPulse && 'animate-pulse-subtle', // Updated to the new subtle pulse
      className
    ),
    style: { color: networkData.color } 
  };

  // Map network icons to their respective components
  switch (networkData.icon) {
    case 'circle':
      return <Circle {...iconProps} />;
    case 'hexagon':
      return <Hexagon {...iconProps} />;
    case 'triangle':
      return <Triangle {...iconProps} />;
    case 'pentagon':
      return <Pentagon {...iconProps} />;
    default:
      return <Circle {...iconProps} />;
  }
};

export default NetworkIcon;
