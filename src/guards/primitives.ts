export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

export function isNull(value: unknown): value is null {
  return value === null;
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol';
}

export function isBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint';
}

export function isPrimitive(value: unknown): value is undefined | null | boolean | number | string | symbol | bigint {
  return value === null || (typeof value !== 'object' && typeof value !== 'function');
}

export function isNullish(value: unknown): value is undefined | null {
  return value === null || value === undefined;
}

export function isFalsy(value: unknown): value is false | 0   | 0n | '' | null | undefined {
  return !value;
}

export function isTruthy<T>(value: T): value is Exclude<T, false | 0   | 0n | '' | null | undefined> {
  return !!value;
}

export function isInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value);
}

export function isSafeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value);
}

export function isFinite(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function isNaN(value: unknown): value is number {
  return typeof value === 'number' && Number.isNaN(value);
}

export function isInfinity(value: unknown): value is number {
  return value === Infinity || value === -Infinity;
}

export function isEmptyString(value: unknown): value is '' {
  return value === '';
}

export function isNumericString(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  if (value === '') return false;
  return !isNaN(Number(value)) && !isNaN(parseFloat(value));
}

export function isJsonString(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}