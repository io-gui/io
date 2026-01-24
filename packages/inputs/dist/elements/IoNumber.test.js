import { describe, it, expect } from 'vitest';
import { IoNumber } from '@io-gui/inputs';
const element = new IoNumber();
element.style.display = 'none';
document.body.appendChild(element);
describe('IoNumber.test', () => {
    it('Should initialize properties correctly', () => {
        expect(element.value).toBe(0);
        expect(element.conversion).toBe(1);
        expect(element.step).toBe(0.0001);
        expect(element.min).toBe(-Infinity);
        expect(element.max).toBe(Infinity);
        expect(element.ladder).toBe(false);
        expect(element.pattern).toBe('pattern="-?[0-9]*?[0-9]*"');
        expect(element.inputMode).toBe('text');
        expect(element.role).toBe('textbox');
        expect(element.spellcheck).toBe(false);
        expect(element._reactiveProperties.get('conversion')).toEqual({
            binding: undefined,
            init: undefined,
            reflect: false,
            type: Number,
            value: 1,
            observer: { type: 'none', observing: false },
        });
        expect(element._reactiveProperties.get('step')).toEqual({
            binding: undefined,
            init: undefined,
            reflect: false,
            type: Number,
            value: 0.0001,
            observer: { type: 'none', observing: false },
        });
        expect(element._reactiveProperties.get('min')).toEqual({
            binding: undefined,
            init: undefined,
            reflect: false,
            type: Number,
            value: -Infinity,
            observer: { type: 'none', observing: false },
        });
        expect(element._reactiveProperties.get('max')).toEqual({
            binding: undefined,
            init: undefined,
            reflect: false,
            type: Number,
            value: Infinity,
            observer: { type: 'none', observing: false },
        });
    });
    it('has correct default attributes', () => {
        expect(element.getAttribute('value')).toBe('0');
        expect(element.getAttribute('role')).toBe('textbox');
        expect(element.getAttribute('pattern')).toBe('pattern="-?[0-9]*?[0-9]*"');
        expect(element.getAttribute('inputmode')).toBe('text');
        expect(element.getAttribute('spellcheck')).toBe('false');
        expect(element.getAttribute('positive')).toBe('');
        expect(element.getAttribute('aria-valuenow')).toBe('0');
        expect(element.getAttribute('aria-valuemin')).toBe('-Infinity');
        expect(element.getAttribute('aria-valuemax')).toBe('Infinity');
        expect(element.getAttribute('aria-valuestep')).toBe('0.0001');
        expect(element.getAttribute('aria-invalid')).toBe(null);
    });
    it('has correct default innerHTML', () => {
        expect(element.innerHTML).toBe('0');
    });
    it('should set innerText to match value property', () => {
        element.value = 0;
        element.step = 1;
        expect(element.innerText).toBe('0');
        element.step = 0.1;
        expect(element.innerText).toBe('0');
        element.value = 'hello';
        expect(element.innerText).toBe('NaN');
        element.value = false;
        expect(element.innerText).toBe('NaN');
        element.value = null;
        expect(element.innerText).toBe('NaN');
        element.value = undefined;
        expect(element.innerText).toBe('NaN');
        element.value = NaN;
        expect(element.innerText).toBe('NaN');
        element.value = 123;
        expect(element.innerText).toBe('123');
        element.step = 0.0001;
        element.value = 0;
    });
    it('should set innerText to match value with custom step settings', () => {
        element.step = 0.000000001;
        element.value = 0.012345678;
        expect(element.innerText).toBe('0.012345678');
        element.step = 0.000001;
        expect(element.innerText).toBe('0.012346');
        element.step = 0.01;
        expect(element.innerText).toBe('0.01');
        element.step = 0.0001;
        element.value = 0;
    });
    it('should set innerText to match value with custom min/max settings', () => {
        element.step = 1;
        element.min = 2;
        element.max = 5;
        element.textNode = '10';
        element._setFromTextNode();
        expect(element.value).toBe(5);
        element.textNode = '0';
        element._setFromTextNode();
        expect(element.value).toBe(2);
        element.step = 0.0001;
        element.value = 0;
        element.min = -Infinity;
        element.max = Infinity;
    });
    it('should set innerText to match value with conversion factor', () => {
        element.conversion = 0.1;
        element.value = 1;
        expect(element.innerText).toBe('0.1');
        element.conversion = 0.01;
        expect(element.innerText).toBe('0.01');
        element.textNode = '10';
        element._setFromTextNode();
        expect(element.value).toBe(1000);
        element.value = 0;
        element.conversion = 1;
    });
    it('has reactive attributes', () => {
        element.value = 1;
        expect(element.getAttribute('value')).toBe('1');
        expect(element.getAttribute('positive')).toBe('');
        element.value = -2;
        expect(element.getAttribute('value')).toBe('-2');
        expect(element.getAttribute('positive')).toBe(null);
        element.value = 0;
        expect(element.getAttribute('value')).toBe('0');
        expect(element.getAttribute('positive')).toBe('');
    });
    it('has contenteditable attribute', () => {
        expect(element.getAttribute('contenteditable')).toBe('true');
    });
    it('has a11y attributes', () => {
        element.value = '';
        expect(element.getAttribute('aria-invalid')).toBe('true');
        element.value = 0;
        expect(element.getAttribute('aria-invalid')).toBe(null);
        element.value = 12;
        element.min = 0;
        element.max = 24;
        element.step = 2;
        expect(element.getAttribute('aria-valuenow')).toBe('12');
        expect(element.getAttribute('aria-valuemin')).toBe('0');
        expect(element.getAttribute('aria-valuemax')).toBe('24');
        expect(element.getAttribute('aria-valuestep')).toBe('2');
        element.value = 0;
        element.min = -Infinity;
        element.max = Infinity;
        element.step = 0.0001;
    });
});
//# sourceMappingURL=IoNumber.test.js.map