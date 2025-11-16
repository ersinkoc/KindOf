import type { TypeName } from './constants';
import { TYPE_TAG_MAP } from './constants';

const toString = Object.prototype.toString;
const toStringTag = Symbol.toStringTag;

export function getNativeType(value: unknown): TypeName | null {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';

  const primitiveType = typeof value;
  
  switch (primitiveType) {
    case 'boolean': return 'boolean';
    case 'number': return 'number';
    case 'string': return 'string';
    case 'symbol': return 'symbol';
    case 'bigint': return 'bigint';
    case 'function': return getFunctionType(value as (...args: any[]) => any);
    case 'object': return getObjectType(value as object);
    default: return null;
  }
}

function getFunctionType(fn: (...args: any[]) => any): TypeName {
  // Try to get function string representation, but handle cases where toString() may throw
  let fnString: string;
  try {
    fnString = fn.toString();
  } catch {
    // If toString() throws (e.g., for some native functions or proxies),
    // fall back to constructor name check
    fnString = '';
  }

  if (fnString) {
    if (/^class\s/.test(fnString)) {
      return 'function';
    }

    if (/^async\s*function\s*\*/.test(fnString) || /^async\s*\*/.test(fnString)) {
      return 'asyncgeneratorfunction';
    }

    if (/^async\s/.test(fnString)) {
      return 'asyncfunction';
    }

    if (/^function\s*\*/.test(fnString) || /^\*/.test(fnString)) {
      return 'generatorfunction';
    }
  }

  // Fallback to constructor name detection
  const ctorName = fn.constructor?.name;
  if (ctorName === 'AsyncFunction') return 'asyncfunction';
  if (ctorName === 'GeneratorFunction') return 'generatorfunction';
  if (ctorName === 'AsyncGeneratorFunction') return 'asyncgeneratorfunction';

  return 'function';
}

function getObjectType(obj: object): TypeName {
  let tag: string;
  try {
    tag = toString.call(obj);
  } catch (e) {
    tag = '[object Object]'; // Fallback for objects with problematic toStringTag
  }
  const mappedType = TYPE_TAG_MAP[tag];
  
  if (mappedType) {
    return mappedType;
  }
  
  // Check for special types first, before processing [object Object]
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer && Buffer.isBuffer(obj)) {
    return 'buffer';
  }
  
  // Check for arguments object without accessing callee (strict mode safe)
  // In strict mode, accessing arguments.callee throws TypeError
  // Safe to check property existence with 'in', but not to access the value
  if (typeof obj === 'object' && 'callee' in obj) {
    return 'arguments';
  }
  
  if (isStream(obj)) {
    return 'stream';
  }
  
  if (isEventEmitter(obj)) {
    return 'eventemitter';
  }
  
  if (tag === '[object Object]') {
    try {
      const customTag = (obj as any)[toStringTag];
      if (typeof customTag === 'string') {
        return customTag.toLowerCase() as TypeName;
      }
    } catch (e) {
      // Ignore error and fallback to other checks
    }
    
    const ctor = obj.constructor;
    if (ctor && ctor !== Object) {
      const ctorName = ctor.name;
      if (ctorName && ctorName !== 'Object') {
        return ctorName.toLowerCase() as TypeName;
      }
    }
    // Don't return 'object' here - continue to check for other types
  }
  
  if (isDOMElement(obj)) {
    return 'element';
  }
  
  if (isDOMNode(obj)) {
    return 'node';
  }
  
  if (isGlobal(obj)) {
    return 'global';
  }
  
  return 'object';
}

function isStream(obj: any): boolean {
  return obj !== null &&
    typeof obj === 'object' &&
    typeof obj.pipe === 'function';
}

function isEventEmitter(obj: any): boolean {
  return obj !== null &&
    typeof obj === 'object' &&
    typeof obj.on === 'function' &&
    typeof obj.emit === 'function' &&
    typeof obj.removeListener === 'function';
}

function isDOMElement(obj: any): boolean {
  if (typeof HTMLElement === 'undefined') return false;
  return obj instanceof HTMLElement;
}

function isDOMNode(obj: any): boolean {
  if (typeof Node === 'undefined') return false;
  return obj instanceof Node;
}

function isGlobal(obj: any): boolean {
  if (typeof globalThis !== 'undefined' && obj === globalThis) return true;
  if (typeof global !== 'undefined' && obj === global) return true;
  if (typeof window !== 'undefined' && obj === window) return true;
  if (typeof self !== 'undefined' && obj === self) return true;
  return false;
}