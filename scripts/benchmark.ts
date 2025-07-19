import { performance } from 'perf_hooks';
import { writeFileSync } from 'fs';
import { kindOf, fastKindOf } from '../src';

// Test data
const testData = [
  // Primitives
  undefined,
  null,
  true,
  false,
  42,
  3.14,
  'hello',
  '',
  Symbol('test'),
  123n,
  
  // Objects
  {},
  { a: 1, b: 2 },
  Object.create(null),
  
  // Arrays
  [],
  [1, 2, 3],
  new Array(100).fill(0),
  
  // Functions
  () => {},
  function() {},
  async function() {},
  function*() {},
  
  // Built-ins
  new Date(),
  /test/gi,
  new Error('test'),
  
  // Collections
  new Map(),
  new Set(),
  new WeakMap(),
  new WeakSet(),
  
  // Typed arrays
  new Int8Array(10),
  new Uint8Array(10),
  new Float32Array(10),
  new Float64Array(10),
  
  // Buffers
  new ArrayBuffer(16),
  new DataView(new ArrayBuffer(16)),
  
  // Promises
  Promise.resolve(42),
  
  // Special
  (function() { return arguments; })(1, 2, 3),
];

interface BenchmarkResult {
  name: string;
  opsPerSecond: number;
  avgTime: number;
  iterations: number;
}

function benchmark(name: string, fn: () => void, iterations = 100000): BenchmarkResult {
  // Warm up
  for (let i = 0; i < 1000; i++) {
    fn();
  }
  
  const start = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  
  const end = performance.now();
  const totalTime = end - start;
  const avgTime = totalTime / iterations;
  const opsPerSecond = Math.round(1000 / avgTime);
  
  return {
    name,
    opsPerSecond,
    avgTime,
    iterations
  };
}

function runBenchmarks(): void {
  console.log('🚀 Running benchmarks...\n');
  
  const results: BenchmarkResult[] = [];
  
  // Test kindOf vs fastKindOf
  let testIndex = 0;
  
  const kindOfResult = benchmark('kindOf', () => {
    kindOf(testData[testIndex++ % testData.length]);
  });
  
  testIndex = 0;
  
  const fastKindOfResult = benchmark('fastKindOf', () => {
    fastKindOf(testData[testIndex++ % testData.length]);
  });
  
  results.push(kindOfResult, fastKindOfResult);
  
  // Test individual type checks
  const primitiveTests = [
    ['undefined', undefined],
    ['null', null],
    ['boolean', true],
    ['number', 42],
    ['string', 'hello'],
    ['symbol', Symbol('test')],
    ['bigint', 123n],
  ] as const;
  
  const objectTests = [
    ['object', {}],
    ['array', [1, 2, 3]],
    ['function', () => {}],
    ['date', new Date()],
    ['regexp', /test/],
    ['error', new Error()],
    ['map', new Map()],
    ['set', new Set()],
    ['promise', Promise.resolve()],
    ['int32array', new Int32Array(10)],
  ] as const;
  
  console.log('📊 Primitive type detection:');
  primitiveTests.forEach(([typeName, value]) => {
    const result = benchmark(`${typeName} detection`, () => {
      kindOf(value);
    });
    results.push(result);
    console.log(`  ${typeName}: ${result.opsPerSecond.toLocaleString()} ops/sec`);
  });
  
  console.log('\n📊 Object type detection:');
  objectTests.forEach(([typeName, value]) => {
    const result = benchmark(`${typeName} detection`, () => {
      kindOf(value);
    });
    results.push(result);
    console.log(`  ${typeName}: ${result.opsPerSecond.toLocaleString()} ops/sec`);
  });
  
  // Performance comparison
  console.log('\n📈 Performance comparison:');
  console.log(`kindOf: ${kindOfResult.opsPerSecond.toLocaleString()} ops/sec`);
  console.log(`fastKindOf: ${fastKindOfResult.opsPerSecond.toLocaleString()} ops/sec`);
  console.log(`Speedup: ${(fastKindOfResult.opsPerSecond / kindOfResult.opsPerSecond).toFixed(2)}x`);
  
  // Memory usage test
  console.log('\n💾 Memory usage test:');
  const memBefore = process.memoryUsage().heapUsed;
  
  // Create many objects and test them
  const objects = Array(10000).fill(0).map((_, i) => ({
    id: i,
    data: `item-${i}`,
    timestamp: Date.now()
  }));
  
  objects.forEach(obj => kindOf(obj));
  
  const memAfter = process.memoryUsage().heapUsed;
  const memDiff = memAfter - memBefore;
  console.log(`Memory used: ${(memDiff / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Memory per operation: ${(memDiff / objects.length).toFixed(2)} bytes`);
  
  // Generate summary
  const summary = generateSummary(results);
  console.log('\n📋 Summary:');
  console.log(summary);
  
  // Save results for CI
  const benchmarkData = {
    timestamp: new Date().toISOString(),
    summary,
    details: results,
    comparison: {
      kindOf: kindOfResult.opsPerSecond,
      fastKindOf: fastKindOfResult.opsPerSecond,
      speedup: fastKindOfResult.opsPerSecond / kindOfResult.opsPerSecond
    }
  };
  
  writeFileSync('benchmark-results.json', JSON.stringify(benchmarkData, null, 2));
}

function generateSummary(results: BenchmarkResult[]): string {
  const total = results.reduce((sum, r) => sum + r.opsPerSecond, 0);
  const average = total / results.length;
  const fastest = results.reduce((max, r) => r.opsPerSecond > max.opsPerSecond ? r : max);
  const slowest = results.reduce((min, r) => r.opsPerSecond < min.opsPerSecond ? r : min);
  
  return `
Average performance: ${average.toLocaleString()} ops/sec
Fastest: ${fastest.name} (${fastest.opsPerSecond.toLocaleString()} ops/sec)
Slowest: ${slowest.name} (${slowest.opsPerSecond.toLocaleString()} ops/sec)
Range: ${(fastest.opsPerSecond / slowest.opsPerSecond).toFixed(2)}x difference
`.trim();
}

// Run if called directly
if (require.main === module) {
  runBenchmarks();
}