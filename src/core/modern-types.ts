import type { TypeName } from './constants';

const WeakMapPrototype = WeakMap.prototype;
const WeakSetPrototype = WeakSet.prototype;
const MapPrototype = Map.prototype;
const SetPrototype = Set.prototype;
const ArrayBufferPrototype = ArrayBuffer.prototype;
const DataViewPrototype = DataView.prototype;
const SharedArrayBufferPrototype = typeof SharedArrayBuffer !== 'undefined' ? SharedArrayBuffer.prototype : null;

export function checkModernType(value: unknown): TypeName | null {
  if (value === null || value === undefined) {
    return null;
  }

  try {
    if (value instanceof Promise || isThenable(value)) {
      return 'promise';
    }

    if (value instanceof Map || (value as any).__proto__ === MapPrototype) {
      return 'map';
    }

    if (value instanceof Set || (value as any).__proto__ === SetPrototype) {
      return 'set';
    }

    if (value instanceof WeakMap || (value as any).__proto__ === WeakMapPrototype) {
      return 'weakmap';
    }

    if (value instanceof WeakSet || (value as any).__proto__ === WeakSetPrototype) {
      return 'weakset';
    }

    if (value instanceof ArrayBuffer || (value as any).__proto__ === ArrayBufferPrototype) {
      return 'arraybuffer';
    }

    if (SharedArrayBufferPrototype && (value instanceof SharedArrayBuffer || (value as any).__proto__ === SharedArrayBufferPrototype)) {
      return 'sharedarraybuffer';
    }

    if (value instanceof DataView || (value as any).__proto__ === DataViewPrototype) {
      return 'dataview';
    }

    if (isProxy(value)) {
      return 'proxy';
    }
  } catch {
    // Cross-realm objects might throw
  }

  return null;
}

function isThenable(value: any): boolean {
  return value !== null &&
    (typeof value === 'object' || typeof value === 'function') &&
    typeof value.then === 'function';
}

function isProxy(value: any): boolean {
  // NOTE: There is no reliable way to detect Proxies in JavaScript
  // as they are designed to be transparent. This function uses heuristics
  // that may produce false positives/negatives.

  if (typeof value !== 'object' && typeof value !== 'function') {
    return false;
  }

  if (value === null) {
    return false;
  }

  try {
    // Try using Object.prototype.toString - may return '[object Proxy]' in some engines
    const tag = Object.prototype.toString.call(value);
    if (tag === '[object Proxy]') {
      return true;
    }

    // Check for explicit toStringTag set to 'Proxy'
    if (value[Symbol.toStringTag] === 'Proxy') {
      return true;
    }
  } catch {
    // Ignore errors
  }

  // Cannot reliably detect proxies - return false
  return false;
}

export function getTypedArrayType(value: any): TypeName | null {
  // Check if ArrayBuffer.isView exists (for very old environments)
  if (typeof ArrayBuffer === 'undefined' || !ArrayBuffer.isView) {
    return null;
  }

  if (!ArrayBuffer.isView(value)) {
    return null;
  }

  const proto = Object.getPrototypeOf(value);
  const ctorName = proto?.constructor?.name;

  switch (ctorName) {
    case 'Int8Array': return 'int8array';
    case 'Uint8Array': return 'uint8array';
    case 'Uint8ClampedArray': return 'uint8clampedarray';
    case 'Int16Array': return 'int16array';
    case 'Uint16Array': return 'uint16array';
    case 'Int32Array': return 'int32array';
    case 'Uint32Array': return 'uint32array';
    case 'Float32Array': return 'float32array';
    case 'Float64Array': return 'float64array';
    case 'BigInt64Array': return 'bigint64array';
    case 'BigUint64Array': return 'biguint64array';
    default: return null;
  }
}