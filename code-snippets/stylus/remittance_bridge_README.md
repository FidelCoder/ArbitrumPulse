# Remittance Bridge Smart Contract

## Overview
This Rust smart contract implements a remittance bridge for cross-border payments in Uganda, connecting blockchain with local mobile money systems. It enables efficient, low-cost transfers with support for multiple mobile money providers as off-ramps.

## Use Case
Uganda has one of the highest remittance inflows in East Africa, with high fees and slow processing times. This bridge provides:
- Reduced remittance costs (up to 70% cheaper than traditional methods)
- Integration with popular mobile money providers like MTN and Airtel
- Transparent fee structure and transaction tracking
- Fast settlement of funds

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

After deployment, initialize the bridge:
```
cargo stylus call --network sepolia --address YOUR_CONTRACT_ADDRESS --function initialize --args 50 FEE_COLLECTOR_ADDRESS
```
This sets a 0.5% platform fee (50 basis points).

## Testing
Test the remittance flow with these commands:

1. Register an off-ramp (admin only):
```
cargo stylus call --network sepolia --address YOUR_CONTRACT_ADDRESS --function register_off_ramp --args "MTN Mobile Money Uganda" OPERATOR_ADDRESS 100 UG UGX
```
This creates an off-ramp with a 1% fee.

2. Create a remittance:
```
cargo stylus call --network sepolia --address YOUR_CONTRACT_ADDRESS --function create_remittance --args OFF_RAMP_ID RECIPIENT_HASH REFERENCE_CODE --value 0.1
```

3. Process the remittance (off-ramp operator):
```
cargo stylus call --network sepolia --address YOUR_CONTRACT_ADDRESS --function process_remittance --args REMITTANCE_ID
```

4. Complete the remittance (off-ramp operator):
```
cargo stylus call --network sepolia --address YOUR_CONTRACT_ADDRESS --function complete_remittance --args REMITTANCE_ID
```

## Functions
- `initialize(fee_basis_points, fee_collector)`: Set up the remittance bridge
- `register_off_ramp(name, operator, fee_basis_points, country_code, currency_code)`: Register mobile money provider
- `set_off_ramp_status(off_ramp_id, is_active)`: Activate/deactivate an off-ramp
- `create_remittance(off_ramp_id, recipient_hash, reference_code)`: Create a new remittance (payable)
- `process_remittance(remittance_id)`: Mark remittance as processing
- `complete_remittance(remittance_id)`: Complete remittance and release funds
- `fail_remittance(remittance_id)`: Mark remittance as failed and refund sender
- `get_remittance(remittance_id)`: View remittance details
- `get_off_ramp(off_ramp_id)`: View off-ramp details
- `get_remittance_status(remittance_id)`: Check remittance status

## Local Context
This contract supports Uganda's remittance economy by:
1. Integrating with popular mobile money systems used by 23 million Ugandans
2. Reducing fees for diaspora sending money home
3. Accelerating settlement times from days to minutes
4. Increasing financial inclusion through mobile money access 