import { describe, it, expect } from 'vitest';
import { getEditorGroups, registerEditorGroups } from '@io-gui/editors';
describe('EditorGroups.test', () => {
    it('Should be defined', () => {
        expect(getEditorGroups).toBeDefined();
        expect(registerEditorGroups).toBeDefined();
    });
});
//# sourceMappingURL=EditorGroups.test.js.map