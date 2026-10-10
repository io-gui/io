import { registerEditorConfig } from '@io-gui/editors';
import { Vector4 } from 'three/webgpu';
import { threeVector4 } from '../../elements/math/ThreeVector4.js';
registerEditorConfig(Object, [
    [Vector4, threeVector4({ min: -Infinity, max: Infinity, step: 0.1 })],
]);
