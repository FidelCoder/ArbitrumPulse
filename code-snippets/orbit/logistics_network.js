// Arbitrum Pulse: Logistics Network
// Purpose: Layer 3 chain for South African supply chain and logistics tracking
// Author: Umojaverse (Griffins Oduol)
// License: MIT

const { ethers } = require('ethers');
const { createRollupChain } = require('@arbitrum/orbit-sdk');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Main function to set up Orbit Chain for logistics tracking
async function setupLogisticsChain() {
    console.log("Starting South African Logistics Network Orbit Chain setup...");
    
    // Connect to Arbitrum Sepolia (Layer 2)
    const provider = new ethers.providers.JsonRpcProvider(process.env.ARBITRUM_SEPOLIA_RPC);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log("Connected to Arbitrum Sepolia as:", wallet.address);
    
    // Define Orbit Chain configuration for Logistics Network
    const orbitChainConfig = {
        chainName: "SALogisticsChain",
        chainId: 42080, // Example chain ID, should be unique
        parentChainId: 421614, // Arbitrum Sepolia
        maxDataSize: 117964, // Default max data size for batches
        maxGasPerTransaction: 1000000000, // Max gas per transaction
        nativeToken: {
            name: "Logistics Token",
            symbol: "LOGS",
            decimals: 18
        },
        description: "Orbit Chain for South African logistics and supply chain tracking"
    };
    
    console.log("Preparing Orbit Chain with configuration:", orbitChainConfig.chainName);
    
    try {
        // Create the Orbit Chain
        const deploymentResult = await createRollupChain(
            wallet,
            orbitChainConfig
        );
        
        console.log("Orbit Chain deployed successfully!");
        console.log("Chain ID:", deploymentResult.chainId);
        console.log("RPC Endpoint:", deploymentResult.rpcUrl);
        console.log("Block Explorer:", deploymentResult.explorerUrl);
        
        // Connect to the new Orbit Chain
        const orbitProvider = new ethers.providers.JsonRpcProvider(deploymentResult.rpcUrl);
        const orbitWallet = new ethers.Wallet(process.env.PRIVATE_KEY, orbitProvider);
        console.log("Connected to new Orbit Chain as:", orbitWallet.address);
        
        // Deploy the logistics tracking contract
        console.log("Deploying Logistics Tracking contract...");
        
        // Contract ABI and bytecode would normally be imported from compiled artifacts
        // For demonstration, we'll represent a simplified deployment process
        const logisticsContract = {
            deploy: async function() {
                console.log("Simulating Logistics Tracking contract deployment...");
                // In a real deployment, you would use the actual contract ABI and bytecode
                return {
                    address: "0x" + "5".repeat(40), // Simulated contract address
                    registerCompany: async function(companyAddress, name, role) {
                        console.log(`Registering company ${name} as ${role}:`, companyAddress);
                        return { wait: async () => true };
                    },
                    createShipment: async function(origin, destination, content, deadline) {
                        console.log("Creating shipment from", origin, "to", destination);
                        return { 
                            wait: async () => ({ shipmentId: "SHIP" + Date.now() }) 
                        };
                    },
                    updateShipmentStatus: async function(shipmentId, status, location) {
                        console.log(`Updating shipment ${shipmentId} status to ${status} at ${location}`);
                        return { wait: async () => true };
                    }
                };
            }
        };
        
        const contract = await logisticsContract.deploy();
        console.log("Logistics Tracking contract deployed at:", contract.address);
        
        // Register demo logistics companies
        console.log("Registering demo logistics companies...");
        
        const demoCompanies = [
            {
                address: "0x" + "6".repeat(40),
                name: "Cape Town Port Authority",
                role: "PORT"
            },
            {
                address: "0x" + "7".repeat(40),
                name: "Transnet Freight Rail",
                role: "RAIL"
            },
            {
                address: "0x" + "8".repeat(40),
                name: "Imperial Logistics",
                role: "ROAD"
            },
            {
                address: "0x" + "9".repeat(40),
                name: "Durban Distribution Center",
                role: "WAREHOUSE"
            }
        ];
        
        for (const company of demoCompanies) {
            await contract.registerCompany(company.address, company.name, company.role);
            console.log(`Registered ${company.role} company: ${company.name}`);
        }
        
        // Create demo shipment for testing
        console.log("Creating demo shipment...");
        
        const shipmentResult = await contract.createShipment(
            "Cape Town Port",
            "Johannesburg Distribution Center",
            "Mining Equipment",
            Math.floor(Date.now() / 1000) + 86400 * 7 // 7 days from now
        );
        
        const receipt = await shipmentResult.wait();
        const shipmentId = receipt.shipmentId;
        console.log("Demo shipment created with ID:", shipmentId);
        
        // Add shipment status updates
        const statusUpdates = [
            { status: "RECEIVED", location: "Cape Town Port" },
            { status: "IN_TRANSIT", location: "N1 Highway" },
            { status: "CUSTOMS_CLEARED", location: "Bloemfontein Checkpoint" }
        ];
        
        for (const update of statusUpdates) {
            await contract.updateShipmentStatus(shipmentId, update.status, update.location);
            console.log(`Added status update: ${update.status} at ${update.location}`);
        }
        
        console.log("Setup complete! South African Logistics Network is ready on Orbit Chain.");
        console.log("Summary:");
        console.log("- Chain ID:", deploymentResult.chainId);
        console.log("- RPC URL:", deploymentResult.rpcUrl);
        console.log("- Logistics Contract:", contract.address);
        
        return {
            chainId: deploymentResult.chainId,
            rpcUrl: deploymentResult.rpcUrl,
            contractAddress: contract.address
        };
    } catch (error) {
        console.error("Error setting up Orbit Chain:", error);
        throw error;
    }
}

// Run the setup if this script is executed directly
if (require.main === module) {
    setupLogisticsChain()
        .then(result => {
            console.log("Successfully set up South African Logistics Network Orbit Chain");
            process.exit(0);
        })
        .catch(error => {
            console.error("Failed to set up Orbit Chain:", error);
            process.exit(1);
        });
} else {
    // Export for use in other modules
    module.exports = { setupLogisticsChain };
} 