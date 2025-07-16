import { sum, formatPrice } from '../exampleUtil';

describe('exampleUtil', () => {
  describe('sum', () => {
    it('adds two numbers correctly', () => {
      expect(sum(1, 2)).toBe(3);
      expect(sum(0, 0)).toBe(0);
      expect(sum(-1, 1)).toBe(0);
    });
  });

  describe('formatPrice', () => {
    it('formats price correctly', () => {
      expect(formatPrice(299)).toBe('$299');
      expect(formatPrice(0)).toBe('$0');
      expect(formatPrice(1299)).toBe('$1299');
    });
  });
}); 