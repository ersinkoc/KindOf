import { kindOfCore } from '../core/kind-of';
import type { TypePlugin, TypeChecker, KindOfInstance, PluginOptions } from './types';

class KindOfExtended {
  private plugins: Map<string, TypePlugin> = new Map();
  private customTypes: Map<string, TypeChecker> = new Map();
  private typeOrder: string[] = [];

  constructor() {
    // Bind the function to maintain proper context
    const boundFunction = this.detect.bind(this);
    Object.setPrototypeOf(boundFunction, KindOfExtended.prototype);
    Object.assign(boundFunction, this);
    return boundFunction as any;
  }

  detect(value: unknown): string {
    // Check custom types first (in reverse order for priority)
    for (let i = this.typeOrder.length - 1; i >= 0; i--) {
      const typeName = this.typeOrder[i];
      if (!typeName) continue;
      const checker = this.customTypes.get(typeName);
      if (checker && checker(value)) {
        return typeName;
      }
    }

    // Fall back to core detection
    return kindOfCore(value);
  }

  use(plugin: TypePlugin, options: PluginOptions = {}): this {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" is already registered`);
    }

    this.plugins.set(plugin.name, plugin);

    // Register all types from the plugin
    const prefix = options.prefix || '';
    for (const [typeName, checker] of Object.entries(plugin.types)) {
      const fullTypeName = prefix + typeName;
      if (this.customTypes.has(fullTypeName) && !options.override) {
        throw new Error(`Type "${fullTypeName}" is already defined`);
      }
      this.customTypes.set(fullTypeName, checker);
      this.typeOrder.push(fullTypeName);
    }

    // Call setup if provided
    if (plugin.setup) {
      plugin.setup(this as any);
    }

    return this;
  }

  unuse(pluginName: string): this {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin "${pluginName}" is not registered`);
    }

    // Call teardown if provided
    if (plugin.teardown) {
      plugin.teardown();
    }

    // Remove all types from the plugin
    for (const typeName of Object.keys(plugin.types)) {
      this.customTypes.delete(typeName);
      const index = this.typeOrder.indexOf(typeName);
      if (index !== -1) {
        this.typeOrder.splice(index, 1);
      }
    }

    this.plugins.delete(pluginName);
    return this;
  }

  defineType(name: string, checker: TypeChecker): this {
    if (this.customTypes.has(name)) {
      throw new Error(`Type "${name}" is already defined`);
    }
    this.customTypes.set(name, checker);
    this.typeOrder.push(name);
    return this;
  }

  removeType(name: string): this {
    if (!this.customTypes.has(name)) {
      throw new Error(`Type "${name}" is not defined`);
    }
    this.customTypes.delete(name);
    const index = this.typeOrder.indexOf(name);
    if (index !== -1) {
      this.typeOrder.splice(index, 1);
    }
    return this;
  }

  getCustomTypes(): Record<string, TypeChecker> {
    return Object.fromEntries(this.customTypes);
  }

  hasType(name: string): boolean {
    return this.customTypes.has(name);
  }
}

export function createKindOfInstance(): KindOfInstance {
  return new KindOfExtended() as any;
}

export function createPlugin(config: TypePlugin): TypePlugin {
  const plugin: TypePlugin = {
    name: config.name,
    version: config.version,
    types: config.types,
  };
  
  if (config.setup) {
    plugin.setup = config.setup;
  }
  
  if (config.teardown) {
    plugin.teardown = config.teardown;
  }
  
  return plugin;
}