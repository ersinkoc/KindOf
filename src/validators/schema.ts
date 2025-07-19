import { kindOfCore } from '../core/kind-of';
import type { ValidationResult, ValidationError, ValidationOptions, SchemaType } from '../types/schema';

export function validateSchema(
  value: unknown,
  schema: SchemaType,
  options: ValidationOptions = {}
): ValidationResult {
  const errors: ValidationError[] = [];
  const context = {
    path: options.path || '',
    strict: options.strict ?? true,
    coerce: options.coerce ?? false,
    partial: options.partial ?? false,
  };

  validateValue(value, schema, context, errors);

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateValue(
  value: unknown,
  schema: SchemaType,
  context: { path: string; strict: boolean; coerce: boolean; partial: boolean },
  errors: ValidationError[]
): void {
  if (typeof schema === 'string') {
    // Simple type check
    const actualType = kindOfCore(value);
    if (actualType !== schema) {
      errors.push({
        path: context.path || 'root',
        expected: schema,
        actual: actualType,
        message: `Expected type "${schema}" but got "${actualType}"`,
      });
    }
  } else if (Array.isArray(schema)) {
    // Array schema
    if (!Array.isArray(value)) {
      errors.push({
        path: context.path || 'root',
        expected: 'array',
        actual: kindOfCore(value),
        message: `Expected array but got "${kindOfCore(value)}"`,
      });
      return;
    }

    const itemSchema = schema[0];
    if (itemSchema) {
      value.forEach((item, index) => {
        validateValue(
          item,
          itemSchema,
          { ...context, path: `${context.path}[${index}]` },
          errors
        );
      });
    }
  } else if (schema && typeof schema === 'object') {
    // Object schema
    if (typeof value !== 'object' || value === null) {
      errors.push({
        path: context.path || 'root',
        expected: 'object',
        actual: kindOfCore(value),
        message: `Expected object but got "${kindOfCore(value)}"`,
      });
      return;
    }

    const obj = value as Record<string, unknown>;
    const schemaObj = schema;

    // Check required properties
    if (!context.partial) {
      for (const key of Object.keys(schemaObj)) {
        if (!(key in obj)) {
          errors.push({
            path: context.path ? `${context.path}.${key}` : key,
            expected: typeof schemaObj[key] === 'string' ? schemaObj[key] : kindOfCore(schemaObj[key]),
            actual: 'undefined',
            message: `Missing required property "${key}"`,
          });
        }
      }
    }

    // Validate present properties
    for (const key of Object.keys(obj)) {
      if (key in schemaObj) {
        const schemaValue = schemaObj[key];
        if (schemaValue !== undefined) {
          validateValue(
            obj[key],
            schemaValue,
            { ...context, path: context.path ? `${context.path}.${key}` : key },
            errors
          );
        }
      } else if (context.strict) {
        errors.push({
          path: context.path ? `${context.path}.${key}` : key,
          expected: 'undefined',
          actual: kindOfCore(obj[key]),
          message: `Unexpected property "${key}"`,
        });
      }
    }
  }
}

export function createValidator(
  schema: SchemaType,
  options?: ValidationOptions
): (value: unknown) => ValidationResult {
  return (value: unknown) => validateSchema(value, schema, options);
}