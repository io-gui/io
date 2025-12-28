import { describe, it, expect } from 'vitest';
import { IoBoolean } from '@io-gui/inputs';
const element = new IoBoolean();
element.style.display = 'none';
document.body.appendChild(element);
describe('IoBoolean.test', () => {
    it('Should have core API functions defined', () => {
        expect(typeof element.toggle).toBe('function');
    });
    it('Should initialize properties correctly', () => {
        expect(element.value).toBe(false);
        expect(element.true).toBe('true');
        expect(element.false).toBe('false');
        expect(element.role).toBe('checkbox');
        expect(element._reactiveProperties.get('value')).toEqual({
            binding: undefined,
            init: undefined,
            reflect: true,
            type: Boolean,
            value: false,
        });
        expect(element._reactiveProperties.get('true')).toEqual({
            binding: undefined,
            init: undefined,
            reflect: false,
            type: String,
            value: 'true',
        });
        expect(element._reactiveProperties.get('false')).toEqual({
            binding: undefined,
            init: undefined,
            reflect: false,
            type: String,
            value: 'false',
        });
    });
    it('has correct default attributes', () => {
        expect(element.getAttribute('role')).toBe('checkbox');
        expect(element.getAttribute('value')).toBe(null);
        expect(element.getAttribute('aria-checked')).toBe('false');
    });
    it('has correct default innerHTML', () => {
        expect(element.innerHTML).toBe('<span>false</span>');
    });
    it('should set innerText to match value property', () => {
        expect(element.innerText).toBe(element.false);
        element.toggle();
        expect(element.innerText).toBe(element.true);
        element.true = 'yes';
        element.false = 'no';
        expect(element.innerText).toBe('yes');
        element.toggle();
        expect(element.innerText).toBe('no');
        element.value = false;
        element.true = 'true';
        element.false = 'false';
    });
    it('should not render innerHTML if no value string is computed', () => {
        element.true = '';
        element.false = '';
        expect(element.innerHTML).toBe('');
        element.toggle();
        expect(element.innerHTML).toBe('');
        element.toggle();
        element.true = 'true';
        element.false = 'false';
    });
    it('has reactive attributes', () => {
        element.value = false;
        expect(element.getAttribute('value')).toBe(null);
        element.value = true;
        expect(element.getAttribute('value')).toBe('');
        element.value = false;
    });
    it('has a11y attributes', () => {
        element.value = false;
        expect(element.getAttribute('aria-checked')).toBe('false');
        element.value = true;
        expect(element.getAttribute('aria-checked')).toBe('true');
        element.value = false;
    });
});
//# sourceMappingURL=IoBoolean.test.js.map