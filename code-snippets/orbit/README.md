# Orbit Chain Demonstration Scripts

This directory contains JavaScript scripts that demonstrate Arbitrum Orbit Chain (Layer 3) setup and interaction, tailored for local African use cases as part of the Arbitrum Pulse bootcamp curriculum.

## Available Demonstrations

1. **E-Governance Marketplace (Rwanda)**
   - [Code](./e_governance_marketplace.js) | [Documentation](./e_governance_marketplace_README.md)
   - Deploys a marketplace for government services on an Orbit Chain
   - Features digital ID verification, business registration, and land registry services

2. **Fintech Bridge (Kenya)**
   - [Code](./fintech_bridge.js) | [Documentation](./fintech_bridge_README.md)
   - Sets up a Layer 3 chain for low-cost remittance transactions
   - Optimized for M-Pesa integration and cross-border payments

3. **Trade Platform (Ethiopia)**
   - [Code](./trade_platform.js) | [Documentation](./trade_platform_README.md)
   - Initializes a chain for export-import tracking
   - Supports coffee export verification and trade documentation

4. **Logistics Network (South Africa)**
   - [Code](./logistics_network.js) | [Documentation](./logistics_network_README.md)
   - Creates a chain for supply chain data sharing
   - Tracks product movement across multiple logistics providers

5. **Microfinance Hub (Uganda)**
   - [Code](./microfinance_hub.js) | [Documentation](./microfinance_hub_README.md)
   - Deploys a chain for community lending records
   - Supports multiple microfinance DAOs in a single ecosystem

## Validation and Testing

We've included validation scripts to verify code integrity:

```bash
# Run the comprehensive validation script
node check.js

# Run more detailed validation
node validate.js
```

These scripts verify:
- Required imports (ethers, createRollupChain)
- Proper chain configuration
- Unique chain IDs
- Contract deployment code
- Error handling
- Environment configuration

## General Setup

All demonstrations share these basic setup requirements:

1. **Install Node.js**:
   ```
   # For Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # For macOS
   brew install node
   
   # For Windows
   # Download installer from https://nodejs.org/
   ```

2. **Install Dependencies**:
   ```
   npm install ethers@5.7.2 @arbitrum/orbit-sdk dotenv
   ```

3. **Configure Environment**:
   Create a `.env` file with:
   ```
   PRIVATE_KEY=your_private_key_here
   ARBITRUM_SEPOLIA_RPC=https://sepolia-rollup.arbitrum.io/rpc
   ```

4. **Get Testnet ETH**:
   Visit an Arbitrum Sepolia faucet to get testnet ETH for deployments.

## Execution Guidelines

- All scripts can be run with: `node script_name.js`
- Each demonstration creates its own Orbit Chain with a unique Chain ID
- The scripts automatically deploy smart contracts to the new chain
- Monitor console output for RPC URLs and contract addresses

## Chain ID Reference

Each demonstration uses a unique Chain ID to avoid conflicts:
- E-Governance Marketplace: `42069`
- Fintech Bridge: `42070`
- Trade Platform: `42071`
- Logistics Network: `42080`
- Microfinance Hub: `42090`

## Educational Purpose

These demonstrations teach:
- How to create and configure Orbit Chains (Layer 3)
- Smart contract deployment on custom chains
- Local African use cases for Layer 3 solutions
- Gas efficiency and transaction cost benefits of L3
- Chain customization for specific applications

## Cross-Platform Compatibility

These scripts are compatible with:
- Ubuntu/Debian Linux
- macOS
- Windows (with Node.js installed, may require WSL for some functionality) 