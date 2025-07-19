// TypeScript usage examples for @oxog/kindof

import { 
  kindOf, 
  isString, 
  isNumber, 
  isArray, 
  isPromise,
  isType,
  assertType,
  ensureType,
  validateSchema,
  coerceType
} from '../../src';

console.log('=== TypeScript Type Inference ===');

// Basic type detection with inference
function processValue(value: unknown): void {
  const type = kindOf(value);
  
  if (type === 'string') {
    // TypeScript knows value is string here
    console.log('String value:', value.toUpperCase());
  } else if (type === 'number') {
    // TypeScript knows value is number here
    console.log('Number value:', value.toFixed(2));
  } else if (type === 'array') {
    // TypeScript knows value is array here
    console.log('Array length:', value.length);
  }
}

processValue('hello');
processValue(42);
processValue([1, 2, 3]);

console.log('\n=== Type Guards ===');

// Type guards with TypeScript inference
function handleData(data: unknown): void {
  if (isString(data)) {
    // TypeScript knows data is string
    console.log('Processing string:', data.charAt(0));
  }
  
  if (isNumber(data)) {
    // TypeScript knows data is number
    console.log('Processing number:', data * 2);
  }
  
  if (isArray(data)) {
    // TypeScript knows data is array
    data.forEach((item, index) => {
      console.log(`Item ${index}:`, item);
    });
  }
  
  if (isPromise(data)) {
    // TypeScript knows data is Promise
    data.then(result => {
      console.log('Promise resolved:', result);
    });
  }
}

handleData('test');
handleData(42);
handleData([1, 2, 3]);
handleData(Promise.resolve('async result'));

console.log('\n=== Generic Type Checking ===');

// Generic type checking
function checkType<T>(value: unknown, expectedType: string): void {
  if (isType(value, expectedType as any)) {
    console.log(`Value is ${expectedType}:`, value);
  } else {
    console.log(`Value is not ${expectedType}, got:`, kindOf(value));
  }
}

checkType('hello', 'string');
checkType(42, 'string');
checkType([], 'array');
checkType({}, 'array');

console.log('\n=== Type Assertions ===');

// Type assertions
function processString(value: unknown): void {
  try {
    assertType(value, 'string');
    // TypeScript knows value is string here
    console.log('String processed:', value.toUpperCase());
  } catch (error) {
    console.log('Assertion failed:', error.message);
  }
}

processString('hello');
processString(42);

console.log('\n=== Type Ensuring ===');

// Type ensuring with defaults
function processWithDefaults(data: unknown): void {
  const str = ensureType(data, 'string', 'default');
  const num = ensureType(data, 'number', 0);
  const arr = ensureType(data, 'array', []);
  
  console.log('String:', str);
  console.log('Number:', num);
  console.log('Array:', arr);
}

processWithDefaults('hello');
processWithDefaults(42);
processWithDefaults([1, 2, 3]);

console.log('\n=== Schema Validation ===');

// Schema validation
interface User {
  name: string;
  age: number;
  email?: string;
  tags: string[];
}

const userSchema = {
  name: 'string',
  age: 'number',
  email: 'string',
  tags: ['string']
};

function validateUser(userData: unknown): User | null {
  const result = validateSchema(userData, userSchema, { partial: true });
  
  if (result.valid) {
    console.log('Valid user:', userData);
    return userData as User;
  } else {
    console.log('Invalid user data:');
    result.errors.forEach(error => {
      console.log(`  - ${error.path}: ${error.message}`);
    });
    return null;
  }
}

validateUser({
  name: 'John',
  age: 30,
  tags: ['admin', 'user']
});

validateUser({
  name: 'Jane',
  age: 'not a number',
  tags: ['user']
});

console.log('\n=== Type Conversion ===');

// Type conversion
function convertTypes(value: unknown): void {
  console.log('Original value:', value, `(${kindOf(value)})`);
  
  const asString = coerceType(value, 'string');
  const asNumber = coerceType(value, 'number');
  const asBoolean = coerceType(value, 'boolean');
  
  console.log('As string:', asString);
  console.log('As number:', asNumber);
  console.log('As boolean:', asBoolean);
}

convertTypes(42);
convertTypes('42');
convertTypes(true);
convertTypes([1, 2, 3]);

console.log('\n=== Advanced Type Checking ===');

// Advanced type checking with generics
function processTypedValue<T>(value: T): string {
  const type = kindOf(value);
  
  switch (type) {
    case 'string':
      return `String: ${(value as string).length} chars`;
    case 'number':
      return `Number: ${(value as number).toFixed(2)}`;
    case 'array':
      return `Array: ${(value as any[]).length} items`;
    case 'object':
      return `Object: ${Object.keys(value as object).length} keys`;
    default:
      return `${type}: ${String(value)}`;
  }
}

console.log(processTypedValue('hello'));
console.log(processTypedValue(42));
console.log(processTypedValue([1, 2, 3]));
console.log(processTypedValue({ a: 1, b: 2 }));

console.log('\n=== Conditional Types ===');

// Working with conditional types
type ProcessedValue<T> = T extends string 
  ? { type: 'string'; value: string; length: number }
  : T extends number 
  ? { type: 'number'; value: number; isInteger: boolean }
  : T extends any[] 
  ? { type: 'array'; value: T; length: number }
  : { type: 'unknown'; value: T };

function processConditionally<T>(value: T): ProcessedValue<T> {
  if (isString(value)) {
    return {
      type: 'string',
      value,
      length: value.length
    } as ProcessedValue<T>;
  }
  
  if (isNumber(value)) {
    return {
      type: 'number',
      value,
      isInteger: Number.isInteger(value)
    } as ProcessedValue<T>;
  }
  
  if (isArray(value)) {
    return {
      type: 'array',
      value,
      length: value.length
    } as ProcessedValue<T>;
  }
  
  return {
    type: 'unknown',
    value
  } as ProcessedValue<T>;
}

const stringResult = processConditionally('hello');
const numberResult = processConditionally(42);
const arrayResult = processConditionally([1, 2, 3]);

console.log('String result:', stringResult);
console.log('Number result:', numberResult);
console.log('Array result:', arrayResult);