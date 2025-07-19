import * as guards from '../../src/guards/collections';

describe('Collection Guards', () => {
  test('isMap', () => {
    expect(guards.isMap(new Map())).toBe(true);
    expect(guards.isMap(new Map([['key', 'value']]))).toBe(true);
    expect(guards.isMap(new WeakMap())).toBe(false);
    expect(guards.isMap({})).toBe(false);
  });

  test('isSet', () => {
    expect(guards.isSet(new Set())).toBe(true);
    expect(guards.isSet(new Set([1, 2, 3]))).toBe(true);
    expect(guards.isSet(new WeakSet())).toBe(false);
    expect(guards.isSet([])).toBe(false);
  });

  test('isWeakMap', () => {
    expect(guards.isWeakMap(new WeakMap())).toBe(true);
    expect(guards.isWeakMap(new Map())).toBe(false);
    expect(guards.isWeakMap({})).toBe(false);
  });

  test('isWeakSet', () => {
    expect(guards.isWeakSet(new WeakSet())).toBe(true);
    expect(guards.isWeakSet(new Set())).toBe(false);
    expect(guards.isWeakSet([])).toBe(false);
  });

  test('isDataView', () => {
    const buffer = new ArrayBuffer(8);
    expect(guards.isDataView(new DataView(buffer))).toBe(true);
    expect(guards.isDataView(buffer)).toBe(false);
    expect(guards.isDataView({})).toBe(false);
  });

  test('isArrayBuffer', () => {
    expect(guards.isArrayBuffer(new ArrayBuffer(8))).toBe(true);
    expect(guards.isArrayBuffer(new SharedArrayBuffer(8))).toBe(false);
    expect(guards.isArrayBuffer([])).toBe(false);
  });

  test('isSharedArrayBuffer', () => {
    if (typeof SharedArrayBuffer !== 'undefined') {
      expect(guards.isSharedArrayBuffer(new SharedArrayBuffer(8))).toBe(true);
    }
    expect(guards.isSharedArrayBuffer(new ArrayBuffer(8))).toBe(false);
    expect(guards.isSharedArrayBuffer([])).toBe(false);
  });

  test('isTypedArray', () => {
    expect(guards.isTypedArray(new Int8Array())).toBe(true);
    expect(guards.isTypedArray(new Uint8Array())).toBe(true);
    expect(guards.isTypedArray(new Float32Array())).toBe(true);
    expect(guards.isTypedArray(new DataView(new ArrayBuffer(8)))).toBe(false);
    expect(guards.isTypedArray([])).toBe(false);
  });

  test('typed array guards', () => {
    expect(guards.isInt8Array(new Int8Array())).toBe(true);
    expect(guards.isInt8Array(new Uint8Array())).toBe(false);

    expect(guards.isUint8Array(new Uint8Array())).toBe(true);
    expect(guards.isUint8Array(new Int8Array())).toBe(false);

    expect(guards.isUint8ClampedArray(new Uint8ClampedArray())).toBe(true);
    expect(guards.isUint8ClampedArray(new Uint8Array())).toBe(false);

    expect(guards.isInt16Array(new Int16Array())).toBe(true);
    expect(guards.isInt16Array(new Uint16Array())).toBe(false);

    expect(guards.isUint16Array(new Uint16Array())).toBe(true);
    expect(guards.isUint16Array(new Int16Array())).toBe(false);

    expect(guards.isInt32Array(new Int32Array())).toBe(true);
    expect(guards.isInt32Array(new Uint32Array())).toBe(false);

    expect(guards.isUint32Array(new Uint32Array())).toBe(true);
    expect(guards.isUint32Array(new Int32Array())).toBe(false);

    expect(guards.isFloat32Array(new Float32Array())).toBe(true);
    expect(guards.isFloat32Array(new Float64Array())).toBe(false);

    expect(guards.isFloat64Array(new Float64Array())).toBe(true);
    expect(guards.isFloat64Array(new Float32Array())).toBe(false);

    if (typeof BigInt64Array !== 'undefined') {
      expect(guards.isBigInt64Array(new BigInt64Array())).toBe(true);
      expect(guards.isBigInt64Array(new BigUint64Array())).toBe(false);
    }

    if (typeof BigUint64Array !== 'undefined') {
      expect(guards.isBigUint64Array(new BigUint64Array())).toBe(true);
      expect(guards.isBigUint64Array(new BigInt64Array())).toBe(false);
    }
  });
});