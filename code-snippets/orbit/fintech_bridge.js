// Arbitrum Pulse: Fintech Bridge
// Purpose: Layer 3 chain for Kenyan low-cost remittance transactions
// Author: Umojaverse (Griffins Oduol)
// License: MIT

const { ethers } = require('ethers');
const { createRollupChain } = require('@arbitrum/orbit-sdk');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Main function to set up Orbit Chain with M-Pesa bridge
async function setupOrbitChain() {
    console.log("Starting Kenyan Fintech Bridge Orbit Chain setup...");
    
    // Connect to Arbitrum Sepolia (Layer 2)
    const provider = new ethers.providers.JsonRpcProvider(process.env.ARBITRUM_SEPOLIA_RPC);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log("Connected to Arbitrum Sepolia as:", wallet.address);
    
    // Define Orbit Chain configuration for Kenyan Fintech Bridge
    const orbitChainConfig = {
        chainName: "KenyaFintechChain",
        chainId: 42070, // Example chain ID, should be unique
        parentChainId: 421614, // Arbitrum Sepolia
        maxDataSize: 117964, // Default max data size for batches
        maxGasPerTransaction: 1000000000, // Max gas per transaction
        nativeToken: {
            name: "Kenya Fintech Token",
            symbol: "KFT",
            decimals: 18
        },
        description: "Orbit Chain for Kenyan fintech and M-Pesa integration"
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
        
        // Deploy the bridge contract
        console.log("Deploying M-Pesa Bridge contract...");
        
        // Contract ABI and bytecode would normally be imported from compiled artifacts
        // For demonstration, we'll represent a simplified deployment process
        const mpesaBridgeContract = {
            deploy: async function() {
                console.log("Simulating M-Pesa Bridge contract deployment...");
                // In a real deployment, you would use the actual contract ABI and bytecode
                return {
                    address: "0x" + "1".repeat(40), // Simulated contract address
                    registerProvider: async function(providerAddress) {
                        console.log("Registering provider:", providerAddress);
                        return { wait: async () => true };
                    },
                    createTransaction: async function(providerId, phoneHash, reference, options) {
                        console.log("Creating transaction to provider:", providerId);
                        return { wait: async () => true };
                    }
                };
            }
        };
        
        const contract = await mpesaBridgeContract.deploy();
        console.log("M-Pesa Bridge deployed at:", contract.address);
        
        // Register demo M-Pesa providers
        console.log("Registering demo M-Pesa providers...");
        
        // Using random addresses for demo providers
        const demoProviders = [
            "0x" + "2".repeat(40), // Simulated Safaricom M-Pesa address
            "0x" + "3".repeat(40)  // Simulated Airtel Money address
        ];
        
        for (let i = 0; i < demoProviders.length; i++) {
            await contract.registerProvider(demoProviders[i]);
            console.log(`Registered provider ${i}: ${demoProviders[i]}`);
        }
        
        // Simulate transactions for testing
        console.log("Creating demo transactions...");
        
        // Create a demo transaction to M-Pesa
        const phoneHash = "0x" + "4".repeat(64); // Simulated phone number hash
        await contract.createTransaction(
            0, // Provider ID for the first provider
            phoneHash,
            "DEMO_PAYMENT",
            { value: "10000000000000000" } // 0.01 ETH
        );
        
        console.log("Demo transaction created!");
        
        console.log("Setup complete! Kenya Fintech Bridge is ready on Orbit Chain.");
        console.log("Summary:");
        console.log("- Chain ID:", deploymentResult.chainId);
        console.log("- RPC URL:", deploymentResult.rpcUrl);
        console.log("- M-Pesa Bridge Contract:", contract.address);
        
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
            console.log("Successfully set up Kenyan Fintech Bridge Orbit Chain");
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