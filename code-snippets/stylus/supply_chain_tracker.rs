// Arbitrum Pulse: Supply Chain Tracker
// Purpose: Track logistics data for South African supply chains
// Author: Umojaverse (Griffins Oduol)
// License: MIT

#![no_std]
use stylus_sdk::{
    alloy_primitives::{Address, U256},
    msg, prelude::*,
    stylus_proc::*,
};

// Constants for item status
const STATUS_CREATED: u8 = 0;
const STATUS_SHIPPED: u8 = 1;
const STATUS_IN_TRANSIT: u8 = 2;
const STATUS_DELIVERED: u8 = 3;
const STATUS_REJECTED: u8 = 4;

// Supply chain tracker storage
#[derive(StorageField)]
struct SupplyChainStorage {
    // Maps item ID to Item struct
    #[selector(0x0)]
    items: StorageMap<U256, Item>,
    // Current item counter
    #[selector(0x1)]
    item_counter: StorageU256,
    // Platform admin address
    #[selector(0x2)]
    admin: StorageAddress,
    // Maps role (1=supplier, 2=carrier, 3=distributor, 4=retailer) to addresses with that role
    #[selector(0x3)]
    roles: StorageMap<u8, StorageMap<Address, bool>>,
    // Maps item ID to its history logs
    #[selector(0x4)]
    history: StorageMap<U256, StorageMap<U256, LogEntry>>,
    // Maps item ID to history log count
    #[selector(0x5)]
    history_counts: StorageMap<U256, U256>,
}

// Item struct to store supply chain item data
#[derive(PartialEq, Clone)]
struct Item {
    // Item name or SKU
    name: [u8; 32],
    // Current owner address
    owner: Address,
    // Original supplier address
    supplier: Address,
    // Current status
    status: u8,
    // Item metadata hash (IPFS hash to detailed info)
    metadata_hash: [u8; 32],
    // Timestamp when item was created
    created_at: U256,
    // Timestamp of last update
    updated_at: U256,
}

// Log entry struct for item history
#[derive(PartialEq, Clone)]
struct LogEntry {
    // Timestamp of the log entry
    timestamp: U256,
    // Status changed to
    status: u8,
    // Address that made the change
    actor: Address,
    // Optional location data hash
    location_hash: [u8; 32],
    // Optional notes hash
    notes_hash: [u8; 32],
}

// Main contract implementation
#[external]
impl SupplyChainTracker {
    // Initialize the supply chain tracker
    #[payable(false)]
    pub fn initialize(&mut self) -> Result<(), Vec<u8>> {
        // Ensure contract is being initialized
        if self.admin.get() != Address::ZERO {
            return Err(b"Already initialized".to_vec());
        }
        
        // Set admin as the deployer
        self.admin.set(msg::sender());
        
        // Initialize item counter
        self.item_counter.set(U256::ZERO);
        
        // Grant admin all roles for convenience
        self.roles.get(1).insert(msg::sender(), true); // Supplier
        self.roles.get(2).insert(msg::sender(), true); // Carrier
        self.roles.get(3).insert(msg::sender(), true); // Distributor
        self.roles.get(4).insert(msg::sender(), true); // Retailer
        
        Ok(())
    }
    
    // Assign a role to an address
    #[payable(false)]
    pub fn assign_role(&mut self, addr: Address, role: u8) -> Result<(), Vec<u8>> {
        // Only admin can assign roles
        if msg::sender() != self.admin.get() {
            return Err(b"Not admin".to_vec());
        }
        
        // Validate role (1=supplier, 2=carrier, 3=distributor, 4=retailer)
        if role < 1 || role > 4 {
            return Err(b"Invalid role".to_vec());
        }
        
        // Assign role
        self.roles.get(role).insert(addr, true);
        
        Ok(())
    }
    
    // Revoke a role from an address
    #[payable(false)]
    pub fn revoke_role(&mut self, addr: Address, role: u8) -> Result<(), Vec<u8>> {
        // Only admin can revoke roles
        if msg::sender() != self.admin.get() {
            return Err(b"Not admin".to_vec());
        }
        
        // Validate role
        if role < 1 || role > 4 {
            return Err(b"Invalid role".to_vec());
        }
        
        // Revoke role
        self.roles.get(role).insert(addr, false);
        
        Ok(())
    }
    
