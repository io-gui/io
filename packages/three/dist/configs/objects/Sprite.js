import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
import { ioNumber } from '@io-gui/inputs';
import { Sprite } from 'three/webgpu';
registerEditorConfig(Sprite, [
    ['count', ioNumber({ min: 1, step: 1 })],
]);
registerEditorGroups(Sprite, {
    Main: ['geometry', 'material', 'center', 'count'],
});
//# sourceMappingURL=Sprite.js.map