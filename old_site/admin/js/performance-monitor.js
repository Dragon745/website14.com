// Performance Monitor for Firestore Operations
export class PerformanceMonitor {
    constructor() {
        this.readCount = 0;
        this.cacheHits = 0;
        this.cacheMisses = 0;
        this.startTime = Date.now();
        this.operations = [];
    }

    // Track a read operation
    trackRead(operation, documentCount = 1) {
        this.readCount += documentCount;
        this.operations.push({
            type: 'read',
            operation,
            documentCount,
            timestamp: Date.now()
        });
        this.updateDisplay();
    }

    // Track cache hit
    trackCacheHit() {
        this.cacheHits++;
        this.updateDisplay();
    }

    // Track cache miss
    trackCacheMiss() {
        this.cacheMisses++;
        this.updateDisplay();
    }

    // Get performance summary
    getSummary() {
        const totalCacheAttempts = this.cacheHits + this.cacheMisses;
        const cacheHitRate = totalCacheAttempts > 0 ? (this.cacheHits / totalCacheAttempts * 100).toFixed(1) : 0;
        const uptime = Math.floor((Date.now() - this.startTime) / 1000);

        return {
            totalReads: this.readCount,
            cacheHits: this.cacheHits,
            cacheMisses: this.cacheMisses,
            cacheHitRate: `${cacheHitRate}%`,
            uptime: `${uptime}s`,
            operations: this.operations.length
        };
    }

    // Update the performance display
    updateDisplay() {
        const summary = this.getSummary();
        const performanceElement = document.getElementById('performance-stats');

        if (performanceElement) {
            performanceElement.innerHTML = `
                <div class="text-xs text-gray-500 space-y-1">
                    <div>📊 Reads: ${summary.totalReads}</div>
                    <div>💾 Cache: ${summary.cacheHitRate} (${summary.cacheHits}/${summary.cacheHits + summary.cacheMisses})</div>
                    <div>⏱️ Uptime: ${summary.uptime}</div>
                </div>
            `;
        }
    }

    // Reset counters
    reset() {
        this.readCount = 0;
        this.cacheHits = 0;
        this.cacheMisses = 0;
        this.operations = [];
        this.startTime = Date.now();
        this.updateDisplay();
    }

    // Export performance data
    exportData() {
        return {
            summary: this.getSummary(),
            operations: this.operations,
            timestamp: new Date().toISOString()
        };
    }
}

// Global performance monitor instance
window.performanceMonitor = new PerformanceMonitor(); 