// Node.js specific example - File Analyzer
// This example demonstrates how to use @oxog/kindof in a Node.js environment
// to analyze file types and content

const fs = require('fs').promises;
const path = require('path');
const { kindOf, isType, getDetailedType, inspect } = require('../../dist/index.cjs');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorize(text, color) {
  return `${colors[color] || ''}${text}${colors.reset}`;
}

async function analyzeFile(filePath) {
  console.log(colorize(`\n=== Analyzing: ${filePath} ===`, 'bright'));
  
  try {
    const stats = await fs.stat(filePath);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    console.log(colorize('File Stats:', 'cyan'));
    console.log(`  Type: ${kindOf(stats)}`);
    console.log(`  Size: ${stats.size} bytes`);
    console.log(`  Created: ${stats.birthtime}`);
    console.log(`  Modified: ${stats.mtime}`);
    console.log(`  Is Directory: ${stats.isDirectory()}`);
    console.log(`  Is File: ${stats.isFile()}`);
    
    // Try to parse content based on extension
    const ext = path.extname(filePath).toLowerCase();
    let parsedContent = null;
    let contentType = 'string';
    
    if (ext === '.json') {
      try {
        parsedContent = JSON.parse(fileContent);
        contentType = kindOf(parsedContent);
        console.log(colorize('\nJSON Content Analysis:', 'cyan'));
        console.log(`  Root Type: ${contentType}`);
        
        if (contentType === 'object' || contentType === 'array') {
          analyzeStructure(parsedContent, '  ');
        }
      } catch (e) {
        console.log(colorize('  Invalid JSON format', 'red'));
      }
    } else {
      console.log(colorize('\nText Content Analysis:', 'cyan'));
      console.log(`  Length: ${fileContent.length} characters`);
      console.log(`  Lines: ${fileContent.split('\n').length}`);
      console.log(`  Type: ${kindOf(fileContent)}`);
    }
    
  } catch (error) {
    console.log(colorize(`Error: ${error.message}`, 'red'));
  }
}

function analyzeStructure(obj, indent = '') {
  const detailed = getDetailedType(obj);
  
  if (detailed.type === 'object') {
    const keys = Object.keys(obj);
    console.log(`${indent}Keys: ${keys.length}`);
    keys.slice(0, 5).forEach(key => {
      const valueType = kindOf(obj[key]);
      console.log(`${indent}  ${key}: ${valueType}`);
    });
    if (keys.length > 5) {
      console.log(`${indent}  ... and ${keys.length - 5} more`);
    }
  } else if (detailed.type === 'array') {
    console.log(`${indent}Length: ${obj.length}`);
    if (obj.length > 0) {
      const types = new Set(obj.slice(0, 10).map(kindOf));
      console.log(`${indent}Types: ${Array.from(types).join(', ')}`);
    }
  }
}

async function analyzeDirectory(dirPath) {
  console.log(colorize(`\n=== Analyzing Directory: ${dirPath} ===`, 'bright'));
  
  try {
    const files = await fs.readdir(dirPath);
    const fileStats = [];
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = await fs.stat(filePath);
      fileStats.push({
        name: file,
        type: stats.isDirectory() ? 'directory' : 'file',
        size: stats.size,
        extension: path.extname(file)
      });
    }
    
    // Group by type
    const byType = {};
    fileStats.forEach(stat => {
      const key = stat.type === 'directory' ? 'directory' : (stat.extension || 'no-extension');
      if (!byType[key]) byType[key] = [];
      byType[key].push(stat);
    });
    
    console.log(colorize('Directory Contents:', 'cyan'));
    console.log(`  Total items: ${files.length}`);
    
    Object.entries(byType).forEach(([type, items]) => {
      console.log(`  ${type}: ${items.length} items`);
    });
    
    // Analyze the collection
    console.log(colorize('\nCollection Analysis:', 'cyan'));
    console.log(`  fileStats type: ${kindOf(fileStats)}`);
    console.log(`  byType type: ${kindOf(byType)}`);
    
    const detailedStats = getDetailedType(fileStats);
    console.log(`  fileStats details: ${inspect(detailedStats, { depth: 1 })}`);
    
  } catch (error) {
    console.log(colorize(`Error: ${error.message}`, 'red'));
  }
}

