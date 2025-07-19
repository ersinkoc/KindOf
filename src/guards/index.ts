export * from './primitives';
export * from './objects';
export * from './collections';

import { kindOfCore } from '../core/kind-of';
import type { TypeMap, TypeName } from '../types';

export function isType<T extends TypeName>(value: unknown, type: T): value is TypeMap[T] {
  return kindOfCore(value) === type;
}

export function assertType<T extends TypeName>(value: unknown, type: T): asserts value is TypeMap[T] {
  if (kindOfCore(value) !== type) {
    throw new TypeError(`Expected type "${type}" but got "${kindOfCore(value)}"`);
  }
}

export function ensureType<T extends TypeName>(
  value: unknown,
  type: T,
  defaultValue: TypeMap[T]
): TypeMap[T] {
  return isType(value, type) ? value : defaultValue;
}