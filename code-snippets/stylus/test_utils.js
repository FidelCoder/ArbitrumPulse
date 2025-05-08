// Test utilities for Arbitrum Pulse Stylus demo contracts
const fs = require('fs');
const path = require('path');

// Simple validation of Rust Stylus contracts
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
      console.log(`Validating: ${file}`);
      
      // Read file content
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Check for required Stylus elements
      if (!content.includes('use stylus_sdk')) {
        results.issues.push({
          file,
          issue: 'Missing stylus_sdk import'
        });
        continue;
      }
      
      // Check for contract structure
      if (!content.includes('pub struct')) {
        results.issues.push({
          file,
          issue: 'Missing contract struct definition'
        });
        continue;
      }
      
      // Check for trait implementation
      if (!content.includes('impl')) {
        results.issues.push({
          file,
          issue: 'Missing trait implementation'
        });
        continue;
      }
      
      results.valid.push(file);
    } catch (error) {
      results.issues.push({
        file,
        issue: `Error: ${error.message}`
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
    
    // Check for storage declarations
    const hasStorage = content.includes('pub struct Storage');
    console.log(`[${hasStorage ? 'OK' : 'WARNING'}] Storage struct ${hasStorage ? 'found' : 'missing'}`);
    
    // Check for external calls
    const hasExternalCalls = content.includes('call');
    console.log(`[INFO] External calls: ${hasExternalCalls ? 'Present' : 'Not found'}`);
    
    // Check for events
    const hasEvents = content.includes('emit');
    console.log(`[INFO] Events: ${hasEvents ? 'Present' : 'Not found'}`);
    
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