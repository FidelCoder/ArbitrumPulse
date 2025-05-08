# Microfinance Hub Orbit Chain Demo

## Overview
This JavaScript script demonstrates setting up an Arbitrum Orbit Chain (Layer 3) for a Ugandan community-based microfinance solution. It creates a custom Layer 3 chain dedicated to supporting savings groups, microloans, and community finance activities common throughout Uganda.

## Use Case
Uganda has a rich tradition of community savings through Village Savings and Loan Associations (VSLAs) known locally as "Nigiina". This Orbit Chain demo enhances these traditional systems by:
- Creating a dedicated blockchain for transparent community savings
- Enabling secure microloans for small business owners
- Digitizing the VSLA model to expand financial inclusion
- Reducing overhead costs and fraud in community finance

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
Run the script to set up the Orbit Chain and deploy the microfinance hub:

```
node microfinance_hub.js
```

The script will:
1. Connect to Arbitrum Sepolia (Layer 2)
2. Create a new Orbit Chain (Layer 3) named "UgandaMicrofinanceChain"
3. Deploy the Microfinance Hub contract
4. Create a demo savings group ("Kampala Women Entrepreneurs")
5. Add members to the group and simulate contributions
6. Process a sample loan request with member approvals

## Expected Output
Upon successful execution, you'll see:
- Chain ID of the new Orbit Chain
- RPC URL endpoint for connecting to the chain
- Contract address of the deployed Microfinance Hub
- Confirmation of the created savings group and members
- Details of member contributions and loan processing

## Local Context
This demo is tailored for Uganda's microfinance ecosystem, which features:
1. Over 13,000 active VSLAs across the country serving 400,000+ members
2. Women making up 75% of VSLA membership nationwide
3. Average loan size of $50-200 USD for small business expansion
4. Group-based approval system requiring majority consensus
5. High mobile penetration (over 70%) but low banking access (less than 20%)

## Cross-Platform Compatibility
This script works on Windows, macOS, and Linux, as it uses platform-agnostic Node.js. Windows users may need to run it in WSL (Windows Subsystem for Linux) if they encounter path-related issues. 