// Simple check script for all Orbit chain JavaScript files
const fs = require('fs');
const path = require('path');

// Get all .js files in the current directory, excluding check scripts and utility files
const jsFiles = fs.readdirSync('./').filter(file => 
  file.endsWith('.js') && 
  !file.startsWith('check') && 
  !file.startsWith('test_') &&
  !file.startsWith('validate')
);

console.log(`Found ${jsFiles.length} Orbit chain scripts to check`);

let allPassed = true;

// Check each script
for (const scriptName of jsFiles) {
  console.log(`\n==== Checking ${scriptName} ====`);
  
  try {
    const content = fs.readFileSync(scriptName, 'utf8');
    console.log(`File size: ${(content.length / 1024).toFixed(2)} KB`);
    
    // Basic checks
    console.log('Basic script checks:');
    const checks = [
      { name: "createRollupChain import", pattern: "createRollupChain" },
      { name: "ethers import", pattern: "require('ethers')" },
      { name: "dotenv config", pattern: "dotenv.config()" },
      { name: "Chain ID configuration", pattern: "chainId:" },
      { name: "Contract deployment", pattern: "deploy" },
      { name: "Error handling", pattern: "catch (error)" }
    ];
    
    let scriptPassed = true;
    for (const check of checks) {
      const found = content.includes(check.pattern);
      console.log(`[${found ? 'PASS' : 'FAIL'}] ${check.name}`);
      if (!found) scriptPassed = false;
    }
    
    // Extract chain ID for verification
    const chainIdMatch = content.match(/chainId:\s*(\d+)/);
    if (chainIdMatch) {
      console.log(`Chain ID: ${chainIdMatch[1]}`);
    }
    
    // Script summary
    console.log(`\nScript status: ${scriptPassed ? '✅ PASSED' : '⚠️ ISSUES FOUND'}`);
    
    if (!scriptPassed) {
      allPassed = false;
    }
  } catch (error) {
    console.error(`Error reading script: ${error.message}`);
    allPassed = false;
  }
}

// Overall summary
console.log('\n==== OVERALL VALIDATION SUMMARY ====');
if (allPassed) {
  console.log('✅ All scripts passed validation checks');
} else {
  console.log('⚠️ Some scripts have issues to address');
} 