
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Code, Info } from 'lucide-react';

const LayerZeroDocumentation: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          LayerZero V2 Documentation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="solana">Solana Contract</TabsTrigger>
            <TabsTrigger value="evm">EVM Contract</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" /> 
                About LayerZero V2
              </h3>
              <p className="text-sm text-muted-foreground">
                LayerZero is an omnichain interoperability protocol designed for lightweight message passing 
                across chains. LayerZero V2 provides significant improvements in security, decentralization, 
                and efficiency compared to V1.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Key Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                <li>Enhanced security model with DVN (Decentralized Verifier Network)</li>
                <li>Support for more chains including Solana</li>
                <li>Improved gas efficiency</li>
                <li>Asynchronous messaging patterns</li>
                <li>Enhanced composability across blockchain ecosystems</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Architecture</h4>
              <p className="text-sm text-muted-foreground">
                The LayerZero protocol consists of three main components:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                <li><strong>Endpoints</strong>: Chain-specific contracts that handle message transmission</li>
                <li><strong>Relayers</strong>: Off-chain services that move messages between chains</li>
                <li><strong>Oracle</strong>: Provides verified block headers for cross-chain validation</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="solana" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <Code className="h-4 w-4" /> 
                Solana Contract Implementation
              </h3>
              <p className="text-sm text-muted-foreground">
                The Solana program integrates with LayerZero V2 to enable cross-chain messaging.
              </p>
            </div>
            
            <div className="bg-muted rounded-md p-3">
              <h4 className="font-medium mb-1 text-sm">Solana Program Structure</h4>
              <pre className="text-xs overflow-x-auto">
                <code className="text-muted-foreground">
{`// Main program entrypoint
use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg,
};

entrypoint!(process_instruction);

// Process incoming instructions
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Instruction routing logic
    Ok(())
}

// Send message through LayerZero
pub fn send_message(
    from: &Pubkey,
    to_chain: u16,
    to_address: Vec<u8>,
    message: Vec<u8>,
) -> ProgramResult {
    // Integration with LayerZero Endpoint
    Ok(())
}

// Receive message from LayerZero
pub fn receive_message(
    from_chain: u16,
    from_address: Vec<u8>,
    message: Vec<u8>,
) -> ProgramResult {
    // Handle incoming message
    Ok(())
}`}
                </code>
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Implementation Notes</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                <li>Uses Anchor framework for safer Solana program development</li>
                <li>Handles serialization/deserialization of cross-chain messages</li>
                <li>Implements security checks for message verification</li>
                <li>Manages gas payment for cross-chain operations</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="evm" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <Code className="h-4 w-4" /> 
                EVM Contract Implementation
              </h3>
              <p className="text-sm text-muted-foreground">
                The EVM contract serves as the destination for messages sent from Solana.
              </p>
            </div>
            
            <div className="bg-muted rounded-md p-3">
              <h4 className="font-medium mb-1 text-sm">EVM Smart Contract</h4>
              <pre className="text-xs overflow-x-auto">
                <code className="text-muted-foreground">
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@layerzerolabs/lz-evm-v2-0.8/contracts/libs/CommonsNative.sol";
import "@layerzerolabs/lz-evm-v2-0.8/contracts/messaging/interfaces/ILayerZeroEndpointV2.sol";
import "@layerzerolabs/lz-evm-v2-0.8/contracts/messaging/interfaces/ILayerZeroReceiver.sol";

contract CrossChainMessenger is ILayerZeroReceiver {
    ILayerZeroEndpointV2 public endpoint;
    mapping(uint32 => mapping(bytes32 => bool)) public receivedMessages;
    
    event MessageReceived(
        uint16 srcChainId, 
        bytes srcAddress, 
        bytes message
    );
    
    constructor(address _endpoint) {
        endpoint = ILayerZeroEndpointV2(_endpoint);
    }
    
    // Send message to another chain
    function sendMessage(
        uint16 _dstChainId,
        bytes calldata _dstAddress,
        bytes calldata _message
    ) external payable {
        // Prepare the message to send
        bytes memory payload = _message;
        
        // Call LayerZero endpoint to send the message
        endpoint.send{value: msg.value}(
            _dstChainId,
            _dstAddress,
            payload,
            payable(msg.sender),
            address(0),
            bytes("")
        );
    }
    
    // Receive message from another chain
    function lzReceive(
        uint16 _srcChainId,
        bytes calldata _srcAddress,
        bytes32 _nonce,
        bytes calldata _payload
    ) external override {
        // Verify the sender is the LayerZero endpoint
        require(msg.sender == address(endpoint), "Invalid endpoint");
        
        // Prevent duplicate messages
        bytes32 messageId = keccak256(
            abi.encodePacked(_srcChainId, _srcAddress, _nonce)
        );
        require(!receivedMessages[_srcChainId][messageId], "Duplicate message");
        receivedMessages[_srcChainId][messageId] = true;
        
        // Process message
        emit MessageReceived(_srcChainId, _srcAddress, _payload);
    }
}`}
                </code>
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Implementation Notes</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                <li>Implements the ILayerZeroReceiver interface</li>
                <li>Handles message validation and deduplication</li>
                <li>Supports bidirectional messaging with Solana</li>
                <li>Includes gas management for cross-chain operations</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LayerZeroDocumentation;
