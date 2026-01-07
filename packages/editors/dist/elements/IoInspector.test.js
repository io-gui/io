import { describe, it, expect } from 'vitest';
import { IoInspector } from '@io-gui/editors';
const element = new IoInspector();
element.style.display = 'none';
document.body.appendChild(element);
describe('IoInspector', () => {
    it('has default values', () => {
        expect(JSON.stringify(element.value)).toBe(JSON.stringify({}));
        expect(JSON.stringify(element.config)).toBe(JSON.stringify([]));
    });
});
//# sourceMappingURL=IoInspector.test.js.map