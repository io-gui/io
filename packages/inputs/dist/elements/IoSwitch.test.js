import { describe, it, expect } from 'vitest';
import { IoSwitch } from '@io-gui/inputs';
const element = new IoSwitch();
element.style.display = 'none';
document.body.appendChild(element);
describe('IoSwitch.test', () => {
    it('has default values', () => {
        expect(element.value).toBe(false);
    });
    it('has tabIndex attribute', () => {
        expect(element.getAttribute('tabIndex')).toBe('0');
    });
    it('has a11y attributes', () => {
        expect(element.getAttribute('role')).toBe('checkbox');
        expect(element.getAttribute('aria-label')).toBe(null);
    });
    it('has value attribute when value is true', () => {
        element.value = false;
        expect(element.hasAttribute('value')).toBe(false);
        expect(element.getAttribute('value')).toBe(null);
        expect(element.getAttribute('aria-checked')).toBe('false');
        element.value = true;
        expect(element.hasAttribute('value')).toBe(true);
        expect(element.getAttribute('value')).toBe('');
        expect(element.getAttribute('aria-checked')).toBe('true');
    });
    it('has title attribute', () => {
        element.title = 'click here';
        expect(element.getAttribute('title')).toBe('click here');
        element.title = 'Button';
    });
});
//# sourceMappingURL=IoSwitch.test.js.map