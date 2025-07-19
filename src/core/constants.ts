export const PRIMITIVE_TYPES = [
  'undefined',
  'null',
  'boolean',
  'number',
  'string',
  'symbol',
  'bigint',
] as const;

export const OBJECT_TYPES = [
  'object',
  'array',
  'function',
  'date',
  'regexp',
  'error',
] as const;

export const COLLECTION_TYPES = [
  'map',
  'set',
  'weakmap',
  'weakset',
] as const;

export const TYPED_ARRAY_TYPES = [
  'int8array',
  'uint8array',
  'uint8clampedarray',
  'int16array',
  'uint16array',
  'int32array',
  'uint32array',
  'float32array',
  'float64array',
  'bigint64array',
  'biguint64array',
] as const;

export const MODERN_TYPES = [
  'promise',
  'generatorfunction',
  'asyncfunction',
  'asyncgeneratorfunction',
  'proxy',
  'dataview',
  'arraybuffer',
  'sharedarraybuffer',
] as const;

export const NODE_TYPES = [
  'buffer',
  'stream',
  'eventemitter',
] as const;

export const DOM_TYPES = [
  'element',
  'node',
  'window',
  'document',
] as const;

export const SPECIAL_TYPES = [
  'arguments',
  'global',
] as const;

export const ALL_TYPES = [
  ...PRIMITIVE_TYPES,
  ...OBJECT_TYPES,
  ...COLLECTION_TYPES,
  ...TYPED_ARRAY_TYPES,
  ...MODERN_TYPES,
  ...NODE_TYPES,
  ...DOM_TYPES,
  ...SPECIAL_TYPES,
] as const;

export type PrimitiveType = typeof PRIMITIVE_TYPES[number];
export type ObjectType = typeof OBJECT_TYPES[number];
export type CollectionType = typeof COLLECTION_TYPES[number];
export type TypedArrayType = typeof TYPED_ARRAY_TYPES[number];
export type ModernType = typeof MODERN_TYPES[number];
export type NodeType = typeof NODE_TYPES[number];
export type DOMType = typeof DOM_TYPES[number];
export type SpecialType = typeof SPECIAL_TYPES[number];
export type TypeName = typeof ALL_TYPES[number];

export const TYPE_TAG_MAP: Record<string, TypeName> = {
  '[object Arguments]': 'arguments',
  '[object Array]': 'array',
  '[object ArrayBuffer]': 'arraybuffer',
  '[object AsyncFunction]': 'asyncfunction',
  '[object AsyncGeneratorFunction]': 'asyncgeneratorfunction',
  '[object BigInt]': 'bigint',
  '[object BigInt64Array]': 'bigint64array',
  '[object BigUint64Array]': 'biguint64array',
  '[object Boolean]': 'boolean',
  '[object DataView]': 'dataview',
  '[object Date]': 'date',
  '[object Error]': 'error',
  '[object Float32Array]': 'float32array',
  '[object Float64Array]': 'float64array',
  '[object Function]': 'function',
  '[object GeneratorFunction]': 'generatorfunction',
  '[object Int8Array]': 'int8array',
  '[object Int16Array]': 'int16array',
  '[object Int32Array]': 'int32array',
  '[object Map]': 'map',
  '[object Number]': 'number',
  '[object Object]': 'object',
  '[object Promise]': 'promise',
  '[object Proxy]': 'proxy',
  '[object RegExp]': 'regexp',
  '[object Set]': 'set',
  '[object SharedArrayBuffer]': 'sharedarraybuffer',
  '[object String]': 'string',
  '[object Symbol]': 'symbol',
  '[object Uint8Array]': 'uint8array',
  '[object Uint8ClampedArray]': 'uint8clampedarray',
  '[object Uint16Array]': 'uint16array',
  '[object Uint32Array]': 'uint32array',
  '[object WeakMap]': 'weakmap',
  '[object WeakSet]': 'weakset',
  '[object Window]': 'window',
  '[object HTMLDocument]': 'document',
  '[object Document]': 'document',
  '[object Null]': 'null',
  '[object Undefined]': 'undefined',
};