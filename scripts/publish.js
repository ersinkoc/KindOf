#!/usr/bin/env node

/**
 * Publish script for @oxog/kindof
 * 
 * This script ensures all quality checks pass before publishing:
 * - Runs linting
 * - Runs type checking
 * - Runs tests with 100% coverage requirement
 * - Builds the project
 * - Publishes to npm
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(command, description) {
  console.log(`\n🔄 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    console.log(`✅ ${description} completed successfully`);
  } catch (error) {
    console.error(`❌ ${description} failed`);
    process.exit(1);
  }
}

function checkCoverage() {
  console.log('\n🔄 Checking test coverage...');
  
  // Since Jest already validates coverage thresholds during test:coverage,
  // we just need to verify the coverage directory exists
  const coverageDir = path.join(process.cwd(), 'coverage');
  
  if (!fs.existsSync(coverageDir)) {
    console.error('❌ Coverage directory not found. Run tests first.');
    process.exit(1);
  }
  
  // Check if any of the expected coverage files exist
  const coverageFiles = ['coverage-final.json', 'lcov.info', 'clover.xml'];
  const hasAnyFile = coverageFiles.some(file => 
    fs.existsSync(path.join(coverageDir, file))
  );
  
  if (!hasAnyFile) {
    console.error('❌ No coverage files found in coverage directory.');
    process.exit(1);
  }
  
  console.log('✅ Coverage check passed (validated by Jest thresholds)');
}

function checkPackageJson() {
  console.log('\n🔄 Validating package.json...');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Check required fields
  const requiredFields = ['name', 'version', 'description', 'main', 'types', 'repository', 'keywords', 'author', 'license'];
  const missingFields = requiredFields.filter(field => !pkg[field]);
  
  if (missingFields.length > 0) {
    console.error(`❌ Missing required fields in package.json: ${missingFields.join(', ')}`);
    process.exit(1);
  }
  
  // Check repository URL
  if (!pkg.repository.url.includes('github.com/ersinkoc/kindof')) {
    console.error('❌ Repository URL should point to github.com/ersinkoc/kindof');
    process.exit(1);
  }
  
  console.log('✅ Package.json validation passed');
}

function checkFiles() {
  console.log('\n🔄 Checking required files...');
  
  const requiredFiles = [
    'README.md',
    'LICENSE',
    'CHANGELOG.md',
    'src/index.ts',
    'tsconfig.json'
  ];
  
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(process.cwd(), file)));
  
  if (missingFiles.length > 0) {
    console.error(`❌ Missing required files: ${missingFiles.join(', ')}`);
    process.exit(1);
  }
  
  console.log('✅ All required files present');
}

async function main() {
  console.log('🚀 Starting publish process for @oxog/kindof...\n');
  
  // Pre-publish checks
  checkFiles();
  checkPackageJson();
  
  // Clean previous builds
  run('npm run clean', 'Cleaning previous builds');
  
  // Run quality checks
  run('npm run lint', 'Running ESLint');
  run('npm run typecheck', 'Running TypeScript compiler');
  
  // Run tests with coverage
  run('npm run test:coverage', 'Running tests with coverage');
  checkCoverage();
  
  // Build the project
  run('npm run build', 'Building project');
  
  // Verify build outputs
  console.log('\n🔄 Verifying build outputs...');
  const distFiles = ['dist/index.cjs', 'dist/index.mjs', 'dist/index.d.ts'];
  const missingDist = distFiles.filter(file => !fs.existsSync(path.join(process.cwd(), file)));
  
  if (missingDist.length > 0) {
    console.error(`❌ Missing build outputs: ${missingDist.join(', ')}`);
    process.exit(1);
  }
  console.log('✅ Build outputs verified');
  
  // Final confirmation
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`\n📦 Ready to publish ${pkg.name}@${pkg.version}`);
  console.log(`📍 Repository: ${pkg.repository.url}`);
  console.log(`👤 Author: ${pkg.author}`);
  
  // Check if we're in dry-run mode
  if (process.argv.includes('--dry-run')) {
    console.log('\n🏃 Dry run mode - skipping actual publish');
    console.log('✅ All checks passed! Ready for publishing.');
    return;
  }
  
  // Publish to npm
  console.log('\n🔄 Publishing to npm...');
  
  try {
    // Check if user is logged in to npm
    execSync('npm whoami', { stdio: 'pipe' });
    
    // Publish
    execSync('npm publish --access public', { stdio: 'inherit' });
    
    console.log('\n🎉 Successfully published to npm!');
    console.log(`📦 Package: https://www.npmjs.com/package/${pkg.name}`);
    console.log(`📚 Repository: ${pkg.repository.url}`);
    
  } catch (error) {
    if (error.message.includes('ENEEDAUTH')) {
      console.error('\n❌ Not logged in to npm. Run "npm login" first.');
    } else {
      console.error('\n❌ Publish failed:', error.message);
    }
    process.exit(1);
  }
}

// Handle script arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node scripts/publish.js [options]

Options:
  --dry-run    Run all checks but don't actually publish
  --help, -h   Show this help message

This script will:
1. Validate package.json and required files
2. Clean previous builds
3. Run linting and type checking
4. Run tests with coverage requirements
5. Build the project
6. Publish to npm (unless --dry-run)
`);
  process.exit(0);
}

main().catch(error => {
  console.error('\n💥 Unexpected error:', error);
  process.exit(1);
});