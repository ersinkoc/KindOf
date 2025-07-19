export function isObject(value: unknown): value is object {
  return value !== null && typeof value === 'object';
}

export function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value);
}

export function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === 'function';
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

export function isRegExp(value: unknown): value is RegExp {
  return value instanceof RegExp;
}

export function isError(value: unknown): value is Error {
  return value instanceof Error ||
    (value !== null &&
      typeof value === 'object' &&
      'name' in value &&
      'message' in value &&
      'stack' in value);
}

export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return value instanceof Promise ||
    (value !== null &&
      typeof value === 'object' &&
      'then' in value &&
      typeof (value as { then?: unknown }).then === 'function');
}

export function isArguments(value: unknown): value is IArguments {
  return Object.prototype.toString.call(value) === '[object Arguments]';
}

export function isBuffer(value: unknown): value is Buffer {
  return typeof Buffer !== 'undefined' &&
    value !== null &&
    typeof value === 'object' &&
    'isBuffer' in Buffer &&
    (Buffer as typeof Buffer & { isBuffer: (obj: unknown) => boolean }).isBuffer(value);
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!isObject(value)) return false;
  
  const proto = Object.getPrototypeOf(value);
  if (proto === null) return true;
  
  const Ctor = Object.prototype.hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor === 'function' &&
    Ctor instanceof Ctor &&
    Function.prototype.toString.call(Ctor) === Function.prototype.toString.call(Object);
}

export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' || Array.isArray(value)) return value.length === 0;
  if (value instanceof Map || value instanceof Set) return value.size === 0;
  if (isPlainObject(value)) return Object.keys(value).length === 0;
  return false;
}

export function isEmptyArray(value: unknown): value is [] {
  return Array.isArray(value) && value.length === 0;
}

export function isEmptyObject(value: unknown): value is Record<string, never> {
  return isPlainObject(value) && Object.keys(value).length === 0;
}

export function hasLength(value: unknown): value is { length: number } {
  return value !== null &&
    value !== undefined &&
    (typeof value === 'object' || typeof value === 'string') &&
    (typeof value === 'string' || 'length' in value) &&
    typeof (value as any).length === 'number';
}

export function hasSize(value: unknown): value is { size: number } {
  return value !== null &&
    value !== undefined &&
    typeof value === 'object' &&
    'size' in value &&
    typeof (value as any).size === 'number';
}

export function isArrayLike<T = unknown>(value: unknown): value is ArrayLike<T> {
  return value !== null &&
    value !== undefined &&
    typeof value !== 'function' &&
    hasLength(value) &&
    (value as any).length >= 0 &&
    (value as any).length <= Number.MAX_SAFE_INTEGER;
}

export function isIterable<T = unknown>(value: unknown): value is Iterable<T> {
  return value !== null &&
    value !== undefined &&
    typeof (value as any)[Symbol.iterator] === 'function';
}

export function isAsyncIterable<T = unknown>(value: unknown): value is AsyncIterable<T> {
  return value !== null &&
    value !== undefined &&
    typeof (value as any)[Symbol.asyncIterator] === 'function';
}

export function isConstructor(value: unknown): value is new (...args: any[]) => any {
  if (typeof value !== 'function') return false;
  
  try {
    const testObj = {};
    const BoundTest = value.bind(testObj);
    new BoundTest();
    return true;
  } catch {
    return false;
  }
}

export function isThenable<T = unknown>(value: unknown): value is PromiseLike<T> {
  return value !== null &&
    (typeof value === 'object' || typeof value === 'function') &&
    'then' in value &&
    typeof (value as any).then === 'function';
}

export function isObservable(value: unknown): value is { subscribe: (...args: any[]) => any } {
  return value !== null &&
    typeof value === 'object' &&
    'subscribe' in value &&
    typeof (value as any).subscribe === 'function';
}

export function isGenerator(value: unknown): value is Generator {
  return value !== null &&
    typeof value === 'object' &&
    typeof (value as any).next === 'function' &&
    typeof (value as any).throw === 'function' &&
    typeof (value as any).return === 'function';
}

export function isAsyncGenerator(value: unknown): value is AsyncGenerator {
  return value !== null &&
    typeof value === 'object' &&
    typeof (value as any).next === 'function' &&
    typeof (value as any).throw === 'function' &&
    typeof (value as any).return === 'function' &&
    isAsyncIterable(value);
}

export function isGeneratorFunction(value: unknown): value is GeneratorFunction {
  if (typeof value !== 'function') return false;
  const name = value.constructor?.name;
  return name === 'GeneratorFunction' || /^function\s*\*/.test(value.toString());
}

export function isAsyncFunction(value: unknown): value is (...args: any[]) => Promise<unknown> {
  if (typeof value !== 'function') return false;
  const name = value.constructor?.name;
  return name === 'AsyncFunction' || /^async\s/.test(value.toString());
}

export function isAsyncGeneratorFunction(value: unknown): value is (...args: any[]) => AsyncGenerator {
  if (typeof value !== 'function') return false;
  const name = value.constructor?.name;
  return name === 'AsyncGeneratorFunction' || /^async\s*function\s*\*/.test(value.toString());
}

export function isProxy(value: unknown): value is object {
  try {
    if (typeof value !== 'object' && typeof value !== 'function') return false;
    if (value === null) return false;
    
    // Attempt to use proxy-specific behavior
    const testHandler: ProxyHandler<object> = {
      get() {
        throw new Error('proxy trap');
      }
    };
    
    const proxy = new Proxy({}, testHandler);
    const isProxyLike = Object.prototype.toString.call(value) === Object.prototype.toString.call(proxy);
    
    return isProxyLike;
  } catch {
    return false;
  }
}

// Error type guards
export function isTypeError(value: unknown): value is TypeError {
  return value instanceof TypeError;
}

export function isRangeError(value: unknown): value is RangeError {
  return value instanceof RangeError;
}

export function isSyntaxError(value: unknown): value is SyntaxError {
  return value instanceof SyntaxError;
}

export function isReferenceError(value: unknown): value is ReferenceError {
  return value instanceof ReferenceError;
}

export function isEvalError(value: unknown): value is EvalError {
  return value instanceof EvalError;
}

export function isURIError(value: unknown): value is URIError {
  return value instanceof URIError;
}

// Node.js specific guards
export function isStream(value: unknown): value is NodeJS.ReadableStream | NodeJS.WritableStream {
  return value !== null &&
    typeof value === 'object' &&
    typeof (value as any).pipe === 'function';
}

export function isEventEmitter(value: unknown): value is NodeJS.EventEmitter {
  return value !== null &&
    typeof value === 'object' &&
    typeof (value as any).on === 'function' &&
    typeof (value as any).emit === 'function' &&
    typeof (value as any).removeListener === 'function';
}

// DOM specific guards
export function isElement(value: unknown): value is Element {
  return typeof Element !== 'undefined' && value instanceof Element;
}

export function isNode(value: unknown): value is Node {
  return typeof Node !== 'undefined' && value instanceof Node;
}

export function isWindow(value: unknown): value is Window {
  return typeof Window !== 'undefined' && value instanceof Window;
}

export function isDocument(value: unknown): value is Document {
  return typeof Document !== 'undefined' && value instanceof Document;
}

export function isGlobal(value: unknown): value is typeof globalThis {
  if (typeof globalThis !== 'undefined' && value === globalThis) return true;
  if (typeof global !== 'undefined' && value === global) return true;
  if (typeof window !== 'undefined' && value === window) return true;
  if (typeof self !== 'undefined' && value === self) return true;
  return false;
}