import { describe, it, expect } from 'vitest';
import { nextQueue } from '@io-gui/core';
import { IoSlider } from '@io-gui/sliders';
const element = new IoSlider();
describe('IoSlider', () => {
    it('Should initialize properties correctly', () => {
        expect(element.value).toBe(0);
        expect(element.step).toBe(0.01);
        expect(element.min).toBe(0);
        expect(element.max).toBe(1);
    });
    it('has correct default attributes', () => {
        expect(element.getAttribute('tabIndex')).toBe('0');
        expect(element.getAttribute('contenteditable')).toBe(null);
    });
    it('has correct default innerHTML', () => {
    });
    it('should render innerHTML', () => {
    });
    it('should change...', () => {
    });
    it('has reactive attributes', () => {
    });
    it('has a11y attributes', async () => {
        expect(element.getAttribute('role')).toBe('slider');
        element.value = 0.1;
        await nextQueue();
        expect(element.getAttribute('aria-valuenow')).toBe('0.1');
        element.min = 0;
        await nextQueue();
        expect(element.getAttribute('aria-valuemin')).toBe('0');
        element.max = 1;
        await nextQueue();
        expect(element.getAttribute('aria-valuemax')).toBe('1');
    });
});
//# sourceMappingURL=IoSlider.test.js.map