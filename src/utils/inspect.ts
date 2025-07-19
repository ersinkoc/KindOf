import { kindOfCore, getDetailedType } from '../core/kind-of';

export interface InspectOptions {
  depth?: number;
  colors?: boolean;
  showHidden?: boolean;
  showProxy?: boolean;
  maxArrayLength?: number;
  maxStringLength?: number;
  breakLength?: number;
  compact?: boolean;
  sorted?: boolean;
  getters?: boolean;
}

export function inspect(value: unknown, options: InspectOptions = {}): string {
  const opts = {
    depth: 2,
    colors: false,
    showHidden: false,
    showProxy: true,
    maxArrayLength: 100,
    maxStringLength: 200,
    breakLength: 80,
    compact: false,
    sorted: false,
    getters: false,
    ...options,
  };

  return inspectValue(value, opts, 0, new Set());
}

function inspectValue(
  value: unknown,
  options: Required<InspectOptions>,
  depth: number,
  seen: Set<any>
): string {
  if (depth > options.depth) {
    return '[Object]';
  }

  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  const type = kindOfCore(value);
  
  if (type === 'string') {
    return inspectString(value as string, options);
  }
  
  if (type === 'number' || type === 'boolean' || type === 'symbol' || type === 'bigint') {
    return String(value);
  }

  if (typeof value === 'object' && value !== null) {
    if (seen.has(value)) {
      return '[Circular]';
    }
    seen.add(value);
  }

  try {
    switch (type) {
      case 'array':
        return inspectArray(value as any[], options, depth, seen);
      case 'object':
        return inspectObject(value as Record<string, any>, options, depth, seen);
      case 'function':
        return inspectFunction(value as (...args: any[]) => any, options);
      case 'date':
        return inspectDate(value as Date, options);
      case 'regexp':
        return inspectRegExp(value as RegExp, options);
      case 'error':
        return inspectError(value as Error, options);
      case 'map':
        return inspectMap(value as Map<any, any>, options, depth, seen);
      case 'set':
        return inspectSet(value as Set<any>, options, depth, seen);
      case 'promise':
        return inspectPromise(value as Promise<any>, options);
      default:
        return inspectGeneric(value, type, options);
    }
  } finally {
    if (typeof value === 'object' && value !== null) {
      seen.delete(value);
    }
  }
}

function inspectString(str: string, options: Required<InspectOptions>): string {
  if (str.length > options.maxStringLength) {
    return `'${str.slice(0, options.maxStringLength)}...'`;
  }
  return `'${str}'`;
}

function inspectArray(arr: any[], options: Required<InspectOptions>, depth: number, seen: Set<any>): string {
  if (arr.length === 0) return '[]';

  const maxLength = Math.min(arr.length, options.maxArrayLength);
  const items: string[] = [];

  for (let i = 0; i < maxLength; i++) {
    items.push(inspectValue(arr[i], options, depth + 1, seen));
  }

  if (arr.length > maxLength) {
    items.push(`... ${arr.length - maxLength} more items`);
  }

  if (options.compact) {
    return `[${items.join(', ')}]`;
  }

  const joined = items.join(', ');
  if (joined.length <= options.breakLength) {
    return `[${joined}]`;
  }

  return `[\n${items.map(item => `  ${item}`).join(',\n')}\n]`;
}

function inspectObject(obj: Record<string, any>, options: Required<InspectOptions>, depth: number, seen: Set<any>): string {
  const keys = options.showHidden ? 
    Object.getOwnPropertyNames(obj) : 
    Object.keys(obj);

  if (keys.length === 0) return '{}';

  if (options.sorted) {
    keys.sort();
  }

  const items: string[] = [];
  for (const key of keys) {
    try {
      const value = obj[key];
      const inspected = inspectValue(value, options, depth + 1, seen);
      items.push(`${key}: ${inspected}`);
    } catch (error) {
      items.push(`${key}: [Error: ${(error as Error).message}]`);
    }
  }

  if (options.compact) {
    return `{${items.join(', ')}}`;
  }

  const joined = items.join(', ');
  if (joined.length <= options.breakLength) {
    return `{${joined}}`;
  }

  return `{\n${items.map(item => `  ${item}`).join(',\n')}\n}`;
}

function inspectFunction(fn: (...args: any[]) => any, _options: Required<InspectOptions>): string {
  const name = fn.name || 'anonymous';
  const type = getDetailedType(fn);
  
  if (type.type === 'asyncfunction') {
    return `[AsyncFunction: ${name}]`;
  } else if (type.type === 'generatorfunction') {
    return `[GeneratorFunction: ${name}]`;
  } else if (type.type === 'asyncgeneratorfunction') {
    return `[AsyncGeneratorFunction: ${name}]`;
  }
  
  return `[Function: ${name}]`;
}

function inspectDate(date: Date, _options: Required<InspectOptions>): string {
  return `${date.toISOString()}`;
}

function inspectRegExp(regex: RegExp, _options: Required<InspectOptions>): string {
  return regex.toString();
}

function inspectError(error: Error, _options: Required<InspectOptions>): string {
  return `${error.name}: ${error.message}`;
}

function inspectMap(map: Map<any, any>, options: Required<InspectOptions>, depth: number, seen: Set<any>): string {
  if (map.size === 0) return 'Map(0) {}';

  const items: string[] = [];
  let count = 0;
  
  for (const [key, value] of map) {
    if (count >= options.maxArrayLength) {
      items.push(`... ${map.size - count} more items`);
      break;
    }
    
    const keyStr = inspectValue(key, options, depth + 1, seen);
    const valueStr = inspectValue(value, options, depth + 1, seen);
    items.push(`${keyStr} => ${valueStr}`);
    count++;
  }

  return `Map(${map.size}) {${items.join(', ')}}`;
}

function inspectSet(set: Set<any>, options: Required<InspectOptions>, depth: number, seen: Set<any>): string {
  if (set.size === 0) return 'Set(0) {}';

  const items: string[] = [];
  let count = 0;
  
  for (const value of set) {
    if (count >= options.maxArrayLength) {
      items.push(`... ${set.size - count} more items`);
      break;
    }
    
    items.push(inspectValue(value, options, depth + 1, seen));
    count++;
  }

  return `Set(${set.size}) {${items.join(', ')}}`;
}

function inspectPromise(_promise: Promise<any>, _options: Required<InspectOptions>): string {
  return 'Promise { <pending> }';
}

function inspectGeneric(value: any, type: string, _options: Required<InspectOptions>): string {
  if (value && typeof value === 'object' && value.constructor) {
    return `${value.constructor.name} {}`;
  }
  return `[${type}]`;
}

export function inspectType(value: unknown): string {
  const detailed = getDetailedType(value);
  const parts: string[] = [];
  
  parts.push(`Type: ${detailed.type}`);
  
  if (detailed.constructor) {
    parts.push(`Constructor: ${detailed.constructor}`);
  }
  
  if (detailed.customType) {
    parts.push(`Custom Type: ${detailed.customType}`);
  }
  
  const flags: string[] = [];
  if (detailed.isPrimitive) flags.push('primitive');
  if (detailed.isBuiltIn) flags.push('built-in');
  if (detailed.isNullish) flags.push('nullish');
  if (detailed.isIterable) flags.push('iterable');
  if (detailed.isAsync) flags.push('async');
  
  if (flags.length > 0) {
    parts.push(`Flags: ${flags.join(', ')}`);
  }
  
  if (detailed.metadata) {
    const metadata = Object.entries(detailed.metadata)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    parts.push(`Metadata: {${metadata}}`);
  }
  
  return parts.join('\n');
}