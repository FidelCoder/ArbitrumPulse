// Arbitrum Pulse: Voting System
// Purpose: Transparent e-governance voting for Rwanda
// Author: Umojaverse (Griffins Oduol)
// License: MIT

#![no_std]
use stylus_sdk::{
    alloy_primitives::{Address, U256},
    msg, prelude::*,
    stylus_proc::*,
};

// Storage for voting system
#[derive(StorageField)]
struct VotingStorage {
    // Maps election ID to Election struct
    #[selector(0x0)]
    elections: StorageMap<U256, Election>,
    // Current election counter
    #[selector(0x1)]
    election_counter: StorageU256,
    // System admin address
    #[selector(0x2)]
    admin: StorageAddress,
    // Maps election ID to candidate votes
    #[selector(0x3)]
    votes: StorageMap<U256, StorageMap<U256, U256>>,
    // Maps election ID to voter's ballot
    #[selector(0x4)]
    ballots: StorageMap<U256, StorageMap<Address, bool>>,
    // Maps voter address to their ID hash (for verification)
    #[selector(0x5)]
    voter_registry: StorageMap<Address, [u8; 32]>,
}

// Election struct to store election data
#[derive(PartialEq, Clone)]
struct Election {
    // Election name (e.g., "Kigali City Council 2025")
    name: [u8; 32],
    // Number of candidates
    candidate_count: U256,
    // Start time of voting period
    start_time: U256,
    // End time of voting period
    end_time: U256,
    // Whether results have been finalized
    finalized: bool,
    // Hash of election metadata (IPFS hash to candidate info)
    metadata_hash: [u8; 32],
}

// Result struct for election results
#[derive(PartialEq, Clone)]
struct ElectionResult {
    // Election ID
    election_id: U256,
    // Winning candidate ID
    winning_candidate: U256,
    // Number of votes for winning candidate
    winning_votes: U256,
    // Total votes cast
    total_votes: U256,
}

// Main contract implementation
#[external]
impl VotingSystem {
    // Initialize the voting system
    #[payable(false)]
    pub fn initialize(&mut self) -> Result<(), Vec<u8>> {
        // Ensure contract is being initialized
        if self.admin.get() != Address::ZERO {
            return Err(b"Already initialized".to_vec());
        }
        
        // Set admin as the deployer
        self.admin.set(msg::sender());
        
        // Initialize election counter
        self.election_counter.set(U256::ZERO);
        
        Ok(())
    }
    
    // Register a voter with their ID hash
    #[payable(false)]
    pub fn register_voter(&mut self, voter: Address, id_hash: [u8; 32]) -> Result<(), Vec<u8>> {
        // Only admin can register voters
        if msg::sender() != self.admin.get() {
            return Err(b"Not admin".to_vec());
        }
        
        // Check if voter already registered
        if self.voter_registry.get(voter) != [0; 32] {
            return Err(b"Voter already registered".to_vec());
        }
        
        // Register voter with their ID hash
        self.voter_registry.insert(voter, id_hash);
        
        Ok(())
    }
    
    // Create a new election
    #[payable(false)]
    pub fn create_election(
        &mut self,
        name: [u8; 32],
        candidate_count: U256,
        start_time: U256,
        end_time: U256,
        metadata_hash: [u8; 32],
    ) -> Result<U256, Vec<u8>> {
        // Only admin can create elections
        if msg::sender() != self.admin.get() {
            return Err(b"Not admin".to_vec());
        }
        
        // Validate inputs
        if candidate_count == U256::ZERO {
            return Err(b"No candidates".to_vec());
        }
        
        if end_time <= start_time {
            return Err(b"Invalid time period".to_vec());
        }
        
        // Get current election ID and increment counter
        let election_id = self.election_counter.get();
        self.election_counter.set(election_id + U256::from(1u32));
        
        // Create new election
        let election = Election {
            name,
            candidate_count,
            start_time,
            end_time,
            finalized: false,
            metadata_hash,
        };
        
        // Save election in storage
        self.elections.insert(election_id, election);
        
        // Return the election ID
        Ok(election_id)
    }
    
