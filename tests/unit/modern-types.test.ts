import { checkModernType, getTypedArrayType } from '../../src/core/modern-types';

describe('Modern Types', () => {
  describe('checkModernType', () => {
    test('detects promises', () => {
      expect(checkModernType(Promise.resolve(42))).toBe('promise');
      expect(checkModernType(Promise.reject().catch(() => {}))).toBe('promise');
      expect(checkModernType({ then: () => {} })).toBe('promise');
    });

    test('detects Maps', () => {
      expect(checkModernType(new Map())).toBe('map');
      expect(checkModernType(new Map([['a', 1]]))).toBe('map');
    });

    test('detects Sets', () => {
      expect(checkModernType(new Set())).toBe('set');
      expect(checkModernType(new Set([1, 2, 3]))).toBe('set');
    });

    test('detects WeakMaps', () => {
      expect(checkModernType(new WeakMap())).toBe('weakmap');
    });

    test('detects WeakSets', () => {
      expect(checkModernType(new WeakSet())).toBe('weakset');
    });

    test('detects ArrayBuffers', () => {
      expect(checkModernType(new ArrayBuffer(8))).toBe('arraybuffer');
    });

    test('detects DataViews', () => {
      expect(checkModernType(new DataView(new ArrayBuffer(8)))).toBe('dataview');
    });

    test('detects SharedArrayBuffer', () => {
      if (typeof SharedArrayBuffer !== 'undefined') {
        expect(checkModernType(new SharedArrayBuffer(8))).toBe('sharedarraybuffer');
      } else {
        expect(checkModernType({})).toBeNull();
      }
    });

    test('returns null for non-modern types', () => {
      expect(checkModernType(null)).toBeNull();
      expect(checkModernType(undefined)).toBeNull();
      expect(checkModernType(42)).toBeNull();
      expect(checkModernType('hello')).toBeNull();
      expect(checkModernType({})).toBeNull();
    });

    test('handles cross-realm objects', () => {
      // Mock a cross-realm object that throws on instanceof checks
      const crossRealmMap = {
        __proto__: Map.prototype,
        size: 0,
        set: Map.prototype.set,
        get: Map.prototype.get,
        has: Map.prototype.has,
        delete: Map.prototype.delete,
        clear: Map.prototype.clear,
        keys: Map.prototype.keys,
        values: Map.prototype.values,
        entries: Map.prototype.entries,
        forEach: Map.prototype.forEach,
        [Symbol.iterator]: Map.prototype[Symbol.iterator],
        [Symbol.toStringTag]: 'Map'
      };
      
      expect(checkModernType(crossRealmMap)).toBe('map');
    });
  });

  describe('getTypedArrayType', () => {
    test('detects typed arrays', () => {
      expect(getTypedArrayType(new Int8Array())).toBe('int8array');
      expect(getTypedArrayType(new Uint8Array())).toBe('uint8array');
      expect(getTypedArrayType(new Uint8ClampedArray())).toBe('uint8clampedarray');
      expect(getTypedArrayType(new Int16Array())).toBe('int16array');
      expect(getTypedArrayType(new Uint16Array())).toBe('uint16array');
      expect(getTypedArrayType(new Int32Array())).toBe('int32array');
      expect(getTypedArrayType(new Uint32Array())).toBe('uint32array');
      expect(getTypedArrayType(new Float32Array())).toBe('float32array');
      expect(getTypedArrayType(new Float64Array())).toBe('float64array');
      expect(getTypedArrayType(new BigInt64Array())).toBe('bigint64array');
      expect(getTypedArrayType(new BigUint64Array())).toBe('biguint64array');
    });

    test('returns null for non-typed arrays', () => {
      expect(getTypedArrayType([])).toBeNull();
      expect(getTypedArrayType({})).toBeNull();
      expect(getTypedArrayType(42)).toBeNull();
      expect(getTypedArrayType('hello')).toBeNull();
      expect(getTypedArrayType(new DataView(new ArrayBuffer(8)))).toBeNull();
    });

    test('handles ArrayBuffer views', () => {
      const buffer = new ArrayBuffer(16);
      const int32View = new Int32Array(buffer);
      expect(getTypedArrayType(int32View)).toBe('int32array');
    });
  });
});