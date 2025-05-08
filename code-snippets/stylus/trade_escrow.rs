// Arbitrum Pulse: Trade Escrow
// Purpose: Secure B2B trade payments for Ethiopian exporters
// Author: Umojaverse (Griffins Oduol)
// License: MIT

#![no_std]
use stylus_sdk::{
    alloy_primitives::{Address, U256},
    msg, prelude::*,
    stylus_proc::*,
};

// Trade escrow contract storage
#[derive(StorageField)]
struct TradeEscrowStorage {
    // Maps trade ID to Trade struct
    #[selector(0x0)]
    trades: StorageMap<U256, Trade>,
    // Current trade counter
    #[selector(0x1)]
    trade_counter: StorageU256,
    // Platform fee percentage (in basis points, e.g., 25 = 0.25%)
    #[selector(0x2)]
    fee_basis_points: StorageU256,
    // Platform admin address
    #[selector(0x3)]
    admin: StorageAddress,
    // Platform fee collector address
    #[selector(0x4)]
    fee_collector: StorageAddress,
}

// Trade struct to store each transaction
#[derive(PartialEq, Clone)]
struct Trade {
    // Exporter's address
    exporter: Address,
    // Importer's address
    importer: Address,
    // Amount in escrow
    amount: U256,
    // Status of the trade (0=created, 1=funded, 2=delivered, 3=completed, 4=refunded, 5=disputed)
    status: u8,
    // Trade description (e.g., "10 bags of Ethiopian coffee")
    description_hash: [u8; 32],
    // Trade creation timestamp
    created_at: U256,
    // Trade expiration timestamp
    expires_at: U256,
}

// Main contract implementation
#[external]
impl TradeEscrow {
    // Initialize the escrow contract with admin and fee settings
    #[payable(false)]
    pub fn initialize(&mut self, fee_basis_points: U256, fee_collector: Address) -> Result<(), Vec<u8>> {
        // Ensure contract is being initialized
        if self.admin.get() != Address::ZERO {
            return Err(b"Already initialized".to_vec());
        }
        
        // Set admin as the deployer
        self.admin.set(msg::sender());
        
        // Set the fee basis points (limit to max 1000 basis points = 10%)
        if fee_basis_points > U256::from(1000u32) {
            return Err(b"Fee too high".to_vec());
        }
        self.fee_basis_points.set(fee_basis_points);
        
        // Set fee collector address
        self.fee_collector.set(fee_collector);
        
        // Initialize trade counter
        self.trade_counter.set(U256::ZERO);
        
        Ok(())
    }
    
    // Create a new trade escrow
    #[payable(false)]
    pub fn create_trade(
        &mut self,
        importer: Address,
        description_hash: [u8; 32],
        expiry_duration: U256,
    ) -> Result<U256, Vec<u8>> {
        // Get exporter address (trade creator)
        let exporter = msg::sender();
        
        // Ensure not sending to self
        if exporter == importer {
            return Err(b"Cannot trade with self".to_vec());
        }
        
        // Get current trade ID and increment counter
        let trade_id = self.trade_counter.get();
        self.trade_counter.set(trade_id + U256::from(1u32));
        
        // Calculate expiration timestamp
        let current_time = block_timestamp();
        let expires_at = current_time + expiry_duration;
        
        // Create new trade
        let trade = Trade {
            exporter,
            importer,
            amount: U256::ZERO,
            status: 0, // Created
            description_hash,
            created_at: current_time,
            expires_at,
        };
        
        // Save trade in storage
        self.trades.insert(trade_id, trade);
        
        // Return the trade ID
        Ok(trade_id)
    }
    
    // Fund a trade by the importer
    #[payable(true)]
    pub fn fund_trade(&mut self, trade_id: U256) -> Result<(), Vec<u8>> {
        // Get trade from storage
        let mut trade = self.get_trade(trade_id)?;
        
        // Ensure sender is the importer
        if msg::sender() != trade.importer {
            return Err(b"Not the importer".to_vec());
        }
        
        // Ensure trade is in created status
        if trade.status != 0 {
            return Err(b"Invalid trade status".to_vec());
        }
        
        // Ensure not expired
        let current_time = block_timestamp();
        if current_time > trade.expires_at {
            return Err(b"Trade expired".to_vec());
        }
        
        // Set trade amount and update status
        trade.amount = msg::value();
        trade.status = 1; // Funded
        
        // Update trade in storage
        self.trades.insert(trade_id, trade);
        
        Ok(())
    }
    
