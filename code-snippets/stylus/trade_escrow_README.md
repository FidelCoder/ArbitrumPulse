# Trade Escrow Smart Contract

## Overview
This Rust smart contract implements a secure trade escrow system for Ethiopian exporters. It facilitates international B2B trade payments by holding funds in escrow until delivery confirmation, reducing risk for both exporters and importers.

## Use Case
Ethiopia is one of Africa's largest coffee exporters but faces challenges with payment security in international trade. This contract provides:
- Secure escrow mechanism for international payments
- Time-based expiration for trade protection
- Dispute resolution capabilities
- Transparent tracking of trade status

## Prerequisites
- Rust (latest stable version)
- Cargo Stylus (`cargo install cargo-stylus`)
- Arbitrum Sepolia testnet ETH (for deployment)
- A wallet with Sepolia ETH for testing

## Setup
1. Install Rust:
   ```
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. Install Cargo Stylus:
   ```
   cargo install cargo-stylus
   ```

3. Configure your wallet:
   Create a `.env` file with your private key:
   ```
   PRIVATE_KEY=your_private_key_here
   ```

## Deployment
To deploy to Arbitrum Sepolia testnet:

```
cargo stylus deploy --network sepolia
```

After deployment, initialize the contract with:
```
cargo stylus call --network sepolia --address YOUR_CONTRACT_ADDRESS --function initialize --args 25 YOUR_FEE_COLLECTOR_ADDRESS
```
This sets a 0.25% platform fee (25 basis points).

## Testing
Test the trade flow with these commands:

1. Create a trade (as exporter):
```
cargo stylus call --network sepolia --address YOUR_CONTRACT_ADDRESS --function create_trade --args IMPORTER_ADDRESS DESCRIPTION_HASH EXPIRY_DURATION_IN_SECONDS
```

2. Fund the trade (as importer):
```
cargo stylus call --network sepolia --address YOUR_CONTRACT_ADDRESS --function fund_trade --args TRADE_ID --value 1.0
```

3. Confirm delivery (as importer):
```
cargo stylus call --network sepolia --address YOUR_CONTRACT_ADDRESS --function confirm_delivery --args TRADE_ID
```

## Functions
- `initialize(fee_basis_points, fee_collector)`: Set up the escrow contract
- `create_trade(importer, description_hash, expiry_duration)`: Create a new trade (exporter)
- `fund_trade(trade_id)`: Fund a trade with payment (importer)
- `confirm_delivery(trade_id)`: Confirm delivery and release funds (importer)
- `claim_refund(trade_id)`: Claim refund after expiry (importer)
- `dispute_trade(trade_id)`: Flag a trade for dispute resolution
- `resolve_dispute(trade_id, exporter_percent)`: Resolve a dispute (admin)
- `get_trade(trade_id)`: View details of a trade
- `get_trade_status(trade_id)`: Check status of a trade

## Local Context
This contract supports Ethiopia's export economy by:
1. Providing payment security for coffee exporters
2. Enabling international trade with reduced risk
3. Building trust between Ethiopian businesses and global importers
4. Supporting the growing digital economy in Addis Ababa 