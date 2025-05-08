# Microfinance DAO Smart Contract

## Overview
This Rust smart contract implements a simple Microfinance DAO designed for community savings and lending in Kenya. Members can deposit funds that are locked for a specified period, simulating traditional community savings groups but with blockchain transparency and security.

## Use Case
In Kenya, community-based savings groups (Chamas) are popular for pooling resources, but often lack transparency and security. This contract provides:
- Secure deposit and withdrawal mechanisms
- Time-based lock periods to encourage saving
- Transparent fund tracking

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

Note the deployed contract address for future interactions.

## Testing
Test deposit and withdrawal functionality:

```
cargo stylus call --network sepolia --address YOUR_CONTRACT_ADDRESS --function deposit --value 0.1
```

Check your balance:
```
cargo stylus call --network sepolia --address YOUR_CONTRACT_ADDRESS --function get_deposit --args YOUR_WALLET_ADDRESS
```

## Functions
- `initialize(lock_period_in_seconds)`: Set up the DAO with a lock period
- `deposit()`: Deposit funds (payable function)
- `withdraw(amount)`: Withdraw funds after lock period
- `get_deposit(member)`: View a member's deposit
- `get_total_deposits()`: View total funds in the DAO
- `is_locked(member)`: Check if a member's funds are still locked

## Local Context
This contract supports Kenya's strong culture of community savings groups (Chamas) by providing:
1. Transparent tracking of deposits
2. Time-locked savings to encourage financial discipline
3. Secure withdrawal mechanisms to prevent unauthorized access 