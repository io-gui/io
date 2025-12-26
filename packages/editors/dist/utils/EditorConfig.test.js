import { describe, it, expect } from 'vitest';
import { getEditorConfig, registerEditorConfig } from './EditorConfig';
describe('EditorConfig.test', () => {
    it('Should be defined', () => {
        expect(getEditorConfig).toBeDefined();
        expect(registerEditorConfig).toBeDefined();
    });
});
//# sourceMappingURL=EditorConfig.test.js.map