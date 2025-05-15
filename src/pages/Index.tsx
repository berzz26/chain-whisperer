import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import CrossChainMessenger from '@/components/CrossChainMessenger';
import CrossChainTransfer from '@/components/CrossChainTransfer';
import TransactionHistory from '@/components/TransactionHistory';
import { Link } from 'react-router-dom';
import { getMessages, getTransactions } from '@/services/layerZeroService';
import { MessageSquare, Wallet, BookOpen } from 'lucide-react';
import { CrossChainMessage, CrossChainTransaction } from '@/types';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
};

const titleVariants = {
  hidden: { 
    opacity: 0,
    y: -20,
    scale: 0.9
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      duration: 0.8
    }
  }
};

const Index = () => {
  const [messages, setMessages] = useState<CrossChainMessage[]>([]);
  const [transactions, setTransactions] = useState<CrossChainTransaction[]>([]);
  
  // Poll for updates to messages and transactions
  useEffect(() => {
    const fetchData = () => {
      setMessages(getMessages());
      setTransactions(getTransactions());
    };
    
    // Initial fetch
    fetchData();
    
    // Set up polling
    const intervalId = setInterval(fetchData, 3000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="min-h-screen w-full bg-neutral-900">
      <div className="container py-12 mx-auto px-4 flex flex-col items-center">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-4xl"
        >
          {/* Header */}
          <motion.div 
            variants={itemVariants}
            className="text-center mb-12"
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-4 text-white"
              variants={titleVariants}
              initial="hidden"
              animate="visible"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-500 hover:opacity-80 transition-opacity cursor-default">
                Chain Whisperer
              </span>
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-sm text-neutral-400 mb-4"
            >
              Cross-chain messaging simplified
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link to="/docs">
                <Button 
                  variant="outline"
                  className="gap-2 px-4 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 border-neutral-700"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Documentation</span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Main content */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-8"
            >
              <Tabs defaultValue="messaging" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4 bg-neutral-800/50 rounded-lg p-1">
                  <TabsTrigger value="messaging" className="flex items-center gap-2 px-3 py-1.5 rounded-md data-[state=active]:bg-neutral-700 data-[state=active]:text-white text-neutral-400">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm">Messages</span>
                  </TabsTrigger>
                  <TabsTrigger value="transfers" className="flex items-center gap-2 px-3 py-1.5 rounded-md data-[state=active]:bg-neutral-700 data-[state=active]:text-white text-neutral-400">
                    <Wallet className="h-4 w-4" />
                    <span className="text-sm">Transfers</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="messaging" className="mt-2">
                  <CrossChainMessenger />
                </TabsContent>
                
                <TabsContent value="transfers" className="mt-2">
                  <CrossChainTransfer />
                </TabsContent>
              </Tabs>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="lg:col-span-4"
            >
              <TransactionHistory 
                messages={messages}
                transactions={transactions}
                className="bg-neutral-800/50 rounded-lg p-4 h-full"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
