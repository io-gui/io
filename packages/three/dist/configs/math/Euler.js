import { registerEditorConfig, ioVector } from '@io-gui/editors';
import { Euler } from 'three/webgpu';
registerEditorConfig(Object, [
    [Euler, ioVector({ min: -360, max: 360, step: 1 })],
]);
//# sourceMappingURL=Euler.js.map