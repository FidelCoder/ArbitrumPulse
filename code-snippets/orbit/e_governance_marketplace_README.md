# E-Governance Marketplace Orbit Chain Demo

## Overview
This JavaScript script demonstrates setting up an Arbitrum Orbit Chain (Layer 3) for a Rwandan e-governance marketplace. The demo creates a custom Layer 3 chain with a dedicated token and deploys a marketplace smart contract for government services.

## Use Case
Rwanda has made significant strides in digitizing government services. This Orbit Chain demo enhances this digital transformation by:
- Creating a dedicated blockchain for government service transactions
- Enabling transparent digital ID verification
- Supporting business registration and land registry checks
- Reducing costs through Layer 3 scaling solution

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
Run the script to set up the Orbit Chain and deploy the e-governance marketplace:

```
node e_governance_marketplace.js
```

The script will:
1. Connect to Arbitrum Sepolia (Layer 2)
2. Create a new Orbit Chain (Layer 3) named "RwandaGovChain"
3. Deploy the E-Governance Marketplace contract
4. Register example government services (Digital ID, Business Registration, Land Registry)

## Expected Output
Upon successful execution, you'll see:
- Chain ID of the new Orbit Chain
- RPC URL endpoint for connecting to the chain
- Contract address of the deployed marketplace
- Confirmation of registered government services

## Local Context
This demo is tailored for Rwanda's Digital Transformation agenda, which aims to:
1. Digitize all government services by 2030
2. Reduce bureaucracy and corruption through transparent blockchain records
3. Lower costs for citizens accessing government services
4. Create a model for other African nations to follow

## Cross-Platform Compatibility
This script works on Windows, macOS, and Linux, as it uses platform-agnostic Node.js. Windows users may need to run it in WSL (Windows Subsystem for Linux) if they encounter path-related issues. 