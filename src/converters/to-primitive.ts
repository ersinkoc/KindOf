import { kindOfCore } from '../core/kind-of';

export function toString(value: unknown): string {
  const type = kindOfCore(value);
  
  switch (type) {
    case 'string':
      return value as string;
    case 'number':
    case 'boolean':
    case 'bigint':
      return String(value);
    case 'symbol':
      return (value as symbol).toString();
    case 'undefined':
      return 'undefined';
    case 'null':
      return 'null';
    case 'date':
      return (value as Date).toISOString();
    case 'regexp':
      return (value as RegExp).toString();
    case 'function':
      return (value as (...args: any[]) => any).toString();
    case 'array':
      return JSON.stringify(value);
    case 'object':
      try {
        return JSON.stringify(value);
      } catch {
        return Object.prototype.toString.call(value);
      }
    default:
      return String(value);
  }
}

export function toNumber(value: unknown): number | null {
  const type = kindOfCore(value);
  
  switch (type) {
    case 'number':
      return value as number;
    case 'string': {
      const num = Number(value);
      return isNaN(num) ? null : num;
    }
    case 'boolean':
      return value ? 1 : 0;
    case 'null':
      return 0;
    case 'bigint': {
      const bigIntValue = Number(value);
      return bigIntValue > Number.MAX_SAFE_INTEGER || bigIntValue < Number.MIN_SAFE_INTEGER 
        ? null 
        : bigIntValue;
    }
    case 'date':
      return (value as Date).getTime();
    default:
      return null;
  }
}

export function toBoolean(value: unknown): boolean {
  const type = kindOfCore(value);
  
  switch (type) {
    case 'boolean':
      return value as boolean;
    case 'string': {
      const str = (value as string).toLowerCase();
      return str !== '' && str !== 'false' && str !== '0' && str !== 'no' && str !== 'null' && str !== 'undefined';
    }
    case 'number':
      return value !== 0 && !isNaN(value as number);
    case 'null':
    case 'undefined':
      return false;
    case 'array':
      return (value as any[]).length > 0;
    case 'object':
      return Object.keys(value as object).length > 0;
    default:
      return !!value;
  }
}

export function toBigInt(value: unknown): bigint | null {
  const type = kindOfCore(value);
  
  switch (type) {
    case 'bigint':
      return value as bigint;
    case 'number':
      if (Number.isInteger(value as number)) {
        return BigInt(value as number);
      }
      return null;
    case 'string':
      try {
        return BigInt(value as string);
      } catch {
        return null;
      }
    case 'boolean':
      return BigInt(value ? 1 : 0);
    default:
      return null;
  }
}

export function toSymbol(value: unknown): symbol {
  const type = kindOfCore(value);
  
  switch (type) {
    case 'symbol':
      return value as symbol;
    case 'string':
      return Symbol(value as string);
    case 'number':
      return Symbol(String(value));
    default:
      return Symbol(toString(value));
  }
}