// Buffer analysis
function analyzeBuffer() {
  console.log(colorize('\n=== Buffer Type Analysis ===', 'bright'));
  
  const buffer = Buffer.from('Hello, World!', 'utf-8');
  const arrayBuffer = new ArrayBuffer(16);
  const uint8Array = new Uint8Array(arrayBuffer);
  const dataView = new DataView(arrayBuffer);
  
  console.log(`Buffer.from('Hello, World!'): ${kindOf(buffer)}`);
  console.log(`new ArrayBuffer(16): ${kindOf(arrayBuffer)}`);
  console.log(`new Uint8Array(arrayBuffer): ${kindOf(uint8Array)}`);
  console.log(`new DataView(arrayBuffer): ${kindOf(dataView)}`);
  
  // Detailed analysis
  const bufferDetails = getDetailedType(buffer);
  console.log(colorize('\nBuffer Details:', 'cyan'));
  console.log(inspect(bufferDetails, { depth: 2, colors: false }));
}

// Stream analysis
function analyzeStreams() {
  console.log(colorize('\n=== Stream Type Analysis ===', 'bright'));
  
  const { Readable, Writable, Transform, Duplex } = require('stream');
  
  const readable = new Readable({ read() {} });
  const writable = new Writable({ write() {} });
  const transform = new Transform({ transform() {} });
  const duplex = new Duplex({ read() {}, write() {} });
  
  console.log(`new Readable(): ${kindOf(readable)}`);
  console.log(`new Writable(): ${kindOf(writable)}`);
  console.log(`new Transform(): ${kindOf(transform)}`);
  console.log(`new Duplex(): ${kindOf(duplex)}`);
  
  // Check if they're all detected as objects with specific properties
  console.log(colorize('\nStream Properties:', 'cyan'));
  console.log(`Readable is object: ${isType(readable, 'object')}`);
  console.log(`Readable has pipe: ${typeof readable.pipe === 'function'}`);
}

// Process and system info analysis
function analyzeNodeEnvironment() {
  console.log(colorize('\n=== Node.js Environment Analysis ===', 'bright'));
  
  console.log(`process: ${kindOf(process)}`);
  console.log(`process.env: ${kindOf(process.env)}`);
  console.log(`process.argv: ${kindOf(process.argv)}`);
  console.log(`process.versions: ${kindOf(process.versions)}`);
  console.log(`require: ${kindOf(require)}`);
  console.log(`module: ${kindOf(module)}`);
  console.log(`exports: ${kindOf(exports)}`);
  console.log(`__dirname: ${kindOf(__dirname)}`);
  console.log(`__filename: ${kindOf(__filename)}`);
  console.log(`global: ${kindOf(global)}`);
  
  // Analyze some process properties
  console.log(colorize('\nProcess Details:', 'cyan'));
  const versionDetails = getDetailedType(process.versions);
  console.log(`process.versions structure: ${inspect(versionDetails, { depth: 1 })}`);
}

// Main execution
async function main() {
  console.log(colorize('@oxog/kindof - Node.js File Analyzer Example', 'bright'));
  console.log(colorize('==========================================\n', 'dim'));
  
  // Analyze the package.json file
  await analyzeFile(path.join(__dirname, '../../package.json'));
  
  // Analyze current directory
  await analyzeDirectory(__dirname);
  
  // Analyze Node.js specific types
  analyzeBuffer();
  analyzeStreams();
  analyzeNodeEnvironment();
  
  console.log(colorize('\n✅ Analysis complete!', 'green'));
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { analyzeFile, analyzeDirectory };