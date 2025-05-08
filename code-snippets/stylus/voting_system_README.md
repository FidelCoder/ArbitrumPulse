# Voting System Smart Contract

## Overview
This Rust smart contract implements a transparent e-governance voting system for Rwanda. It enables secure, verifiable elections with voter registration, election creation, vote casting, and result finalization, all on the blockchain for transparency.

## Use Case
Rwanda has been investing in digital government services and this voting system enhances democratic processes through:
- Transparent, tamper-proof election records
- Voter verification to prevent fraud
- Real-time vote tallying
- Digital inclusion for citizens

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

After deployment, initialize the voting system:
```
cargo stylus call --network sepolia --address YOUR_CONTRACT_ADDRESS --function initialize
```

## Testing
Test the election flow with these commands:

1. Register voters (admin only):
```
cargo stylus call --network sepolia --address YOUR_CONTRACT_ADDRESS --function register_voter --args VOTER_ADDRESS VOTER_ID_HASH
```

2. Create an election (admin only):
```
cargo stylus call --network sepolia --address YOUR_CONTRACT_ADDRESS --function create_election --args "Kigali City Council 2025" 5 START_TIME END_TIME METADATA_HASH
```

3. Cast a vote (by registered voter):
```
cargo stylus call --network sepolia --address YOUR_CONTRACT_ADDRESS --function cast_vote --args ELECTION_ID CANDIDATE_ID
```

4. Finalize results (admin only, after election end):
```
cargo stylus call --network sepolia --address YOUR_CONTRACT_ADDRESS --function finalize_election --args ELECTION_ID
```

## Functions
- `initialize()`: Set up the voting system with admin rights
- `register_voter(voter, id_hash)`: Register a voter with ID verification
- `create_election(name, candidate_count, start_time, end_time, metadata_hash)`: Create a new election
- `cast_vote(election_id, candidate_id)`: Cast a vote for a candidate
- `finalize_election(election_id)`: Count votes and determine winner
- `has_voted(election_id, voter)`: Check if a voter has voted
- `get_vote_count(election_id, candidate_id)`: Get current votes for a candidate
- `get_election(election_id)`: View election details
- `is_registered(voter)`: Check if a voter is registered

## Local Context
This contract supports Rwanda's digital transformation by:
1. Enhancing democratic processes through transparent voting
2. Reducing electoral fraud through digital ID verification
3. Supporting Kigali's smart city initiatives
4. Providing a model for other African nations to follow in e-governance 