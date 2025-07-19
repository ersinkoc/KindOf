export function isMap<K = any, V = any>(value: unknown): value is Map<K, V> {
  return value instanceof Map;
}

export function isSet<T = any>(value: unknown): value is Set<T> {
  return value instanceof Set;
}

export function isWeakMap<K extends object = object, V = any>(value: unknown): value is WeakMap<K, V> {
  return value instanceof WeakMap;
}

export function isWeakSet<T extends object = object>(value: unknown): value is WeakSet<T> {
  return value instanceof WeakSet;
}

export function isDataView(value: unknown): value is DataView {
  return value instanceof DataView;
}

export function isArrayBuffer(value: unknown): value is ArrayBuffer {
  return value instanceof ArrayBuffer;
}

export function isSharedArrayBuffer(value: unknown): value is SharedArrayBuffer {
  return typeof SharedArrayBuffer !== 'undefined' && value instanceof SharedArrayBuffer;
}

export function isTypedArray(value: unknown): value is TypedArray {
  return ArrayBuffer.isView(value) && !(value instanceof DataView);
}

export function isInt8Array(value: unknown): value is Int8Array {
  return value instanceof Int8Array;
}

export function isUint8Array(value: unknown): value is Uint8Array {
  return value instanceof Uint8Array;
}

export function isUint8ClampedArray(value: unknown): value is Uint8ClampedArray {
  return value instanceof Uint8ClampedArray;
}

export function isInt16Array(value: unknown): value is Int16Array {
  return value instanceof Int16Array;
}

export function isUint16Array(value: unknown): value is Uint16Array {
  return value instanceof Uint16Array;
}

export function isInt32Array(value: unknown): value is Int32Array {
  return value instanceof Int32Array;
}

export function isUint32Array(value: unknown): value is Uint32Array {
  return value instanceof Uint32Array;
}

export function isFloat32Array(value: unknown): value is Float32Array {
  return value instanceof Float32Array;
}

export function isFloat64Array(value: unknown): value is Float64Array {
  return value instanceof Float64Array;
}

export function isBigInt64Array(value: unknown): value is BigInt64Array {
  return typeof BigInt64Array !== 'undefined' && value instanceof BigInt64Array;
}

export function isBigUint64Array(value: unknown): value is BigUint64Array {
  return typeof BigUint64Array !== 'undefined' && value instanceof BigUint64Array;
}

// Helper type definition
type TypedArray = 
  | Int8Array 
  | Uint8Array 
  | Uint8ClampedArray 
  | Int16Array 
  | Uint16Array 
  | Int32Array 
  | Uint32Array 
  | Float32Array 
  | Float64Array 
  | BigInt64Array 
  | BigUint64Array;