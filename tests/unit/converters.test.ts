import { toString, toNumber, toBoolean, toBigInt, toSymbol, coerceType } from '../../src/converters';

describe('Type Converters', () => {
  describe('toString', () => {
    test('converts primitives to string', () => {
      expect(toString('hello')).toBe('hello');
      expect(toString(42)).toBe('42');
      expect(toString(true)).toBe('true');
      expect(toString(false)).toBe('false');
      expect(toString(null)).toBe('null');
      expect(toString(undefined)).toBe('undefined');
      expect(toString(123n)).toBe('123');
    });

    test('converts symbols to string', () => {
      const sym = Symbol('test');
      expect(toString(sym)).toBe('Symbol(test)');
    });

    test('converts objects to string', () => {
      expect(toString([1, 2, 3])).toBe('[1,2,3]');
      expect(toString({ a: 1, b: 2 })).toBe('{"a":1,"b":2}');
      expect(toString(new Date('2020-01-01'))).toBe('2020-01-01T00:00:00.000Z');
      expect(toString(/test/g)).toBe('/test/g');
    });

    test('handles circular references', () => {
      const obj: any = { a: 1 };
      obj.b = obj;
      const result = toString(obj);
      expect(result).toBe('[object Object]');
    });
  });

  describe('toNumber', () => {
    test('converts valid values to number', () => {
      expect(toNumber(42)).toBe(42);
      expect(toNumber('42')).toBe(42);
      expect(toNumber('3.14')).toBe(3.14);
      expect(toNumber(true)).toBe(1);
      expect(toNumber(false)).toBe(0);
      expect(toNumber(null)).toBe(0);
      expect(toNumber(123n)).toBe(123);
    });

    test('converts dates to timestamp', () => {
      const date = new Date('2020-01-01');
      expect(toNumber(date)).toBe(date.getTime());
    });

    test('returns null for invalid conversions', () => {
      expect(toNumber('hello')).toBeNull();
      expect(toNumber(undefined)).toBeNull();
      expect(toNumber({})).toBeNull();
      expect(toNumber([])).toBeNull();
      expect(toNumber(Symbol())).toBeNull();
    });

    test('handles BigInt overflow', () => {
      const bigNum = BigInt(Number.MAX_SAFE_INTEGER) + 1n;
      expect(toNumber(bigNum)).toBeNull();
    });
  });

  describe('toBoolean', () => {
    test('converts truthy values to true', () => {
      expect(toBoolean(true)).toBe(true);
      expect(toBoolean(1)).toBe(true);
      expect(toBoolean('hello')).toBe(true);
      expect(toBoolean('true')).toBe(true);
      expect(toBoolean('yes')).toBe(true);
      expect(toBoolean([1, 2, 3])).toBe(true);
      expect(toBoolean({ a: 1 })).toBe(true);
      expect(toBoolean(Symbol())).toBe(true);
    });

    test('converts falsy values to false', () => {
      expect(toBoolean(false)).toBe(false);
      expect(toBoolean(0)).toBe(false);
      expect(toBoolean('')).toBe(false);
      expect(toBoolean('false')).toBe(false);
      expect(toBoolean('0')).toBe(false);
      expect(toBoolean('no')).toBe(false);
      expect(toBoolean('null')).toBe(false);
      expect(toBoolean('undefined')).toBe(false);
      expect(toBoolean(null)).toBe(false);
      expect(toBoolean(undefined)).toBe(false);
      expect(toBoolean([])).toBe(false);
      expect(toBoolean({})).toBe(false);
      expect(toBoolean(NaN)).toBe(false);
    });
  });

  describe('toBigInt', () => {
    test('converts valid values to BigInt', () => {
      expect(toBigInt(123n)).toBe(123n);
      expect(toBigInt(42)).toBe(42n);
      expect(toBigInt('123')).toBe(123n);
      expect(toBigInt(true)).toBe(1n);
      expect(toBigInt(false)).toBe(0n);
    });

    test('returns null for invalid conversions', () => {
      expect(toBigInt(3.14)).toBeNull();
      expect(toBigInt('hello')).toBeNull();
      expect(toBigInt(undefined)).toBeNull();
      expect(toBigInt(null)).toBeNull();
      expect(toBigInt({})).toBeNull();
    });
  });

  describe('toSymbol', () => {
    test('converts values to Symbol', () => {
      const sym = Symbol('test');
      expect(toSymbol(sym)).toBe(sym);
      expect(toSymbol('hello').toString()).toBe('Symbol(hello)');
      expect(toSymbol(42).toString()).toBe('Symbol(42)');
    });
  });

  describe('coerceType', () => {
    test('returns value if already correct type', () => {
      expect(coerceType(42, 'number')).toBe(42);
      expect(coerceType('hello', 'string')).toBe('hello');
      expect(coerceType(true, 'boolean')).toBe(true);
    });

    test('coerces to string', () => {
      expect(coerceType(42, 'string')).toBe('42');
      expect(coerceType(true, 'string')).toBe('true');
      expect(coerceType(null, 'string')).toBe('null');
    });

    test('coerces to number', () => {
      expect(coerceType('42', 'number')).toBe(42);
      expect(coerceType(true, 'number')).toBe(1);
      expect(coerceType('hello', 'number')).toBeNull();
    });

    test('coerces to boolean', () => {
      expect(coerceType(1, 'boolean')).toBe(true);
      expect(coerceType(0, 'boolean')).toBe(false);
      expect(coerceType('hello', 'boolean')).toBe(true);
    });

    test('coerces to undefined and null', () => {
      expect(coerceType(42, 'undefined')).toBeUndefined();
      expect(coerceType(42, 'null')).toBeNull();
    });

    test('coerces to array', () => {
      const obj = { 0: 'a', 1: 'b', length: 2 };
      const result = coerceType(obj, 'array');
      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(['a', 'b']);
    });

    test('coerces to object', () => {
      const arr = ['a', 'b'];
      const result = coerceType(arr, 'object');
      expect(result).toEqual({ 0: 'a', 1: 'b' });
    });

    test('coerces to date', () => {
      const result = coerceType('2020-01-01', 'date');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2020);
    });

    test('returns null for invalid coercions', () => {
      expect(coerceType('hello', 'number')).toBeNull();
      expect(coerceType(42, 'date')).toBeNull();
      expect(coerceType('invalid', 'date')).toBeNull();
    });
  });
});