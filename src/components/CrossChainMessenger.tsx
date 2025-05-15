import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { NetworkChain } from '@/types';
import NetworkSelector from './NetworkSelector';
import NetworkNode from './NetworkNode';
import MessageTravel from './MessageTravel';
import { ArrowRight, MessageSquare, Loader2 } from 'lucide-react';
import { sendMessage } from '@/services/layerZeroService';
import { motion } from 'framer-motion';

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30
    }
  }
};

const CrossChainMessenger: React.FC = () => {
  const [sourceChain, setSourceChain] = useState<NetworkChain>('solana');
  const [destinationChain, setDestinationChain] = useState<NetworkChain>('ethereum');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [animateMessage, setAnimateMessage] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message to send');
      return;
    }

    try {
      setSending(true);
      setAnimateMessage(true);

      // Call the LayerZero messaging service
      const result = await sendMessage(sourceChain, destinationChain, message);

      if (result.status === 'confirmed') {
        toast.success('Message sent successfully!');
        setMessage('');
      } else {
        toast.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSending(false);
      // Animation will be reset by the onComplete handler
    }
  };

  const handleAnimationComplete = () => {
    setAnimateMessage(false);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
    >
      <Card className="w-full max-w-md bg-background/70 border border-border rounded-xl shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <MessageSquare className="h-5 w-5" />
            Cross-Chain Messenger
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4">
            <NetworkSelector
              label="From"
              selectedNetwork={sourceChain}
              excludeNetwork={destinationChain}
              onSelectNetwork={setSourceChain}
            />

            <div className="relative flex justify-center py-2">
              <div className="bg-muted h-px w-full absolute top-1/2 transform -translate-y-1/2" />
              <div className="bg-background rounded-full p-1 z-10 border border-border">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <MessageTravel 
                from={sourceChain} 
                to={destinationChain} 
                active={animateMessage}
                onComplete={handleAnimationComplete}
              />
            </div>

            <NetworkSelector
              label="To"
              selectedNetwork={destinationChain}
              excludeNetwork={sourceChain}
              onSelectNetwork={setDestinationChain}
            />
          </div>

          <div className="space-y-2">
            <label 
              htmlFor="message" 
              className="text-sm font-medium text-muted-foreground"
            >
              Message
            </label>
            <Textarea
              id="message"
              placeholder="Enter the message to send..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-24 bg-background/80 border border-border rounded-md"
              disabled={sending}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleSendMessage}
            disabled={sending || !message.trim()}
          >
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending via LayerZero...
              </>
            ) : (
              'Send Cross-Chain Message'
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CrossChainMessenger;
