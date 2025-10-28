import { getNativeType } from '../../src/core/native-types';
import { kindOfCore, getDetailedType } from '../../src/core/kind-of';
import { checkModernType } from '../../src/core/modern-types';
import { inspect } from '../../src/utils/inspect';
import * as guards from '../../src/guards/objects';
import * as converters from '../../src/converters/to-complex';
import { validateSchema } from '../../src/validators/schema';

describe('Edge Cases and Full Coverage', () => {
  describe('Native Types Edge Cases', () => {
    it('should handle errors in toStringTag getter', () => {
      const obj = {};
      Object.defineProperty(obj, Symbol.toStringTag, {
        get() { throw new Error('toStringTag error'); }
      });
      
      expect(getNativeType(obj)).toBe('object');
    });

    it('should handle objects without constructor', () => {
      const obj = Object.create(null);
      expect(getNativeType(obj)).toBe('object');
    });

    it.skip('should handle DOM elements when HTMLElement exists', () => {
      class MockHTMLElement {}
      global.HTMLElement = MockHTMLElement as any;
      
      const element = new MockHTMLElement();
      expect(getNativeType(element)).toBe('element');
      
      delete (global as any).HTMLElement;
    });

    it.skip('should handle DOM nodes when Node exists', () => {
      class MockNode {}
      global.Node = MockNode as any;
      
      const node = new MockNode();
      expect(getNativeType(node)).toBe('node');
      
      delete (global as any).Node;
    });

    it.skip('should handle global object variations', () => {
      expect(getNativeType(globalThis)).toBe('global');
      
      global.global = global;
      expect(getNativeType(global)).toBe('global');
      delete (global as any).global;
      
      global.window = global as any;
      expect(getNativeType(global.window)).toBe('global');
      delete (global as any).window;
      
      global.self = global as any;
      expect(getNativeType(global.self)).toBe('global');
      delete (global as any).self;
    });
  });

  describe('Kind Of Core Edge Cases', () => {
    it('should use modern type detection for promises', () => {
      const promise = Promise.resolve('test');
      expect(kindOfCore(promise)).toBe('promise');
    });

    it('should use typed array detection', () => {
      const typedArray = new Float32Array(5);
      expect(kindOfCore(typedArray)).toBe('float32array');
    });

    it('should include metadata for typed arrays', () => {
      const typedArray = new Uint16Array(10);
      const details = getDetailedType(typedArray);
      
      expect(details.metadata).toBeDefined();
      expect(details.metadata?.byteLength).toBe(20);
      expect(details.metadata?.length).toBe(10);
    });
  });

  describe('Modern Types Edge Cases', () => {
    it('should handle proxy detection errors', () => {
      const problematicObj = {
        get [Symbol.toStringTag]() {
          throw new Error('toStringTag error');
        }
      };
      
      expect(checkModernType(problematicObj)).toBeNull();
    });

    it('should detect proxy with descriptor heuristic', () => {
      const mockProxy = {};
      Object.defineProperty(mockProxy, Symbol.toStringTag, {
        value: 'Proxy',
        configurable: false
      });
      
      expect(checkModernType(mockProxy)).toBe('proxy');
    });
  });

  describe('Guards Edge Cases', () => {
    it('should handle proxy detection errors in guards', () => {
      const problematicObj = {};
      const originalToString = Object.prototype.toString;
      
      Object.prototype.toString = function() {
        if (this === problematicObj) {
          throw new Error('toString error');
        }
        return originalToString.call(this);
      };
      
      expect(guards.isProxy(problematicObj)).toBe(false);
      
      Object.prototype.toString = originalToString;
    });

    it('should detect async iterable objects', () => {
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
    });

    it('should detect async generator objects', () => {
      async function* asyncGen() {
        yield 1;
      }
      
      const gen = asyncGen();
      expect(guards.isAsyncGenerator(gen)).toBe(true);
    });
  });

  describe('Converters Edge Cases', () => {
    it('should handle buffer conversion when already a buffer', () => {
      if (typeof Buffer !== 'undefined') {
        const buf = Buffer.from('test');
        const result = converters.toBuffer(buf);
        expect(result).toEqual(buf);
      }
    });

    it('should handle error conversion from object without message', () => {
      const obj = { name: 'CustomError' };
      const error = converters.toError(obj);
      
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe('[object Object]');
    });

    it('should handle typed array conversion from ArrayBuffer', () => {
      const arrayBuffer = new ArrayBuffer(16);
      const result = converters.toTypedArray(arrayBuffer, Float32Array);
      
      expect(result).toBeInstanceOf(Float32Array);
      expect(result?.length).toBe(4);
    });
  });

  describe('Inspect Edge Cases', () => {
    it('should format arrays compactly when requested', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = inspect(arr, { compact: true });
      
      expect(result).toBe('[1, 2, 3, 4, 5]');
    });

    it('should handle Map overflow', () => {
      const map = new Map();
      for (let i = 0; i < 10; i++) {
        map.set(i, `value${i}`);
      }
      
      const result = inspect(map, { maxArrayLength: 3 });
      expect(result).toContain('... 7 more items');
    });

    it('should handle Set overflow', () => {
      const set = new Set();
      for (let i = 0; i < 10; i++) {
        set.add(`value${i}`);
      }
      
      const result = inspect(set, { maxArrayLength: 3 });
      expect(result).toContain('... 7 more items');
    });

    it('should handle property access errors', () => {
      const obj = {
        get errorProp() {
          throw new Error('Property access error');
        }
      };
      
      const result = inspect(obj);
      expect(result).toContain('[Error: Property access error]');
    });
  });

  describe('Schema Validation Edge Cases', () => {
    it('should handle nested object validation', () => {
      const schema = {
        nested: {
          name: 'string'
        }
      };
      
      const data = {
        nested: 'not-object'
      };
      
      const result = validateSchema(data, schema);
      expect(result.valid).toBe(false);
      expect(result.errors[0]?.expected).toBe('object');
    });

    it('should handle strict mode for unexpected properties', () => {
      const schema = {
        name: 'string'
      };
      
      const data = {
        name: 'John',
        extra: 'unexpected'
      };
      
      const result = validateSchema(data, schema, { strict: true });
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('Unexpected property'))).toBe(true);
    });

    it('should allow extra properties in non-strict mode', () => {
      const schema = {
        name: 'string'
      };
      
      const data = {
        name: 'John',
        age: 30,
        extra: 'value'
      };
      
      const result = validateSchema(data, schema, { strict: false });
      expect(result.valid).toBe(true);
    });
  });
});