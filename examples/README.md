# @oxog/kindof Examples

This directory contains comprehensive examples demonstrating the usage of @oxog/kindof in various environments and use cases.

## Directory Structure

```
examples/
├── basic/           # Basic JavaScript usage examples
├── typescript/      # TypeScript-specific examples
├── browser/         # Browser environment examples
├── node/           # Node.js-specific examples
├── react/          # React integration examples
└── demo.js         # Quick demo showcasing main features
```

## Running the Examples

### Prerequisites

First, build the project to generate the distribution files:

```bash
npm install
npm run build
```

### Basic Examples

```bash
node examples/basic/index.js
node examples/demo.js
```

### TypeScript Examples

```bash
npx tsx examples/typescript/index.ts
```

### Browser Examples

Open `examples/browser/index.html` in your web browser. No build step required!

### Node.js Examples

```bash
node examples/node/file-analyzer.js
node examples/node/api-validator.js
```

### React Examples

Open `examples/react/index.html` in your web browser for the standalone version, or integrate `App.jsx` into your React build pipeline.

## What Each Example Demonstrates

### basic/index.js
- Basic type detection for all JavaScript types
- Fast mode for performance-critical code
- Batch processing with `kindOfMany`
- Detailed type information with `getDetailedType`
- Custom objects and Symbol.toStringTag

### typescript/index.ts
- TypeScript type inference and narrowing
- Type guards with proper TypeScript support
- Generic type checking
- Type assertions and ensuring
- Schema validation with TypeScript interfaces
- Type conversion with type safety

### demo.js
- Quick overview of all main features
- Plugin system and custom type definitions
- Schema validation
- Type conversion
- Inspect utility

### browser/index.html
- Interactive type detection UI
- Form validation with real-time feedback
- Browser-specific type detection (DOM elements, Events, etc.)
- Custom type definitions for URLs and emails
- Live examples with visual feedback

### node/file-analyzer.js
- File and directory analysis
- Buffer and stream type detection
- Node.js environment analysis
- Colored terminal output
- Recursive data structure analysis

### node/api-validator.js
- Express-style middleware creation
- Complex nested schema validation
- Type coercion for API inputs
- Error handling and reporting
- Real-world API validation scenarios

### react/App.jsx & index.html
- React hooks for type validation
- Form validation with schema support
- React-specific type detection (elements, components)
- Interactive type detection UI
- Integration with React state management

## Key Features Demonstrated

1. **Type Detection**: Accurate detection of 40+ JavaScript types
2. **Type Guards**: Runtime type checking with TypeScript support
3. **Schema Validation**: Complex object validation with nested schemas
4. **Type Conversion**: Safe type coercion between different types
5. **Plugin System**: Extensible type detection with custom types
6. **Performance**: Fast mode for performance-critical applications
7. **Environment Support**: Works in Node.js, browsers, and with frameworks

## Common Use Cases

- **API Validation**: Validate request/response data structures
- **Form Validation**: Type-safe form handling in web applications
- **Data Processing**: Ensure data types before processing
- **Type Safety**: Runtime type checking to complement TypeScript
- **Debugging**: Detailed type information for troubleshooting
- **Data Migration**: Convert between different data formats safely

## Tips

1. Use `fastKindOf` when performance is critical
2. Use `validateSchema` for complex object validation
3. Create custom type detectors with the plugin system
4. Use type guards (`isString`, `isNumber`, etc.) for cleaner code
5. Leverage `getDetailedType` for debugging and logging

For more information, see the [main README](../README.md) and [API documentation](../docs/).