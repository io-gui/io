import { registerEditorConfig } from '@io-gui/editors';
import { threeQuaternion } from '../../elements/math/ThreeQuaternion.js';
import { Quaternion } from 'three/webgpu';
registerEditorConfig(Object, [
    [Quaternion, threeQuaternion({ min: -Infinity, max: Infinity, step: 0.1 })],
]);
