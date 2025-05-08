// Test utilities for Arbitrum Pulse Orbit Chain demos
const { ethers } = require('ethers');

// Mock implementation of createRollupChain for testing
const mockCreateRollupChain = async (wallet, config) => {
  console.log(`[MOCK] Creating Orbit Chain: ${config.chainName}`);
  
  // Return mock deployment data
  return {
    chainId: config.chainId,
    rpcUrl: `https://mock-rpc-${config.chainId}.arbitrum.io/rpc`,
    explorerUrl: `https://mock-explorer-${config.chainId}.arbitrum.io`,
  };
};

// Mock provider for testing
class MockProvider {
  constructor(url) {
    this.url = url;
    console.log(`[MOCK] Connected to: ${url}`);
  }
  
  // Add minimal required functionality
  getSigner() {
    return { address: '0xMockAddress' };
  }
}

// Check all JavaScript files for common issues
const validateOrbitFiles = () => {
  const fs = require('fs');
  const path = require('path');
  
  const orbitDir = path.join(__dirname);
  const jsFiles = fs.readdirSync(orbitDir).filter(file => 
    file.endsWith('.js') && file !== 'test_utils.js'
  );
  
  console.log(`Found ${jsFiles.length} Orbit Chain demo files to validate`);
  
  const results = {
    valid: [],
    issues: []
  };
  
  for (const file of jsFiles) {
    try {
      // Simple validation - just check that the file can be required
      const fullPath = path.join(orbitDir, file);
      console.log(`Validating: ${file}`);
      
      // Basic syntax check
      const content = fs.readFileSync(fullPath, 'utf8');
      new Function(content);
      
      // Check for required imports
      if (!content.includes('createRollupChain')) {
        results.issues.push({
          file,
          issue: 'Missing createRollupChain import'
        });
        continue;
      }
      
      if (!content.includes('ethers')) {
        results.issues.push({
          file,
          issue: 'Missing ethers import'
        });
        continue;
      }
      
      results.valid.push(file);
    } catch (error) {
      results.issues.push({
        file,
        issue: `Syntax error: ${error.message}`
      });
    }
  }
  
  return results;
};

// Run a quick check on a specific file
const quickCheck = (filename) => {
  const fs = require('fs');
  const path = require('path');
  
  try {
    const fullPath = path.join(__dirname, filename);
    console.log(`Quick checking: ${filename}`);
    
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Extract and validate Chain ID
    const chainIdMatch = content.match(/chainId:\s*(\d+)/);
    if (chainIdMatch) {
      console.log(`[OK] Chain ID found: ${chainIdMatch[1]}`);
    } else {
      console.log(`[WARNING] Chain ID not found or in unexpected format`);
    }
    
    // Check for contract deployment
    if (content.includes('deploy()')) {
      console.log(`[OK] Contract deployment found`);
    } else {
      console.log(`[WARNING] Contract deployment might be missing or in unexpected format`);
    }
    
    // Check for dotenv configuration
    if (content.includes('dotenv.config()')) {
      console.log(`[OK] Environment loading found`);
    } else {
      console.log(`[WARNING] dotenv configuration might be missing`);
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error checking ${filename}:`, error.message);
    return { 
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  mockCreateRollupChain,
  MockProvider,
  validateOrbitFiles,
  quickCheck
}; 