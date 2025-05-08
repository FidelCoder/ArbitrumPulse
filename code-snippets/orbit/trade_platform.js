// Arbitrum Pulse: Trade Platform
// Purpose: Initialize an Orbit Chain for tracking Ethiopian exports
// Author: Umojaverse (Griffins Oduol)
// License: MIT

const { ethers } = require('ethers');
const { createRollupChain } = require('@arbitrum/orbit-sdk');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Main function to set up Orbit Chain for Ethiopian trade
async function setupOrbitChain() {
    console.log("Starting Ethiopian Trade Platform Orbit Chain setup...");
    
    // Connect to Arbitrum Sepolia (Layer 2)
    const provider = new ethers.providers.JsonRpcProvider(process.env.ARBITRUM_SEPOLIA_RPC);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log("Connected to Arbitrum Sepolia as:", wallet.address);
    
    // Define Orbit Chain configuration for Ethiopian Trade
    const orbitChainConfig = {
        chainName: "EthiopiaTradeChain",
        chainId: 42071, // Example chain ID, should be unique
        parentChainId: 421614, // Arbitrum Sepolia
        maxDataSize: 117964, // Default max data size for batches
        maxGasPerTransaction: 1000000000, // Max gas per transaction
        nativeToken: {
            name: "Ethiopia Trade Token",
            symbol: "ETT",
            decimals: 18
        },
        description: "Orbit Chain for tracking Ethiopian exports, especially coffee"
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
        
        // Deploy the trade contract
        console.log("Deploying Ethiopian Trade Platform contract...");
        
        // Contract ABI and bytecode would normally be imported from compiled artifacts
        // For demonstration, we'll represent a simplified deployment process
        const tradePlatformContract = {
            deploy: async function() {
                console.log("Simulating Ethiopian Trade Platform contract deployment...");
                // In a real deployment, you would use the actual contract ABI and bytecode
                return {
                    address: "0x" + "1".repeat(40), // Simulated contract address
                    registerExporter: async function(exporterAddress, name, licenseId) {
                        console.log("Registering exporter:", name, exporterAddress);
                        return { wait: async () => true };
                    },
                    registerImporter: async function(importerAddress, name, countryCode) {
                        console.log("Registering importer:", name, importerAddress);
                        return { wait: async () => true };
                    },
                    createCoffeeShipment: async function(batchId, quantity, grade, region, certifications) {
                        console.log("Creating coffee shipment:", batchId, region);
                        return { wait: async () => true };
                    },
                    createTradeAgreement: async function(exporterId, importerId, shipmentId, price) {
                        console.log("Creating trade agreement between exporter", exporterId, "and importer", importerId);
                        return { wait: async () => true };
                    }
                };
            }
        };
        
        const contract = await tradePlatformContract.deploy();
        console.log("Ethiopian Trade Platform deployed at:", contract.address);
        
        // Register demo exporters and importers
        console.log("Registering demo exporters and importers...");
        
        // Using randomly generated addresses for demo
        const demoExporters = [
            { address: "0x" + "a".repeat(40), name: "Oromia Coffee Farmers Co-op", licenseId: "ETH-EXP-0001" },
            { address: "0x" + "b".repeat(40), name: "Yirgacheffe Coffee Producers", licenseId: "ETH-EXP-0024" }
        ];
        
        const demoImporters = [
            { address: "0x" + "c".repeat(40), name: "European Coffee Traders", countryCode: "EU" },
            { address: "0x" + "d".repeat(40), name: "North American Importers", countryCode: "US" }
        ];
        
        // Register the exporters
        for (let exporter of demoExporters) {
            await contract.registerExporter(exporter.address, exporter.name, exporter.licenseId);
        }
        
        // Register the importers
        for (let importer of demoImporters) {
            await contract.registerImporter(importer.address, importer.name, importer.countryCode);
        }
        
        // Create demo coffee shipments
        console.log("Creating demo coffee shipments...");
        
        // Demo coffee data
        const demoCoffeeShipments = [
            { batchId: "BATCH-2025-001", quantity: "2000", grade: "Grade 1", region: "Sidamo", certifications: "Organic, Fair Trade" },
            { batchId: "BATCH-2025-002", quantity: "1500", grade: "Grade 2", region: "Yirgacheffe", certifications: "Rainforest Alliance" }
        ];
        
        // Create shipments
        for (let shipment of demoCoffeeShipments) {
            await contract.createCoffeeShipment(
                shipment.batchId,
                shipment.quantity,
                shipment.grade,
                shipment.region,
                shipment.certifications
            );
        }
        
        // Create a demo trade agreement
        console.log("Creating demo trade agreement...");
        await contract.createTradeAgreement(
            0, // Exporter ID (first registered exporter)
            1, // Importer ID (second registered importer)
            0, // Shipment ID (first coffee shipment)
            "25000" // Price (in ETT tokens)
        );
        
        console.log("Setup complete! Ethiopian Trade Platform is ready on Orbit Chain.");
        console.log("Summary:");
        console.log("- Chain ID:", deploymentResult.chainId);
        console.log("- RPC URL:", deploymentResult.rpcUrl);
        console.log("- Trade Platform Contract:", contract.address);
        
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
    setupOrbitChain()
        .then(result => {
            console.log("Successfully set up Ethiopian Trade Platform Orbit Chain");
            process.exit(0);
        })
        .catch(error => {
            console.error("Failed to set up Orbit Chain:", error);
            process.exit(1);
        });
} else {
    // Export for use in other modules
    module.exports = { setupOrbitChain };
} 