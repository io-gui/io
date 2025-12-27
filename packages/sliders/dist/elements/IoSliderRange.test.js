import { describe, it, expect } from 'vitest';
import { nextQueue } from '@io-gui/core';
import { IoSliderRange } from '@io-gui/sliders';
const element = new IoSliderRange();
element.style.display = 'none';
document.body.appendChild(element);
function reset() {
    element.value = [0, 1];
    element.step = 0.01;
    element.min = 0;
    element.max = 1;
}
describe('IoSliderRange', () => {
    it('has default values', () => {
        reset();
        expect(element.value[0]).toBe(0);
        expect(element.value[1]).toBe(1);
        expect(element.step).toBe(0.01);
        expect(element.min).toBe(0);
        expect(element.max).toBe(1);
    });
    it('has tabIndex attribute', () => {
        expect(element.getAttribute('tabIndex')).toBe('0');
    });
    it('has contenteditable attribute on number field', () => {
        expect(element.getAttribute('contenteditable')).toBe(null);
    });
    it('has a11y attributes', async () => {
        reset();
        expect(element.getAttribute('role')).toBe('slider');
        await nextQueue();
        element.min = 0;
        expect(element.getAttribute('aria-valuemin')).toBe('0');
        await nextQueue();
        element.max = 1;
        expect(element.getAttribute('aria-valuemax')).toBe('1');
    });
});
//# sourceMappingURL=IoSliderRange.test.js.map