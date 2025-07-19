export interface TypeMap {
  'undefined': undefined;
  'null': null;
  'boolean': boolean;
  'number': number;
  'string': string;
  'symbol': symbol;
  'bigint': bigint;
  'object': object;
  'array': any[];
  'function': Function;
  'date': Date;
  'regexp': RegExp;
  'error': Error;
  'promise': Promise<any>;
  'map': Map<any, any>;
  'set': Set<any>;
  'weakmap': WeakMap<any, any>;
  'weakset': WeakSet<any>;
  'int8array': Int8Array;
  'uint8array': Uint8Array;
  'uint8clampedarray': Uint8ClampedArray;
  'int16array': Int16Array;
  'uint16array': Uint16Array;
  'int32array': Int32Array;
  'uint32array': Uint32Array;
  'float32array': Float32Array;
  'float64array': Float64Array;
  'bigint64array': BigInt64Array;
  'biguint64array': BigUint64Array;
  'generatorfunction': GeneratorFunction;
  'asyncfunction': AsyncFunction;
  'asyncgeneratorfunction': AsyncGeneratorFunction;
  'proxy': any;
  'dataview': DataView;
  'arraybuffer': ArrayBuffer;
  'sharedarraybuffer': SharedArrayBuffer;
  'arguments': IArguments;
  'buffer': Buffer;
  'stream': NodeJS.ReadableStream | NodeJS.WritableStream;
  'eventemitter': NodeJS.EventEmitter;
  'element': Element;
  'node': Node;
  'window': Window;
  'document': Document;
  'global': typeof globalThis;
}

export type TypeName = keyof TypeMap;

export type TypeString<T> = 
  T extends undefined ? 'undefined' :
  T extends null ? 'null' :
  T extends boolean ? 'boolean' :
  T extends number ? 'number' :
  T extends string ? 'string' :
  T extends symbol ? 'symbol' :
  T extends bigint ? 'bigint' :
  T extends any[] ? 'array' :
  T extends Function ? 'function' :
  T extends Date ? 'date' :
  T extends RegExp ? 'regexp' :
  T extends Error ? 'error' :
  T extends Promise<any> ? 'promise' :
  T extends Map<any, any> ? 'map' :
  T extends Set<any> ? 'set' :
  T extends WeakMap<any, any> ? 'weakmap' :
  T extends WeakSet<any> ? 'weakset' :
  T extends Int8Array ? 'int8array' :
  T extends Uint8Array ? 'uint8array' :
  T extends Uint8ClampedArray ? 'uint8clampedarray' :
  T extends Int16Array ? 'int16array' :
  T extends Uint16Array ? 'uint16array' :
  T extends Int32Array ? 'int32array' :
  T extends Uint32Array ? 'uint32array' :
  T extends Float32Array ? 'float32array' :
  T extends Float64Array ? 'float64array' :
  T extends BigInt64Array ? 'bigint64array' :
  T extends BigUint64Array ? 'biguint64array' :
  T extends DataView ? 'dataview' :
  T extends ArrayBuffer ? 'arraybuffer' :
  T extends SharedArrayBuffer ? 'sharedarraybuffer' :
  T extends object ? 'object' :
  string;


// Helper types for advanced type checking
export type Primitive = undefined | null | boolean | number | string | symbol | bigint;
export type Nullish = undefined | null;
export type Falsy = false | 0   | 0n | '' | null | undefined;
export type TypedArray = 
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

// Function type helpers
export interface GeneratorFunction {
  new(...args: any[]): Generator;
  (...args: any[]): Generator;
}

export interface AsyncFunction {
  new(...args: any[]): Promise<any>;
  (...args: any[]): Promise<any>;
}

export interface AsyncGeneratorFunction {
  new(...args: any[]): AsyncGenerator;
  (...args: any[]): AsyncGenerator;
}

// Node.js type helpers (will be undefined in browser)
declare global {
  namespace NodeJS {
    interface ReadableStream {}
    interface WritableStream {}
    interface EventEmitter {}
  }
  interface Buffer {}
}