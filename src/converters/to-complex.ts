import { kindOfCore } from '../core/kind-of';

export function toArray(value: unknown): unknown[] | null {
  const type = kindOfCore(value);
  
  switch (type) {
    case 'array':
      return value as unknown[];
    case 'string':
      return Array.from(value as string);
    case 'set':
      return Array.from(value as Set<unknown>);
    case 'map':
      return Array.from(value as Map<unknown, unknown>);
    case 'arguments':
      return Array.from(value as ArrayLike<unknown>);
    case 'null':
    case 'undefined':
      return [];
    default:
      if (value !== null && typeof value === 'object' && 'length' in value) {
        return Array.from(value as ArrayLike<unknown>);
      }
      return [value];
  }
}

export function toObject(value: unknown): Record<string, unknown> | null {
  const type = kindOfCore(value);
  
  switch (type) {
    case 'object':
      return value as Record<string, unknown>;
    case 'array': {
      const arr = value as unknown[];
      const obj: Record<string, unknown> = {};
      arr.forEach((item, index) => {
        obj[index] = item;
      });
      return obj;
    }
    case 'map': {
      const map = value as Map<unknown, unknown>;
      const obj: Record<string, unknown> = {};
      for (const [key, val] of map) {
        obj[String(key)] = val;
      }
      return obj;
    }
    case 'set': {
      const set = value as Set<unknown>;
      const obj: Record<string, unknown> = {};
      let index = 0;
      for (const item of set) {
        obj[index++] = item;
      }
      return obj;
    }
    case 'string': {
      const str = value as string;
      const obj: Record<string, unknown> = {};
      for (let i = 0; i < str.length; i++) {
        obj[i] = str[i];
      }
      return obj;
    }
    case 'null':
    case 'undefined':
      return {};
    default:
      return { value };
  }
}

export function toMap(value: unknown): Map<unknown, unknown> | null {
  const type = kindOfCore(value);
  
  switch (type) {
    case 'map':
      return value as Map<unknown, unknown>;
    case 'object': {
      const obj = value as Record<string, unknown>;
      const map = new Map<unknown, unknown>();
      for (const [key, val] of Object.entries(obj)) {
        map.set(key, val);
      }
      return map;
    }
    case 'array': {
      const arr = value as unknown[];
      const map = new Map<unknown, unknown>();
      arr.forEach((item, index) => {
        map.set(index, item);
      });
      return map;
    }
    case 'set': {
      const set = value as Set<unknown>;
      const map = new Map<unknown, unknown>();
      let index = 0;
      for (const item of set) {
        map.set(index++, item);
      }
      return map;
    }
    default:
      return null;
  }
}

export function toSet(value: unknown): Set<unknown> | null {
  const type = kindOfCore(value);
  
  switch (type) {
    case 'set':
      return value as Set<unknown>;
    case 'array':
      return new Set(value as unknown[]);
    case 'string':
      return new Set(Array.from(value as string));
    case 'map':
      return new Set((value as Map<unknown, unknown>).values());
    case 'object':
      return new Set(Object.values(value as Record<string, unknown>));
    default:
      return value !== null && value !== undefined ? new Set([value]) : new Set();
  }
}

export function toDate(value: unknown): Date | null {
  const type = kindOfCore(value);
  
  switch (type) {
    case 'date':
      return value as Date;
    case 'string': {
      const date = new Date(value as string);
      return isNaN(date.getTime()) ? null : date;
    }
    case 'number': {
      const date = new Date(value as number);
      return isNaN(date.getTime()) ? null : date;
    }
    default:
      return null;
  }
}

export function toRegExp(value: unknown): RegExp | null {
  const type = kindOfCore(value);
  
  switch (type) {
    case 'regexp':
      return value as RegExp;
    case 'string':
      try {
        return new RegExp(value as string);
      } catch {
        return null;
      }
    default:
      return null;
  }
}

export function toError(value: unknown): Error | null {
  const type = kindOfCore(value);
  
  switch (type) {
    case 'error':
      return value as Error;
    case 'string':
      return new Error(value as string);
    case 'object':
      if (value && typeof value === 'object' && 'message' in value) {
        return new Error(String((value as any).message));
      }
      return new Error(String(value));
    default:
      return new Error(String(value));
  }
}

export function toFunction(value: unknown): ((...args: any[]) => any) | null {
  const type = kindOfCore(value);

  switch (type) {
    case 'function':
    case 'asyncfunction':
    case 'generatorfunction':
    case 'asyncgeneratorfunction':
      return value as (...args: any[]) => any;
    case 'string':
      // SECURITY: Removed string->function conversion using new Function()
      // This was a code injection vulnerability similar to eval()
      // If you need to create functions from strings, use a safe parser/compiler
      // or explicitly use new Function() yourself with proper input validation
      return null;
    default:
      return null;
  }
}

export function toPromise(value: unknown): Promise<unknown> | null {
  const type = kindOfCore(value);
  
  switch (type) {
    case 'promise':
      return value as Promise<unknown>;
    case 'function':
      try {
        const result = (value as (...args: any[]) => any)();
        return Promise.resolve(result);
      } catch (error) {
        return Promise.reject(error);
      }
    default:
      return Promise.resolve(value);
  }
}

export function toBuffer(value: unknown): Buffer | null {
  if (typeof Buffer === 'undefined') {
    return null;
  }
  
  const type = kindOfCore(value);
  
  switch (type) {
    case 'buffer':
      return value as Buffer;
    case 'string':
      return Buffer.from(value as string);
    case 'array':
      return Buffer.from(value as number[]);
    case 'uint8array':
      return Buffer.from(value as Uint8Array);
    case 'arraybuffer':
      return Buffer.from(value as ArrayBuffer);
    default:
      return null;
  }
}

export function toTypedArray<T extends ArrayBufferView>(
  value: unknown,
  TypedArrayConstructor: new (length: number) => T
): T | null {
  const type = kindOfCore(value);

  switch (type) {
    case 'arraybuffer':
      // For ArrayBuffer, we need a different constructor signature
      // Cast to any to work around TypeScript's constructor type limitations
      return new (TypedArrayConstructor as any)(value as ArrayBuffer);
    case 'array': {
      const arr = value as number[];
      // Create typed array directly from length, then populate
      // This avoids hardcoding element size and lets the constructor handle it
      const view = new TypedArrayConstructor(arr.length);
      for (let i = 0; i < arr.length; i++) {
        (view as any)[i] = arr[i];
      }
      return view;
    }
    default:
      // Check if it's already a typed array or ArrayBuffer view
      if (type.includes('array') && ArrayBuffer.isView(value)) {
        const source = value as any;
        const view = new TypedArrayConstructor(source.length);
        for (let i = 0; i < source.length; i++) {
          (view as any)[i] = source[i];
        }
        return view;
      }
      return null;
  }
}