    // Create a new item in the supply chain
    #[payable(false)]
    pub fn create_item(
        &mut self,
        name: [u8; 32],
        metadata_hash: [u8; 32],
    ) -> Result<U256, Vec<u8>> {
        let sender = msg::sender();
        
        // Ensure sender is a supplier
        if !self.roles.get(1).get(sender) {
            return Err(b"Not a supplier".to_vec());
        }
        
        // Get current item ID and increment counter
        let item_id = self.item_counter.get();
        self.item_counter.set(item_id + U256::from(1u32));
        
        // Get current timestamp
        let timestamp = block_timestamp();
        
        // Create new item
        let item = Item {
            name,
            owner: sender,
            supplier: sender,
            status: STATUS_CREATED,
            metadata_hash,
            created_at: timestamp,
            updated_at: timestamp,
        };
        
        // Save item in storage
        self.items.insert(item_id, item);
        
        // Create first history log entry
        let log_entry = LogEntry {
            timestamp,
            status: STATUS_CREATED,
            actor: sender,
            location_hash: [0; 32],
            notes_hash: [0; 32],
        };
        
        // Save log entry and update history count
        self.history.get(item_id).insert(U256::ZERO, log_entry);
        self.history_counts.insert(item_id, U256::from(1u32));
        
        // Return the item ID
        Ok(item_id)
    }
    
    // Ship an item (supplier -> carrier)
    #[payable(false)]
    pub fn ship_item(
        &mut self,
        item_id: U256,
        carrier: Address,
        location_hash: [u8; 32],
        notes_hash: [u8; 32],
    ) -> Result<(), Vec<u8>> {
        let sender = msg::sender();
        
        // Get item from storage
        let mut item = self.get_item(item_id)?;
        
        // Ensure sender owns the item
        if sender != item.owner {
            return Err(b"Not the owner".to_vec());
        }
        
        // Ensure carrier has carrier role
        if !self.roles.get(2).get(carrier) {
            return Err(b"Not a carrier".to_vec());
        }
        
        // Ensure item is in CREATED status
        if item.status != STATUS_CREATED {
            return Err(b"Invalid item status".to_vec());
        }
        
        // Update item
        let timestamp = block_timestamp();
        item.owner = carrier;
        item.status = STATUS_SHIPPED;
        item.updated_at = timestamp;
        
        // Save updated item
        self.items.insert(item_id, item);
        
        // Add history log
        let log_entry = LogEntry {
            timestamp,
            status: STATUS_SHIPPED,
            actor: sender,
            location_hash,
            notes_hash,
        };
        
        // Get current history count and increment
        let history_count = self.history_counts.get(item_id);
        self.history.get(item_id).insert(history_count, log_entry);
        self.history_counts.insert(item_id, history_count + U256::from(1u32));
        
        Ok(())
    }
    
    // Update item in transit (carrier)
    #[payable(false)]
    pub fn update_in_transit(
        &mut self,
        item_id: U256,
        location_hash: [u8; 32],
        notes_hash: [u8; 32],
    ) -> Result<(), Vec<u8>> {
        let sender = msg::sender();
        
        // Get item from storage
        let mut item = self.get_item(item_id)?;
        
        // Ensure sender owns the item
        if sender != item.owner {
            return Err(b"Not the owner".to_vec());
        }
        
        // Ensure sender is a carrier
        if !self.roles.get(2).get(sender) {
            return Err(b"Not a carrier".to_vec());
        }
        
        // Ensure item is in SHIPPED status
        if item.status != STATUS_SHIPPED {
            return Err(b"Invalid item status".to_vec());
        }
        
        // Update item
        let timestamp = block_timestamp();
        item.status = STATUS_IN_TRANSIT;
        item.updated_at = timestamp;
        
        // Save updated item
        self.items.insert(item_id, item);
        
        // Add history log
        let log_entry = LogEntry {
            timestamp,
            status: STATUS_IN_TRANSIT,
            actor: sender,
            location_hash,
            notes_hash,
        };
        
        // Get current history count and increment
        let history_count = self.history_counts.get(item_id);
        self.history.get(item_id).insert(history_count, log_entry);
        self.history_counts.insert(item_id, history_count + U256::from(1u32));
        
        Ok(())
    }
    
