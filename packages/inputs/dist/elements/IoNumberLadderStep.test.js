import { describe, it, expect } from 'vitest';
import { IoNumberLadderStep } from '@io-gui/inputs';
const step = new IoNumberLadderStep({ value: 1, label: '1' });
step.style.display = 'none';
document.body.appendChild(step);
describe('IoNumberLadderStep.test', () => {
    it('Should initialize properties correctly', () => {
        expect(step.value).toBe(1);
        expect(step.role).toBe('spinbutton');
    });
    it('has correct default attributes', () => {
        expect(step.getAttribute('value')).toBe(null);
        expect(step.getAttribute('role')).toBe('spinbutton');
    });
    it('has correct default innerHTML', () => {
        step.label = '1';
        expect(step.innerHTML).toBe('<span>1</span>');
    });
    it('should set innerText to match label property', () => {
        step.label = '0';
        expect(step.textContent).toBe('0');
        step.label = '1';
    });
});
//# sourceMappingURL=IoNumberLadderStep.test.js.map