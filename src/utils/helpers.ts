import { kindOfCore } from '../core/kind-of';

export function isValidType(type: string): boolean {
  const validTypes = new Set([
    'undefined', 'null', 'boolean', 'number', 'string', 'symbol', 'bigint',
    'object', 'array', 'function', 'date', 'regexp', 'error',
    'map', 'set', 'weakmap', 'weakset',
    'int8array', 'uint8array', 'uint8clampedarray', 'int16array', 'uint16array',
    'int32array', 'uint32array', 'float32array', 'float64array',
    'bigint64array', 'biguint64array',
    'promise', 'generatorfunction', 'asyncfunction', 'asyncgeneratorfunction',
    'proxy', 'dataview', 'arraybuffer', 'sharedarraybuffer',
    'arguments', 'buffer', 'stream', 'eventemitter',
    'element', 'node', 'window', 'document', 'global'
  ]);
  
  return validTypes.has(type);
}

export function getTypeCategory(type: string): string {
  if (['undefined', 'null', 'boolean', 'number', 'string', 'symbol', 'bigint'].includes(type)) {
    return 'primitive';
  }
  
  if (['object', 'array', 'function', 'date', 'regexp', 'error'].includes(type)) {
    return 'object';
  }
  
  if (['map', 'set', 'weakmap', 'weakset'].includes(type)) {
    return 'collection';
  }
  
  if (type.includes('array') && type !== 'array') {
    return 'typedarray';
  }
  
  if (['promise', 'generatorfunction', 'asyncfunction', 'asyncgeneratorfunction'].includes(type)) {
    return 'modern';
  }
  
  if (['buffer', 'stream', 'eventemitter'].includes(type)) {
    return 'node';
  }
  
  if (['element', 'node', 'window', 'document'].includes(type)) {
    return 'dom';
  }
  
  return 'special';
}

export function compareTypes(a: unknown, b: unknown): boolean {
  return kindOfCore(a) === kindOfCore(b);
}

export function isTypeOfAny(value: unknown, types: string[]): boolean {
  const type = kindOfCore(value);
  return types.includes(type);
}

export function isTypeOfAll(values: unknown[], expectedType: string): boolean {
  return values.every(value => kindOfCore(value) === expectedType);
}

export function groupByType(values: unknown[]): Map<string, unknown[]> {
  const groups = new Map<string, unknown[]>();
  
  for (const value of values) {
    const type = kindOfCore(value);
    if (!groups.has(type)) {
      groups.set(type, []);
    }
    const group = groups.get(type);
    if (group) {
      group.push(value);
    }
  }
  
  return groups;
}

export function getTypeStats(values: unknown[]): Record<string, number> {
  const stats: Record<string, number> = {};
  
  for (const value of values) {
    const type = kindOfCore(value);
    stats[type] = (stats[type] || 0) + 1;
  }
  
  return stats;
}

export function filterByType<T>(values: unknown[], type: string): T[] {
  return values.filter(value => kindOfCore(value) === type) as T[];
}

export function findByType(values: unknown[], type: string): unknown {
  return values.find(value => kindOfCore(value) === type);
}

export function someOfType(values: unknown[], type: string): boolean {
  return values.some(value => kindOfCore(value) === type);
}

export function everyOfType(values: unknown[], type: string): boolean {
  return values.every(value => kindOfCore(value) === type);
}

export function noneOfType(values: unknown[], type: string): boolean {
  return !values.some(value => kindOfCore(value) === type);
}

export function countByType(values: unknown[], type: string): number {
  return values.filter(value => kindOfCore(value) === type).length;
}

export function getUniqueTypes(values: unknown[]): string[] {
  const types = new Set<string>();
  for (const value of values) {
    types.add(kindOfCore(value));
  }
  return Array.from(types);
}

export function createTypeMap(values: unknown[]): Map<string, unknown[]> {
  return groupByType(values);
}

export function getMostCommonType(values: unknown[]): string | null {
  if (values.length === 0) return null;
  
  const stats = getTypeStats(values);
  let maxCount = 0;
  let mostCommon: string | null = null;
  
  for (const [type, count] of Object.entries(stats)) {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = type;
    }
  }
  
  return mostCommon;
}

export function getLeastCommonType(values: unknown[]): string | null {
  if (values.length === 0) return null;
  
  const stats = getTypeStats(values);
  let minCount = Infinity;
  let leastCommon: string | null = null;
  
  for (const [type, count] of Object.entries(stats)) {
    if (count < minCount) {
      minCount = count;
      leastCommon = type;
    }
  }
  
  return leastCommon;
}

export function isHomogeneous(values: unknown[]): boolean {
  if (values.length === 0) return true;
  
  const firstType = kindOfCore(values[0]);
  return values.every(value => kindOfCore(value) === firstType);
}

export function isHeterogeneous(values: unknown[]): boolean {
  return !isHomogeneous(values);
}

export function partition(values: unknown[], predicate: (value: unknown) => boolean): [unknown[], unknown[]] {
  const truthy: unknown[] = [];
  const falsy: unknown[] = [];
  
  for (const value of values) {
    if (predicate(value)) {
      truthy.push(value);
    } else {
      falsy.push(value);
    }
  }
  
  return [truthy, falsy];
}

export function partitionByType(values: unknown[], type: string): [unknown[], unknown[]] {
  return partition(values, value => kindOfCore(value) === type);
}