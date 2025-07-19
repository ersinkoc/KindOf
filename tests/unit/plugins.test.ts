import { createKindOfInstance, createPlugin, reactPlugin, nodePlugin } from '../../src/plugins';

describe('Plugins', () => {
  describe('Plugin System', () => {
    test('should create plugin instance', () => {
      const plugin = createPlugin({
        name: 'test',
        version: '1.0.0',
        types: {
          'custom': (value: unknown) => value === 'custom'
        }
      });
      
      expect(plugin.name).toBe('test');
      expect(plugin.version).toBe('1.0.0');
      expect(plugin.types.custom('custom')).toBe(true);
    });

    test('should create kindof instance', () => {
      const kindOf = createKindOfInstance();
      expect(typeof kindOf).toBe('function');
      expect(kindOf(42)).toBe('number');
    });

    test('should use plugin', () => {
      const kindOf = createKindOfInstance();
      const plugin = createPlugin({
        name: 'test',
        version: '1.0.0',
        types: {
          'custom': (value: unknown) => value === 'custom'
        }
      });

      kindOf.use(plugin);
      expect(kindOf('custom')).toBe('custom');
    });

    test('should unuse plugin', () => {
      const kindOf = createKindOfInstance();
      const plugin = createPlugin({
        name: 'test',
        version: '1.0.0',
        types: {
          'custom': (value: unknown) => value === 'custom'
        }
      });

      kindOf.use(plugin);
      expect(kindOf('custom')).toBe('custom');
      
      kindOf.unuse('test');
      expect(kindOf('custom')).toBe('string');
    });

    test('should define custom type', () => {
      const kindOf = createKindOfInstance();
      kindOf.defineType('custom', (value: unknown) => value === 'custom');
      expect(kindOf('custom')).toBe('custom');
    });

    test('should remove custom type', () => {
      const kindOf = createKindOfInstance();
      kindOf.defineType('custom', (value: unknown) => value === 'custom');
      expect(kindOf('custom')).toBe('custom');
      
      kindOf.removeType('custom');
      expect(kindOf('custom')).toBe('string');
    });

    test('should check if type exists', () => {
      const kindOf = createKindOfInstance();
      expect(kindOf.hasType('custom')).toBe(false);
      
      kindOf.defineType('custom', (value: unknown) => value === 'custom');
      expect(kindOf.hasType('custom')).toBe(true);
    });

    test('should get custom types', () => {
      const kindOf = createKindOfInstance();
      kindOf.defineType('custom', (value: unknown) => value === 'custom');
      
      const types = kindOf.getCustomTypes();
      expect(types.custom).toBeDefined();
      expect(types.custom('custom')).toBe(true);
    });

    test('should handle plugin setup and teardown', () => {
      const kindOf = createKindOfInstance();
      let setupCalled = false;
      let teardownCalled = false;
      
      const plugin = createPlugin({
        name: 'test',
        version: '1.0.0',
        types: {
          'custom': (value: unknown) => value === 'custom'
        },
        setup: () => { setupCalled = true; },
        teardown: () => { teardownCalled = true; }
      });

      kindOf.use(plugin);
      expect(setupCalled).toBe(true);
      
      kindOf.unuse('test');
      expect(teardownCalled).toBe(true);
    });

    test('should throw error for duplicate plugin', () => {
      const kindOf = createKindOfInstance();
      const plugin = createPlugin({
        name: 'test',
        version: '1.0.0',
        types: {
          'custom': (value: unknown) => value === 'custom'
        }
      });

      kindOf.use(plugin);
      expect(() => kindOf.use(plugin)).toThrow('Plugin "test" is already registered');
    });

    test('should throw error for non-existent plugin', () => {
      const kindOf = createKindOfInstance();
      expect(() => kindOf.unuse('nonexistent')).toThrow('Plugin "nonexistent" is not registered');
    });
  });

  describe('React Plugin', () => {
    test('should detect React elements', () => {
      const reactElement = {
        $$typeof: Symbol.for('react.element'),
        type: 'div',
        props: { children: 'Hello' }
      };
      
      expect(reactPlugin.types['react.element'](reactElement)).toBe(true);
      expect(reactPlugin.types['react.element']({})).toBe(false);
    });

    test('should detect React components', () => {
      function MyComponent() { return null; }
      class MyClassComponent { 
        render() { return null; }
      }
      (MyClassComponent.prototype as any).isReactComponent = true;
      
      expect(reactPlugin.types['react.component'](MyComponent)).toBe(true);
      expect(reactPlugin.types['react.component'](MyClassComponent)).toBe(true);
      expect(reactPlugin.types['react.component']({})).toBe(false);
    });

    test('should detect React memo', () => {
      const memoComponent = {
        $$typeof: { toString: () => 'Symbol(react.memo)' },
        type: () => null
      };
      
      expect(reactPlugin.types['react.memo'](memoComponent)).toBe(true);
      expect(reactPlugin.types['react.memo']({})).toBe(false);
    });
  });

  describe('Node Plugin', () => {
    test('should detect readable streams', () => {
      const readableStream = {
        readable: true,
        read: () => {},
        _readableState: {}
      };
      
      expect(nodePlugin.types['node.readablestream'](readableStream)).toBe(true);
      expect(nodePlugin.types['node.readablestream']({})).toBe(false);
    });

    test('should detect writable streams', () => {
      const writableStream = {
        writable: true,
        write: () => {},
        _writableState: {}
      };
      
      expect(nodePlugin.types['node.writablestream'](writableStream)).toBe(true);
      expect(nodePlugin.types['node.writablestream']({})).toBe(false);
    });

    test('should detect servers', () => {
      const server = {
        listen: () => {},
        close: () => {},
        address: () => {}
      };
      
      expect(nodePlugin.types['node.server'](server)).toBe(true);
      expect(nodePlugin.types['node.server']({})).toBe(false);
    });

    test('should detect URLs', () => {
      const url = {
        href: 'https://example.com',
        protocol: 'https:',
        hostname: 'example.com',
        pathname: '/',
        search: '',
        hash: '',
        constructor: { name: 'URL' }
      };
      
      expect(nodePlugin.types['node.url'](url)).toBe(true);
      expect(nodePlugin.types['node.url']({})).toBe(false);
    });

    test('should detect duplex streams', () => {
      // Line 24: isDuplexStream combines readable and writable stream checks
      const duplexStream = {
        readable: true,
        read: () => {},
        _readableState: {},
        writable: true,
        write: () => {},
        _writableState: {}
      };
      
      expect(nodePlugin.types['node.duplexstream'](duplexStream)).toBe(true);
      expect(nodePlugin.types['node.duplexstream']({})).toBe(false);
      
      // Test with only readable properties
      const onlyReadable = {
        readable: true,
        read: () => {},
        _readableState: {}
      };
      expect(nodePlugin.types['node.duplexstream'](onlyReadable)).toBe(false);
    });

    test('should detect transform streams', () => {
      // Line 28: Transform stream detection
      const transformStream = {
        readable: true,
        read: () => {},
        _readableState: {},
        writable: true,
        write: () => {},
        _writableState: {},
        _transform: () => {}
      };
      
      expect(nodePlugin.types['node.transformstream'](transformStream)).toBe(true);
      expect(nodePlugin.types['node.transformstream']({})).toBe(false);
    });

    test('should detect incoming messages', () => {
      // Line 45: Incoming message detection
      const incomingMessage = {
        headers: {},
        method: 'GET',
        url: '/path',
        readable: true,
        read: () => {},
        _readableState: {}
      };
      
      expect(nodePlugin.types['node.incomingmessage'](incomingMessage)).toBe(true);
      expect(nodePlugin.types['node.incomingmessage']({})).toBe(false);
    });

    test('should detect server responses', () => {
      // Line 54: Server response detection
      const serverResponse = {
        statusCode: 200,
        setHeader: () => {},
        writeHead: () => {},
        writable: true,
        write: () => {},
        _writableState: {}
      };
      
      expect(nodePlugin.types['node.serverresponse'](serverResponse)).toBe(true);
      expect(nodePlugin.types['node.serverresponse']({})).toBe(false);
    });

    test('should detect child processes', () => {
      // Line 63: Child process detection
      const childProcess = {
        pid: 12345,
        kill: () => {},
        stdin: {},
        stdout: {},
        stderr: {}
      };
      
      expect(nodePlugin.types['node.childprocess'](childProcess)).toBe(true);
      expect(nodePlugin.types['node.childprocess']({})).toBe(false);
    });

    test('should detect workers', () => {
      // Line 74: Worker detection
      const worker = {
        threadId: 1,
        postMessage: () => {},
        terminate: () => {}
      };
      
      expect(nodePlugin.types['node.worker'](worker)).toBe(true);
      expect(nodePlugin.types['node.worker']({})).toBe(false);
    });

    test('should detect message ports', () => {
      // Line 83: MessagePort detection
      const messagePort = {
        postMessage: () => {},
        start: () => {},
        close: () => {}
      };
      
      expect(nodePlugin.types['node.messageport'](messagePort)).toBe(true);
      expect(nodePlugin.types['node.messageport']({})).toBe(false);
    });

    test('should detect URL search params', () => {
      // Line 104: URLSearchParams detection
      const urlSearchParams = {
        append: () => {},
        get: () => {},
        set: () => {},
        delete: () => {},
        constructor: { name: 'URLSearchParams' }
      };
      
      expect(nodePlugin.types['node.urlsearchparams'](urlSearchParams)).toBe(true);
      expect(nodePlugin.types['node.urlsearchparams']({})).toBe(false);
    });

    test('should detect text encoders', () => {
      // Line 115: TextEncoder detection
      const textEncoder = {
        encode: () => {},
        constructor: { name: 'TextEncoder' }
      };
      
      expect(nodePlugin.types['node.textencoder'](textEncoder)).toBe(true);
      expect(nodePlugin.types['node.textencoder']({})).toBe(false);
    });

    test('should detect text decoders', () => {
      // Line 123: TextDecoder detection
      const textDecoder = {
        decode: () => {},
        constructor: { name: 'TextDecoder' }
      };
      
      expect(nodePlugin.types['node.textdecoder'](textDecoder)).toBe(true);
      expect(nodePlugin.types['node.textdecoder']({})).toBe(false);
    });

    test('should detect abort controllers', () => {
      // Line 131: AbortController detection
      const abortController = {
        signal: {},
        abort: () => {},
        constructor: { name: 'AbortController' }
      };
      
      expect(nodePlugin.types['node.abortcontroller'](abortController)).toBe(true);
      expect(nodePlugin.types['node.abortcontroller']({})).toBe(false);
    });

    test('should detect abort signals', () => {
      // Line 140: AbortSignal detection
      const abortSignal = {
        aborted: false,
        constructor: { name: 'AbortSignal' }
      };
      
      expect(nodePlugin.types['node.abortsignal'](abortSignal)).toBe(true);
      expect(nodePlugin.types['node.abortsignal']({})).toBe(false);
    });

    test('should detect performance observers', () => {
      // Line 148: PerformanceObserver detection
      const performanceObserver = {
        observe: () => {},
        disconnect: () => {},
        constructor: { name: 'PerformanceObserver' }
      };
      
      expect(nodePlugin.types['node.performanceobserver'](performanceObserver)).toBe(true);
      expect(nodePlugin.types['node.performanceobserver']({})).toBe(false);
    });

    test('should detect performance entries', () => {
      // Line 157: PerformanceEntry detection
      const performanceEntry = {
        name: 'test',
        entryType: 'mark',
        startTime: 100,
        duration: 50,
        constructor: { name: 'PerformanceMark' }
      };
      
      expect(nodePlugin.types['node.performanceentry'](performanceEntry)).toBe(true);
      expect(nodePlugin.types['node.performanceentry']({})).toBe(false);
      
      // Test with different Performance constructor name
      const performanceEntryNavigation = {
        name: 'navigation',
        entryType: 'navigation',
        startTime: 0,
        duration: 1000,
        constructor: { name: 'PerformanceNavigationTiming' }
      };
      
      expect(nodePlugin.types['node.performanceentry'](performanceEntryNavigation)).toBe(true);
    });

    test('should handle edge cases for node types', () => {
      // Test null/undefined values for all node types
      const nodeCheckers = [
        'node.readablestream',
        'node.writablestream', 
        'node.duplexstream',
        'node.transformstream',
        'node.server',
        'node.incomingmessage',
        'node.serverresponse',
        'node.childprocess',
        'node.worker',
        'node.messageport',
        'node.url',
        'node.urlsearchparams',
        'node.textencoder',
        'node.textdecoder',
        'node.abortcontroller',
        'node.abortsignal',
        'node.performanceobserver',
        'node.performanceentry'
      ];
      
      nodeCheckers.forEach(checker => {
        expect(nodePlugin.types[checker](null)).toBe(false);
        expect(nodePlugin.types[checker](undefined)).toBe(false);
        expect(nodePlugin.types[checker]('string')).toBe(false);
        expect(nodePlugin.types[checker](42)).toBe(false);
      });
    });
  });
});