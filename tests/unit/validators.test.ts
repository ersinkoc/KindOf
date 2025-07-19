import { validateSchema, createValidator } from '../../src/validators';
import type { SchemaType } from '../../src/validators';

describe('Schema Validation', () => {
  describe('validateSchema', () => {
    test('validates primitive types', () => {
      expect(validateSchema('hello', 'string')).toEqual({
        valid: true,
        errors: []
      });

      expect(validateSchema(42, 'number')).toEqual({
        valid: true,
        errors: []
      });

      expect(validateSchema(true, 'boolean')).toEqual({
        valid: true,
        errors: []
      });
    });

    test('rejects incorrect primitive types', () => {
      const result = validateSchema('hello', 'number');
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toMatchObject({
        path: 'root',
        expected: 'number',
        actual: 'string',
        message: 'Expected type "number" but got "string"'
      });
    });

    test('validates arrays', () => {
      const schema: SchemaType = ['string'];
      const result = validateSchema(['hello', 'world'], schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('rejects non-arrays when array schema is expected', () => {
      // Test lines 45-51: when value is not array but schema expects array
      const schema: SchemaType = ['string'];
      
      // Test with various non-array values
      const nonArrayValues = [
        { value: 'not an array', expected: 'array', actual: 'string' },
        { value: 42, expected: 'array', actual: 'number' },
        { value: {}, expected: 'array', actual: 'object' },
        { value: null, expected: 'array', actual: 'null' },
        { value: undefined, expected: 'array', actual: 'undefined' },
        { value: true, expected: 'array', actual: 'boolean' }
      ];
      
      nonArrayValues.forEach(({ value, expected, actual }) => {
        const result = validateSchema(value, schema);
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0]).toMatchObject({
          path: 'root',
          expected: expected,
          actual: actual,
          message: `Expected array but got "${actual}"`
        });
      });
    });

    test('validates array items', () => {
      const schema: SchemaType = ['number'];
      const result = validateSchema(['hello', 42], schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toMatchObject({
        path: '[0]',
        expected: 'number',
        actual: 'string'
      });
    });

    test('validates objects', () => {
      const schema: SchemaType = {
        name: 'string',
        age: 'number',
        active: 'boolean'
      };
      const result = validateSchema({
        name: 'John',
        age: 30,
        active: true
      }, schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('reports missing required properties', () => {
      const schema: SchemaType = {
        name: 'string',
        age: 'number'
      };
      const result = validateSchema({ name: 'John' }, schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toMatchObject({
        path: 'age',
        expected: 'number',
        actual: 'undefined',
        message: 'Missing required property "age"'
      });
    });

    test('reports unexpected properties in strict mode', () => {
      const schema: SchemaType = {
        name: 'string'
      };
      const result = validateSchema({
        name: 'John',
        age: 30
      }, schema, { strict: true });
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toMatchObject({
        path: 'age',
        expected: 'undefined',
        actual: 'number',
        message: 'Unexpected property "age"'
      });
    });

    test('allows unexpected properties in non-strict mode', () => {
      const schema: SchemaType = {
        name: 'string'
      };
      const result = validateSchema({
        name: 'John',
        age: 30
      }, schema, { strict: false });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('supports partial validation', () => {
      const schema: SchemaType = {
        name: 'string',
        age: 'number'
      };
      const result = validateSchema({ name: 'John' }, schema, { partial: true });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('validates nested objects', () => {
      const schema: SchemaType = {
        user: {
          name: 'string',
          age: 'number'
        }
      };
      const result = validateSchema({
        user: {
          name: 'John',
          age: 30
        }
      }, schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('reports nested validation errors', () => {
      const schema: SchemaType = {
        user: {
          name: 'string',
          age: 'number'
        }
      };
      const result = validateSchema({
        user: {
          name: 'John',
          age: 'not a number'
        }
      }, schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toMatchObject({
        path: 'user.age',
        expected: 'number',
        actual: 'string'
      });
    });

    test('validates array of objects', () => {
      const schema: SchemaType = [{
        name: 'string',
        age: 'number'
      }];
      const result = validateSchema([
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 }
      ], schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('reports complex nested errors', () => {
      const schema: SchemaType = {
        users: [{
          name: 'string',
          age: 'number'
        }]
      };
      const result = validateSchema({
        users: [
          { name: 'John', age: 30 },
          { name: 'Jane', age: 'not a number' }
        ]
      }, schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toMatchObject({
        path: 'users[1].age',
        expected: 'number',
        actual: 'string'
      });
    });
  });

  describe('createValidator', () => {
    test('creates reusable validator', () => {
      const validator = createValidator({
        name: 'string',
        age: 'number'
      });

      const result1 = validator({ name: 'John', age: 30 });
      expect(result1.valid).toBe(true);

      const result2 = validator({ name: 'Jane', age: 'not a number' });
      expect(result2.valid).toBe(false);
    });

    test('validator respects options', () => {
      const validator = createValidator({
        name: 'string',
        age: 'number'
      }, { strict: false });

      const result = validator({ name: 'John', age: 30, extra: 'property' });
      expect(result.valid).toBe(true);
    });
  });
});