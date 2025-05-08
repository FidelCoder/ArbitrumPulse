// Simple check script for all Rust contracts
const fs = require('fs');
const path = require('path');

// Get all .rs files in the current directory
const rustFiles = fs.readdirSync('./').filter(file => file.endsWith('.rs'));
console.log(`Found ${rustFiles.length} Rust contracts to check`);

let allPassed = true;

// Check each contract
for (const contractName of rustFiles) {
  console.log(`\n==== Checking ${contractName} ====`);
  
  try {
    const content = fs.readFileSync(contractName, 'utf8');
    console.log(`File size: ${(content.length / 1024).toFixed(2)} KB`);
    
    // Basic Rust checks
    console.log('Basic contract checks:');
    const checks = [
      { name: "Public functions", pattern: "pub fn" },
      { name: "Struct definitions", pattern: "struct " },
      { name: "Stylus imports", pattern: "use stylus_sdk" },
      { name: "External attribute", pattern: "#[external]" },
      { name: "Implementation blocks", pattern: "impl " }
    ];
    
    let contractPassed = true;
    for (const check of checks) {
      const found = content.includes(check.pattern);
      console.log(`[${found ? 'PASS' : 'FAIL'}] ${check.name}`);
      if (!found) contractPassed = false;
    }
    
    // Contract summary
    console.log(`\nContract status: ${contractPassed ? '✅ PASSED' : '⚠️ ISSUES FOUND'}`);
    
    if (!contractPassed) {
      allPassed = false;
    }
  } catch (error) {
    console.error(`Error reading contract: ${error.message}`);
    allPassed = false;
  }
}

// Overall summary
console.log('\n==== OVERALL VALIDATION SUMMARY ====');
if (allPassed) {
  console.log('✅ All contracts passed validation checks');
} else {
  console.log('⚠️ Some contracts have issues to address');
} 