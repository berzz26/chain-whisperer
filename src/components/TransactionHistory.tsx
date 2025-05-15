
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { CrossChainTransaction, CrossChainMessage } from '@/types';
import NetworkIcon from './NetworkIcon';
import TokenBadge from './TokenBadge';
import { ArrowRight, Clock, MessageSquare, Wallet } from 'lucide-react';

interface TransactionHistoryProps {
  messages: CrossChainMessage[];
  transactions: CrossChainTransaction[];
  className?: string;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  messages, 
  transactions,
  className 
}) => {
  // Combine and sort both types by timestamp
  const combinedHistory = [
    ...messages.map(msg => ({ ...msg, type: 'message' as const })),
    ...transactions.map(tx => ({ ...tx, type: 'transaction' as const }))
  ].sort((a, b) => b.timestamp - a.timestamp);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default" className="bg-space-cosmic-teal">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="animate-pulse">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 pr-4">
          {combinedHistory.length > 0 ? (
            <div className="space-y-3">
              {combinedHistory.map((item) => (
                <div 
                  key={item.id} 
                  className="p-3 bg-muted/30 rounded-lg border border-muted"
                >
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {item.type === 'message' ? (
                        <MessageSquare className="h-4 w-4 text-space-nebula-pink" />
                      ) : (
                        <Wallet className="h-4 w-4 text-space-solar-yellow" />
                      )}
                      <span className="text-sm font-medium">
                        {item.type === 'message' ? 'Message' : 'Transfer'}
                      </span>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <NetworkIcon network={item.fromChain} size={16} />
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <NetworkIcon network={item.toChain} size={16} />
                    
                    {item.type === 'transaction' && (
                      <div className="ml-auto">
                        <TokenBadge 
                          token={item.token} 
                          size="sm"
                        />
                      </div>
                    )}
                  </div>
                  
                  {item.type === 'message' && (
                    <div className="text-sm bg-background/50 p-2 rounded mt-2 line-clamp-2">
                      {item.message}
                    </div>
                  )}
                  
                  {item.type === 'transaction' && (
                    <div className="text-sm font-medium">
                      Amount: {item.amount} {item.token.symbol}
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground mt-2">
                    {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No activity yet
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
