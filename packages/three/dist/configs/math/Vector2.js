import { registerEditorConfig } from '@io-gui/editors';
import { Vector2 } from 'three/webgpu';
import { threeVector2 } from '../../elements/math/ThreeVector2.js';
registerEditorConfig(Object, [
    [Vector2, threeVector2({ min: -Infinity, max: Infinity, step: 0.1 })],
]);
