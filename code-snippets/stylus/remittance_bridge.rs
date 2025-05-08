// Arbitrum Pulse: Remittance Bridge
// Purpose: Efficient cross-border payments for Uganda
// Author: Umojaverse (Griffins Oduol)
// License: MIT

#![no_std]
use stylus_sdk::{
    alloy_primitives::{Address, U256},
    msg, prelude::*,
    stylus_proc::*,
};

// Remittance bridge storage
#[derive(StorageField)]
struct RemittanceBridgeStorage {
    // Maps remittance ID to Remittance struct
    #[selector(0x0)]
    remittances: StorageMap<U256, Remittance>,
    // Current remittance counter
    #[selector(0x1)]
    remittance_counter: StorageU256,
    // Platform admin address
    #[selector(0x2)]
    admin: StorageAddress,
    // Maps off-ramp ID to OffRamp struct (mobile money providers)
    #[selector(0x3)]
    off_ramps: StorageMap<U256, OffRamp>,
    // Current off-ramp counter
    #[selector(0x4)]
    off_ramp_counter: StorageU256,
    // Platform fee percentage (in basis points, e.g., 25 = 0.25%)
    #[selector(0x5)]
    fee_basis_points: StorageU256,
    // Platform fee collector address
    #[selector(0x6)]
    fee_collector: StorageAddress,
    // Maps off-ramp operator address to off-ramp ID
    #[selector(0x7)]
    off_ramp_operators: StorageMap<Address, U256>,
}

// Remittance struct to store each transaction
#[derive(PartialEq, Clone)]
struct Remittance {
    // Sender address
    sender: Address,
    // Off-ramp ID to use for this remittance
    off_ramp_id: U256,
    // Amount in wei
    amount: U256,
    // Recipient information hash (e.g. mobile money number)
    recipient_hash: [u8; 32],
    // Status (0=pending, 1=processing, 2=completed, 3=failed)
    status: u8,
    // Timestamp when remittance was created
    created_at: U256,
    // Timestamp when remittance was completed or failed
    completed_at: U256,
    // Reference code for the transaction
    reference_code: [u8; 32],
}

// Off-ramp (mobile money provider) struct
#[derive(PartialEq, Clone)]
struct OffRamp {
    // Off-ramp name (e.g., "MTN Mobile Money Uganda")
    name: [u8; 32],
    // Off-ramp operator address
    operator: Address,
    // Whether the off-ramp is active
    is_active: bool,
    // Off-ramp specific fee (in basis points)
    fee_basis_points: U256,
    // Country code (e.g. "UG" for Uganda)
    country_code: [u8; 2],
    // Currency code (e.g. "UGX" for Ugandan Shilling)
    currency_code: [u8; 3],
}

// Main contract implementation
#[external]
impl RemittanceBridge {
    // Initialize the remittance bridge
    #[payable(false)]
    pub fn initialize(&mut self, fee_basis_points: U256, fee_collector: Address) -> Result<(), Vec<u8>> {
        // Ensure contract is being initialized
        if self.admin.get() != Address::ZERO {
            return Err(b"Already initialized".to_vec());
        }
        
        // Set admin as the deployer
        self.admin.set(msg::sender());
        
        // Set the fee basis points (limit to max 500 basis points = 5%)
        if fee_basis_points > U256::from(500u32) {
            return Err(b"Fee too high".to_vec());
        }
        self.fee_basis_points.set(fee_basis_points);
        
        // Set fee collector address
        self.fee_collector.set(fee_collector);
        
        // Initialize counters
        self.remittance_counter.set(U256::ZERO);
        self.off_ramp_counter.set(U256::ZERO);
        
        Ok(())
    }
    
