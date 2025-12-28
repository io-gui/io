import { describe, it, expect } from 'vitest';
import { IoColorRgba } from '@io-gui/colors';
const element = new IoColorRgba();
element.style.display = 'none';
document.body.appendChild(element);
describe('IoColorRgba.test', () => {
    it('Should be defined', () => {
        expect(IoColorRgba).toBeDefined();
    });
});
//# sourceMappingURL=IoColorRgba.test.js.map