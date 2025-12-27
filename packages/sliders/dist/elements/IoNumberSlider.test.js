import { describe, it, expect } from 'vitest';
import { nextQueue } from '@io-gui/core';
import { IoNumberSlider } from '@io-gui/sliders';
const element = new IoNumberSlider();
element.style.display = 'none';
document.body.appendChild(element);
describe('IoNumberSlider', () => {
    it('has default values', () => {
        expect(element.value).toBe(0);
        expect(element.step).toBe(0.01);
        expect(element.min).toBe(0);
        expect(element.max).toBe(1);
    });
    it('matches values', async () => {
        element.value = 0;
        await nextQueue();
        expect(element.$.number.innerText).toBe('0');
        element.value = 1;
        await nextQueue();
        expect(element.$.number.innerText).toBe('1');
        element.value = 0.1;
        await nextQueue();
        expect(element.$.number.innerText).toBe('0.1');
        element.value = 0.01;
        await nextQueue();
        expect(element.$.number.innerText).toBe('0.01');
        element.value = 0.001;
        await nextQueue();
        expect(element.$.number.innerText).toBe('0');
    });
    it('has tabIndex attribute', () => {
        expect(element.$.number.getAttribute('tabIndex')).toBe('0');
        expect(element.$.slider.getAttribute('tabIndex')).toBe('0');
    });
    it('has contenteditable attribute on number field', () => {
        expect(element.getAttribute('contenteditable')).toBe(null);
        expect(element.$.number.getAttribute('contenteditable')).toBe('true');
        expect(element.$.slider.getAttribute('contenteditable')).toBe(null);
    });
    it('has a11y attributes', async () => {
        expect(element.$.slider.getAttribute('role')).toBe('slider');
        element.value = 0.1;
        await nextQueue();
        console.log(element.$.slider);
        expect(element.$.slider.getAttribute('aria-valuenow')).toBe('0.1');
        element.min = 0;
        await nextQueue();
        expect(element.$.slider.getAttribute('aria-valuemin')).toBe('0');
    });
});
//# sourceMappingURL=IoNumberSlider.test.js.map