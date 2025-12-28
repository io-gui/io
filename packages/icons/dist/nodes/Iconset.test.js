import { describe, it, expect } from 'vitest';
import { IconsetSingleton } from '@io-gui/icons';
describe('Iconset.test', () => {
    it('Should have core API functions defined', () => {
        expect(typeof IconsetSingleton.registerIcons).toBe('function');
        expect(typeof IconsetSingleton.getIcon).toBe('function');
    });
    it('Should register and retrieve icons', () => {
        const testicons = '<svg><g id="dummy"><path></path></g></svg>';
        IconsetSingleton.registerIcons('test', testicons);
        expect(IconsetSingleton.getIcon('test:dummy')).toBe('<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g class="icon-id-dummy"><path></path></g></svg>');
    });
});
//# sourceMappingURL=Iconset.test.js.map