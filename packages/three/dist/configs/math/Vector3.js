import { registerEditorConfig } from '@io-gui/editors';
import { ioVector3 } from '@io-gui/three';
import { Vector3 } from 'three/webgpu';
registerEditorConfig(Object, [
    [Vector3, ioVector3({ min: -Infinity, max: Infinity, step: 0.1 })],
]);
//# sourceMappingURL=Vector3.js.map