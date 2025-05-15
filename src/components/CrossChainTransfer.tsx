
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { NetworkChain } from '@/types';
import NetworkSelector from './NetworkSelector';
import TokenBadge from './TokenBadge';
import { ArrowRight, Loader2, Wallet } from 'lucide-react';
import { transferTokens, getTokenBalances } from '@/services/layerZeroService';
import { tokens } from '@/data/tokens';
import MessageTravel from './MessageTravel';

const CrossChainTransfer: React.FC = () => {
  const [sourceChain, setSourceChain] = useState<NetworkChain>('solana');
  const [destinationChain, setDestinationChain] = useState<NetworkChain>('ethereum');
  const [selectedTokenId, setSelectedTokenId] = useState('usdc');
  const [amount, setAmount] = useState('');
  const [transferring, setTransferring] = useState(false);
  const [animateTransfer, setAnimateTransfer] = useState(false);

  // Get available tokens for the source chain
  const availableTokens = tokens.filter(token => 
    token.chains.includes(sourceChain) && token.chains.includes(destinationChain)
  );

  // Get token balances for the source chain
  const sourceBalances = getTokenBalances(sourceChain);
  
  // Get balance of selected token
  const selectedTokenBalance = sourceBalances.find(
    balance => balance.token.id === selectedTokenId
  );

  const handleTransfer = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!selectedTokenBalance || parseFloat(selectedTokenBalance.balance) < parseFloat(amount)) {
      toast.error(`Insufficient balance of ${selectedTokenBalance?.token.symbol || 'selected token'}`);
      return;
    }

    try {
      setTransferring(true);
      setAnimateTransfer(true);

      // Call the LayerZero token transfer service
      const result = await transferTokens(
        sourceChain,
        destinationChain,
        selectedTokenId,
        amount
      );

      if (result.status === 'confirmed') {
        toast.success(`Successfully transferred ${amount} ${result.token.symbol} to ${destinationChain}`);
        setAmount('');
      } else {
        toast.error('Failed to transfer tokens');
      }
    } catch (error) {
      console.error('Error transferring tokens:', error);
      toast.error('Failed to transfer tokens: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setTransferring(false);
      // Animation will be reset by the onComplete handler
    }
  };

  const handleAnimationComplete = () => {
    setAnimateTransfer(false);
  };

  // Handle source chain change
  const handleSourceChainChange = (chain: NetworkChain) => {
    setSourceChain(chain);
    
    // Check if selected token is available on new source chain
    const tokenAvailable = tokens.find(
      token => token.id === selectedTokenId && token.chains.includes(chain) && token.chains.includes(destinationChain)
    );
    
    if (!tokenAvailable && availableTokens.length > 0) {
      setSelectedTokenId(availableTokens[0].id);
    }
  };

  // Handle destination chain change
  const handleDestinationChainChange = (chain: NetworkChain) => {
    setDestinationChain(chain);
    
    // Check if selected token is available on new destination chain
    const tokenAvailable = tokens.find(
      token => token.id === selectedTokenId && token.chains.includes(sourceChain) && token.chains.includes(chain)
    );
    
    if (!tokenAvailable && availableTokens.length > 0) {
      setSelectedTokenId(availableTokens[0].id);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Cross-Chain Transfer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <NetworkSelector
            label="From"
            selectedNetwork={sourceChain}
            excludeNetwork={destinationChain}
            onSelectNetwork={handleSourceChainChange}
          />

          <div className="relative flex justify-center py-2">
            <div className="bg-muted h-px w-full absolute top-1/2 transform -translate-y-1/2" />
            <div className="bg-card rounded-full p-1 z-10">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <MessageTravel 
              from={sourceChain} 
              to={destinationChain} 
              active={animateTransfer}
              onComplete={handleAnimationComplete}
            />
          </div>

          <NetworkSelector
            label="To"
            selectedNetwork={destinationChain}
            excludeNetwork={sourceChain}
            onSelectNetwork={handleDestinationChainChange}
          />
        </div>

        <div className="space-y-2">
          <label 
            className="text-sm font-medium text-muted-foreground"
          >
            Token
          </label>
          {availableTokens.length > 0 ? (
            <Select
              value={selectedTokenId}
              onValueChange={setSelectedTokenId}
              disabled={transferring || availableTokens.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a token" />
              </SelectTrigger>
              <SelectContent>
                {availableTokens.map(token => (
                  <SelectItem key={token.id} value={token.id}>
                    <div className="flex items-center gap-2">
                      <TokenBadge token={token} size="sm" />
                      <span className="text-xs text-muted-foreground">
                        Balance: {sourceBalances.find(b => b.token.id === token.id)?.balance || '0'}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-sm text-muted-foreground p-2 border border-dashed rounded-md">
              No compatible tokens available between these chains
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label 
              htmlFor="amount" 
              className="text-sm font-medium text-muted-foreground"
            >
              Amount
            </label>
            {selectedTokenBalance && (
              <span className="text-xs text-muted-foreground">
                Available: {selectedTokenBalance.balance} {selectedTokenBalance.token.symbol}
              </span>
            )}
          </div>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={transferring || availableTokens.length === 0}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleTransfer}
          disabled={transferring || !amount || parseFloat(amount) <= 0 || availableTokens.length === 0}
        >
          {transferring ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Transferring via LayerZero...
            </>
          ) : (
            'Send Cross-Chain Transfer'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CrossChainTransfer;
