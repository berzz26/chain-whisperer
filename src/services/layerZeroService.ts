
import { v4 as uuidv4 } from 'uuid';
import { CrossChainMessage, CrossChainTransaction, NetworkChain, TokenBalance } from '../types';
import { getNetwork } from '../data/networks';
import { getToken } from '../data/tokens';

// Mock delay to simulate blockchain interactions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique transaction hashes
const generateTxHash = () => '0x' + Array.from({ length: 64 }, () => 
  Math.floor(Math.random() * 16).toString(16)).join('');

// Mock transaction history
let messageHistory: CrossChainMessage[] = [];
let transactionHistory: CrossChainTransaction[] = [];

// Mock token balances - in a real app this would come from wallet connections
let tokenBalances: TokenBalance[] = [
  {
    token: getToken('usdc'),
    chain: 'solana',
    balance: '1000.00'
  },
  {
    token: getToken('sol'),
    chain: 'solana',
    balance: '10.5'
  },
  {
    token: getToken('usdc'),
    chain: 'ethereum',
    balance: '500.00'
  },
  {
    token: getToken('eth'),
    chain: 'ethereum',
    balance: '2.35'
  },
  {
    token: getToken('usdc'),
    chain: 'arbitrum',
    balance: '750.00'
  },
  {
    token: getToken('eth'),
    chain: 'arbitrum',
    balance: '1.75'
  },
  {
    token: getToken('usdc'),
    chain: 'polygon',
    balance: '1200.00'
  },
  {
    token: getToken('matic'),
    chain: 'polygon',
    balance: '120.5'
  },
];

export const getMessages = (): CrossChainMessage[] => {
  return [...messageHistory].sort((a, b) => b.timestamp - a.timestamp);
};

export const getTransactions = (): CrossChainTransaction[] => {
  return [...transactionHistory].sort((a, b) => b.timestamp - a.timestamp);
};

export const getTokenBalances = (chain?: NetworkChain): TokenBalance[] => {
  if (chain) {
    return tokenBalances.filter(tb => tb.chain === chain);
  }
  return tokenBalances;
};

// Send a cross-chain message using LayerZero
export const sendMessage = async (
  fromChain: NetworkChain,
  toChain: NetworkChain,
  message: string
): Promise<CrossChainMessage> => {
  console.log(`Sending message from ${fromChain} to ${toChain}: ${message}`);

  // Create a new message record
  const newMessage: CrossChainMessage = {
    id: uuidv4(),
    fromChain,
    toChain,
    message,
    status: 'pending',
    timestamp: Date.now(),
  };

  messageHistory.push(newMessage);

  try {
    // Simulate network delay for source chain confirmation
    await delay(2000 + Math.random() * 3000);

    // Update with transaction hash after "confirmation" on source chain
    const updatedMessage = {
      ...newMessage,
      txHash: generateTxHash(),
    };

    // Update in our history
    messageHistory = messageHistory.map(m => 
      m.id === newMessage.id ? updatedMessage : m
    );

    // Simulate delay for destination chain confirmation
    await delay(3000 + Math.random() * 5000);

    // Finalize the message as confirmed
    const confirmedMessage = {
      ...updatedMessage,
      status: 'confirmed' as const,
      confirmedAt: Date.now(),
    };

    // Update in our history
    messageHistory = messageHistory.map(m => 
      m.id === newMessage.id ? confirmedMessage : m
    );

    return confirmedMessage;
  } catch (error) {
    // If something goes wrong, mark as failed
    const failedMessage = {
      ...newMessage,
      status: 'failed' as const,
    };
    
    // Update in our history
    messageHistory = messageHistory.map(m => 
      m.id === newMessage.id ? failedMessage : m
    );

    console.error('Failed to send message:', error);
    return failedMessage;
  }
};

// Transfer tokens cross-chain using LayerZero
export const transferTokens = async (
  fromChain: NetworkChain,
  toChain: NetworkChain,
  tokenId: string,
  amount: string
): Promise<CrossChainTransaction> => {
  const token = getToken(tokenId);
  console.log(`Transferring ${amount} ${token.symbol} from ${fromChain} to ${toChain}`);

  // Validate token exists on both chains
  if (!token.chains.includes(fromChain) || !token.chains.includes(toChain)) {
    throw new Error(`Token ${token.symbol} is not available on both chains`);
  }

  // Validate balance
  const sourceBalance = tokenBalances.find(tb => 
    tb.chain === fromChain && tb.token.id === tokenId
  );

  if (!sourceBalance || parseFloat(sourceBalance.balance) < parseFloat(amount)) {
    throw new Error(`Insufficient balance of ${token.symbol} on ${fromChain}`);
  }

  // Create a new transaction record
  const newTransaction: CrossChainTransaction = {
    id: uuidv4(),
    fromChain,
    toChain,
    token,
    amount,
    status: 'pending',
    timestamp: Date.now(),
  };

  transactionHistory.push(newTransaction);

  // Simulate the transfer
  try {
    // Update source chain balance immediately to simulate sending
    tokenBalances = tokenBalances.map(tb => {
      if (tb.chain === fromChain && tb.token.id === tokenId) {
        return {
          ...tb,
          balance: (parseFloat(tb.balance) - parseFloat(amount)).toFixed(tb.token.decimals)
        };
      }
      return tb;
    });

    // Simulate network delay for source chain confirmation
    await delay(2000 + Math.random() * 3000);

    // Update with transaction hash after "confirmation" on source chain
    const updatedTransaction = {
      ...newTransaction,
      txHash: generateTxHash(),
    };

    // Update in our history
    transactionHistory = transactionHistory.map(t => 
      t.id === newTransaction.id ? updatedTransaction : t
    );

    // Simulate delay for destination chain confirmation
    await delay(4000 + Math.random() * 6000);

    // Update destination chain balance
    let destinationBalance = tokenBalances.find(tb => 
      tb.chain === toChain && tb.token.id === tokenId
    );

    if (destinationBalance) {
      // Update existing balance
      tokenBalances = tokenBalances.map(tb => {
        if (tb.chain === toChain && tb.token.id === tokenId) {
          return {
            ...tb,
            balance: (parseFloat(tb.balance) + parseFloat(amount)).toFixed(tb.token.decimals)
          };
        }
        return tb;
      });
    } else {
      // Create new balance entry
      tokenBalances.push({
        token,
        chain: toChain,
        balance: amount
      });
    }

    // Finalize the transaction as confirmed
    const confirmedTransaction = {
      ...updatedTransaction,
      status: 'confirmed' as const,
      confirmedAt: Date.now(),
    };

    // Update in our history
    transactionHistory = transactionHistory.map(t => 
      t.id === newTransaction.id ? confirmedTransaction : t
    );

    return confirmedTransaction;
  } catch (error) {
    // If something goes wrong, mark as failed and restore balance
    const failedTransaction = {
      ...newTransaction,
      status: 'failed' as const,
    };
    
    // Restore the original balance
    tokenBalances = tokenBalances.map(tb => {
      if (tb.chain === fromChain && tb.token.id === tokenId) {
        return {
          ...tb,
          balance: (parseFloat(tb.balance) + parseFloat(amount)).toFixed(tb.token.decimals)
        };
      }
      return tb;
    });
    
    // Update in our history
    transactionHistory = transactionHistory.map(t => 
      t.id === newTransaction.id ? failedTransaction : t
    );

    console.error('Failed to transfer tokens:', error);
    return failedTransaction;
  }
};
