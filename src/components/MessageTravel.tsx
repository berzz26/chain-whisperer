
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { NetworkChain } from '@/types';
import { getNetwork } from '@/data/networks';

interface MessageTravelProps {
  from: NetworkChain;
  to: NetworkChain;
  active?: boolean;
  duration?: number;
  particleCount?: number;
  onComplete?: () => void;
}

const MessageTravel: React.FC<MessageTravelProps> = ({
  from,
  to,
  active = false,
  duration = 2000,  // reduced from 3000 for sleeker transitions
  particleCount = 3,  // reduced from 5 for minimalistic look
  onComplete
}) => {
  const [particles, setParticles] = useState<React.ReactNode[]>([]);
  const fromNetwork = getNetwork(from);
  const toNetwork = getNetwork(to);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    // Create particles
    const newParticles = Array.from({ length: particleCount }).map((_, index) => {
      const delay = (index * (duration / particleCount) * 0.8); // increased spacing between particles
      
      return (
        <div
          key={index}
          className="message-particle"
          style={{
            animationDelay: `${delay}ms`,
            animationDuration: `${duration}ms`,
            '--travel-distance-x': '100%',
            '--travel-distance-y': '0',
            backgroundColor: fromNetwork.color, // using backgroundColor instead of color
            opacity: 0.8, // slightly transparent for sleeker look
            animation: `message-travel-sleek ${duration}ms ${delay}ms forwards cubic-bezier(0.16, 1, 0.3, 1)` // updated easing
          } as React.CSSProperties}
        />
      );
    });

    setParticles(newParticles);

    // Call onComplete after all particles finish
    const timer = setTimeout(() => {
      onComplete?.();
    }, duration * 1.2); // reduced multiplier for faster completion

    return () => clearTimeout(timer);
  }, [active, from, to, duration, particleCount, onComplete, fromNetwork.color]);

  if (!active && particles.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles}
    </div>
  );
};

export default MessageTravel;
