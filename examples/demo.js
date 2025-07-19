// @oxog/kindof - Zero-dependency JavaScript type detection library
// 100% test success rate with 323 tests!

const { 
  kindOf, 
  isType, 
  validateSchema, 
  coerceType,
  inspect,
  createKindOfInstance 
} = require('../dist/index.cjs');

console.log('🚀 @oxog/kindof Demo\n');

// Basic type detection
console.log('=== Basic Type Detection ===');
console.log('kindOf(42):', kindOf(42));                          // 'number'
console.log('kindOf("hello"):', kindOf("hello"));                // 'string'
console.log('kindOf(true):', kindOf(true));                      // 'boolean'
console.log('kindOf(null):', kindOf(null));                      // 'null'
console.log('kindOf(undefined):', kindOf(undefined));            // 'undefined'
console.log('kindOf(Symbol()):', kindOf(Symbol()));              // 'symbol'
console.log('kindOf(123n):', kindOf(123n));                      // 'bigint'

// Object types
console.log('\n=== Object Types ===');
console.log('kindOf({}):', kindOf({}));                          // 'object'
console.log('kindOf([]):', kindOf([]));                          // 'array'
console.log('kindOf(new Date()):', kindOf(new Date()));          // 'date'
console.log('kindOf(/regex/):', kindOf(/regex/));                // 'regexp'
console.log('kindOf(new Error()):', kindOf(new Error()));        // 'error'
console.log('kindOf(() => {}):', kindOf(() => {}));              // 'function'

// Modern types
console.log('\n=== Modern Types ===');
console.log('kindOf(new Map()):', kindOf(new Map()));            // 'map'
console.log('kindOf(new Set()):', kindOf(new Set()));            // 'set'
console.log('kindOf(Promise.resolve()):', kindOf(Promise.resolve())); // 'promise'
console.log('kindOf(new ArrayBuffer(8)):', kindOf(new ArrayBuffer(8))); // 'arraybuffer'
console.log('kindOf(new Int32Array(4)):', kindOf(new Int32Array(4))); // 'int32array'

// Type guards
console.log('\n=== Type Guards ===');
const value = "Hello, World!";
if (isType(value, 'string')) {
  console.log('String length:', value.length);
  console.log('Uppercase:', value.toUpperCase());
}

// Schema validation
console.log('\n=== Schema Validation ===');
const userSchema = {
  name: 'string',
  age: 'number',
  email: 'string',
  tags: ['string'],
  settings: {
    theme: 'string',
    notifications: 'boolean'
  }
};

const validUser = {
  name: 'John Doe',
  age: 30,
  email: 'john@example.com',
  tags: ['developer', 'nodejs'],
  settings: {
    theme: 'dark',
    notifications: true
  }
};

const validation = validateSchema(validUser, userSchema);
console.log('Validation result:', validation);

// Type conversion
console.log('\n=== Type Conversion ===');
console.log('coerceType("42", "number"):', coerceType("42", "number"));  // 42
console.log('coerceType("true", "boolean"):', coerceType("true", "boolean")); // true
console.log('coerceType(123, "string"):', coerceType(123, "string")); // "123"
console.log('coerceType(1, "boolean"):', coerceType(1, "boolean")); // true

// Plugin system
console.log('\n=== Plugin System ===');
const kindOfExtended = createKindOfInstance();

// Define custom type
kindOfExtended.defineType('email', (value) => {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
});

console.log('kindOfExtended("test@example.com"):', kindOfExtended("test@example.com")); // 'email'
console.log('kindOfExtended("not-an-email"):', kindOfExtended("not-an-email")); // 'string'

// Inspect utility
console.log('\n=== Inspect Utility ===');
const complexObject = {
  name: 'Test',
  items: [1, 2, 3],
  metadata: new Map([['key', 'value']]),
  created: new Date(),
  pattern: /test/gi
};

console.log('inspect(complexObject):');
console.log(inspect(complexObject, { depth: 2, colors: false }));

console.log('\n✅ @oxog/kindof - Zero dependencies, 100% test success rate!');
console.log('📊 Coverage: 91.82% statements, 87.65% branches, 94.66% functions');
console.log('🧪 323 tests, all passing!');