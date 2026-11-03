// TODO (you): an in-memory cache where each entry expires after a set time.
// It needs a way to get a value (counting a hit or a miss), store a value,
// and report { entries, hits, misses, ttlSeconds }. The exact counting rules
// are on the assignment page. A Map with { value, expiresAt } entries works well.

export class TtlCache {
    constructor(ttlSeconds) {
        this.ttlSeconds = ttlSeconds;
        this.store = new Map();
        this.hits = 0;
        this.misses = 0;
    }
    // to get a value, counting a hit or a miss
    get(key) {
        const entry = this.store.get(key);

        // not in the cache
        if (entry === undefined) {
            this.misses++;
            return undefined;
        }
        // expired
        if (Date.now() >= entry.expiresAt) {
            this.store.delete(key);
            this.misses++;
            return undefined;
        }
        
        // found and still valid
        this.hits++;
        return entry.value;
    }

    // to store a valuewith expiry time
    set(key, value) {
        this.store.set(key, {
            value: value,
            expiresAt: Date.now() + this.ttlSeconds * 1000,
        });
    }

    // to report { entries, hits, misses, ttlSeconds }
    stats() {
         const now = Date.now();
        // Remove expired entries
        for (const [key, entry] of this.store) {
            if (now >= entry.expiresAt) {
                this.store.delete(key);
            }
        }

        return {
            entries: this.store.size,
            hits: this.hits,
            misses: this.misses,
            ttlSeconds: this.ttlSeconds,
        };
    }
}