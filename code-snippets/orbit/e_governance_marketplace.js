// Arbitrum Pulse: E-Governance Marketplace
// Purpose: Demonstrates setting up an Orbit Chain for Rwandan e-governance services
// Author: Umojaverse (Griffins Oduol)
// License: MIT

const { ethers } = require('ethers');
const { createRollupChain } = require('@arbitrum/orbit-sdk');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// E-Governance marketplace contract - simple version for demonstration
const MARKETPLACE_CONTRACT = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EGovernanceMarketplace {
    // Service provider structure
    struct ServiceProvider {
        address providerAddress;
        string serviceName;
        string serviceDescription;
        uint256 price;
        bool isActive;
    }
    
    // Service providers mapping by their ID
    mapping(uint256 => ServiceProvider) public serviceProviders;
    uint256 public providerCount;
    
    // Track citizen service purchases
    mapping(address => mapping(uint256 => bool)) public citizenServices;
    
    // Events
    event ServiceProviderRegistered(uint256 indexed providerId, address provider, string serviceName);
    event ServicePurchased(address indexed citizen, uint256 indexed providerId, string serviceName);
    
    // Register a new government service provider
    function registerServiceProvider(
        string memory _serviceName,
        string memory _serviceDescription,
        uint256 _price
    ) external {
        uint256 providerId = providerCount;
        serviceProviders[providerId] = ServiceProvider({
            providerAddress: msg.sender,
            serviceName: _serviceName,
            serviceDescription: _serviceDescription,
            price: _price,
            isActive: true
        });
        
        providerCount++;
        emit ServiceProviderRegistered(providerId, msg.sender, _serviceName);
    }
    
    // Purchase a government service
    function purchaseService(uint256 _providerId) external payable {
        ServiceProvider memory provider = serviceProviders[_providerId];
        require(provider.isActive, "Service not available");
        require(msg.value >= provider.price, "Insufficient payment");
        
        // Record the purchase
        citizenServices[msg.sender][_providerId] = true;
        
        // Transfer payment to service provider
        payable(provider.providerAddress).transfer(msg.value);
        
        emit ServicePurchased(msg.sender, _providerId, provider.serviceName);
    }
    
    // Check if citizen has purchased a service
    function hasService(address _citizen, uint256 _providerId) external view returns (bool) {
        return citizenServices[_citizen][_providerId];
    }
}
`;

// Main function to set up Orbit Chain with e-governance marketplace
async function setupOrbitChain() {
    console.log("Starting Rwandan E-Governance Marketplace Orbit Chain setup...");
    
    // Connect to Arbitrum Sepolia (Layer 2)
    const provider = new ethers.providers.JsonRpcProvider(process.env.ARBITRUM_SEPOLIA_RPC);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log("Connected to Arbitrum Sepolia as:", wallet.address);
    
    // Define Orbit Chain configuration
    const orbitChainConfig = {
        chainName: "RwandaGovChain",
        chainId: 42069, // Example chain ID, should be unique
        parentChainId: 421614, // Arbitrum Sepolia
        maxDataSize: 117964, // Default max data size for batches
        maxGasPerTransaction: 1000000000, // Max gas per transaction
        nativeToken: {
            name: "Rwanda Governance Token",
            symbol: "RGT",
            decimals: 18
        },
        description: "Orbit Chain for Rwanda e-governance services"
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
        
        // Deploy the e-governance marketplace contract
        console.log("Deploying E-Governance Marketplace contract...");
        const contractFactory = new ethers.ContractFactory(
            // ABI is automatically generated from the contract source
            (new ethers.utils.Interface(MARKETPLACE_CONTRACT)).format(ethers.utils.FormatTypes.json),
            ethers.utils.solidityPack(MARKETPLACE_CONTRACT),
            orbitWallet
        );
        
        const contract = await contractFactory.deploy();
        await contract.deployed();
        console.log("E-Governance Marketplace deployed at:", contract.address);
        
        // Register some example government services
        console.log("Registering example government services...");
        await contract.registerServiceProvider(
            "Digital ID Verification",
            "Verify citizenship status and get digital ID",
            ethers.utils.parseEther("0.01")
        );
        
        await contract.registerServiceProvider(
            "Business Registration",
            "Register a new business entity",
            ethers.utils.parseEther("0.05")
        );
        
        await contract.registerServiceProvider(
            "Land Registry Check",
            "Verify land ownership records",
            ethers.utils.parseEther("0.02")
        );
        
        console.log("Setup complete! Rwanda E-Governance Marketplace is ready on Orbit Chain.");
        console.log("Summary:");
        console.log("- Chain ID:", deploymentResult.chainId);
        console.log("- RPC URL:", deploymentResult.rpcUrl);
        console.log("- Marketplace Contract:", contract.address);
        
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
            console.log("Successfully set up Rwandan E-Governance Orbit Chain");
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