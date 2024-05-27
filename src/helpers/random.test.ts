import { choose } from './random';

describe('choose function', () => {
    it('should return undefined for an empty array', () => {
        const result = choose([]);
        expect(result).toBeUndefined();
    });

    it('should return a single value for an array with one item', () => {
        const result = choose(['test']);
        expect(result).toBe('test');
    });

    it('should return a value from the array for multiple items', () => {
        const array = [1, 2, 3, 4, 5];
        const result = choose(array);
        expect(array).toContain(result);
    });
});
