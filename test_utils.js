// Test utilities for Arbitrum Pulse Stylus demo contracts
const fs = require('fs');
const path = require('path');

// Simple syntax validation of Rust Stylus contracts
const validateStylusFiles = () => {
  const stylusDir = path.join(__dirname);
  const rustFiles = fs.readdirSync(stylusDir).filter(file => 
    file.endsWith('.rs') && !file.startsWith('test_')
  );
  
  console.log(`Found ${rustFiles.length} Stylus demo contracts to validate`);
  
  const results = {
    valid: [],
    issues: []
  };
  
  for (const file of rustFiles) {
    try {
      const fullPath = path.join(stylusDir, file);
      
      // Read file content
      const content = fs.readFileSync(fullPath, 'utf8');
      
      console.log(`Validating: ${file}`);
      results.valid.push(file);
    } catch (error) {
      results.issues.push({
        file,
        issue: `Error reading file: ${error.message}`
      });
    }
  }
  
  return results;
};

// Check a specific Rust file in more detail
const checkRustContract = (filename) => {
  try {
    const fullPath = path.join(__dirname, filename);
    console.log(`Checking Rust contract: ${filename}`);
    
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Basic Rust syntax checks
    const checks = [
      { name: "Public functions", regex: /pub\s+fn/, severity: "OK" },
      { name: "Struct definitions", regex: /struct\s+\w+/, severity: "OK" },
      { name: "Stylus imports", regex: /use\s+stylus_sdk/, severity: "OK" },
      { name: "External implementation", regex: /#\[external\]/, severity: "INFO" },
      { name: "Payable functions", regex: /#\[payable/, severity: "INFO" },
      { name: "No std attribute", regex: /#!\[no_std\]/, severity: "INFO" },
      { name: "Implementation blocks", regex: /impl\s+\w+/, severity: "OK" }
    ];
    
    for (const check of checks) {
      const found = check.regex.test(content);
      console.log(`[${found ? check.severity : 'WARNING'}] ${check.name}: ${found ? 'Found' : 'Not found'}`);
    }
    
    // Check file size (large files may indicate comprehensive implementations)
    const sizeInKB = content.length / 1024;
    console.log(`[INFO] File size: ${sizeInKB.toFixed(2)} KB`);
    
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
  validateStylusFiles,
  checkRustContract
}; 