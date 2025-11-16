import type { TypeName } from './constants';
export type { TypeName } from './constants';
import { getNativeType } from './native-types';
import { checkModernType, getTypedArrayType } from './modern-types';


export interface DetailedType {
  type: string;
  constructor: string | null;
  prototype: string | null;
  isPrimitive: boolean;
  isBuiltIn: boolean;
  isNullish: boolean;
  isIterable: boolean;
  isAsync: boolean;
  customType: string | null;
  metadata?: Record<string, any> | undefined;
}

let typeCache: WeakMap<object, string> | null = null;
let cacheEnabled = true;

export function kindOfCore(value: unknown): string {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';

  const primitiveType = getPrimitiveType(value);
  if (primitiveType) return primitiveType;

  if (typeof value === 'object' && cacheEnabled && typeCache) {
    const cached = typeCache.get(value);
    if (cached) return cached;
  }

  let type = getNativeType(value);
  
  if (!type || type === 'object') {
    const modernType = checkModernType(value);
    if (modernType) {
      type = modernType;
    } else {
      const arrayType = getTypedArrayType(value);
      if (arrayType) {
        type = arrayType;
      } else {
        type = getCustomType(value) || type || ('object' as TypeName);
      }
    }
  }

  if (typeof value === 'object' && cacheEnabled && type) {
    if (!typeCache) typeCache = new WeakMap();
    typeCache.set(value, type);
  }

  return type || 'object';
}

export function fastKindOf(value: unknown): string {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';

  const primitiveType = typeof value;
  if (primitiveType !== 'object' && primitiveType !== 'function') {
    return primitiveType;
  }

  if (Array.isArray(value)) return 'array';
  if (value instanceof Date) return 'date';
  if (value instanceof RegExp) return 'regexp';
  if (value instanceof Error) return 'error';

  return 'object';
}

export function kindOfMany(values: unknown[]): string[] {
  const results: string[] = new Array(values.length);
  for (let i = 0; i < values.length; i++) {
    results[i] = kindOfCore(values[i]);
  }
  return results;
}

export function getDetailedType(value: unknown): DetailedType {
  const type = kindOfCore(value);
  const isPrimitive = value === null || (typeof value !== 'object' && typeof value !== 'function');
  
  let constructor: string | null = null;
  let prototype: string | null = null;
  let isIterable = false;
  let isAsync = false;
  let customType: string | null = null;
  const metadata: Record<string, any> = {};

  if (!isPrimitive && value !== null) {
    const obj = value as any;
    
    if (obj.constructor) {
      constructor = obj.constructor.name || null;
    }
    
    const proto = Object.getPrototypeOf(obj);
    if (proto && proto.constructor) {
      prototype = proto.constructor.name || null;
    }
    
    isIterable = typeof obj[Symbol.iterator] === 'function';
    isAsync = typeof obj[Symbol.asyncIterator] === 'function' ||
              type === 'promise' ||
              type === 'asyncfunction' ||
              type === 'asyncgeneratorfunction';

    // Safely access Symbol.toStringTag - getter might throw
    try {
      if (obj[Symbol.toStringTag]) {
        customType = String(obj[Symbol.toStringTag]);
      }
    } catch {
      // Ignore errors from toStringTag getter
    }
    
    if (type === 'array') {
      metadata['length'] = (obj).length;
    } else if (type === 'map' || type === 'set') {
      metadata['size'] = (obj).size;
    } else if (type === 'arraybuffer' || type === 'sharedarraybuffer') {
      metadata['byteLength'] = (obj).byteLength;
    } else if (type.includes('array') && (obj).buffer) {
      metadata['byteLength'] = (obj).byteLength;
      metadata['length'] = (obj).length;
    }
  }

  return {
    type,
    constructor,
    prototype,
    isPrimitive,
    isBuiltIn: isBuiltInType(type),
    isNullish: value === null || value === undefined,
    isIterable,
    isAsync,
    customType,
    metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
  };
}

function getPrimitiveType(value: unknown): string | null {
  const type = typeof value;
  switch (type) {
    case 'boolean':
    case 'number':
    case 'string':
    case 'symbol':
    case 'bigint':
      return type;
    default:
      return null;
  }
}

function getCustomType(value: any): TypeName | null {
  try {
    const toStringTag = value[Symbol.toStringTag];
    if (typeof toStringTag === 'string') {
      return toStringTag.toLowerCase() as TypeName;
    }

    if (value.constructor && value.constructor !== Object) {
      const ctorName = value.constructor.name;
      if (ctorName && ctorName !== 'Object') {
        return ctorName.toLowerCase() as TypeName;
      }
    }
  } catch {
    // Ignore errors from accessing properties
  }

  return null;
}

function isBuiltInType(type: string): boolean {
  const builtInTypes = new Set([
    'undefined', 'null', 'boolean', 'number', 'string', 'symbol', 'bigint',
    'object', 'array', 'function', 'date', 'regexp', 'error',
    'map', 'set', 'weakmap', 'weakset',
    'int8array', 'uint8array', 'uint8clampedarray', 'int16array', 'uint16array',
    'int32array', 'uint32array', 'float32array', 'float64array',
    'bigint64array', 'biguint64array',
    'promise', 'generatorfunction', 'asyncfunction', 'asyncgeneratorfunction',
    'proxy', 'dataview', 'arraybuffer', 'sharedarraybuffer',
    'arguments'
  ]);
  
  return builtInTypes.has(type);
}

export function enableCache(): void {
  cacheEnabled = true;
  if (!typeCache) typeCache = new WeakMap();
}

export function disableCache(): void {
  cacheEnabled = false;
  typeCache = null;
}

export function clearCache(): void {
  if (typeCache) {
    typeCache = new WeakMap();
  }
}