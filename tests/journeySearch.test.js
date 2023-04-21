import { it, expect } from 'vitest';
import {journeySearch} from '../functions/journeySearch';

it('should transform numbers to a float type of number', () => {
    const userInput = '1';

    const result = journeySearch(userInput, 0, 1);

    expect(result).toBeTypeOf("number")
}); 


it('should yield NaN for non-transformable values', () => {
    const input = 'value';

    const result = journeySearch(input, 0, 1);

    expect(result).toBeNaN;
});


it('should yield 0 if an empty array is provided to min fields', () => {
    const input = null;
    const value = 0;

    const result = journeySearch(input, value, 1 );

    expect(result).toBe(0);
});


it('should yield infinity if an empty array is provided to max fields', () => {
    const input = null;
    const value = Infinity;

    const result = journeySearch(input, value, 1 );

    expect(result).toBe(Infinity);
});