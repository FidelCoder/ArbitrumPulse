# Supply Chain Tracker Smart Contract

## Overview
This Rust smart contract implements a supply chain tracking system for South African logistics. It enables transparent tracking of products through the entire supply chain, recording ownership transfers, location updates, and status changes on the blockchain.

## Use Case
South Africa is a major logistics hub for southern Africa with complex supply chains. This tracker provides:
- End-to-end visibility of product movement
- Role-based access for supply chain participants
- Immutable history of product handling
- Transparent verification of product authenticity

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

After deployment, initialize the tracker:
```
cargo stylus call --network sepolia --address YOUR_CONTRACT_ADDRESS --function initialize
```

## Testing
Test the supply chain flow with these commands:

1. Assign roles (admin only):
```
cargo stylus call --network sepolia --address YOUR_CONTRACT_ADDRESS --function assign_role --args SUPPLIER_ADDRESS 1
cargo stylus call --network sepolia --address YOUR_CONTRACT_ADDRESS --function assign_role --args CARRIER_ADDRESS 2
cargo stylus call --network sepolia --address YOUR_CONTRACT_ADDRESS --function assign_role --args DISTRIBUTOR_ADDRESS 3
cargo stylus call --network sepolia --address YOUR_CONTRACT_ADDRESS --function assign_role --args RETAILER_ADDRESS 4
```

2. Create an item (as supplier):
```
cargo stylus call --network sepolia --address YOUR_CONTRACT_ADDRESS --function create_item --args "South African Wine Case" METADATA_HASH
```

3. Ship the item to carrier (as supplier):
```
cargo stylus call --network sepolia --address YOUR_CONTRACT_ADDRESS --function ship_item --args ITEM_ID CARRIER_ADDRESS LOCATION_HASH NOTES_HASH
```

4. Update in-transit status (as carrier):
```
cargo stylus call --network sepolia --address YOUR_CONTRACT_ADDRESS --function update_in_transit --args ITEM_ID LOCATION_HASH NOTES_HASH
```

5. Deliver to distributor (as carrier):
```
cargo stylus call --network sepolia --address YOUR_CONTRACT_ADDRESS --function deliver_item --args ITEM_ID DISTRIBUTOR_ADDRESS LOCATION_HASH NOTES_HASH
```

## Functions
- `initialize()`: Set up the supply chain tracker
- `assign_role(addr, role)`: Assign role to an address (1=supplier, 2=carrier, 3=distributor, 4=retailer)
- `revoke_role(addr, role)`: Revoke role from an address
- `create_item(name, metadata_hash)`: Create a new item to track
- `ship_item(item_id, carrier, location_hash, notes_hash)`: Transfer item to carrier for shipping
- `update_in_transit(item_id, location_hash, notes_hash)`: Update item status while in transit
- `deliver_item(item_id, recipient, location_hash, notes_hash)`: Deliver item to distributor/retailer
- `reject_item(item_id, location_hash, notes_hash)`: Reject an item at any point
- `get_item(item_id)`: Get item details
- `get_history_entry(item_id, log_id)`: Get a specific history entry
- `get_history_count(item_id)`: Get total history entries for an item
- `has_role(addr, role)`: Check if address has a specific role

## Local Context
This contract supports South Africa's logistics industry by:
1. Enhancing transparency in wine exports and mineral shipments
2. Reducing fraud through immutable record-keeping
3. Enabling real-time tracking of high-value goods
4. Simplifying compliance with trade regulations 