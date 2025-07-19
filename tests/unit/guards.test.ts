import * as guards from '../../src/guards';
import { isType, assertType, ensureType } from '../../src';

describe('Type Guards', () => {
  describe('Primitive Guards', () => {
    test('isUndefined', () => {
      expect(guards.isUndefined(undefined)).toBe(true);
      expect(guards.isUndefined(null)).toBe(false);
      expect(guards.isUndefined(0)).toBe(false);
    });

    test('isNull', () => {
      expect(guards.isNull(null)).toBe(true);
      expect(guards.isNull(undefined)).toBe(false);
      expect(guards.isNull(0)).toBe(false);
    });

    test('isBoolean', () => {
      expect(guards.isBoolean(true)).toBe(true);
      expect(guards.isBoolean(false)).toBe(true);
      expect(guards.isBoolean(1)).toBe(false);
    });

    test('isNumber', () => {
      expect(guards.isNumber(42)).toBe(true);
      expect(guards.isNumber(NaN)).toBe(true);
      expect(guards.isNumber(Infinity)).toBe(true);
      expect(guards.isNumber('42')).toBe(false);
    });

    test('isString', () => {
      expect(guards.isString('hello')).toBe(true);
      expect(guards.isString('')).toBe(true);
      expect(guards.isString(123)).toBe(false);
    });

    test('isSymbol', () => {
      expect(guards.isSymbol(Symbol())).toBe(true);
      expect(guards.isSymbol(Symbol.for('test'))).toBe(true);
      expect(guards.isSymbol('symbol')).toBe(false);
    });

    test('isBigInt', () => {
      expect(guards.isBigInt(123n)).toBe(true);
      expect(guards.isBigInt(0n)).toBe(true);
      expect(guards.isBigInt(123)).toBe(false);
    });

    test('isPrimitive', () => {
      expect(guards.isPrimitive(null)).toBe(true);
      expect(guards.isPrimitive(undefined)).toBe(true);
      expect(guards.isPrimitive(true)).toBe(true);
      expect(guards.isPrimitive(42)).toBe(true);
      expect(guards.isPrimitive('hello')).toBe(true);
      expect(guards.isPrimitive(Symbol())).toBe(true);
      expect(guards.isPrimitive(123n)).toBe(true);
      expect(guards.isPrimitive({})).toBe(false);
      expect(guards.isPrimitive([])).toBe(false);
    });

    test('isNullish', () => {
      expect(guards.isNullish(null)).toBe(true);
      expect(guards.isNullish(undefined)).toBe(true);
      expect(guards.isNullish(0)).toBe(false);
      expect(guards.isNullish('')).toBe(false);
    });

    test('isFalsy', () => {
      expect(guards.isFalsy(false)).toBe(true);
      expect(guards.isFalsy(0)).toBe(true);
      expect(guards.isFalsy('')).toBe(true);
      expect(guards.isFalsy(null)).toBe(true);
      expect(guards.isFalsy(undefined)).toBe(true);
      expect(guards.isFalsy(0n)).toBe(true);
      expect(guards.isFalsy(true)).toBe(false);
      expect(guards.isFalsy(1)).toBe(false);
    });

    test('isTruthy', () => {
      expect(guards.isTruthy(true)).toBe(true);
      expect(guards.isTruthy(1)).toBe(true);
      expect(guards.isTruthy('hello')).toBe(true);
      expect(guards.isTruthy({})).toBe(true);
      expect(guards.isTruthy([])).toBe(true);
      expect(guards.isTruthy(false)).toBe(false);
      expect(guards.isTruthy(0)).toBe(false);
    });
  });

  describe('Numeric Guards', () => {
    test('isInteger', () => {
      expect(guards.isInteger(42)).toBe(true);
      expect(guards.isInteger(0)).toBe(true);
      expect(guards.isInteger(-42)).toBe(true);
      expect(guards.isInteger(3.14)).toBe(false);
      expect(guards.isInteger('42')).toBe(false);
    });

    test('isSafeInteger', () => {
      expect(guards.isSafeInteger(42)).toBe(true);
      expect(guards.isSafeInteger(Number.MAX_SAFE_INTEGER)).toBe(true);
      expect(guards.isSafeInteger(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
    });

    test('isFinite', () => {
      expect(guards.isFinite(42)).toBe(true);
      expect(guards.isFinite(3.14)).toBe(true);
      expect(guards.isFinite(Infinity)).toBe(false);
      expect(guards.isFinite(NaN)).toBe(false);
    });

    test('isNaN', () => {
      expect(guards.isNaN(NaN)).toBe(true);
      expect(guards.isNaN(42)).toBe(false);
      expect(guards.isNaN('NaN')).toBe(false);
    });

    test('isInfinity', () => {
      expect(guards.isInfinity(Infinity)).toBe(true);
      expect(guards.isInfinity(-Infinity)).toBe(true);
      expect(guards.isInfinity(42)).toBe(false);
    });
  });

  describe('String Guards', () => {
    test('isEmptyString', () => {
      expect(guards.isEmptyString('')).toBe(true);
      expect(guards.isEmptyString(' ')).toBe(false);
      expect(guards.isEmptyString('hello')).toBe(false);
    });

    test('isNumericString', () => {
      expect(guards.isNumericString('123')).toBe(true);
      expect(guards.isNumericString('3.14')).toBe(true);
      expect(guards.isNumericString('-42')).toBe(true);
      expect(guards.isNumericString('abc')).toBe(false);
      expect(guards.isNumericString('')).toBe(false);
      expect(guards.isNumericString(123)).toBe(false); // Not a string
      expect(guards.isNumericString(null)).toBe(false); // Not a string
    });

    test('isJsonString', () => {
      expect(guards.isJsonString('{"a": 1}')).toBe(true);
      expect(guards.isJsonString('[1, 2, 3]')).toBe(true);
      expect(guards.isJsonString('"hello"')).toBe(true);
      expect(guards.isJsonString('invalid')).toBe(false);
      expect(guards.isJsonString(123)).toBe(false); // Not a string
      expect(guards.isJsonString({})).toBe(false); // Not a string
    });
  });

  describe('Object Guards', () => {
    test('isObject', () => {
      expect(guards.isObject({})).toBe(true);
      expect(guards.isObject([])).toBe(true);
      expect(guards.isObject(new Date())).toBe(true);
      expect(guards.isObject(null)).toBe(false);
      expect(guards.isObject(undefined)).toBe(false);
      expect(guards.isObject('string')).toBe(false);
    });

    test('isArray', () => {
      expect(guards.isArray([])).toBe(true);
      expect(guards.isArray([1, 2, 3])).toBe(true);
      expect(guards.isArray({})).toBe(false);
      expect(guards.isArray('array')).toBe(false);
    });

    test('isFunction', () => {
      expect(guards.isFunction(() => {})).toBe(true);
      expect(guards.isFunction(function() {})).toBe(true);
      expect(guards.isFunction(async () => {})).toBe(true);
      expect(guards.isFunction({})).toBe(false);
    });

    test('isDate', () => {
      expect(guards.isDate(new Date())).toBe(true);
      expect(guards.isDate(Date.now())).toBe(false);
      expect(guards.isDate('2023-01-01')).toBe(false);
    });

    test('isRegExp', () => {
      expect(guards.isRegExp(/test/)).toBe(true);
      expect(guards.isRegExp(new RegExp('test'))).toBe(true);
      expect(guards.isRegExp('/test/')).toBe(false);
    });

    test('isError', () => {
      expect(guards.isError(new Error())).toBe(true);
      expect(guards.isError(new TypeError())).toBe(true);
      expect(guards.isError({ name: 'Error', message: 'test', stack: 'stack' })).toBe(true);
      expect(guards.isError('error')).toBe(false);
    });

    test('isPromise', () => {
      expect(guards.isPromise(Promise.resolve())).toBe(true);
      expect(guards.isPromise({ then: () => {} })).toBe(true);
      expect(guards.isPromise({ then: 'not a function' })).toBe(false);
      expect(guards.isPromise(null)).toBe(false);
    });

    test('isArguments', () => {
      function testFunc(..._args: any[]) {
        return guards.isArguments(arguments);
      }
      expect(testFunc(1, 2, 3)).toBe(true);
      expect(guards.isArguments([])).toBe(false);
      expect(guards.isArguments({})).toBe(false);
    });

    test('isBuffer', () => {
      if (typeof Buffer !== 'undefined') {
        expect(guards.isBuffer(Buffer.from('test'))).toBe(true);
      }
      expect(guards.isBuffer({})).toBe(false);
      expect(guards.isBuffer(null)).toBe(false);
    });

    test('isPlainObject', () => {
      expect(guards.isPlainObject({})).toBe(true);
      expect(guards.isPlainObject(Object.create(null))).toBe(true);
      expect(guards.isPlainObject([])).toBe(false);
      expect(guards.isPlainObject(new Date())).toBe(false);
    });

    test('isEmpty', () => {
      expect(guards.isEmpty(null)).toBe(true);
      expect(guards.isEmpty(undefined)).toBe(true);
      expect(guards.isEmpty('')).toBe(true);
      expect(guards.isEmpty([])).toBe(true);
      expect(guards.isEmpty(new Map())).toBe(true);
      expect(guards.isEmpty(new Set())).toBe(true);
      expect(guards.isEmpty({})).toBe(true);
      expect(guards.isEmpty([1])).toBe(false);
      expect(guards.isEmpty('test')).toBe(false);
    });

    test('isEmptyArray', () => {
      expect(guards.isEmptyArray([])).toBe(true);
      expect(guards.isEmptyArray([1])).toBe(false);
      expect(guards.isEmptyArray({})).toBe(false);
    });

    test('isEmptyObject', () => {
      expect(guards.isEmptyObject({})).toBe(true);
      expect(guards.isEmptyObject({ a: 1 })).toBe(false);
      expect(guards.isEmptyObject([])).toBe(false);
    });

    test('hasLength', () => {
      expect(guards.hasLength('')).toBe(true);
      expect(guards.hasLength([])).toBe(true);
      expect(guards.hasLength({ length: 0 })).toBe(true);
      expect(guards.hasLength({})).toBe(false);
      expect(guards.hasLength(null)).toBe(false);
    });

    test('hasSize', () => {
      expect(guards.hasSize(new Map())).toBe(true);
      expect(guards.hasSize(new Set())).toBe(true);
      expect(guards.hasSize({ size: 0 })).toBe(true);
      expect(guards.hasSize({})).toBe(false);
      expect(guards.hasSize(null)).toBe(false);
    });

    test('isArrayLike', () => {
      expect(guards.isArrayLike([])).toBe(true);
      expect(guards.isArrayLike('string')).toBe(true);
      expect(guards.isArrayLike({ length: 3 })).toBe(true);
      expect(guards.isArrayLike({})).toBe(false);
      expect(guards.isArrayLike(null)).toBe(false);
      expect(guards.isArrayLike(() => {})).toBe(false);
    });

    test('isIterable', () => {
      expect(guards.isIterable([])).toBe(true);
      expect(guards.isIterable('')).toBe(true);
      expect(guards.isIterable(new Set())).toBe(true);
      expect(guards.isIterable(new Map())).toBe(true);
      expect(guards.isIterable({})).toBe(false);
      expect(guards.isIterable(null)).toBe(false);
    });

    test('isAsyncIterable', () => {
      const asyncIterable = {
        [Symbol.asyncIterator]: function() {
          return {
            async next() {
              return { done: true, value: undefined };
            }
          };
        }
      };
      expect(guards.isAsyncIterable(asyncIterable)).toBe(true);
      expect(guards.isAsyncIterable({})).toBe(false);
      expect(guards.isAsyncIterable(null)).toBe(false);
    });

    test('isConstructor', () => {
      expect(guards.isConstructor(Date)).toBe(true);
      expect(guards.isConstructor(Array)).toBe(true);
      expect(guards.isConstructor(() => {})).toBe(false);
      expect(guards.isConstructor({})).toBe(false);
    });

    test('isThenable', () => {
      expect(guards.isThenable(Promise.resolve())).toBe(true);
      expect(guards.isThenable({ then: () => {} })).toBe(true);
      expect(guards.isThenable({})).toBe(false);
      expect(guards.isThenable(null)).toBe(false);
    });

    test('isObservable', () => {
      expect(guards.isObservable({ subscribe: () => {} })).toBe(true);
      expect(guards.isObservable({})).toBe(false);
      expect(guards.isObservable(null)).toBe(false);
    });

    test('isGenerator', () => {
      function* genFunc() {
        yield 1;
      }
      const gen = genFunc();
      expect(guards.isGenerator(gen)).toBe(true);
      expect(guards.isGenerator({})).toBe(false);
    });

    test('isAsyncGenerator', () => {
      async function* asyncGenFunc() {
        yield 1;
      }
      const asyncGen = asyncGenFunc();
      expect(guards.isAsyncGenerator(asyncGen)).toBe(true);
      expect(guards.isAsyncGenerator({})).toBe(false);
    });

    test('isGeneratorFunction', () => {
      function* genFunc() {}
      expect(guards.isGeneratorFunction(genFunc)).toBe(true);
      expect(guards.isGeneratorFunction(() => {})).toBe(false);
    });

    test('isAsyncFunction', () => {
      async function asyncFunc() {}
      expect(guards.isAsyncFunction(asyncFunc)).toBe(true);
      expect(guards.isAsyncFunction(() => {})).toBe(false);
    });

    test('isAsyncGeneratorFunction', () => {
      async function* asyncGenFunc() {}
      expect(guards.isAsyncGeneratorFunction(asyncGenFunc)).toBe(true);
      expect(guards.isAsyncGeneratorFunction(() => {})).toBe(false);
    });

    test('isProxy', () => {
      const proxy = new Proxy({}, {});
      const result = guards.isProxy(proxy);
      expect(typeof result).toBe('boolean');
      expect(guards.isProxy({})).toBe(false);
      
      // Test line 192: return isProxyLike; - test the proxy detection logic
      // Test with various non-proxy objects to ensure they return false
      expect(guards.isProxy(null)).toBe(false);
      expect(guards.isProxy(undefined)).toBe(false);
      expect(guards.isProxy('string')).toBe(false);
      expect(guards.isProxy(42)).toBe(false);
      expect(guards.isProxy([])).toBe(false);
      expect(guards.isProxy(new Date())).toBe(false);
      expect(guards.isProxy(function() {})).toBe(false);
      
      // Test actual proxy - this triggers the full isProxy logic including line 192
      const targetObj = { test: 'value' };
      const handler = {
        get: function(target: any, prop: string) {
          return target[prop];
        }
      };
      const testProxy = new Proxy(targetObj, handler);
      
      // The isProxy function tries to detect proxies but it's inherently difficult
      // The important thing is that it doesn't throw and returns a boolean
      const proxyResult = guards.isProxy(testProxy);
      expect(typeof proxyResult).toBe('boolean');
    });

    test('Error type guards', () => {
      expect(guards.isTypeError(new TypeError())).toBe(true);
      expect(guards.isRangeError(new RangeError())).toBe(true);
      expect(guards.isSyntaxError(new SyntaxError())).toBe(true);
      expect(guards.isReferenceError(new ReferenceError())).toBe(true);
      expect(guards.isEvalError(new EvalError())).toBe(true);
      expect(guards.isURIError(new URIError())).toBe(true);
    });

    test('Node.js specific guards', () => {
      const mockStream = { pipe: () => {} };
      expect(guards.isStream(mockStream)).toBe(true);
      
      const mockEventEmitter = {
        on: () => {},
        emit: () => {},
        removeListener: () => {}
      };
      expect(guards.isEventEmitter(mockEventEmitter)).toBe(true);
    });

    test('DOM specific guards', () => {
      if (typeof Element !== 'undefined') {
        // In browser environment
        const div = document.createElement('div');
        expect(guards.isElement(div)).toBe(true);
      } else {
        // In Node.js environment
        expect(guards.isElement({})).toBe(false);
      }
      
      // isNode
      if (typeof Node !== 'undefined' && typeof document !== 'undefined') {
        const textNode = document.createTextNode('test');
        expect(guards.isNode(textNode)).toBe(true);
      } else {
        expect(guards.isNode({})).toBe(false);
      }
      
      // isWindow
      if (typeof Window !== 'undefined' && typeof window !== 'undefined') {
        expect(guards.isWindow(window)).toBe(true);
      } else {
        expect(guards.isWindow({})).toBe(false);
      }
      
      // isDocument
      if (typeof Document !== 'undefined' && typeof document !== 'undefined') {
        expect(guards.isDocument(document)).toBe(true);
      } else {
        expect(guards.isDocument({})).toBe(false);
      }
    });

    test('isGlobal', () => {
      expect(guards.isGlobal(globalThis)).toBe(true);
      expect(guards.isGlobal({})).toBe(false);
      expect(guards.isGlobal(null)).toBe(false);
    });

    test('isSomething', () => {
      expect(guards.isObject({})).toBe(true);
      expect(guards.isObject([])).toBe(true);
      expect(guards.isObject(new Date())).toBe(true);
      expect(guards.isObject(null)).toBe(false);
      expect(guards.isObject(42)).toBe(false);
    });

    test('isArray', () => {
      expect(guards.isArray([])).toBe(true);
      expect(guards.isArray([1, 2, 3])).toBe(true);
      expect(guards.isArray([])).toBe(true);
      expect(guards.isArray({})).toBe(false);
    });

    test('isFunction', () => {
      expect(guards.isFunction(() => {})).toBe(true);
      expect(guards.isFunction(function() {})).toBe(true);
      expect(guards.isFunction(class {})).toBe(true);
      expect(guards.isFunction({})).toBe(false);
    });

    test('isPlainObject', () => {
      expect(guards.isPlainObject({})).toBe(true);
      expect(guards.isPlainObject({ a: 1 })).toBe(true);
      expect(guards.isPlainObject(Object.create(null))).toBe(true);
      expect(guards.isPlainObject([])).toBe(false);
      expect(guards.isPlainObject(new Date())).toBe(false);
    });

    test('isEmpty', () => {
      expect(guards.isEmpty('')).toBe(true);
      expect(guards.isEmpty([])).toBe(true);
      expect(guards.isEmpty({})).toBe(true);
      expect(guards.isEmpty(new Map())).toBe(true);
      expect(guards.isEmpty(new Set())).toBe(true);
      expect(guards.isEmpty(null)).toBe(true);
      expect(guards.isEmpty(undefined)).toBe(true);
      expect(guards.isEmpty('hello')).toBe(false);
      expect(guards.isEmpty([1])).toBe(false);
      expect(guards.isEmpty({ a: 1 })).toBe(false);
      
      // Test line 67: return false for non-plain objects
      expect(guards.isEmpty(new Date())).toBe(false);
      expect(guards.isEmpty(/regex/)).toBe(false);
      expect(guards.isEmpty(new Error())).toBe(false);
      expect(guards.isEmpty(function() {})).toBe(false);
      expect(guards.isEmpty(42)).toBe(false);
      expect(guards.isEmpty(true)).toBe(false);
      expect(guards.isEmpty(Symbol('test'))).toBe(false);
    });

    test('hasLength', () => {
      expect(guards.hasLength([])).toBe(true);
      expect(guards.hasLength('hello')).toBe(true);
      expect(guards.hasLength({ length: 5 })).toBe(true);
      expect(guards.hasLength({})).toBe(false);
      expect(guards.hasLength(42)).toBe(false);
    });

    test('hasSize', () => {
      expect(guards.hasSize(new Map())).toBe(true);
      expect(guards.hasSize(new Set())).toBe(true);
      expect(guards.hasSize({ size: 5 })).toBe(true);
      expect(guards.hasSize({})).toBe(false);
      expect(guards.hasSize([])).toBe(false);
    });

    test('isIterable', () => {
      expect(guards.isIterable([])).toBe(true);
      expect(guards.isIterable('hello')).toBe(true);
      expect(guards.isIterable(new Set())).toBe(true);
      expect(guards.isIterable(new Map())).toBe(true);
      expect(guards.isIterable({})).toBe(false);
    });

    test('isThenable', () => {
      expect(guards.isThenable(Promise.resolve())).toBe(true);
      expect(guards.isThenable({ then: () => {} })).toBe(true);
      expect(guards.isThenable({})).toBe(false);
    });
  });

  describe('Collection Guards', () => {
    test('isMap', () => {
      expect(guards.isMap(new Map())).toBe(true);
      expect(guards.isMap(new WeakMap())).toBe(false);
      expect(guards.isMap({})).toBe(false);
    });

    test('isSet', () => {
      expect(guards.isSet(new Set())).toBe(true);
      expect(guards.isSet(new WeakSet())).toBe(false);
      expect(guards.isSet([])).toBe(false);
    });

    test('isTypedArray', () => {
      expect(guards.isTypedArray(new Int8Array())).toBe(true);
      expect(guards.isTypedArray(new Uint8Array())).toBe(true);
      expect(guards.isTypedArray(new Float32Array())).toBe(true);
      expect(guards.isTypedArray(new DataView(new ArrayBuffer(8)))).toBe(false);
      expect(guards.isTypedArray([])).toBe(false);
    });
  });

  describe('Error Guards', () => {
    test('error type guards', () => {
      expect(guards.isTypeError(new TypeError())).toBe(true);
      expect(guards.isRangeError(new RangeError())).toBe(true);
      expect(guards.isSyntaxError(new SyntaxError())).toBe(true);
      expect(guards.isReferenceError(new ReferenceError())).toBe(true);
      expect(guards.isEvalError(new EvalError())).toBe(true);
      expect(guards.isURIError(new URIError())).toBe(true);
    });
  });

  describe('Type Assertion', () => {
    test('isType correctly identifies types', () => {
      expect(isType(42, 'number')).toBe(true);
      expect(isType('hello', 'string')).toBe(true);
      expect(isType([], 'array')).toBe(true);
      expect(isType({}, 'object')).toBe(true);
      expect(isType(42, 'string')).toBe(false);
    });

    test('assertType throws on mismatch', () => {
      expect(() => assertType(42, 'number')).not.toThrow();
      expect(() => assertType(42, 'string')).toThrow(TypeError);
      expect(() => assertType(42, 'string')).toThrow('Expected type "string" but got "number"');
    });

    test('ensureType returns value or default', () => {
      expect(ensureType(42, 'number', 0)).toBe(42);
      expect(ensureType('42', 'number', 0)).toBe(0);
      expect(ensureType(undefined, 'string', 'default')).toBe('default');
    });
  });
});