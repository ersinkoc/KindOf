import { kindOfCore, fastKindOf, kindOfMany, getDetailedType, enableCache, disableCache, clearCache } from './core/kind-of';
import type { TypeString } from './types';
import { isType, assertType, ensureType } from './guards';

// Main function with overloads
export function kindOf(value: unknown): string;
export function kindOf<T>(value: T): TypeString<T>;
export function kindOf(value: unknown): string {
  return kindOfCore(value);
}

// Re-export all functions
export { 
  fastKindOf, 
  kindOfMany, 
  getDetailedType,
  isType,
  assertType,
  ensureType,
  enableCache,
  disableCache,
  clearCache
};

// Re-export all guards
export * from './guards';

// Re-export validators
export * from './validators';

// Re-export converters
export * from './converters';

// Re-export utils
export * from './utils';

// Re-export plugins
export * from './plugins';

// Re-export types
export type { DetailedType } from './core/kind-of';
export type * from './types';
export type * from './types/schema';

// Default export
export default kindOf;

// Named exports for convenience
export const typeOf = kindOf;
export const getType = kindOf;