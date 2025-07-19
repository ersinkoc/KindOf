import * as utils from '../../src/utils';

describe('Utils', () => {
  describe('Performance Monitor', () => {
    let monitor: utils.PerformanceMonitor;

    beforeEach(() => {
      monitor = new utils.PerformanceMonitor();
    });

    test('should start disabled', () => {
      expect(monitor.isEnabled()).toBe(false);
    });

    test('should enable and disable', () => {
      monitor.enable();
      expect(monitor.isEnabled()).toBe(true);
      
      monitor.disable();
      expect(monitor.isEnabled()).toBe(false);
    });

    test('should record metrics when enabled', () => {
      monitor.enable();
      const stopTimer = monitor.startTimer('test');
      stopTimer();
      
      const metrics = monitor.getMetrics('test') as utils.PerformanceMetrics;
      expect(metrics.totalCalls).toBe(1);
      expect(metrics.totalTime).toBeGreaterThan(0);
    });

    test('should not record metrics when disabled', () => {
      const stopTimer = monitor.startTimer('test');
      stopTimer();
      
      const metrics = monitor.getMetrics('test') as utils.PerformanceMetrics;
      expect(metrics.totalCalls).toBe(0);
    });

    test('should record cache hits and misses', () => {
      monitor.enable();
      monitor.recordCacheHit('test');
      monitor.recordCacheMiss('test');
      
      const metrics = monitor.getMetrics('test') as utils.PerformanceMetrics;
      expect(metrics.cacheHits).toBe(1);
      expect(metrics.cacheMisses).toBe(1);
    });

    test('should reset metrics', () => {
      monitor.enable();
      monitor.startTimer('test')();
      monitor.reset('test');
      
      const metrics = monitor.getMetrics('test') as utils.PerformanceMetrics;
      expect(metrics.totalCalls).toBe(0);
    });

    test('should generate report', () => {
      monitor.enable();
      monitor.startTimer('test')();
      monitor.recordCacheHit('test');
      
      const report = monitor.getReport();
      expect(report).toContain('Performance Report');
      expect(report).toContain('test:');
      expect(report).toContain('Total calls: 1');
    });

    test('should handle getMetrics without operation parameter', () => {
      monitor.enable();
      monitor.startTimer('test1')();
      monitor.startTimer('test2')();
      
      // Line 86: return new Map(this.metrics) when no operation specified
      const allMetrics = monitor.getMetrics() as Map<string, utils.PerformanceMetrics>;
      expect(allMetrics).toBeInstanceOf(Map);
      expect(allMetrics.has('test1')).toBe(true);
      expect(allMetrics.has('test2')).toBe(true);
    });

    test('should handle reset without operation parameter', () => {
      monitor.enable();
      monitor.startTimer('test1')();
      monitor.startTimer('test2')();
      
      // Verify metrics exist
      expect((monitor.getMetrics() as Map<string, utils.PerformanceMetrics>).size).toBeGreaterThan(0);
      
      // Line 93: this.metrics.clear() when no operation specified
      monitor.reset();
      
      // All metrics should be cleared
      expect((monitor.getMetrics() as Map<string, utils.PerformanceMetrics>).size).toBe(0);
    });

    test('should handle reset with specific operation', () => {
      monitor.enable();
      monitor.startTimer('test1')();
      monitor.startTimer('test2')();
      
      // Reset only test1
      monitor.reset('test1');
      
      const allMetrics = monitor.getMetrics() as Map<string, utils.PerformanceMetrics>;
      expect(allMetrics.has('test1')).toBe(false);
      expect(allMetrics.has('test2')).toBe(true);
    });

    test('should throw error when metric creation fails', () => {
      // This test covers the theoretical error case in line 77
      // In practice, this error should never occur since we create the metric
      // before trying to get it, but we test the error path for completeness
      const testMonitor = new utils.PerformanceMonitor();
      testMonitor.enable();
      
      // Mock the internal metrics map to simulate a failure
      const originalGet = Map.prototype.get;
      const mockGet = jest.fn().mockReturnValue(undefined);
      
      // Replace the get method temporarily
      Object.defineProperty(testMonitor['metrics'], 'get', {
        value: mockGet,
        configurable: true
      });
      
      // This should trigger the error on line 77
      expect(() => {
        testMonitor['getOrCreateMetric']('test');
      }).toThrow("Metric 'test' should exist after creation");
      
      // Restore original method
      Object.defineProperty(testMonitor['metrics'], 'get', {
        value: originalGet,
        configurable: true
      });
    });
  });

  describe('Inspect', () => {
    test('should inspect primitives', () => {
      expect(utils.inspect(42)).toBe('42');
      expect(utils.inspect('hello')).toBe("'hello'");
      expect(utils.inspect(true)).toBe('true');
      expect(utils.inspect(null)).toBe('null');
      expect(utils.inspect(undefined)).toBe('undefined');
    });

    test('should inspect arrays', () => {
      expect(utils.inspect([])).toBe('[]');
      expect(utils.inspect([1, 2, 3])).toBe('[1, 2, 3]');
    });

    test('should inspect objects', () => {
      expect(utils.inspect({})).toBe('{}');
      expect(utils.inspect({ a: 1 })).toBe("{a: 1}");
    });

    test('should handle circular references', () => {
      const obj: any = { a: 1 };
      obj.b = obj;
      const result = utils.inspect(obj);
      expect(result).toContain('[Circular]');
    });

    test('should inspect functions', () => {
      function testFunc() {}
      expect(utils.inspect(testFunc)).toBe('[Function: testFunc]');
      
      const arrow = () => {};
      expect(utils.inspect(arrow)).toBe('[Function: arrow]');
    });

    test('should inspect with options', () => {
      const longString = 'a'.repeat(300);
      const result = utils.inspect(longString, { maxStringLength: 10 });
      expect(result).toBe("'aaaaaaaaaa...'");
    });

    test('should inspect type details', () => {
      const result = utils.inspectType([1, 2, 3]);
      expect(result).toContain('Type: array');
      expect(result).toContain('Constructor: Array');
      expect(result).toContain('Flags: built-in, iterable');
    });
  });

  describe('Helpers', () => {
    test('should validate types', () => {
      expect(utils.isValidType('string')).toBe(true);
      expect(utils.isValidType('number')).toBe(true);
      expect(utils.isValidType('invalid')).toBe(false);
    });

    test('should get type category', () => {
      expect(utils.getTypeCategory('string')).toBe('primitive');
      expect(utils.getTypeCategory('array')).toBe('object');
      expect(utils.getTypeCategory('map')).toBe('collection');
      expect(utils.getTypeCategory('int8array')).toBe('typedarray');
      expect(utils.getTypeCategory('promise')).toBe('modern');
      
      // Test lines 41-49: additional categories including DOM and special fallback
      expect(utils.getTypeCategory('buffer')).toBe('node');
      expect(utils.getTypeCategory('stream')).toBe('node');
      expect(utils.getTypeCategory('eventemitter')).toBe('node');
      
      // Test lines 45-47: DOM types category
      expect(utils.getTypeCategory('element')).toBe('dom');
      expect(utils.getTypeCategory('node')).toBe('dom');
      expect(utils.getTypeCategory('window')).toBe('dom');
      expect(utils.getTypeCategory('document')).toBe('dom');
      
      // Test line 49: special fallback category
      expect(utils.getTypeCategory('proxy')).toBe('special');
      expect(utils.getTypeCategory('global')).toBe('special');
      expect(utils.getTypeCategory('arguments')).toBe('special');
      expect(utils.getTypeCategory('unknown-type')).toBe('special');
    });

    test('should compare types', () => {
      expect(utils.compareTypes('hello', 'world')).toBe(true);
      expect(utils.compareTypes('hello', 42)).toBe(false);
    });

    test('should check type of any', () => {
      expect(utils.isTypeOfAny(42, ['number', 'string'])).toBe(true);
      expect(utils.isTypeOfAny(42, ['string', 'boolean'])).toBe(false);
    });

    test('should check type of all', () => {
      expect(utils.isTypeOfAll([1, 2, 3], 'number')).toBe(true);
      expect(utils.isTypeOfAll([1, 'two', 3], 'number')).toBe(false);
    });

    test('should group by type', () => {
      const values = [1, 'two', 3, 'four'];
      const groups = utils.groupByType(values);
      expect(groups.get('number')).toEqual([1, 3]);
      expect(groups.get('string')).toEqual(['two', 'four']);
    });

    test('should get type stats', () => {
      const values = [1, 'two', 3, 'four'];
      const stats = utils.getTypeStats(values);
      expect(stats.number).toBe(2);
      expect(stats.string).toBe(2);
    });

    test('should filter by type', () => {
      const values = [1, 'two', 3, 'four'];
      const numbers = utils.filterByType(values, 'number');
      expect(numbers).toEqual([1, 3]);
    });

    test('should find by type', () => {
      const values = [1, 'two', 3, 'four'];
      const firstString = utils.findByType(values, 'string');
      expect(firstString).toBe('two');
    });

    test('should check some/every/none of type', () => {
      const values = [1, 'two', 3];
      expect(utils.someOfType(values, 'string')).toBe(true);
      expect(utils.everyOfType(values, 'number')).toBe(false);
      expect(utils.noneOfType(values, 'boolean')).toBe(true);
    });

    test('should count by type', () => {
      const values = [1, 'two', 3, 'four'];
      expect(utils.countByType(values, 'number')).toBe(2);
      expect(utils.countByType(values, 'string')).toBe(2);
    });

    test('should get unique types', () => {
      const values = [1, 'two', 3, 'four', true];
      const types = utils.getUniqueTypes(values);
      expect(types).toEqual(['number', 'string', 'boolean']);
    });

    test('should get most/least common type', () => {
      const values = [1, 'two', 3, 'four', 5];
      expect(utils.getMostCommonType(values)).toBe('number');
      expect(utils.getLeastCommonType(values)).toBe('string');
    });

    test('should check homogeneous/heterogeneous', () => {
      expect(utils.isHomogeneous([1, 2, 3])).toBe(true);
      expect(utils.isHomogeneous([1, 'two', 3])).toBe(false);
      expect(utils.isHeterogeneous([1, 'two', 3])).toBe(true);
    });

    test('should partition arrays', () => {
      const values = [1, 2, 3, 4, 5];
      const [evens, odds] = utils.partition(values, x => (x as number) % 2 === 0);
      expect(evens).toEqual([2, 4]);
      expect(odds).toEqual([1, 3, 5]);
    });

    test('should partition by type', () => {
      const values = [1, 'two', 3, 'four'];
      const [numbers, others] = utils.partitionByType(values, 'number');
      expect(numbers).toEqual([1, 3]);
      expect(others).toEqual(['two', 'four']);
    });

    test('should create type map', () => {
      // Test lines 125-126: createTypeMap function
      const values = [1, 'two', 3, 'four', true];
      const typeMap = utils.createTypeMap(values);
      
      // createTypeMap should return the same as groupByType
      const groupByResult = utils.groupByType(values);
      expect(typeMap).toEqual(groupByResult);
      
      // Verify the actual content
      expect(typeMap.get('number')).toEqual([1, 3]);
      expect(typeMap.get('string')).toEqual(['two', 'four']);
      expect(typeMap.get('boolean')).toEqual([true]);
    });
  });
});