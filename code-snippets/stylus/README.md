# Stylus Smart Contract Examples

This directory contains Rust-based Stylus smart contract examples for Arbitrum, tailored for local African use cases as part of the Arbitrum Pulse bootcamp curriculum.

## Available Examples

1. **Microfinance DAO (Kenya)**
   - [Code](./microfinance_dao.rs) | [Documentation](./microfinance_dao_README.md)
   - Community savings and lending platform for Kenyan "Chamas"
   - Features deposit/withdrawal functions with time-based locks

2. **Trade Escrow (Ethiopia)**
   - [Code](./trade_escrow.rs) | [Documentation](./trade_escrow_README.md)
   - Secure B2B trade payment system for Ethiopian exporters
   - Includes escrow release on delivery confirmation

3. **Voting System (Rwanda)**
   - [Code](./voting_system.rs) | [Documentation](./voting_system_README.md)
   - Transparent e-governance voting platform
   - Tracks voter eligibility and prevents double voting

4. **Supply Chain Tracker (South Africa)**
   - [Code](./supply_chain_tracker.rs) | [Documentation](./supply_chain_tracker_README.md)
   - Logistics data tracking system for South African supply chains
   - Records inventory movements and timestamps

5. **Remittance Bridge (Uganda)**
   - [Code](./remittance_bridge.rs) | [Documentation](./remittance_bridge_README.md)
   - Cross-border payment system with low fees
   - Optimized for mobile money integration

## Validation and Testing

We've included validation scripts to verify code integrity:

```bash
# Run the comprehensive validation script
node check.js

# Check a specific contract
node check_contract.js microfinance_dao.rs
```

These scripts verify:
- Proper Rust syntax and structure
- Required Stylus SDK imports
- Public functions and implementation blocks
- External attributes and other critical elements

## General Setup

All examples share these basic setup requirements:

1. **Install Rust**:
   ```
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Install Cargo Stylus**:
   ```
   cargo install cargo-stylus
   ```

3. **Get Testnet ETH**:
   Visit an Arbitrum Sepolia faucet to get testnet ETH for deployment.

4. **Configure Environment**:
   Create a `.env` file with your private key:
   ```
   PRIVATE_KEY=your_private_key_here
   ```

5. **Deployment Command**:
   ```
   cargo stylus deploy --network sepolia
   ```

## Testing Guidelines

- All contracts are deployable on Arbitrum Sepolia testnet
- Each README contains specific testing instructions for that contract
- Use the provided commands to verify functionality after deployment
- Test across different operating systems (Windows, macOS, Linux)

## Educational Purpose

These examples are designed for educational workshops, demonstrating:
- Rust programming for Stylus
- Smart contract design patterns
- Local African use cases for blockchain
- Arbitrum Layer 2 scaling benefits 