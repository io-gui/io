import { describe, it, expect } from 'vitest';
import { nextQueue } from '@io-gui/core';
import { IoColorBase } from '@io-gui/colors';
const element = new IoColorBase();
element.style.display = 'none';
document.body.appendChild(element);
describe('IoColorBase.test', () => {
    it('Should have core API functions defined', () => {
        expect(typeof element.rgbFromHsv).toBe('function');
        expect(typeof element.rgbFromHsl).toBe('function');
        expect(typeof element.valueFromRgb).toBe('function');
    });
    it('Should initialize properties correctly', () => {
        expect(element.reactivity).toBe('throttled');
        expect(element.value).toEqual({ r: 1, g: 1, b: 1, a: 1 });
        expect(element.rgba).toEqual([1, 1, 1, 1]);
        expect(element.hsv).toEqual([1, 0, 1]);
        expect(element.hsl).toEqual([1, 1, 1]);
    });
    it('Should convert colors correctly', () => {
        element.hsv = [0.5, 0.5, 0.5];
        expect(element.value).toEqual({ r: 1, g: 1, b: 1, a: 1 });
        expect(element.rgba).toEqual([1, 1, 1, 1]);
        expect(element.hsl).toEqual([1, 1, 1]);
        element.rgbFromHsv();
        expect(element.value).toEqual({ r: 1, g: 1, b: 1, a: 1 });
        expect(element.rgba).toEqual([0.25, 0.5, 0.5, 1]);
        element.valueFromRgb();
        expect(element.value).toEqual({ r: 0.25, g: 0.5, b: 0.5, a: 1 });
    });
    it('Should reactively update on value change', async () => {
        // Ensure throttle delay from previous test has expired
        await nextQueue();
        element.value = { r: 0.25, g: 0.75, b: 1, a: 0.5 };
        // With throttled reactivity, change handler executes immediately on first call after delay
        expect(element.rgba).toEqual([0.25, 0.75, 1, 0.5]);
        expect(element.hsv).toEqual([0.5555555555555557, 0.75, 1]);
        expect(element.hsl).toEqual([0.5555555555555556, 1, 0.625]);
        element.value.r = 0.5;
        element.dispatchMutation(element.value);
        await nextQueue();
        expect(element.rgba).toEqual([0.5, 0.75, 1, 0.5]);
        expect(element.hsv).toEqual([0.5833333333333334, 0.5, 1]);
        expect(element.hsl).toEqual([0.5833333333333334, 1, 0.75]);
    });
});
//# sourceMappingURL=IoColorBase.test.js.map