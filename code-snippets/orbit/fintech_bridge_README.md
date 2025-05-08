# Fintech Bridge Orbit Chain Demo

## Overview
This JavaScript script demonstrates setting up an Arbitrum Orbit Chain (Layer 3) for a Kenyan fintech bridge that enables low-cost remittance transactions. It creates a custom Layer 3 chain with M-Pesa integration capabilities for efficient cross-border payments.

## Use Case
Kenya is a global leader in mobile money adoption through M-Pesa, with over 30 million active users. This Orbit Chain demo enhances the fintech landscape by:
- Creating a dedicated blockchain for remittance transactions
- Reducing fees for cross-border payments to and from Kenya
- Integrating with popular mobile money platforms like M-Pesa and Airtel Money
- Accelerating settlement times from days to minutes

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- An Ethereum wallet with Arbitrum Sepolia testnet ETH
- Basic knowledge of JavaScript and Ethereum

## Dependencies
The script requires the following packages:
```
npm install ethers@5.7.2 @arbitrum/orbit-sdk dotenv
```

## Setup
1. Clone the repository and navigate to the directory:
   ```
   cd code-snippets/orbit/
   ```

2. Create a `.env` file with the following variables:
   ```
   PRIVATE_KEY=your_private_key_here
   ARBITRUM_SEPOLIA_RPC=https://sepolia-rollup.arbitrum.io/rpc
   ```

3. Install dependencies:
   ```
   npm install
   ```

## Execution
Run the script to set up the Orbit Chain and deploy the M-Pesa bridge:

```
node fintech_bridge.js
```

The script will:
1. Connect to Arbitrum Sepolia (Layer 2)
2. Create a new Orbit Chain (Layer 3) named "KenyaFintechChain"
3. Deploy the M-Pesa Bridge contract
4. Register demo mobile money providers (Safaricom M-Pesa, Airtel Money)
5. Create a sample transaction

## Expected Output
Upon successful execution, you'll see:
- Chain ID of the new Orbit Chain
- RPC URL endpoint for connecting to the chain
- Contract address of the deployed M-Pesa Bridge
- Confirmation of registered mobile money providers
- Details of the sample transaction

## Local Context
This demo is tailored for Kenya's fintech ecosystem, which features:
1. M-Pesa's dominance with 98% of mobile money transactions in the country
2. $63 billion in mobile money transactions annually (equivalent to 63% of Kenya's GDP)
3. High fees for international remittances (5-9%)
4. 3 million Kenyans in the diaspora who regularly send money home

## Cross-Platform Compatibility
This script works on Windows, macOS, and Linux, as it uses platform-agnostic Node.js. Windows users may need to run it in WSL (Windows Subsystem for Linux) if they encounter path-related issues. 