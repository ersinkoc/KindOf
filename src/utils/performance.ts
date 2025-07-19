export interface PerformanceMetrics {
  totalCalls: number;
  totalTime: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  cacheHits: number;
  cacheMisses: number;
}

export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private enabled = false;

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  startTimer(operation: string): () => void {
    if (!this.enabled) {
      return () => {};
    }

    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(operation, duration);
    };
  }

  recordCacheHit(operation: string): void {
    if (!this.enabled) return;

    const metric = this.getOrCreateMetric(operation);
    metric.cacheHits++;
  }

  recordCacheMiss(operation: string): void {
    if (!this.enabled) return;

    const metric = this.getOrCreateMetric(operation);
    metric.cacheMisses++;
  }

  private recordMetric(operation: string, duration: number): void {
    const metric = this.getOrCreateMetric(operation);
    
    metric.totalCalls++;
    metric.totalTime += duration;
    metric.averageTime = metric.totalTime / metric.totalCalls;
    metric.minTime = Math.min(metric.minTime, duration);
    metric.maxTime = Math.max(metric.maxTime, duration);
  }

  private getOrCreateMetric(operation: string): PerformanceMetrics {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, {
        totalCalls: 0,
        totalTime: 0,
        averageTime: 0,
        minTime: Infinity,
        maxTime: 0,
        cacheHits: 0,
        cacheMisses: 0,
      });
    }
    const metric = this.metrics.get(operation);
    if (!metric) {
      throw new Error(`Metric '${operation}' should exist after creation`);
    }
    return metric;
  }

  getMetrics(operation?: string): PerformanceMetrics | Map<string, PerformanceMetrics> {
    if (operation) {
      return this.metrics.get(operation) || this.getOrCreateMetric(operation);
    }
    return new Map(this.metrics);
  }

  reset(operation?: string): void {
    if (operation) {
      this.metrics.delete(operation);
    } else {
      this.metrics.clear();
    }
  }

  getReport(): string {
    const report: string[] = ['Performance Report:', ''];
    
    for (const [operation, metrics] of this.metrics) {
      report.push(`${operation}:`);
      report.push(`  Total calls: ${metrics.totalCalls}`);
      report.push(`  Total time: ${metrics.totalTime.toFixed(2)}ms`);
      report.push(`  Average time: ${metrics.averageTime.toFixed(2)}ms`);
      report.push(`  Min time: ${metrics.minTime.toFixed(2)}ms`);
      report.push(`  Max time: ${metrics.maxTime.toFixed(2)}ms`);
      report.push(`  Cache hits: ${metrics.cacheHits}`);
      report.push(`  Cache misses: ${metrics.cacheMisses}`);
      if (metrics.cacheHits + metrics.cacheMisses > 0) {
        const hitRate = (metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses)) * 100;
        report.push(`  Cache hit rate: ${hitRate.toFixed(1)}%`);
      }
      report.push('');
    }
    
    return report.join('\n');
  }
}

export const performanceMonitor = new PerformanceMonitor();