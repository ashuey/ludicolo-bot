import {SimpleMemoryCache} from './SimpleMemoryCache';

const testKey = 'testKey';
const testValue = 'testValue';
const testTTL = 3; // 3 seconds

describe('SimpleMemoryCache', () => {
    let cache: SimpleMemoryCache;

    beforeEach(() => {
        jest.useFakeTimers();
        cache = new SimpleMemoryCache();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('sets and retrieves a key', () => {
        cache.set(testKey, testValue, testTTL);
        expect(cache.get(testKey)).toEqual(testValue);
    });

    it('returns undefined for nonexistent key', () => {
        expect(cache.get(testKey)).toBeUndefined();
    });

    it('deletes a key', () => {
        cache.set(testKey, testValue, testTTL);
        cache.delete(testKey);
        expect(cache.get(testKey)).toBeUndefined();
    });

    it('clears all keys', () => {
        cache.set(testKey, testValue, testTTL);
        cache.clear();
        expect(cache.get(testKey)).toBeUndefined();
    });

    it('retrieves multiple keys', () => {
        cache.set(testKey, testValue, testTTL);
        const result = cache.getMultiple([testKey]);
        expect(result[testKey]).toEqual(testValue);
    });

    it('sets multiple keys', () => {
        cache.setMultiple({[testKey]: testValue}, testTTL);
        expect(cache.get(testKey)).toEqual(testValue);
    });

    it('deletes multiple keys', () => {
        cache.set(testKey, testValue, testTTL);
        cache.deleteMultiple([testKey]);
        expect(cache.get(testKey)).toBeUndefined();
    });

    it('checks if key exists', () => {
        cache.set(testKey, testValue, testTTL);
        expect(cache.has(testKey)).toEqual(true);
        cache.delete(testKey);
        expect(cache.has(testKey)).toEqual(false);
    });

    it('cleans up expired keys', () => {
        cache.set(testKey, testValue, 1); // TTL of 1 second
        jest.advanceTimersByTime(2000); // Advance timer by 2 seconds to exceed TTL
        cache.cleanup();
        expect(cache.get(testKey)).toBeUndefined();
    });
});
