// Arbitrum Pulse: Microfinance DAO
// Purpose: Manages community savings for Kenyan microfinance
// Author: Umojaverse (Griffins Oduol)
// License: MIT

#![no_std]
use stylus_sdk::{
    alloy_primitives::{Address, U256},
    msg, prelude::*,
    stylus_proc::*,
};

// Storage for member deposits
#[derive(StorageField)]
struct Deposits {
    // Maps member address to their deposit amount
    #[selector(0x0)]
    deposits: StorageMap<Address, U256>,
    // Total amount deposited in the DAO
    #[selector(0x1)]
    total_deposits: StorageU256,
    // Minimum time (in seconds) funds must be locked
    #[selector(0x2)]
    lock_period: StorageU256,
    // Mapping of when each member made their last deposit
    #[selector(0x3)]
    last_deposit_time: StorageMap<Address, U256>,
    // DAO admin address
    #[selector(0x4)]
    admin: StorageAddress,
}

// Main contract struct
#[external]
impl MicrofinanceDAO {
    // Initialize the DAO with an admin and lock period
    #[payable(false)]
    pub fn initialize(&mut self, lock_period_in_seconds: U256) -> Result<(), Vec<u8>> {
        // Set the contract creator as admin
        self.admin.set(msg::sender());
        // Set the lock period
        self.lock_period.set(lock_period_in_seconds);
        
        Ok(())
    }

    // Deposit funds into the DAO
    #[payable(true)]
    pub fn deposit(&mut self) -> Result<(), Vec<u8>> {
        let sender = msg::sender();
        let amount = msg::value();
        
        // Add to member's deposit amount
        let current_deposit = self.deposits.get(sender);
        self.deposits.insert(sender, current_deposit + amount);
        
        // Update total deposits
        let total = self.total_deposits.get();
        self.total_deposits.set(total + amount);
        
        // Record deposit time
        self.last_deposit_time.insert(sender, block_timestamp());
        
        Ok(())
    }

    // Withdraw funds from the DAO
    #[payable(false)]
    pub fn withdraw(&mut self, amount: U256) -> Result<(), Vec<u8>> {
        let sender = msg::sender();
        
        // Check if member has enough funds
        let current_deposit = self.deposits.get(sender);
        if current_deposit < amount {
            return Err(b"Insufficient funds".to_vec());
        }
        
        // Check if lock period has passed
        let deposit_time = self.last_deposit_time.get(sender);
        let current_time = block_timestamp();
        if current_time - deposit_time < self.lock_period.get() {
            return Err(b"Funds still locked".to_vec());
        }
        
        // Update member's deposit amount
        self.deposits.insert(sender, current_deposit - amount);
        
        // Update total deposits
        let total = self.total_deposits.get();
        self.total_deposits.set(total - amount);
        
        // Transfer funds to member
        if !sender.transfer(amount) {
            return Err(b"Transfer failed".to_vec());
        }
        
        Ok(())
    }

    // View member's deposit
    #[payable(false)]
    pub fn get_deposit(&self, member: Address) -> U256 {
        self.deposits.get(member)
    }

    // View total deposits in the DAO
    #[payable(false)]
    pub fn get_total_deposits(&self) -> U256 {
        self.total_deposits.get()
    }

    // Check if member's funds are locked
    #[payable(false)]
    pub fn is_locked(&self, member: Address) -> bool {
        let deposit_time = self.last_deposit_time.get(member);
        let current_time = block_timestamp();
        current_time - deposit_time < self.lock_period.get()
    }
}

// Helper function to get current block timestamp
fn block_timestamp() -> U256 {
    U256::from(stylus_sdk::block::timestamp())
} 