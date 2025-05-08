// Simple script to check a single Rust contract
const fs = require('fs');
const path = require('path');

// Get the contract name from command line
const contractName = process.argv[2];
if (!contractName) {
  console.error('Please provide a contract name, e.g.: node check_contract.js microfinance_dao.rs');
  process.exit(1);
}

// Full path to the contract
const contractPath = path.join(__dirname, contractName);

// Read the contract
try {
  const content = fs.readFileSync(contractPath, 'utf8');
  console.log(`Successfully read contract: ${contractName}`);
  console.log(`File size: ${(content.length / 1024).toFixed(2)} KB`);
  
  // Basic Rust checks
  console.log('\nBasic contract checks:');
  
  const checks = [
    { name: "Public functions", regex: /pub\s+fn/, severity: "Critical" },
    { name: "Struct definitions", regex: /struct\s+\w+/, severity: "Critical" },
    { name: "Stylus imports", regex: /use\s+stylus_sdk/, severity: "Critical" },
    { name: "External attribute", regex: /#\[external\]/, severity: "Important" },
    { name: "Payable attribute", regex: /#\[payable/, severity: "Optional" },
    { name: "No std attribute", regex: /#!\[no_std\]/, severity: "Important" },
    { name: "Implementation blocks", regex: /impl\s+\w+/, severity: "Critical" }
  ];
  
  let passedCritical = true;
  for (const check of checks) {
    const found = check.regex.test(content);
    console.log(`[${found ? 'PASS' : 'FAIL'}] ${check.name} (${check.severity})`);
    
    if (!found && check.severity === 'Critical') {
      passedCritical = false;
    }
  }
  
  // Summary
  console.log('\nSummary:');
  if (passedCritical) {
    console.log('✅ Contract passes all critical checks');
  } else {
    console.log('❌ Contract is missing critical elements');
  }
  
} catch (error) {
  console.error(`Error reading contract: ${error.message}`);
  process.exit(1);
} 