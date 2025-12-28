import { describe, it, expect } from 'vitest';
import { IoOptionSelect, MenuOption } from '@io-gui/menus';
const element = new IoOptionSelect({ value: '', option: new MenuOption({ id: 'test', options: [] }) });
document.body.appendChild(element);
element.style.display = 'none';
describe('IoOptionSelect', () => {
    it('has default values', () => {
    });
    it('matches values', () => {
        expect(element.textContent).toBe('test');
        element.value = 2;
        expect(element.textContent).toBe('2');
    });
    it('has tabIndex attribute', () => {
    });
    it('has a11y attributes', () => {
    });
});
//# sourceMappingURL=IoOptionSelect.test.js.map