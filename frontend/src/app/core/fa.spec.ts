import { describe, expect, it } from 'vitest';
import { parseNumber } from './fa';

describe('parseNumber', () => {
  it('reads Persian digits and decimal separator', () => expect(parseNumber('۳٫۲۵')).toBe(3.25));
  it('strips thousands separators', () => expect(parseNumber('۹٬۸۵۰٬۰۰۰')).toBe(9850000));
  it('reads Latin with commas', () => expect(parseNumber('1,250,000')).toBe(1250000));
  it('rejects text', () => expect(parseNumber('abc')).toBeNaN());
  it('rejects empty', () => expect(parseNumber('')).toBeNaN());
});
