import { describe, it, expect } from 'vitest';
import { IoColorSwatch } from '@io-gui/colors';
const element = new IoColorSwatch();
element.style.display = 'none';
document.body.appendChild(element);
describe('IoColorSwatch', () => {
    it('Should be defined', () => {
        expect(IoColorSwatch).toBeDefined();
    });
});
//# sourceMappingURL=IoColorSwatch.test.js.map