import { registerEditorConfig, ioVector } from '@io-gui/editors';
import { Vector2 } from 'three/webgpu';
registerEditorConfig(Object, [
    [Vector2, ioVector({ min: -Infinity, max: Infinity, step: 0.1 })],
]);
//# sourceMappingURL=Vector2.js.map