    // Register a new off-ramp (mobile money provider)
    #[payable(false)]
    pub fn register_off_ramp(
        &mut self,
        name: [u8; 32],
        operator: Address,
        fee_basis_points: U256,
        country_code: [u8; 2],
        currency_code: [u8; 3],
    ) -> Result<U256, Vec<u8>> {
        // Only admin can register off-ramps
        if msg::sender() != self.admin.get() {
            return Err(b"Not admin".to_vec());
        }
        
        // Validate fee (limit to max 1000 basis points = 10%)
        if fee_basis_points > U256::from(1000u32) {
            return Err(b"Fee too high".to_vec());
        }
        
        // Get current off-ramp ID and increment counter
        let off_ramp_id = self.off_ramp_counter.get();
        self.off_ramp_counter.set(off_ramp_id + U256::from(1u32));
        
        // Create new off-ramp
        let off_ramp = OffRamp {
            name,
            operator,
            is_active: true,
            fee_basis_points,
            country_code,
            currency_code,
        };
        
        // Save off-ramp in storage
        self.off_ramps.insert(off_ramp_id, off_ramp);
        
        // Map operator address to off-ramp ID
        self.off_ramp_operators.insert(operator, off_ramp_id);
        
        // Return the off-ramp ID
        Ok(off_ramp_id)
    }
    
    // Set off-ramp active status
    #[payable(false)]
    pub fn set_off_ramp_status(&mut self, off_ramp_id: U256, is_active: bool) -> Result<(), Vec<u8>> {
        // Only admin can update off-ramp status
        if msg::sender() != self.admin.get() {
            return Err(b"Not admin".to_vec());
        }
        
        // Get off-ramp from storage
        let mut off_ramp = self.get_off_ramp(off_ramp_id)?;
        
        // Update status
        off_ramp.is_active = is_active;
        
        // Save updated off-ramp
        self.off_ramps.insert(off_ramp_id, off_ramp);
        
        Ok(())
    }
    
    // Create a new remittance
    #[payable(true)]
    pub fn create_remittance(
        &mut self,
        off_ramp_id: U256,
        recipient_hash: [u8; 32],
        reference_code: [u8; 32],
    ) -> Result<U256, Vec<u8>> {
        // Ensure value is sent
        let amount = msg::value();
        if amount == U256::ZERO {
            return Err(b"Zero amount".to_vec());
        }
        
        // Get off-ramp from storage
        let off_ramp = self.get_off_ramp(off_ramp_id)?;
        
        // Ensure off-ramp is active
        if !off_ramp.is_active {
            return Err(b"Off-ramp not active".to_vec());
        }
        
        // Get current remittance ID and increment counter
        let remittance_id = self.remittance_counter.get();
        self.remittance_counter.set(remittance_id + U256::from(1u32));
        
        // Get current timestamp
        let timestamp = block_timestamp();
        
        // Create new remittance
        let remittance = Remittance {
            sender: msg::sender(),
            off_ramp_id,
            amount,
            recipient_hash,
            status: 0, // Pending
            created_at: timestamp,
            completed_at: U256::ZERO,
            reference_code,
        };
        
        // Save remittance in storage
        self.remittances.insert(remittance_id, remittance);
        
        // Return the remittance ID
        Ok(remittance_id)
    }
    
    // Process a remittance (off-ramp operator)
    #[payable(false)]
    pub fn process_remittance(&mut self, remittance_id: U256) -> Result<(), Vec<u8>> {
        let sender = msg::sender();
        
        // Get remittance from storage
        let mut remittance = self.get_remittance(remittance_id)?;
        
        // Get off-ramp from storage
        let off_ramp = self.get_off_ramp(remittance.off_ramp_id)?;
        
        // Ensure sender is the off-ramp operator
        if sender != off_ramp.operator {
            return Err(b"Not the off-ramp operator".to_vec());
        }
        
        // Ensure remittance is in pending status
        if remittance.status != 0 {
            return Err(b"Invalid remittance status".to_vec());
        }
        
        // Update remittance status
        remittance.status = 1; // Processing
        
        // Save updated remittance
        self.remittances.insert(remittance_id, remittance);
        
        Ok(())
    }
    
