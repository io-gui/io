import { registerEditorConfig } from '@io-gui/editors';
import { Vector3 } from 'three/webgpu';
import { ioVector3 } from '../../elements/math/IoVector3.js';
registerEditorConfig(Object, [
    [Vector3, ioVector3({ min: -Infinity, max: Infinity, step: 0.1 })],
]);
//# sourceMappingURL=Vector3.js.map