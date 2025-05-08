// Validation script for all Orbit Chain demos
const { validateOrbitFiles, quickCheck } = require('./test_utils');

console.log("Validating Arbitrum Pulse Orbit Chain demos...");

// Run validation on all files
const results = validateOrbitFiles();

console.log("\n=== VALIDATION RESULTS ===");
console.log(`${results.valid.length} valid files`);
console.log(`${results.issues.length} files with issues`);

if (results.issues.length > 0) {
  console.log("\nIssues found:");
  results.issues.forEach(issue => {
    console.log(`- ${issue.file}: ${issue.issue}`);
  });
}

console.log("\n=== DETAILED FILE CHECKS ===");
// Run quick checks on all valid files
for (const file of results.valid) {
  console.log(`\nChecking ${file}:`);
  quickCheck(file);
}

console.log("\nValidation complete!"); 