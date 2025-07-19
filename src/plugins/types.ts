export type TypeChecker = (value: unknown) => boolean;

export interface TypePlugin {
  name: string;
  version: string;
  types: Record<string, TypeChecker>;
  setup?: (kindOf: KindOfInstance) => void;
  teardown?: () => void;
}

export interface KindOfInstance {
  (value: unknown): string;
  use(plugin: TypePlugin): this;
  unuse(pluginName: string): this;
  defineType(name: string, checker: TypeChecker): this;
  removeType(name: string): this;
  getCustomTypes(): Record<string, TypeChecker>;
  hasType(name: string): boolean;
}

export interface PluginOptions {
  override?: boolean;
  prefix?: string;
}