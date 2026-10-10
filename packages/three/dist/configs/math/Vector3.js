import { registerEditorConfig } from '@io-gui/editors';
import { Vector3 } from 'three/webgpu';
import { threeVector3 } from '../../elements/math/ThreeVector3.js';
registerEditorConfig(Object, [
    [Vector3, threeVector3({ min: -Infinity, max: Infinity, step: 0.1 })],
]);
