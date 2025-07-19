// Basic usage examples for @oxog/kindof

const { kindOf, fastKindOf, kindOfMany, getDetailedType } = require('../../dist/index.cjs');

console.log('=== Basic Type Detection ===');

// Primitives
console.log('kindOf(undefined):', kindOf(undefined));           // 'undefined'
console.log('kindOf(null):', kindOf(null));                     // 'null'
console.log('kindOf(true):', kindOf(true));                     // 'boolean'
console.log('kindOf(42):', kindOf(42));                         // 'number'
console.log('kindOf("hello"):', kindOf('hello'));               // 'string'
console.log('kindOf(Symbol()):', kindOf(Symbol()));             // 'symbol'
console.log('kindOf(123n):', kindOf(123n));                     // 'bigint'

// Objects
console.log('kindOf({}):', kindOf({}));                         // 'object'
console.log('kindOf([]):', kindOf([]));                         // 'array'
console.log('kindOf(() => {}):', kindOf(() => {}));             // 'function'
console.log('kindOf(new Date()):', kindOf(new Date()));         // 'date'
console.log('kindOf(/test/):', kindOf(/test/));                 // 'regexp'
console.log('kindOf(new Error()):', kindOf(new Error()));       // 'error'

// Collections
console.log('kindOf(new Map()):', kindOf(new Map()));           // 'map'
console.log('kindOf(new Set()):', kindOf(new Set()));           // 'set'
console.log('kindOf(new WeakMap()):', kindOf(new WeakMap()));   // 'weakmap'
console.log('kindOf(new WeakSet()):', kindOf(new WeakSet()));   // 'weakset'

// Modern types
console.log('kindOf(Promise.resolve()):', kindOf(Promise.resolve()));  // 'promise'
console.log('kindOf(async () => {}):', kindOf(async () => {}));        // 'asyncfunction'
console.log('kindOf(function*() {}):', kindOf(function*() {}));        // 'generatorfunction'

// Typed arrays
console.log('kindOf(new Int32Array()):', kindOf(new Int32Array()));    // 'int32array'
console.log('kindOf(new Float64Array()):', kindOf(new Float64Array()));// 'float64array'

console.log('\n=== Fast Type Detection ===');

// Fast mode for performance-critical code
console.log('fastKindOf(42):', fastKindOf(42));                 // 'number'
console.log('fastKindOf("hello"):', fastKindOf('hello'));       // 'string'
console.log('fastKindOf([]):', fastKindOf([]));                 // 'array'
console.log('fastKindOf({}):', fastKindOf({}));                 // 'object'

console.log('\n=== Batch Processing ===');

// Process multiple values at once
const values = [42, 'hello', [], {}, null, undefined, true];
const types = kindOfMany(values);
console.log('kindOfMany(values):', types);
// ['number', 'string', 'array', 'object', 'null', 'undefined', 'boolean']

console.log('\n=== Detailed Type Information ===');

// Get comprehensive type information
const arrayDetails = getDetailedType([1, 2, 3]);
console.log('getDetailedType([1, 2, 3]):');
console.log(JSON.stringify(arrayDetails, null, 2));

const objectDetails = getDetailedType({ name: 'John', age: 30 });
console.log('\ngetDetailedType({ name: "John", age: 30 }):');
console.log(JSON.stringify(objectDetails, null, 2));

console.log('\n=== Custom Objects ===');

// Custom constructor
class MyClass {
  constructor(name) {
    this.name = name;
  }
}

const instance = new MyClass('test');
console.log('kindOf(new MyClass()):', kindOf(instance));        // 'object'
console.log('getDetailedType(new MyClass()):');
console.log(JSON.stringify(getDetailedType(instance), null, 2));

// Object with custom Symbol.toStringTag
const customObj = {
  [Symbol.toStringTag]: 'CustomType',
  value: 42
};
console.log('\nkindOf(customObj):', kindOf(customObj));         // 'object'
console.log('getDetailedType(customObj):');
console.log(JSON.stringify(getDetailedType(customObj), null, 2));