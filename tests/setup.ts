// Test setup file

// Global test utilities
(global as any).testValues = {
  // Primitives
  undefined: undefined,
  null: null,
  boolean: { true: true, false: false },
  number: { 
    positive: 42, 
    negative: -42, 
    zero: 0, 
    float: 3.14,
    infinity: Infinity,
    negInfinity: -Infinity,
    nan: NaN
  },
  string: { 
    empty: '', 
    normal: 'hello', 
    numeric: '123',
    whitespace: '   '
  },
  symbol: { 
    basic: Symbol('test'),
    global: Symbol.for('global')
  },
  bigint: { 
    positive: 123n, 
    negative: -123n, 
    zero: 0n
  },

  // Objects
  object: {
    empty: {},
    plain: { a: 1, b: 2 },
    nested: { a: { b: { c: 3 } } },
    nullProto: Object.create(null),
  },
  array: {
    empty: [],
    numbers: [1, 2, 3],
    mixed: [1, 'two', true, null],
    nested: [[1, 2], [3, 4]],
  },
  function: {
    arrow: () => {},
    normal: function() {},
    named: function testFunc() {},
    async: async function() {},
    generator: function*() {},
    asyncGenerator: async function*() {},
    class: class TestClass {},
  },
  date: {
    now: new Date(),
    past: new Date('2020-01-01'),
    invalid: new Date('invalid'),
  },
  regexp: {
    simple: /test/,
    flags: /test/gi,
    complex: /^[a-z]+@[a-z]+\.[a-z]+$/i,
  },
  error: {
    basic: new Error('test'),
    type: new TypeError('type error'),
    range: new RangeError('range error'),
    syntax: new SyntaxError('syntax error'),
  },

  // Collections
  map: {
    empty: new Map(),
    filled: new Map([['key1', 'value1'], ['key2', 'value2']]),
  },
  set: {
    empty: new Set(),
    filled: new Set([1, 2, 3]),
  },
  weakmap: {
    empty: new WeakMap(),
    filled: (() => {
      const wm = new WeakMap();
      const obj = {};
      wm.set(obj, 'value');
      return wm;
    })(),
  },
  weakset: {
    empty: new WeakSet(),
    filled: (() => {
      const ws = new WeakSet();
      ws.add({});
      return ws;
    })(),
  },

  // Typed Arrays
  typedArrays: {
    int8: new Int8Array([1, 2, 3]),
    uint8: new Uint8Array([1, 2, 3]),
    uint8Clamped: new Uint8ClampedArray([1, 2, 3]),
    int16: new Int16Array([1, 2, 3]),
    uint16: new Uint16Array([1, 2, 3]),
    int32: new Int32Array([1, 2, 3]),
    uint32: new Uint32Array([1, 2, 3]),
    float32: new Float32Array([1.1, 2.2, 3.3]),
    float64: new Float64Array([1.1, 2.2, 3.3]),
    bigInt64: new BigInt64Array([1n, 2n, 3n]),
    bigUint64: new BigUint64Array([1n, 2n, 3n]),
  },

  // Buffers
  buffers: {
    arrayBuffer: new ArrayBuffer(8),
    dataView: new DataView(new ArrayBuffer(8)),
    sharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined' ? new SharedArrayBuffer(8) : null,
  },

  // Special
  promise: {
    resolved: Promise.resolve(42),
    rejected: Promise.reject(new Error('rejected')).catch(() => {}),
    pending: new Promise(() => {}),
  },
  arguments: (function(..._args: any[]) { return arguments; })(1, 2, 3),
};