export type SchemaType = string | SchemaObject | SchemaArray;

export interface SchemaObject {
  [key: string]: SchemaType;
}

export interface SchemaArray extends Array<SchemaType> {}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings?: ValidationWarning[];
}

export interface ValidationError {
  path: string;
  expected: string;
  actual: string;
  message: string;
}

export interface ValidationWarning {
  path: string;
  message: string;
}

export interface ValidationOptions {
  strict?: boolean;
  coerce?: boolean;
  partial?: boolean;
  path?: string;
}