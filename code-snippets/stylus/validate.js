// Validation script for all Stylus contracts
const { validateStylusFiles, checkRustContract } = require('./test_utils');

console.log("Validating Arbitrum Pulse Stylus contracts...");

// Run validation on all files
const results = validateStylusFiles();

console.log("\n=== VALIDATION RESULTS ===");
console.log(`${results.valid.length} valid contracts`);
console.log(`${results.issues.length} contracts with issues`);

if (results.issues.length > 0) {
  console.log("\nIssues found:");
  results.issues.forEach(issue => {
    console.log(`- ${issue.file}: ${issue.issue}`);
  });
}

console.log("\n=== DETAILED CONTRACT CHECKS ===");
// Run detailed checks on all valid contracts
for (const file of results.valid) {
  console.log(`\nChecking ${file}:`);
  checkRustContract(file);
}

console.log("\nValidation complete!"); 