    // Deliver item (carrier -> distributor/retailer)
    #[payable(false)]
    pub fn deliver_item(
        &mut self,
        item_id: U256,
        recipient: Address,
        location_hash: [u8; 32],
        notes_hash: [u8; 32],
    ) -> Result<(), Vec<u8>> {
        let sender = msg::sender();
        
        // Get item from storage
        let mut item = self.get_item(item_id)?;
        
        // Ensure sender owns the item
        if sender != item.owner {
            return Err(b"Not the owner".to_vec());
        }
        
        // Ensure sender is a carrier
        if !self.roles.get(2).get(sender) {
            return Err(b"Not a carrier".to_vec());
        }
        
        // Ensure recipient is distributor or retailer
        if !self.roles.get(3).get(recipient) && !self.roles.get(4).get(recipient) {
            return Err(b"Not a distributor or retailer".to_vec());
        }
        
        // Ensure item is in SHIPPED or IN_TRANSIT status
        if item.status != STATUS_SHIPPED && item.status != STATUS_IN_TRANSIT {
            return Err(b"Invalid item status".to_vec());
        }
        
        // Update item
        let timestamp = block_timestamp();
        item.owner = recipient;
        item.status = STATUS_DELIVERED;
        item.updated_at = timestamp;
        
        // Save updated item
        self.items.insert(item_id, item);
        
        // Add history log
        let log_entry = LogEntry {
            timestamp,
            status: STATUS_DELIVERED,
            actor: sender,
            location_hash,
            notes_hash,
        };
        
        // Get current history count and increment
        let history_count = self.history_counts.get(item_id);
        self.history.get(item_id).insert(history_count, log_entry);
        self.history_counts.insert(item_id, history_count + U256::from(1u32));
        
        Ok(())
    }
    
    // Reject item (can be called by any owner)
    #[payable(false)]
    pub fn reject_item(
        &mut self,
        item_id: U256,
        location_hash: [u8; 32],
        notes_hash: [u8; 32],
    ) -> Result<(), Vec<u8>> {
        let sender = msg::sender();
        
        // Get item from storage
        let mut item = self.get_item(item_id)?;
        
        // Ensure sender owns the item
        if sender != item.owner {
            return Err(b"Not the owner".to_vec());
        }
        
        // Update item
        let timestamp = block_timestamp();
        item.status = STATUS_REJECTED;
        item.updated_at = timestamp;
        
        // Save updated item
        self.items.insert(item_id, item);
        
        // Add history log
        let log_entry = LogEntry {
            timestamp,
            status: STATUS_REJECTED,
            actor: sender,
            location_hash,
            notes_hash,
        };
        
        // Get current history count and increment
        let history_count = self.history_counts.get(item_id);
        self.history.get(item_id).insert(history_count, log_entry);
        self.history_counts.insert(item_id, history_count + U256::from(1u32));
        
        Ok(())
    }
    
    // Get item details by ID
    #[payable(false)]
    pub fn get_item(&self, item_id: U256) -> Result<Item, Vec<u8>> {
        let item = self.items.get(item_id);
        
        // Ensure item exists
        if item.created_at == U256::ZERO {
            return Err(b"Item not found".to_vec());
        }
        
        Ok(item)
    }
    
    // Get log entry from item history
    #[payable(false)]
    pub fn get_history_entry(&self, item_id: U256, log_id: U256) -> Result<LogEntry, Vec<u8>> {
        // Ensure log ID is valid
        let history_count = self.history_counts.get(item_id);
        if log_id >= history_count {
            return Err(b"Log entry not found".to_vec());
        }
        
        Ok(self.history.get(item_id).get(log_id))
    }
    
    // Get total history entries for an item
    #[payable(false)]
    pub fn get_history_count(&self, item_id: U256) -> U256 {
        self.history_counts.get(item_id)
    }
    
    // Check if address has a specific role
    #[payable(false)]
    pub fn has_role(&self, addr: Address, role: u8) -> bool {
        self.roles.get(role).get(addr)
    }
}

// Helper function to get current block timestamp
fn block_timestamp() -> U256 {
    U256::from(stylus_sdk::block::timestamp())
} 