    // Confirm delivery by the importer, releasing funds to exporter
    #[payable(false)]
    pub fn confirm_delivery(&mut self, trade_id: U256) -> Result<(), Vec<u8>> {
        // Get trade from storage
        let mut trade = self.get_trade(trade_id)?;
        
        // Ensure sender is the importer
        if msg::sender() != trade.importer {
            return Err(b"Not the importer".to_vec());
        }
        
        // Ensure trade is in funded status
        if trade.status != 1 {
            return Err(b"Trade not funded".to_vec());
        }
        
        // Update trade status
        trade.status = 3; // Completed
        
        // Calculate fee
        let fee_basis_points = self.fee_basis_points.get();
        let fee = (trade.amount * fee_basis_points) / U256::from(10000u32);
        let payment_amount = trade.amount - fee;
        
        // Update trade in storage
        self.trades.insert(trade_id, trade.clone());
        
        // Transfer fee to fee collector if fee is non-zero
        if fee > U256::ZERO {
            let fee_collector = self.fee_collector.get();
            if !fee_collector.transfer(fee) {
                return Err(b"Fee transfer failed".to_vec());
            }
        }
        
        // Transfer payment to exporter
        if !trade.exporter.transfer(payment_amount) {
            return Err(b"Payment transfer failed".to_vec());
        }
        
        Ok(())
    }
    
    // Refund if delivery not confirmed before expiry
    #[payable(false)]
    pub fn claim_refund(&mut self, trade_id: U256) -> Result<(), Vec<u8>> {
        // Get trade from storage
        let mut trade = self.get_trade(trade_id)?;
        
        // Ensure trade is in funded status
        if trade.status != 1 {
            return Err(b"Trade not funded".to_vec());
        }
        
        // Ensure trade has expired
        let current_time = block_timestamp();
        if current_time <= trade.expires_at {
            return Err(b"Trade not expired".to_vec());
        }
        
        // Update trade status
        trade.status = 4; // Refunded
        
        // Update trade in storage
        self.trades.insert(trade_id, trade.clone());
        
        // Transfer full amount back to importer
        if !trade.importer.transfer(trade.amount) {
            return Err(b"Refund transfer failed".to_vec());
        }
        
        Ok(())
    }
    
    // Mark trade as disputed, only admin can resolve
    #[payable(false)]
    pub fn dispute_trade(&mut self, trade_id: U256) -> Result<(), Vec<u8>> {
        // Get trade from storage
        let mut trade = self.get_trade(trade_id)?;
        
        // Ensure sender is either importer or exporter
        let sender = msg::sender();
        if sender != trade.importer && sender != trade.exporter {
            return Err(b"Not a trade party".to_vec());
        }
        
        // Ensure trade is in funded status
        if trade.status != 1 {
            return Err(b"Trade not funded".to_vec());
        }
        
        // Update trade status
        trade.status = 5; // Disputed
        
        // Update trade in storage
        self.trades.insert(trade_id, trade);
        
        Ok(())
    }
    
    // Admin resolves dispute by deciding where funds go
    #[payable(false)]
    pub fn resolve_dispute(
        &mut self,
        trade_id: U256,
        exporter_percent: U256,
    ) -> Result<(), Vec<u8>> {
        // Ensure sender is admin
        if msg::sender() != self.admin.get() {
            return Err(b"Not admin".to_vec());
        }
        
        // Get trade from storage
        let mut trade = self.get_trade(trade_id)?;
        
        // Ensure trade is in disputed status
        if trade.status != 5 {
            return Err(b"Trade not disputed".to_vec());
        }
        
        // Ensure exporter_percent is valid (0-100%)
        if exporter_percent > U256::from(100u32) {
            return Err(b"Invalid percentage".to_vec());
        }
        
        // Calculate amounts
        let exporter_amount = (trade.amount * exporter_percent) / U256::from(100u32);
        let importer_amount = trade.amount - exporter_amount;
        
        // Update trade status
        trade.status = 3; // Completed
        
        // Update trade in storage
        self.trades.insert(trade_id, trade.clone());
        
        // Transfer funds according to resolution
        if exporter_amount > U256::ZERO {
            if !trade.exporter.transfer(exporter_amount) {
                return Err(b"Exporter transfer failed".to_vec());
            }
        }
        
        if importer_amount > U256::ZERO {
            if !trade.importer.transfer(importer_amount) {
                return Err(b"Importer transfer failed".to_vec());
            }
        }
        
        Ok(())
    }
    
    // Get trade details by ID
    #[payable(false)]
    pub fn get_trade(&self, trade_id: U256) -> Result<Trade, Vec<u8>> {
        let trade = self.trades.get(trade_id);
        
        // Ensure trade exists (check if exporter is non-zero)
        if trade.exporter == Address::ZERO {
            return Err(b"Trade not found".to_vec());
        }
        
        Ok(trade)
    }
    
    // Get trade status by ID
    #[payable(false)]
    pub fn get_trade_status(&self, trade_id: U256) -> Result<u8, Vec<u8>> {
        let trade = self.get_trade(trade_id)?;
        Ok(trade.status)
    }
}

// Helper function to get current block timestamp
fn block_timestamp() -> U256 {
    U256::from(stylus_sdk::block::timestamp())
} 