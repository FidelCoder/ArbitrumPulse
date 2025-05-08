// Arbitrum Pulse: Microfinance Hub
// Purpose: Layer 3 chain for Ugandan community-based microfinance solutions
// Author: Umojaverse (Griffins Oduol)
// License: MIT

const { ethers } = require('ethers');
const { createRollupChain } = require('@arbitrum/orbit-sdk');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Main function to set up Orbit Chain for microfinance hub
async function setupMicrofinanceChain() {
    console.log("Starting Ugandan Microfinance Hub Orbit Chain setup...");
    
    // Connect to Arbitrum Sepolia (Layer 2)
    const provider = new ethers.providers.JsonRpcProvider(process.env.ARBITRUM_SEPOLIA_RPC);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log("Connected to Arbitrum Sepolia as:", wallet.address);
    
    // Define Orbit Chain configuration for Microfinance Hub
    const orbitChainConfig = {
        chainName: "UgandaMicrofinanceChain",
        chainId: 42090, // Example chain ID, should be unique
        parentChainId: 421614, // Arbitrum Sepolia
        maxDataSize: 117964, // Default max data size for batches
        maxGasPerTransaction: 1000000000, // Max gas per transaction
        nativeToken: {
            name: "Microfinance Token",
            symbol: "MICRO",
            decimals: 18
        },
        description: "Orbit Chain for Ugandan community-based microfinance solutions"
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
        
        // Deploy the microfinance hub contract
        console.log("Deploying Microfinance Hub contract...");
        
        // Contract ABI and bytecode would normally be imported from compiled artifacts
        // For demonstration, we'll represent a simplified deployment process
        const microfinanceContract = {
            deploy: async function() {
                console.log("Simulating Microfinance Hub contract deployment...");
                // In a real deployment, you would use the actual contract ABI and bytecode
                return {
                    address: "0x" + "a".repeat(40), // Simulated contract address
                    createSavingsGroup: async function(name, location, targetAmount, duration) {
                        console.log(`Creating savings group: ${name} in ${location}`);
                        return { 
                            wait: async () => ({ groupId: "GROUP" + Date.now() }) 
                        };
                    },
                    joinGroup: async function(groupId, memberAddress, memberName) {
                        console.log(`Adding member ${memberName} to group ${groupId}`);
                        return { wait: async () => true };
                    },
                    makeContribution: async function(groupId, memberAddress, amount) {
                        console.log(`Processing contribution of ${amount} to group ${groupId}`);
                        return { wait: async () => true };
                    },
                    requestLoan: async function(groupId, memberAddress, amount, purpose) {
                        console.log(`Processing loan request of ${amount} for ${purpose}`);
                        return { 
                            wait: async () => ({ loanId: "LOAN" + Date.now() }) 
                        };
                    },
                    approveLoan: async function(loanId, approverAddress) {
                        console.log(`Approving loan ${loanId}`);
                        return { wait: async () => true };
                    }
                };
            }
        };
        
        const contract = await microfinanceContract.deploy();
        console.log("Microfinance Hub contract deployed at:", contract.address);
        
        // Create demo savings group
        console.log("Creating demo savings group...");
        
        const groupResult = await contract.createSavingsGroup(
            "Kampala Women Entrepreneurs",
            "Kampala, Uganda",
            ethers.utils.parseEther("5.0"), // 5 ETH target
            180 * 24 * 60 * 60 // 180 days duration
        );
        
        const groupReceipt = await groupResult.wait();
        const groupId = groupReceipt.groupId;
        console.log("Demo savings group created with ID:", groupId);
        
        // Add members to the group
        console.log("Adding members to savings group...");
        
        const demoMembers = [
            {
                address: "0x" + "b".repeat(40),
                name: "Grace Nakato"
            },
            {
                address: "0x" + "c".repeat(40),
                name: "Sarah Okello"
            },
            {
                address: "0x" + "d".repeat(40),
                name: "Florence Mugisha"
            },
            {
                address: "0x" + "e".repeat(40),
                name: "Lydia Nantongo"
            },
            {
                address: "0x" + "f".repeat(40),
                name: "Esther Byamukama"
            }
        ];
        
        for (const member of demoMembers) {
            await contract.joinGroup(groupId, member.address, member.name);
            console.log(`Added member to group: ${member.name}`);
        }
        
        // Simulate contributions
        console.log("Processing member contributions...");
        
        for (const member of demoMembers) {
            const contributionAmount = ethers.utils.parseEther((0.1 + Math.random() * 0.2).toFixed(2));
            await contract.makeContribution(
                groupId, 
                member.address, 
                contributionAmount
            );
            console.log(`${member.name} contributed ${ethers.utils.formatEther(contributionAmount)} ETH`);
        }
        
        // Process loan request
        console.log("Processing loan request...");
        
        const loanResult = await contract.requestLoan(
            groupId,
            demoMembers[0].address,
            ethers.utils.parseEther("0.5"),
            "Expand textile business at Owino Market"
        );
        
        const loanReceipt = await loanResult.wait();
        const loanId = loanReceipt.loanId;
        console.log("Loan request created with ID:", loanId);
        
        // Approve loan
        console.log("Approving loan request...");
        
        for (let i = 1; i < 4; i++) { // 3 members approve
            await contract.approveLoan(loanId, demoMembers[i].address);
            console.log(`Loan approved by ${demoMembers[i].name}`);
        }
        
        console.log("Setup complete! Uganda Microfinance Hub is ready on Orbit Chain.");
        console.log("Summary:");
        console.log("- Chain ID:", deploymentResult.chainId);
        console.log("- RPC URL:", deploymentResult.rpcUrl);
        console.log("- Microfinance Contract:", contract.address);
        
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
    setupMicrofinanceChain()
        .then(result => {
            console.log("Successfully set up Ugandan Microfinance Hub Orbit Chain");
            process.exit(0);
        })
        .catch(error => {
            console.error("Failed to set up Orbit Chain:", error);
            process.exit(1);
        });
} else {
    // Export for use in other modules
    module.exports = { setupMicrofinanceChain };
} 