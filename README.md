# ArbitrumPulse
Welcome to Arbitrum Pulse, a Umojaverse-led initiative to ignite Africa's blockchain revolution through bootcamps in Ethiopia, Kenya, South Africa, Uganda, and Rwanda. This repository is your go-to resource for learning to build scalable decentralized applications (DApps) using Arbitrum, Stylus, and Orbit Chains.

## Code Snippets

This repository contains educational code examples for the Arbitrum Pulse bootcamps:

### [Stylus Smart Contract Examples](./code-snippets/stylus/)
Rust-based smart contracts for Arbitrum Stylus, featuring:
- [Microfinance DAO (Kenya)](./code-snippets/stylus/microfinance_dao.rs) - Community savings and lending platform
- [Trade Escrow (Ethiopia)](./code-snippets/stylus/trade_escrow.rs) - Secure B2B trade payment system for exporters
- [Voting System (Rwanda)](./code-snippets/stylus/voting_system.rs) - Transparent e-governance voting platform
- [Supply Chain Tracker (South Africa)](./code-snippets/stylus/supply_chain_tracker.rs) - Logistics data tracking system
- [Remittance Bridge (Uganda)](./code-snippets/stylus/remittance_bridge.rs) - Cross-border payment system with mobile money integration

### [Orbit Chain Demonstrations](./code-snippets/orbit/)
JavaScript scripts for Arbitrum Orbit Chain (Layer 3) setup:
- [E-Governance Marketplace (Rwanda)](./code-snippets/orbit/e_governance_marketplace.js) - Government services platform
- [Fintech Bridge (Kenya)](./code-snippets/orbit/fintech_bridge.js) - M-Pesa integrated remittance solution
- [Trade Platform (Ethiopia)](./code-snippets/orbit/trade_platform.js) - Coffee export tracking system
- [Logistics Network (South Africa)](./code-snippets/orbit/logistics_network.js) - Supply chain data sharing network
- [Microfinance Hub (Uganda)](./code-snippets/orbit/microfinance_hub.js) - Community lending record system

## Validation and Testing

We've included validation scripts to verify the code integrity:

- For Stylus contracts: `cd code-snippets/stylus && node check.js`
- For Orbit chains: `cd code-snippets/orbit && node check.js`

These scripts check for proper code structure, required imports, and consistent implementation.

## Setup and Requirements

### For Stylus Examples:
- Rust (latest stable version)
- Cargo Stylus
- Arbitrum Sepolia testnet ETH

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install cargo-stylus
```

### For Orbit Chain Demos:
- Node.js (v16 or higher)
- npm or yarn
- Arbitrum Sepolia testnet ETH

```bash
npm install ethers@5.7.2 @arbitrum/orbit-sdk dotenv
```

## Environment Configuration

Create a `.env` file in the root directory with:

```
PRIVATE_KEY=your_private_key_here
ARBITRUM_SEPOLIA_RPC=https://sepolia-rollup.arbitrum.io/rpc
```

## Bootcamp Information

The Arbitrum Pulse bootcamps will take place from May 4-11, 2025, in:
- Addis Ababa, Ethiopia
- Nairobi, Kenya
- Johannesburg, South Africa
- Kampala, Uganda
- Kigali, Rwanda

Target audience:
- 30% blockchain enthusiasts
- 35% web2 developers
- 35% web3 developers

## Cross-Platform Compatibility

All code examples are designed to work across:
- Ubuntu/Debian Linux
- macOS
- Windows (may require WSL for some functionality)

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
