/**
 * @param {Function} fn
 * @param {number} maxCacheSize
 */
export function memo(fn, maxCacheSize = 10) {
    const cache = new Map();

    return function (...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {

            const cachedResult = cache.get(key);
            cache.delete(key);
            cache.set(key, cachedResult);
            
            return cachedResult;
        }

        const result = fn(...args);

        if (cache.size >= maxCacheSize) {
            const oldestKey = cache.keys().next().value;
            cache.delete(oldestKey);
        }

        cache.set(key, result);
        return result;
    };
}