import { describe, it, expect } from 'vitest';
import { IoOverlaySingleton } from '@io-gui/core';
describe('IoOverlay', () => {
    it('Should initialize properties correctly', () => {
        expect(IoOverlaySingleton.expanded).toEqual(false);
        expect(IoOverlaySingleton._reactiveProperties.get('expanded')).toEqual({
            binding: undefined,
            init: undefined,
            reflect: true,
            type: Boolean,
            value: false,
            observer: { type: 'none', observing: false },
        });
    });
});
//# sourceMappingURL=IoOverlay.test.js.map