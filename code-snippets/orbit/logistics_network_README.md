# Logistics Network Orbit Chain Demo

## Overview
This JavaScript script demonstrates setting up an Arbitrum Orbit Chain (Layer 3) for a South African logistics network. It creates a custom Layer 3 chain specifically designed for supply chain tracking and logistics management across South Africa's complex transportation infrastructure.

## Use Case
South Africa has the most developed logistics infrastructure in Africa but faces challenges with visibility and coordination. This Orbit Chain demo addresses these issues by:
- Creating a dedicated blockchain for supply chain tracking
- Enabling real-time shipment status updates and location tracking
- Connecting ports, railways, road logistics, and distribution centers
- Improving transparency and reducing delays in logistics operations

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
Run the script to set up the Orbit Chain and deploy the logistics tracking system:

```
node logistics_network.js
```

The script will:
1. Connect to Arbitrum Sepolia (Layer 2)
2. Create a new Orbit Chain (Layer 3) named "SALogisticsChain"
3. Deploy the Logistics Tracking contract
4. Register demo logistics companies (Cape Town Port Authority, Transnet Freight Rail, etc.)
5. Create a sample shipment with tracking updates

## Expected Output
Upon successful execution, you'll see:
- Chain ID of the new Orbit Chain
- RPC URL endpoint for connecting to the chain
- Contract address of the deployed Logistics Tracking contract
- Confirmation of registered logistics companies
- Details of the sample shipment and status updates

## Local Context
This demo is tailored for South Africa's logistics ecosystem, which features:
1. The busiest ports in Africa (Durban, Cape Town)
2. Over 30,000 km of rail network operated by Transnet
3. A road freight industry that carries 80% of the country's goods
4. Critical bottlenecks at port-rail-road interfaces that cause delays
5. Need for enhanced visibility in the mining equipment supply chain (a key export sector)

## Cross-Platform Compatibility
This script works on Windows, macOS, and Linux, as it uses platform-agnostic Node.js. Windows users may need to run it in WSL (Windows Subsystem for Linux) if they encounter path-related issues. 