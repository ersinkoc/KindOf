import type { TypeMap, TypeName, Primitive, Nullish, TypedArray } from './index';

// Type guard signatures
export type TypeGuard<T extends TypeName> = (value: unknown) => value is TypeMap[T];

// Individual type guards
export function isUndefined(value: unknown): value is undefined;
export function isNull(value: unknown): value is null;
export function isBoolean(value: unknown): value is boolean;
export function isNumber(value: unknown): value is number;
export function isString(value: unknown): value is string;
export function isSymbol(value: unknown): value is symbol;
export function isBigInt(value: unknown): value is bigint;
export function isObject(value: unknown): value is object;
export function isArray<T = any>(value: unknown): value is T[];
export function isFunction(value: unknown): value is (...args: any[]) => any;
export function isDate(value: unknown): value is Date;
export function isRegExp(value: unknown): value is RegExp;
export function isError(value: unknown): value is Error;
export function isPromise<T = any>(value: unknown): value is Promise<T>;
export function isMap<K = any, V = any>(value: unknown): value is Map<K, V>;
export function isSet<T = any>(value: unknown): value is Set<T>;
export function isWeakMap<K extends object = object, V = any>(value: unknown): value is WeakMap<K, V>;
export function isWeakSet<T extends object = object>(value: unknown): value is WeakSet<T>;

// Typed array guards
export function isInt8Array(value: unknown): value is Int8Array;
export function isUint8Array(value: unknown): value is Uint8Array;
export function isUint8ClampedArray(value: unknown): value is Uint8ClampedArray;
export function isInt16Array(value: unknown): value is Int16Array;
export function isUint16Array(value: unknown): value is Uint16Array;
export function isInt32Array(value: unknown): value is Int32Array;
export function isUint32Array(value: unknown): value is Uint32Array;
export function isFloat32Array(value: unknown): value is Float32Array;
export function isFloat64Array(value: unknown): value is Float64Array;
export function isBigInt64Array(value: unknown): value is BigInt64Array;
export function isBigUint64Array(value: unknown): value is BigUint64Array;

// Modern type guards
export function isGeneratorFunction(value: unknown): value is GeneratorFunction;
export function isAsyncFunction(value: unknown): value is (...args: any[]) => Promise<any>;
export function isAsyncGeneratorFunction(value: unknown): value is (...args: any[]) => AsyncGenerator;
export function isProxy(value: unknown): value is any;
export function isDataView(value: unknown): value is DataView;
export function isArrayBuffer(value: unknown): value is ArrayBuffer;
export function isSharedArrayBuffer(value: unknown): value is SharedArrayBuffer;

// Special type guards
export function isArguments(value: unknown): value is IArguments;
export function isBuffer(value: unknown): value is Buffer;
export function isStream(value: unknown): value is NodeJS.ReadableStream | NodeJS.WritableStream;
export function isEventEmitter(value: unknown): value is NodeJS.EventEmitter;
export function isElement(value: unknown): value is Element;
export function isNode(value: unknown): value is Node;
export function isWindow(value: unknown): value is Window;
export function isDocument(value: unknown): value is Document;
export function isGlobal(value: unknown): value is typeof globalThis;

// Composite guards
export function isPrimitive(value: unknown): value is Primitive;
export function isNullish(value: unknown): value is Nullish;
export function isIterable<T = any>(value: unknown): value is Iterable<T>;
export function isAsyncIterable<T = any>(value: unknown): value is AsyncIterable<T>;
export function isTypedArray(value: unknown): value is TypedArray;
export function isArrayLike<T = any>(value: unknown): value is ArrayLike<T>;
export function isPlainObject(value: unknown): value is Record<string, any>;
export function isEmpty(value: unknown): boolean;
export function isFalsy(value: unknown): value is false | 0   | 0n | '' | null | undefined;
export function isTruthy<T>(value: T): value is Exclude<T, false | 0   | 0n | '' | null | undefined>;

// Numeric guards
export function isInteger(value: unknown): value is number;
export function isSafeInteger(value: unknown): value is number;
export function isFinite(value: unknown): value is number;
export function isNaN(value: unknown): value is number;
export function isInfinity(value: unknown): value is number;

// String guards
export function isEmptyString(value: unknown): value is '';
export function isNumericString(value: unknown): value is string;
export function isJsonString(value: unknown): value is string;

// Collection guards
export function isEmptyArray(value: unknown): value is [];
export function isEmptyObject(value: unknown): value is Record<string, never>;
export function hasLength(value: unknown): value is { length: number };
export function hasSize(value: unknown): value is { size: number };

// Error type guards
export function isTypeError(value: unknown): value is TypeError;
export function isRangeError(value: unknown): value is RangeError;
export function isSyntaxError(value: unknown): value is SyntaxError;
export function isReferenceError(value: unknown): value is ReferenceError;
export function isEvalError(value: unknown): value is EvalError;
export function isURIError(value: unknown): value is URIError;

// Advanced guards
export function isConstructor(value: unknown): value is new (...args: any[]) => any;
export function isThenable(value: unknown): value is PromiseLike<unknown>;
export function isObservable(value: unknown): value is { subscribe: (...args: any[]) => any };
export function isGenerator(value: unknown): value is Generator;
export function isAsyncGenerator(value: unknown): value is AsyncGenerator;