
# OmniChain Messenger - LayerZero V2 on Solana

A cross-chain messaging and asset transfer application built using LayerZero V2, enabling seamless communication between Solana and EVM chains.

## Features

- **Cross-Chain Messaging**: Send text messages between different blockchain networks
- **Token Transfers**: Transfer tokens across chains using LayerZero's omnichain infrastructure
- **Chain Support**: Currently supports Solana, Ethereum, Arbitrum, and Polygon
- **Transaction History**: Track all your cross-chain activities in one place
- **Technical Documentation**: Learn about the implementation details

## Architecture

### Solana Program
The Solana program is written using the Anchor framework and integrates with LayerZero V2 to:
- Send messages and tokens to EVM chains
- Receive and process messages from EVM chains
- Handle token bridging functionality

### EVM Smart Contract
The EVM contract implements the ILayerZeroReceiver interface to:
- Receive messages from Solana
- Process and validate cross-chain messages
- Send messages back to Solana
- Manage token transfers

### Frontend Application
A React-based frontend that provides:
- User-friendly interface for messaging and transfers
- Visualizations of cross-chain communication
- Real-time status updates
- Technical documentation

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Solana CLI (for deploying Solana programs)
- Truffle or Hardhat (for deploying EVM contracts)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/omnichain-messenger.git
cd omnichain-messenger
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Deploying Smart Contracts

#### Solana Program
```bash
# Navigate to the Solana program directory
cd solana-program

# Build the program
anchor build

# Deploy to your preferred Solana network (devnet/testnet/mainnet)
anchor deploy --provider.cluster devnet
```

#### EVM Contract
```bash
# Navigate to the EVM contract directory
cd evm-contract

# Compile the contract
npx hardhat compile

# Deploy to your preferred network
npx hardhat run scripts/deploy.js --network arbitrum
```

## Usage

1. Open the application in your browser (default: http://localhost:8080)
2. Connect your wallet (supports Phantom for Solana and MetaMask for EVM chains)
3. Select source and destination chains
4. Compose and send cross-chain messages or transfer tokens
5. Monitor the transaction status in the history panel

## Gas Optimization

The application implements several gas optimization techniques:
- Batch processing for multiple messages
- Efficient payload encoding/decoding
- Optimized contract interactions
- Shared proof verification where possible

## Security Considerations

- Messages include nonce values to prevent replay attacks
- Critical operations require proper signature verification
- User addresses are validated across chain formats
- Token transfers implement safe transfer patterns

## License

MIT

## Acknowledgements

This project is built using LayerZero V2 protocol. Special thanks to the LayerZero team for their documentation and support.
