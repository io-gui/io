import { registerEditorConfig, ioVector } from '@io-gui/editors';
import { Vector4 } from 'three/webgpu';
registerEditorConfig(Object, [
    [Vector4, ioVector({ min: -Infinity, max: Infinity, step: 0.1 })],
]);
//# sourceMappingURL=Vector4.js.map