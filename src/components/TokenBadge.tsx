
import React from 'react';
import { cn } from '@/lib/utils';
import { Token } from '@/types';

interface TokenBadgeProps {
  token: Token;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

const TokenBadge: React.FC<TokenBadgeProps> = ({
  token,
  size = 'md',
  showName = false,
  className
}) => {
  // Size mappings
  const sizeMap = {
    sm: { container: 'h-6 text-xs', img: 'w-4 h-4' },
    md: { container: 'h-8 text-sm', img: 'w-5 h-5' },
    lg: { container: 'h-10 text-base', img: 'w-6 h-6' },
  };

  // Extract size values
  const { container: containerSize, img: imgSize } = sizeMap[size];

  return (
    <div
      className={cn(
        'flex items-center bg-muted rounded-full px-2',
        containerSize,
        className
      )}
    >
      <div className={cn('rounded-full flex-shrink-0 bg-black/10 mr-1', imgSize)}>
        {/* In a real app, we'd use the token logo */}
        <div className={cn('rounded-full flex items-center justify-center', imgSize)}>
          {token.symbol.charAt(0)}
        </div>
      </div>
      <span className="font-medium">
        {showName ? token.name : token.symbol}
      </span>
    </div>
  );
};

export default TokenBadge;
