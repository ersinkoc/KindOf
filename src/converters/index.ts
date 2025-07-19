export { toString, toNumber, toBoolean, toBigInt, toSymbol } from './to-primitive';
export * from './to-complex';

import { kindOfCore } from '../core/kind-of';
import type { TypeMap, TypeName } from '../types';
import { toString, toNumber, toBoolean, toBigInt, toSymbol } from './to-primitive';

export function coerceType<T extends TypeName>(value: unknown, targetType: T): TypeMap[T] | null {
  const currentType = kindOfCore(value);
  
  if (currentType === targetType) {
    return value as TypeMap[T];
  }

  switch (targetType) {
    case 'string':
      return toString(value) as TypeMap[T];
    case 'number':
      return toNumber(value) as TypeMap[T];
    case 'boolean':
      return toBoolean(value) as TypeMap[T];
    case 'bigint':
      return toBigInt(value) as TypeMap[T];
    case 'symbol':
      return toSymbol(value) as TypeMap[T];
    case 'undefined':
      return undefined as TypeMap[T];
    case 'null':
      return null as TypeMap[T];
    case 'array':
      if (currentType === 'object' && value !== null) {
        const arr = Array.from(value as any);
        return arr.length > 0 ? arr as TypeMap[T] : null;
      }
      return null;
    case 'object':
      if (currentType === 'array') {
        const obj: any = {};
        (value as any[]).forEach((item, index) => {
          obj[index] = item;
        });
        return obj as TypeMap[T];
      }
      return null;
    case 'date':
      if (currentType === 'string') {
        const date = new Date(value as string);
        return isNaN(date.getTime()) ? null : date as TypeMap[T];
      }
      return null;
    default:
      return null;
  }
}