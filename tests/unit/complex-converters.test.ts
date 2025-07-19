import { 
  toArray, 
  toObject, 
  toMap, 
  toSet, 
  toDate, 
  toRegExp, 
  toError, 
  toFunction, 
  toPromise, 
  toBuffer,
  toTypedArray
} from '../../src/converters';

describe('Complex Type Converters', () => {
  describe('toArray', () => {
    test('converts various types to array', () => {
      expect(toArray([1, 2, 3])).toEqual([1, 2, 3]);
      expect(toArray('hello')).toEqual(['h', 'e', 'l', 'l', 'o']);
      expect(toArray(new Set([1, 2, 3]))).toEqual([1, 2, 3]);
      expect(toArray(new Map([['a', 1], ['b', 2]]))).toEqual([['a', 1], ['b', 2]]);
      expect(toArray(null)).toEqual([]);
      expect(toArray(undefined)).toEqual([]);
      expect(toArray(42)).toEqual([42]);
    });

    test('handles arguments object', () => {
      const args = (function(..._args: any[]) { return arguments; })(1, 2, 3);
      expect(toArray(args)).toEqual([1, 2, 3]);
    });

    test('handles array-like objects', () => {
      const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
      expect(toArray(arrayLike)).toEqual(['a', 'b', 'c']);
    });
  });

  describe('toObject', () => {
    test('converts various types to object', () => {
      expect(toObject({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
      expect(toObject([1, 2, 3])).toEqual({ 0: 1, 1: 2, 2: 3 });
      expect(toObject('hello')).toEqual({ 0: 'h', 1: 'e', 2: 'l', 3: 'l', 4: 'o' });
      expect(toObject(null)).toEqual({});
      expect(toObject(undefined)).toEqual({});
      expect(toObject(42)).toEqual({ value: 42 });
    });

    test('converts Map to object', () => {
      const map = new Map([['a', 1], ['b', 2]]);
      expect(toObject(map)).toEqual({ a: 1, b: 2 });
    });

    test('converts Set to object', () => {
      const set = new Set([1, 2, 3]);
      expect(toObject(set)).toEqual({ 0: 1, 1: 2, 2: 3 });
    });
  });

  describe('toMap', () => {
    test('converts various types to Map', () => {
      const map = new Map([['a', 1], ['b', 2]]);
      expect(toMap(map)).toEqual(map);
      
      const obj = { a: 1, b: 2 };
      const resultMap = toMap(obj);
      expect(resultMap?.get('a')).toBe(1);
      expect(resultMap?.get('b')).toBe(2);
    });

    test('converts array to Map', () => {
      const arr = ['a', 'b', 'c'];
      const resultMap = toMap(arr);
      expect(resultMap?.get(0)).toBe('a');
      expect(resultMap?.get(1)).toBe('b');
      expect(resultMap?.get(2)).toBe('c');
    });

    test('converts Set to Map', () => {
      const set = new Set(['a', 'b', 'c']);
      const resultMap = toMap(set);
      expect(resultMap?.get(0)).toBe('a');
      expect(resultMap?.get(1)).toBe('b');
      expect(resultMap?.get(2)).toBe('c');
    });

    test('returns null for invalid conversions', () => {
      expect(toMap(42)).toBeNull();
      expect(toMap('hello')).toBeNull();
    });
  });

  describe('toSet', () => {
    test('converts various types to Set', () => {
      const set = new Set([1, 2, 3]);
      expect(toSet(set)).toEqual(set);
      
      expect(toSet([1, 2, 3])).toEqual(new Set([1, 2, 3]));
      expect(toSet('hello')).toEqual(new Set(['h', 'e', 'l', 'l', 'o']));
      expect(toSet({ a: 1, b: 2 })).toEqual(new Set([1, 2]));
    });

    test('converts Map to Set', () => {
      const map = new Map([['a', 1], ['b', 2]]);
      expect(toSet(map)).toEqual(new Set([1, 2]));
    });

    test('handles null and undefined', () => {
      expect(toSet(null)).toEqual(new Set());
      expect(toSet(undefined)).toEqual(new Set());
      expect(toSet(42)).toEqual(new Set([42]));
    });
  });

  describe('toDate', () => {
    test('converts various types to Date', () => {
      const date = new Date('2020-01-01');
      expect(toDate(date)).toEqual(date);
      
      const dateFromString = toDate('2020-01-01');
      expect(dateFromString).toBeInstanceOf(Date);
      expect(dateFromString?.getFullYear()).toBe(2020);
      
      const dateFromNumber = toDate(1577836800000);
      expect(dateFromNumber).toBeInstanceOf(Date);
    });

    test('returns null for invalid dates', () => {
      expect(toDate('invalid')).toBeNull();
      expect(toDate({})).toBeNull();
      expect(toDate([])).toBeNull();
    });
  });

  describe('toRegExp', () => {
    test('converts various types to RegExp', () => {
      const regex = /test/gi;
      expect(toRegExp(regex)).toEqual(regex);
      
      const regexFromString = toRegExp('test');
      expect(regexFromString).toBeInstanceOf(RegExp);
      expect(regexFromString?.source).toBe('test');
    });

    test('returns null for invalid regex', () => {
      expect(toRegExp('[')).toBeNull();
      expect(toRegExp(42)).toBeNull();
      expect(toRegExp({})).toBeNull();
    });
  });

  describe('toError', () => {
    test('converts various types to Error', () => {
      const error = new Error('test');
      expect(toError(error)).toEqual(error);
      
      const errorFromString = toError('test message');
      expect(errorFromString).toBeInstanceOf(Error);
      expect(errorFromString?.message).toBe('test message');
      
      const errorFromObject = toError({ message: 'object error' });
      expect(errorFromObject).toBeInstanceOf(Error);
      expect(errorFromObject?.message).toBe('object error');
    });

    test('converts any value to Error', () => {
      const errorFromNumber = toError(42);
      expect(errorFromNumber).toBeInstanceOf(Error);
      expect(errorFromNumber?.message).toBe('42');
    });
  });

  describe('toFunction', () => {
    test('returns functions as-is', () => {
      const fn = () => {};
      expect(toFunction(fn)).toBe(fn);
      
      const asyncFn = async () => {};
      expect(toFunction(asyncFn)).toBe(asyncFn);
      
      const genFn = function*() {};
      expect(toFunction(genFn)).toBe(genFn);
    });

    test('converts string to function', () => {
      const fn = toFunction('42');
      expect(fn).toBeInstanceOf(Function);
      expect(fn?.()).toBe(42);
    });

    test('returns null for invalid string', () => {
      expect(toFunction('invalid syntax [')).toBeNull();
      expect(toFunction(42)).toBeNull();
      expect(toFunction({})).toBeNull();
    });
  });

  describe('toPromise', () => {
    test('returns promises as-is', () => {
      const promise = Promise.resolve(42);
      expect(toPromise(promise)).toBe(promise);
    });

    test('converts function to promise', async () => {
      const fn = () => 42;
      const promise = toPromise(fn);
      expect(promise).toBeInstanceOf(Promise);
      expect(await promise).toBe(42);
    });

    test('handles throwing functions', async () => {
      const fn = () => { throw new Error('test'); };
      const promise = toPromise(fn);
      expect(promise).toBeInstanceOf(Promise);
      
      try {
        await promise;
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    test('wraps other values in resolved promise', async () => {
      const promise = toPromise(42);
      expect(promise).toBeInstanceOf(Promise);
      expect(await promise).toBe(42);
    });
  });

  describe('toBuffer', () => {
    test('converts various types to Buffer', () => {
      if (typeof Buffer === 'undefined') {
        expect(toBuffer('hello')).toBeNull();
        return;
      }
      
      const buffer = Buffer.from('hello');
      expect(toBuffer(buffer)).toEqual(buffer);
      
      const bufferFromString = toBuffer('hello');
      expect(bufferFromString).toBeInstanceOf(Buffer);
      expect(bufferFromString?.toString()).toBe('hello');
      
      const bufferFromArray = toBuffer([72, 101, 108, 108, 111]);
      expect(bufferFromArray).toBeInstanceOf(Buffer);
      expect(bufferFromArray?.toString()).toBe('Hello');
    });

    test('returns null for invalid conversions', () => {
      if (typeof Buffer === 'undefined') {
        expect(toBuffer({})).toBeNull();
        return;
      }
      
      expect(toBuffer({})).toBeNull();
      expect(toBuffer(true)).toBeNull();
    });
  });

  describe('toTypedArray', () => {
    test('converts various types to typed arrays', () => {
      const buffer = new ArrayBuffer(16);
      const int32Array = toTypedArray(buffer, Int32Array);
      expect(int32Array).toBeInstanceOf(Int32Array);
      
      const float32Array = toTypedArray([1.1, 2.2, 3.3], Float32Array);
      expect(float32Array).toBeInstanceOf(Float32Array);
      expect(float32Array?.[0]).toBeCloseTo(1.1);
    });

    test('returns null for invalid conversions', () => {
      expect(toTypedArray('hello', Int32Array)).toBeNull();
      expect(toTypedArray({}, Float32Array)).toBeNull();
    });
  });
});