import { kindOf, fastKindOf, kindOfMany, getDetailedType, enableCache, disableCache, clearCache } from '../../src';

describe('Core Type Detection', () => {
  describe('kindOf', () => {
    // Primitives
    test('detects undefined', () => {
      expect(kindOf(undefined)).toBe('undefined');
    });

    test('detects null', () => {
      expect(kindOf(null)).toBe('null');
    });

    test('detects boolean', () => {
      expect(kindOf(true)).toBe('boolean');
      expect(kindOf(false)).toBe('boolean');
    });

    test('detects number', () => {
      expect(kindOf(42)).toBe('number');
      expect(kindOf(3.14)).toBe('number');
      expect(kindOf(0)).toBe('number');
      expect(kindOf(-42)).toBe('number');
      expect(kindOf(Infinity)).toBe('number');
      expect(kindOf(-Infinity)).toBe('number');
      expect(kindOf(NaN)).toBe('number');
    });

    test('detects string', () => {
      expect(kindOf('')).toBe('string');
      expect(kindOf('hello')).toBe('string');
      expect(kindOf('123')).toBe('string');
    });

    test('detects symbol', () => {
      expect(kindOf(Symbol())).toBe('symbol');
      expect(kindOf(Symbol('test'))).toBe('symbol');
      expect(kindOf(Symbol.for('global'))).toBe('symbol');
    });

    test('detects bigint', () => {
      expect(kindOf(123n)).toBe('bigint');
      expect(kindOf(-123n)).toBe('bigint');
      expect(kindOf(0n)).toBe('bigint');
    });

    // Objects
    test('detects object', () => {
      expect(kindOf({})).toBe('object');
      expect(kindOf({ a: 1 })).toBe('object');
      expect(kindOf(Object.create(null))).toBe('object');
    });

    test('detects array', () => {
      expect(kindOf([])).toBe('array');
      expect(kindOf([1, 2, 3])).toBe('array');
      expect(kindOf([])).toBe('array');
    });

    test('detects function', () => {
      expect(kindOf(() => {})).toBe('function');
      expect(kindOf(function() {})).toBe('function');
      expect(kindOf(class {})).toBe('function');
    });

    test('detects date', () => {
      expect(kindOf(new Date())).toBe('date');
      expect(kindOf(new Date('2020-01-01'))).toBe('date');
      expect(kindOf(new Date('invalid'))).toBe('date');
    });

    test('detects regexp', () => {
      expect(kindOf(/test/)).toBe('regexp');
      expect(kindOf(/test/gi)).toBe('regexp');
      expect(kindOf(new RegExp('test'))).toBe('regexp');
    });

    test('detects error', () => {
      expect(kindOf(new Error())).toBe('error');
      expect(kindOf(new TypeError())).toBe('error');
      expect(kindOf(new RangeError())).toBe('error');
    });

    // Collections
    test('detects map', () => {
      expect(kindOf(new Map())).toBe('map');
      expect(kindOf(new Map([['key', 'value']]))).toBe('map');
    });

    test('detects set', () => {
      expect(kindOf(new Set())).toBe('set');
      expect(kindOf(new Set([1, 2, 3]))).toBe('set');
    });

    test('detects weakmap', () => {
      expect(kindOf(new WeakMap())).toBe('weakmap');
    });

    test('detects weakset', () => {
      expect(kindOf(new WeakSet())).toBe('weakset');
    });

    // Modern types
    test('detects promise', () => {
      expect(kindOf(Promise.resolve())).toBe('promise');
      expect(kindOf(Promise.reject().catch(() => {}))).toBe('promise');
      expect(kindOf(new Promise(() => {}))).toBe('promise');
    });

    test('detects async function', () => {
      expect(kindOf(async function() {})).toBe('asyncfunction');
      expect(kindOf(async () => {})).toBe('asyncfunction');
    });

    test('detects generator function', () => {
      expect(kindOf(function*() {})).toBe('generatorfunction');
    });

    test('detects async generator function', () => {
      expect(kindOf(async function*() {})).toBe('asyncgeneratorfunction');
    });

    // Typed arrays
    test('detects typed arrays', () => {
      expect(kindOf(new Int8Array())).toBe('int8array');
      expect(kindOf(new Uint8Array())).toBe('uint8array');
      expect(kindOf(new Uint8ClampedArray())).toBe('uint8clampedarray');
      expect(kindOf(new Int16Array())).toBe('int16array');
      expect(kindOf(new Uint16Array())).toBe('uint16array');
      expect(kindOf(new Int32Array())).toBe('int32array');
      expect(kindOf(new Uint32Array())).toBe('uint32array');
      expect(kindOf(new Float32Array())).toBe('float32array');
      expect(kindOf(new Float64Array())).toBe('float64array');
      expect(kindOf(new BigInt64Array())).toBe('bigint64array');
      expect(kindOf(new BigUint64Array())).toBe('biguint64array');
    });

    // Buffers
    test('detects arraybuffer', () => {
      expect(kindOf(new ArrayBuffer(8))).toBe('arraybuffer');
    });

    test('detects dataview', () => {
      expect(kindOf(new DataView(new ArrayBuffer(8)))).toBe('dataview');
    });

    test('detects sharedarraybuffer', () => {
      if (typeof SharedArrayBuffer !== 'undefined') {
        expect(kindOf(new SharedArrayBuffer(8))).toBe('sharedarraybuffer');
      }
    });

    // Special
    test('detects arguments', () => {
      const args = (function(..._args: any[]) { return arguments; })(1, 2, 3);
      expect(kindOf(args)).toBe('arguments');
    });
  });

  describe('fastKindOf', () => {
    test('quickly identifies primitives', () => {
      expect(fastKindOf(undefined)).toBe('undefined');
      expect(fastKindOf(null)).toBe('null');
      expect(fastKindOf(true)).toBe('boolean');
      expect(fastKindOf(42)).toBe('number');
      expect(fastKindOf('hello')).toBe('string');
      expect(fastKindOf(Symbol())).toBe('symbol');
      expect(fastKindOf(123n)).toBe('bigint');
    });

    test('quickly identifies common objects', () => {
      expect(fastKindOf([])).toBe('array');
      expect(fastKindOf(new Date())).toBe('date');
      expect(fastKindOf(/test/)).toBe('regexp');
      expect(fastKindOf(new Error())).toBe('error');
      expect(fastKindOf({})).toBe('object');
      expect(fastKindOf(new Map())).toBe('object');
    });
  });

  describe('kindOfMany', () => {
    test('processes multiple values', () => {
      const values = [undefined, null, true, 42, 'hello', [], {}];
      const types = kindOfMany(values);
      expect(types).toEqual(['undefined', 'null', 'boolean', 'number', 'string', 'array', 'object']);
    });

    test('handles empty array', () => {
      expect(kindOfMany([])).toEqual([]);
    });
  });

  describe('getDetailedType', () => {
    test('provides detailed information for primitives', () => {
      const details = getDetailedType(42);
      expect(details).toMatchObject({
        type: 'number',
        isPrimitive: true,
        isBuiltIn: true,
        isNullish: false,
        isIterable: false,
        isAsync: false,
      });
    });

    test('provides detailed information for objects', () => {
      const arr = [1, 2, 3];
      const details = getDetailedType(arr);
      expect(details).toMatchObject({
        type: 'array',
        constructor: 'Array',
        isPrimitive: false,
        isBuiltIn: true,
        isNullish: false,
        isIterable: true,
        isAsync: false,
        metadata: { length: 3 },
      });
    });

    test('detects custom types via Symbol.toStringTag', () => {
      const customObj = { [Symbol.toStringTag]: 'CustomType' };
      const details = getDetailedType(customObj);
      expect(details.customType).toBe('CustomType');
    });
  });

  describe('caching', () => {
    test('cache can be enabled and disabled', () => {
      const obj = { test: true };
      
      enableCache();
      expect(kindOf(obj)).toBe('object');
      expect(kindOf(obj)).toBe('object'); // Should use cache
      
      disableCache();
      expect(kindOf(obj)).toBe('object'); // Should not use cache
      
      enableCache();
      clearCache();
      expect(kindOf(obj)).toBe('object'); // Cache cleared
    });
  });
});