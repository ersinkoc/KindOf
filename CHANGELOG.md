# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of @oxog/kindof
- Core type detection for 40+ JavaScript types
- Complete TypeScript support with type inference
- Type guards for all supported types
- Schema validation system
- Type conversion utilities
- Plugin system for custom type detection
- Performance optimizations with caching
- Comprehensive test suite with 100% coverage
- Documentation and examples
- CI/CD pipeline with automated testing and releases

### Features
- **Core Functions**
  - `kindOf()` - Main type detection function
  - `fastKindOf()` - Optimized detection for common types
  - `kindOfMany()` - Batch type detection
  - `getDetailedType()` - Comprehensive type information

- **Type Guards**
  - All primitive type guards (`isString`, `isNumber`, etc.)
  - Object type guards (`isArray`, `isObject`, etc.)
  - Collection type guards (`isMap`, `isSet`, etc.)
  - Modern type guards (`isPromise`, `isAsyncFunction`, etc.)
  - Typed array guards (`isInt32Array`, `isFloat64Array`, etc.)
  - Utility guards (`isEmpty`, `isIterable`, etc.)

- **Validation**
  - Schema validation with `validateSchema()`
  - Reusable validators with `createValidator()`
  - Nested object and array validation
  - Partial validation support
  - Strict/non-strict mode

- **Type Conversion**
  - `coerceType()` - Intelligent type coercion
  - Primitive converters (`toString`, `toNumber`, etc.)
  - Safe conversion with fallbacks

- **Performance**
  - Optimized type detection algorithms
  - Optional caching for repeated checks
  - Fast path for common types
  - Memory-efficient implementation

- **TypeScript**
  - Full type inference support
  - Conditional types for advanced use cases
  - Type assertions and guards
  - Generic type utilities

## [1.0.0] - 2025-07-17

### Added
- Initial public release with 100% test success rate (323 tests)