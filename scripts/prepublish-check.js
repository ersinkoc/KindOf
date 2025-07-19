#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Running pre-publish checks...\n');

let hasErrors = false;

// Check if dist folder exists
if (!fs.existsSync(path.join(__dirname, '../dist'))) {
  console.error('❌ Error: dist folder not found. Run "npm run build" first.');
  hasErrors = true;
}

// Check if all required files exist in dist
const requiredFiles = [
  'dist/index.mjs',
  'dist/index.cjs',
  'dist/index.d.ts',
  'dist/kindof.umd.js',
  'dist/kindof.umd.min.js',
  'dist/guards/index.mjs',
  'dist/guards/index.cjs',
  'dist/guards/index.d.ts',
  'dist/converters/index.mjs',
  'dist/converters/index.cjs',
  'dist/converters/index.d.ts',
  'dist/validators/index.mjs',
  'dist/validators/index.cjs',
  'dist/validators/index.d.ts'
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: Required file missing: ${file}`);
    hasErrors = true;
  } else {
    console.log(`✅ Found: ${file}`);
  }
});

// Check package.json
const packageJson = require('../package.json');

if (!packageJson.name) {
  console.error('❌ Error: package.json missing "name" field');
  hasErrors = true;
}

if (!packageJson.version) {
  console.error('❌ Error: package.json missing "version" field');
  hasErrors = true;
}

if (!packageJson.main || !packageJson.module || !packageJson.types) {
  console.error('❌ Error: package.json missing main/module/types fields');
  hasErrors = true;
}

// Check for dependencies (should be zero)
if (packageJson.dependencies && Object.keys(packageJson.dependencies).length > 0) {
  console.error('❌ Error: Package should have zero dependencies');
  console.error('   Found:', Object.keys(packageJson.dependencies).join(', '));
  hasErrors = true;
} else {
  console.log('✅ Zero dependencies confirmed');
}

// Check README exists
if (!fs.existsSync(path.join(__dirname, '../README.md'))) {
  console.error('❌ Error: README.md not found');
  hasErrors = true;
} else {
  console.log('✅ README.md found');
}

// Check LICENSE exists
if (!fs.existsSync(path.join(__dirname, '../LICENSE'))) {
  console.error('❌ Error: LICENSE not found');
  hasErrors = true;
} else {
  console.log('✅ LICENSE found');
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.error('\n❌ Pre-publish checks FAILED. Fix the errors above before publishing.');
  process.exit(1);
} else {
  console.log('\n✅ All pre-publish checks PASSED!');
  console.log('\n📦 Package is ready to publish:');
  console.log(`   Name: ${packageJson.name}`);
  console.log(`   Version: ${packageJson.version}`);
  console.log(`   License: ${packageJson.license}`);
  console.log('\n🚀 Run "npm publish" to publish to NPM');
}