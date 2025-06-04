import { describe, it, expect, vi } from 'vitest';
import { formatNumber } from './utils.js';



describe('formatNumber', () => {
    
    it('Should parse a simple string with a number only', () => {
        expect(formatNumber(2)).toBe("2");
    });
    it('Should parse a simple string with a string only', () => {
        expect(formatNumber("hello")).toBe("hello");
    });
    it('Should parse a string with a number and a string', () => {
        expect(formatNumber("2 kilos")).toBe("2 kilos");
        expect(formatNumber("about 2 kilos")).toBe("about 2 kilos");
    });
    it('Should parse a string with a scaled number and a string', () => {
        expect(formatNumber("2 kilos", true, 2)).toBe("4 kilos");
        expect(formatNumber("2 kilos", true, 0.5)).toBe("1 kilos");
    });
    it('Should parse a string with a scaled number with decimals', () => {
        expect(formatNumber("2.5 kilos", true, 2)).toBe("5 kilos");
    });
    it('Should parse a string with a scaled number with decimals, rounding to une decimal', () => {
        expect(formatNumber("2.55 kilos")).toBe("2.5 kilos");
        expect(formatNumber("1 kilos", false, 0.3333333)).toBe("0.3 kilos");
    });
    it('Should convert to fractions', () => {
        expect(formatNumber(0.33333, true)).toBe("1/3");
        expect(formatNumber(0.5, true)).toBe("1/2");
        expect(formatNumber(0.2, true)).toBe("1/5");
    });

    
});