    // Cast a vote in an election
    #[payable(false)]
    pub fn cast_vote(&mut self, election_id: U256, candidate_id: U256) -> Result<(), Vec<u8>> {
        let voter = msg::sender();
        
        // Ensure voter is registered
        if self.voter_registry.get(voter) == [0; 32] {
            return Err(b"Voter not registered".to_vec());
        }
        
        // Get election from storage
        let election = self.get_election(election_id)?;
        
        // Ensure election is active
        let current_time = block_timestamp();
        if current_time < election.start_time || current_time > election.end_time {
            return Err(b"Election not active".to_vec());
        }
        
        // Ensure candidate ID is valid
        if candidate_id >= election.candidate_count {
            return Err(b"Invalid candidate".to_vec());
        }
        
        // Ensure voter hasn't already voted
        if self.ballots.get(election_id).get(voter) {
            return Err(b"Already voted".to_vec());
        }
        
        // Record vote
        let current_votes = self.votes.get(election_id).get(candidate_id);
        self.votes.get(election_id).insert(candidate_id, current_votes + U256::from(1u32));
        
        // Mark voter as having voted
        self.ballots.get(election_id).insert(voter, true);
        
        Ok(())
    }
    
    // Finalize election results
    #[payable(false)]
    pub fn finalize_election(&mut self, election_id: U256) -> Result<ElectionResult, Vec<u8>> {
        // Only admin can finalize elections
        if msg::sender() != self.admin.get() {
            return Err(b"Not admin".to_vec());
        }
        
        // Get election from storage
        let mut election = self.get_election(election_id)?;
        
        // Ensure election has ended
        let current_time = block_timestamp();
        if current_time <= election.end_time {
            return Err(b"Election still active".to_vec());
        }
        
        // Ensure election isn't already finalized
        if election.finalized {
            return Err(b"Already finalized".to_vec());
        }
        
        // Find winning candidate
        let mut winning_candidate = U256::ZERO;
        let mut winning_votes = U256::ZERO;
        let mut total_votes = U256::ZERO;
        
        for i in 0..election.candidate_count.as_usize() {
            let candidate_id = U256::from(i as u32);
            let votes = self.votes.get(election_id).get(candidate_id);
            
            total_votes = total_votes + votes;
            
            if votes > winning_votes {
                winning_votes = votes;
                winning_candidate = candidate_id;
            }
        }
        
        // Mark election as finalized
        election.finalized = true;
        self.elections.insert(election_id, election);
        
        // Return election results
        Ok(ElectionResult {
            election_id,
            winning_candidate,
            winning_votes,
            total_votes,
        })
    }
    
    // Check if an address has voted in an election
    #[payable(false)]
    pub fn has_voted(&self, election_id: U256, voter: Address) -> bool {
        self.ballots.get(election_id).get(voter)
    }
    
    // Get vote count for a candidate
    #[payable(false)]
    pub fn get_vote_count(&self, election_id: U256, candidate_id: U256) -> U256 {
        self.votes.get(election_id).get(candidate_id)
    }
    
    // Get election details by ID
    #[payable(false)]
    pub fn get_election(&self, election_id: U256) -> Result<Election, Vec<u8>> {
        let election = self.elections.get(election_id);
        
        // Ensure election exists
        if election.start_time == U256::ZERO && election.end_time == U256::ZERO {
            return Err(b"Election not found".to_vec());
        }
        
        Ok(election)
    }
    
    // Check if a voter is registered
    #[payable(false)]
    pub fn is_registered(&self, voter: Address) -> bool {
        self.voter_registry.get(voter) != [0; 32]
    }
    
    // Get voter ID hash
    #[payable(false)]
    pub fn get_voter_id_hash(&self, voter: Address) -> Result<[u8; 32], Vec<u8>> {
        let id_hash = self.voter_registry.get(voter);
        
        // Ensure voter is registered
        if id_hash == [0; 32] {
            return Err(b"Voter not registered".to_vec());
        }
        
        Ok(id_hash)
    }
}

// Helper function to get current block timestamp
fn block_timestamp() -> U256 {
    U256::from(stylus_sdk::block::timestamp())
} 