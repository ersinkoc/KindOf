# React Examples for @oxog/kindof

This directory contains React examples demonstrating how to use @oxog/kindof in React applications.

## Files

- **App.jsx** - React component example for use with a build system (webpack, vite, etc.)
- **index.html** - Standalone HTML file that works without any build tools

## Running the Examples

### Standalone HTML Example

Simply open `index.html` in your web browser. This example uses:
- React and ReactDOM from CDN
- Babel standalone for JSX transformation
- The UMD build of @oxog/kindof

### Component Example (App.jsx)

To use the `App.jsx` component in your React project:

1. Install the package:
   ```bash
   npm install @oxog/kindof
   ```

2. Import and use the component:
   ```jsx
   import App from './examples/react/App.jsx';
   ```

## Features Demonstrated

- **Type Detection**: Real-time type detection for user input
- **Form Validation**: Schema-based form validation with error handling
- **Custom Hooks**: 
  - `useTypeValidation` - Validates types with React state
  - `useFormValidation` - Form validation with schema support
- **React-specific Types**: Custom type detection for React elements and components
- **Type Conversion**: Automatic type coercion for form inputs
- **Interactive UI**: Live examples showing various JavaScript and React types

## Key Concepts

### Custom React Type Detection

The example shows how to extend @oxog/kindof with React-specific types:

```javascript
const customKindOf = createKindOfInstance();

// Detect React elements
customKindOf.defineType('react-element', (value) => {
  return React.isValidElement(value);
});

// Detect React components
customKindOf.defineType('react-component', (value) => {
  return typeof value === 'function' && (
    value.prototype?.isReactComponent || 
    String(value).includes('useState')
  );
});
```

### Form Validation

The example includes a complete form validation system:

```javascript
const formSchema = {
  name: 'string',
  email: 'string',
  age: 'number',
  subscribe: 'boolean'
};

const { errors, validate } = useFormValidation(formSchema);
```

This provides real-time validation feedback and type coercion for form inputs.