    // Complete a remittance (off-ramp operator)
    #[payable(false)]
    pub fn complete_remittance(&mut self, remittance_id: U256) -> Result<(), Vec<u8>> {
        let sender = msg::sender();
        
        // Get remittance from storage
        let mut remittance = self.get_remittance(remittance_id)?;
        
        // Get off-ramp from storage
        let off_ramp = self.get_off_ramp(remittance.off_ramp_id)?;
        
        // Ensure sender is the off-ramp operator
        if sender != off_ramp.operator {
            return Err(b"Not the off-ramp operator".to_vec());
        }
        
        // Ensure remittance is in processing status
        if remittance.status != 1 {
            return Err(b"Invalid remittance status".to_vec());
        }
        
        // Calculate platform fee
        let platform_fee_basis_points = self.fee_basis_points.get();
        let platform_fee = (remittance.amount * platform_fee_basis_points) / U256::from(10000u32);
        
        // Calculate off-ramp fee
        let off_ramp_fee_basis_points = off_ramp.fee_basis_points;
        let off_ramp_fee = (remittance.amount * off_ramp_fee_basis_points) / U256::from(10000u32);
        
        // Calculate final payment to off-ramp operator
        let payment_amount = remittance.amount - platform_fee;
        
        // Update remittance
        let timestamp = block_timestamp();
        remittance.status = 2; // Completed
        remittance.completed_at = timestamp;
        
        // Save updated remittance
        self.remittances.insert(remittance_id, remittance.clone());
        
        // Transfer platform fee to fee collector
        let fee_collector = self.fee_collector.get();
        if platform_fee > U256::ZERO {
            if !fee_collector.transfer(platform_fee) {
                return Err(b"Platform fee transfer failed".to_vec());
            }
        }
        
        // Transfer payment to off-ramp operator
        if !off_ramp.operator.transfer(payment_amount) {
            return Err(b"Payment transfer failed".to_vec());
        }
        
        Ok(())
    }
    
    // Mark a remittance as failed (off-ramp operator)
    #[payable(false)]
    pub fn fail_remittance(&mut self, remittance_id: U256) -> Result<(), Vec<u8>> {
        let sender = msg::sender();
        
        // Get remittance from storage
        let mut remittance = self.get_remittance(remittance_id)?;
        
        // Get off-ramp from storage
        let off_ramp = self.get_off_ramp(remittance.off_ramp_id)?;
        
        // Ensure sender is the off-ramp operator or admin
        if sender != off_ramp.operator && sender != self.admin.get() {
            return Err(b"Not authorized".to_vec());
        }
        
        // Ensure remittance is in pending or processing status
        if remittance.status != 0 && remittance.status != 1 {
            return Err(b"Invalid remittance status".to_vec());
        }
        
        // Update remittance
        let timestamp = block_timestamp();
        remittance.status = 3; // Failed
        remittance.completed_at = timestamp;
        
        // Save updated remittance
        self.remittances.insert(remittance_id, remittance.clone());
        
        // Refund sender
        if !remittance.sender.transfer(remittance.amount) {
            return Err(b"Refund transfer failed".to_vec());
        }
        
        Ok(())
    }
    
    // Get remittance details by ID
    #[payable(false)]
    pub fn get_remittance(&self, remittance_id: U256) -> Result<Remittance, Vec<u8>> {
        let remittance = self.remittances.get(remittance_id);
        
        // Ensure remittance exists
        if remittance.created_at == U256::ZERO {
            return Err(b"Remittance not found".to_vec());
        }
        
        Ok(remittance)
    }
    
    // Get off-ramp details by ID
    #[payable(false)]
    pub fn get_off_ramp(&self, off_ramp_id: U256) -> Result<OffRamp, Vec<u8>> {
        let off_ramp = self.off_ramps.get(off_ramp_id);
        
        // Ensure off-ramp exists
        if off_ramp.operator == Address::ZERO {
            return Err(b"Off-ramp not found".to_vec());
        }
        
        Ok(off_ramp)
    }
    
    // Get off-ramp ID by operator address
    #[payable(false)]
    pub fn get_operator_off_ramp_id(&self, operator: Address) -> U256 {
        self.off_ramp_operators.get(operator)
    }
    
    // Check if address is an off-ramp operator
    #[payable(false)]
    pub fn is_off_ramp_operator(&self, addr: Address) -> bool {
        self.off_ramp_operators.get(addr) != U256::ZERO
    }
    
    // Get remittance status by ID
    #[payable(false)]
    pub fn get_remittance_status(&self, remittance_id: U256) -> Result<u8, Vec<u8>> {
        let remittance = self.get_remittance(remittance_id)?;
        Ok(remittance.status)
    }
}

// Helper function to get current block timestamp
fn block_timestamp() -> U256 {
    U256::from(stylus_sdk::block::timestamp())
} 