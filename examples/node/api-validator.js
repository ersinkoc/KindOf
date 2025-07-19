// Node.js API Request/Response Validator Example
// Demonstrates schema validation for API endpoints

const { validateSchema, kindOf, ensureType, coerceType } = require('../../dist/index.cjs');

// Define schemas for common API patterns
const schemas = {
  // User registration request
  userRegistration: {
    username: 'string',
    email: 'string',
    password: 'string',
    age: 'number',
    termsAccepted: 'boolean',
    preferences: {
      newsletter: 'boolean',
      notifications: {
        email: 'boolean',
        push: 'boolean'
      }
    }
  },
  
  // Product listing
  product: {
    id: 'string',
    name: 'string',
    price: 'number',
    description: 'string',
    categories: ['string'],
    inStock: 'boolean',
    metadata: 'object'
  },
  
  // API response wrapper
  apiResponse: {
    success: 'boolean',
    data: '*', // Any type
    error: {
      code: 'string',
      message: 'string',
      details: 'object'
    },
    timestamp: 'string'
  }
};

// Middleware factory for Express-like frameworks
function createValidator(schema, options = {}) {
  return (req, res, next) => {
    const result = validateSchema(req.body, schema, options);
    
    if (!result.valid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: result.errors
        },
        timestamp: new Date().toISOString()
      });
    }
    
    // Optionally coerce types
    if (options.coerce) {
      req.body = coerceRequestTypes(req.body, schema);
    }
    
    next();
  };
}

// Coerce request types based on schema
function coerceRequestTypes(data, schema) {
  const coerced = {};
  
  for (const [key, expectedType] of Object.entries(schema)) {
    if (key in data) {
      if (typeof expectedType === 'string') {
        coerced[key] = coerceType(data[key], expectedType);
      } else if (Array.isArray(expectedType)) {
        // Handle array schemas
        coerced[key] = ensureType(data[key], 'array', []);
      } else if (typeof expectedType === 'object') {
        // Recursively handle nested objects
        coerced[key] = coerceRequestTypes(data[key] || {}, expectedType);
      } else {
        coerced[key] = data[key];
      }
    }
  }
  
  return coerced;
}

// Example API endpoint handlers
const handlers = {
  // User registration handler
  registerUser: (req) => {
    const validation = validateSchema(req.body, schemas.userRegistration);
    
    if (!validation.valid) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid registration data',
          details: validation.errors
        }
      };
    }
    
    // Simulate user creation
    return {
      success: true,
      data: {
        id: 'user_' + Date.now(),
        username: req.body.username,
        email: req.body.email,
        createdAt: new Date().toISOString()
      }
    };
  },
  
  // Product creation handler
  createProduct: (req) => {
    const validation = validateSchema(req.body, schemas.product, { partial: true });
    
    if (!validation.valid) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid product data',
          details: validation.errors
        }
      };
    }
    
    // Ensure required fields have defaults
    const product = {
      id: req.body.id || 'prod_' + Date.now(),
      name: req.body.name,
      price: ensureType(req.body.price, 'number', 0),
      description: ensureType(req.body.description, 'string', ''),
      categories: ensureType(req.body.categories, 'array', []),
      inStock: ensureType(req.body.inStock, 'boolean', true),
      metadata: ensureType(req.body.metadata, 'object', {})
    };
    
    return {
      success: true,
      data: product
    };
  }
};

// Test the validators
function runTests() {
  console.log('=== API Validator Examples ===\n');
  
  // Test 1: Valid user registration
  console.log('Test 1: Valid User Registration');
  const validUser = {
    username: 'johndoe',
    email: 'john@example.com',
    password: 'securepass123',
    age: 25,
    termsAccepted: true,
    preferences: {
      newsletter: true,
      notifications: {
        email: true,
        push: false
      }
    }
  };
  
  const result1 = handlers.registerUser({ body: validUser });
  console.log('Result:', JSON.stringify(result1, null, 2));
  
  // Test 2: Invalid user registration
  console.log('\nTest 2: Invalid User Registration');
  const invalidUser = {
    username: 'janedoe',
    email: 'not-an-email',
    password: 123, // Should be string
    age: '25', // Should be number
    termsAccepted: 'yes', // Should be boolean
    preferences: {
      newsletter: true
      // Missing notifications object
    }
  };
  
  const result2 = handlers.registerUser({ body: invalidUser });
  console.log('Result:', JSON.stringify(result2, null, 2));
  
  // Test 3: Product creation with partial data
  console.log('\nTest 3: Product Creation (Partial Data)');
  const partialProduct = {
    name: 'Awesome Widget',
    price: '29.99', // String that can be coerced to number
    categories: ['electronics', 'gadgets']
  };
  
  const result3 = handlers.createProduct({ body: partialProduct });
  console.log('Result:', JSON.stringify(result3, null, 2));
  
  // Test 4: Type coercion
  console.log('\nTest 4: Type Coercion Examples');
  const dataToCoerce = {
    stringToNumber: '42',
    stringToBoolean: 'true',
    numberToString: 123,
    arrayFromString: 'item1,item2,item3'
  };
  
  console.log('Original data:', dataToCoerce);
  console.log('Coerced:');
  console.log('  stringToNumber:', coerceType(dataToCoerce.stringToNumber, 'number'));
  console.log('  stringToBoolean:', coerceType(dataToCoerce.stringToBoolean, 'boolean'));
  console.log('  numberToString:', coerceType(dataToCoerce.numberToString, 'string'));
  
  // Test 5: Complex nested validation
  console.log('\nTest 5: Complex Nested Validation');
  const complexData = {
    orders: [
      {
        id: 'order_001',
        items: [
          { productId: 'prod_123', quantity: 2, price: 29.99 },
          { productId: 'prod_456', quantity: 1, price: 49.99 }
        ],
        customer: {
          id: 'cust_789',
          name: 'John Smith',
          email: 'john.smith@example.com'
        },
        total: 109.97,
        status: 'pending'
      }
    ],
    metadata: {
      source: 'web',
      version: '1.0'
    }
  };
  
  const orderSchema = {
    orders: [{
      id: 'string',
      items: [{
        productId: 'string',
        quantity: 'number',
        price: 'number'
      }],
      customer: {
        id: 'string',
        name: 'string',
        email: 'string'
      },
      total: 'number',
      status: 'string'
    }],
    metadata: 'object'
  };
  
  const validation = validateSchema(complexData, orderSchema);
  console.log('Complex validation result:', validation);
  console.log('Data type analysis:');
  console.log('  orders:', kindOf(complexData.orders));
  console.log('  orders[0].items:', kindOf(complexData.orders[0].items));
  console.log('  metadata:', kindOf(complexData.metadata));
}

// Run tests
if (require.main === module) {
  runTests();
}

module.exports = {
  schemas,
  createValidator,
  handlers
};