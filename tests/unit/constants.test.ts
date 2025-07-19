import { 
  PRIMITIVE_TYPES, 
  OBJECT_TYPES, 
  COLLECTION_TYPES, 
  TYPED_ARRAY_TYPES,
  MODERN_TYPES,
  NODE_TYPES,
  DOM_TYPES,
  SPECIAL_TYPES,
  ALL_TYPES,
  TYPE_TAG_MAP
} from '../../src/core/constants';

describe('Constants', () => {
  test('PRIMITIVE_TYPES contains all primitive types', () => {
    expect(PRIMITIVE_TYPES).toContain('undefined');
    expect(PRIMITIVE_TYPES).toContain('null');
    expect(PRIMITIVE_TYPES).toContain('boolean');
    expect(PRIMITIVE_TYPES).toContain('number');
    expect(PRIMITIVE_TYPES).toContain('string');
    expect(PRIMITIVE_TYPES).toContain('symbol');
    expect(PRIMITIVE_TYPES).toContain('bigint');
    expect(PRIMITIVE_TYPES).toHaveLength(7);
  });

  test('OBJECT_TYPES contains all object types', () => {
    expect(OBJECT_TYPES).toContain('object');
    expect(OBJECT_TYPES).toContain('array');
    expect(OBJECT_TYPES).toContain('function');
    expect(OBJECT_TYPES).toContain('date');
    expect(OBJECT_TYPES).toContain('regexp');
    expect(OBJECT_TYPES).toContain('error');
    expect(OBJECT_TYPES).toHaveLength(6);
  });

  test('COLLECTION_TYPES contains all collection types', () => {
    expect(COLLECTION_TYPES).toContain('map');
    expect(COLLECTION_TYPES).toContain('set');
    expect(COLLECTION_TYPES).toContain('weakmap');
    expect(COLLECTION_TYPES).toContain('weakset');
    expect(COLLECTION_TYPES).toHaveLength(4);
  });

  test('TYPED_ARRAY_TYPES contains all typed array types', () => {
    expect(TYPED_ARRAY_TYPES).toContain('int8array');
    expect(TYPED_ARRAY_TYPES).toContain('uint8array');
    expect(TYPED_ARRAY_TYPES).toContain('uint8clampedarray');
    expect(TYPED_ARRAY_TYPES).toContain('int16array');
    expect(TYPED_ARRAY_TYPES).toContain('uint16array');
    expect(TYPED_ARRAY_TYPES).toContain('int32array');
    expect(TYPED_ARRAY_TYPES).toContain('uint32array');
    expect(TYPED_ARRAY_TYPES).toContain('float32array');
    expect(TYPED_ARRAY_TYPES).toContain('float64array');
    expect(TYPED_ARRAY_TYPES).toContain('bigint64array');
    expect(TYPED_ARRAY_TYPES).toContain('biguint64array');
    expect(TYPED_ARRAY_TYPES).toHaveLength(11);
  });

  test('MODERN_TYPES contains all modern types', () => {
    expect(MODERN_TYPES).toContain('promise');
    expect(MODERN_TYPES).toContain('generatorfunction');
    expect(MODERN_TYPES).toContain('asyncfunction');
    expect(MODERN_TYPES).toContain('asyncgeneratorfunction');
    expect(MODERN_TYPES).toContain('proxy');
    expect(MODERN_TYPES).toContain('dataview');
    expect(MODERN_TYPES).toContain('arraybuffer');
    expect(MODERN_TYPES).toContain('sharedarraybuffer');
    expect(MODERN_TYPES).toHaveLength(8);
  });

  test('NODE_TYPES contains all Node.js types', () => {
    expect(NODE_TYPES).toContain('buffer');
    expect(NODE_TYPES).toContain('stream');
    expect(NODE_TYPES).toContain('eventemitter');
    expect(NODE_TYPES).toHaveLength(3);
  });

  test('DOM_TYPES contains all DOM types', () => {
    expect(DOM_TYPES).toContain('element');
    expect(DOM_TYPES).toContain('node');
    expect(DOM_TYPES).toContain('window');
    expect(DOM_TYPES).toContain('document');
    expect(DOM_TYPES).toHaveLength(4);
  });

  test('SPECIAL_TYPES contains all special types', () => {
    expect(SPECIAL_TYPES).toContain('arguments');
    expect(SPECIAL_TYPES).toContain('global');
    expect(SPECIAL_TYPES).toHaveLength(2);
  });

  test('ALL_TYPES contains all type categories', () => {
    const expectedLength = PRIMITIVE_TYPES.length + 
                          OBJECT_TYPES.length + 
                          COLLECTION_TYPES.length + 
                          TYPED_ARRAY_TYPES.length + 
                          MODERN_TYPES.length + 
                          NODE_TYPES.length + 
                          DOM_TYPES.length + 
                          SPECIAL_TYPES.length;
    
    expect(ALL_TYPES).toHaveLength(expectedLength);
    
    // Check that all categories are included
    PRIMITIVE_TYPES.forEach(type => expect(ALL_TYPES).toContain(type));
    OBJECT_TYPES.forEach(type => expect(ALL_TYPES).toContain(type));
    COLLECTION_TYPES.forEach(type => expect(ALL_TYPES).toContain(type));
    TYPED_ARRAY_TYPES.forEach(type => expect(ALL_TYPES).toContain(type));
    MODERN_TYPES.forEach(type => expect(ALL_TYPES).toContain(type));
    NODE_TYPES.forEach(type => expect(ALL_TYPES).toContain(type));
    DOM_TYPES.forEach(type => expect(ALL_TYPES).toContain(type));
    SPECIAL_TYPES.forEach(type => expect(ALL_TYPES).toContain(type));
  });

  test('TYPE_TAG_MAP contains correct mappings', () => {
    expect(TYPE_TAG_MAP['[object Array]']).toBe('array');
    expect(TYPE_TAG_MAP['[object Object]']).toBe('object');
    expect(TYPE_TAG_MAP['[object Date]']).toBe('date');
    expect(TYPE_TAG_MAP['[object RegExp]']).toBe('regexp');
    expect(TYPE_TAG_MAP['[object Error]']).toBe('error');
    expect(TYPE_TAG_MAP['[object Map]']).toBe('map');
    expect(TYPE_TAG_MAP['[object Set]']).toBe('set');
    expect(TYPE_TAG_MAP['[object WeakMap]']).toBe('weakmap');
    expect(TYPE_TAG_MAP['[object WeakSet]']).toBe('weakset');
    expect(TYPE_TAG_MAP['[object Promise]']).toBe('promise');
    expect(TYPE_TAG_MAP['[object Arguments]']).toBe('arguments');
    expect(TYPE_TAG_MAP['[object Null]']).toBe('null');
    expect(TYPE_TAG_MAP['[object Undefined]']).toBe('undefined');
  });

  test('TYPE_TAG_MAP contains typed array mappings', () => {
    expect(TYPE_TAG_MAP['[object Int8Array]']).toBe('int8array');
    expect(TYPE_TAG_MAP['[object Uint8Array]']).toBe('uint8array');
    expect(TYPE_TAG_MAP['[object Uint8ClampedArray]']).toBe('uint8clampedarray');
    expect(TYPE_TAG_MAP['[object Int16Array]']).toBe('int16array');
    expect(TYPE_TAG_MAP['[object Uint16Array]']).toBe('uint16array');
    expect(TYPE_TAG_MAP['[object Int32Array]']).toBe('int32array');
    expect(TYPE_TAG_MAP['[object Uint32Array]']).toBe('uint32array');
    expect(TYPE_TAG_MAP['[object Float32Array]']).toBe('float32array');
    expect(TYPE_TAG_MAP['[object Float64Array]']).toBe('float64array');
    expect(TYPE_TAG_MAP['[object BigInt64Array]']).toBe('bigint64array');
    expect(TYPE_TAG_MAP['[object BigUint64Array]']).toBe('biguint64array');
  });

  test('TYPE_TAG_MAP contains modern type mappings', () => {
    expect(TYPE_TAG_MAP['[object ArrayBuffer]']).toBe('arraybuffer');
    expect(TYPE_TAG_MAP['[object SharedArrayBuffer]']).toBe('sharedarraybuffer');
    expect(TYPE_TAG_MAP['[object DataView]']).toBe('dataview');
    expect(TYPE_TAG_MAP['[object AsyncFunction]']).toBe('asyncfunction');
    expect(TYPE_TAG_MAP['[object GeneratorFunction]']).toBe('generatorfunction');
    expect(TYPE_TAG_MAP['[object AsyncGeneratorFunction]']).toBe('asyncgeneratorfunction');
    expect(TYPE_TAG_MAP['[object Proxy]']).toBe('proxy');
  });

  test('TYPE_TAG_MAP contains function type mappings', () => {
    expect(TYPE_TAG_MAP['[object Function]']).toBe('function');
    expect(TYPE_TAG_MAP['[object AsyncFunction]']).toBe('asyncfunction');
    expect(TYPE_TAG_MAP['[object GeneratorFunction]']).toBe('generatorfunction');
    expect(TYPE_TAG_MAP['[object AsyncGeneratorFunction]']).toBe('asyncgeneratorfunction');
  });

  test('TYPE_TAG_MAP contains DOM type mappings', () => {
    expect(TYPE_TAG_MAP['[object Window]']).toBe('window');
    expect(TYPE_TAG_MAP['[object HTMLDocument]']).toBe('document');
    expect(TYPE_TAG_MAP['[object Document]']).toBe('document');
  });

  test('no duplicate types in ALL_TYPES', () => {
    const uniqueTypes = new Set(ALL_TYPES);
    expect(uniqueTypes.size).toBe(ALL_TYPES.length);
  });

  test('all TYPE_TAG_MAP values are valid types', () => {
    const validTypes = new Set(ALL_TYPES);
    for (const type of Object.values(TYPE_TAG_MAP)) {
      expect(validTypes.has(type)).toBe(true);
    }
  });
});