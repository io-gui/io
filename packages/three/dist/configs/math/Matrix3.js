import { registerEditorConfig, ioObject } from '@io-gui/editors';
import { Matrix3 } from 'three/webgpu';
import { threeMatrix3 } from '../../elements/math/ThreeMatrix3.js';
registerEditorConfig(Matrix3, [
    ['elements', threeMatrix3()],
]);
registerEditorConfig(Object, [
    [Matrix3, ioObject({ labeled: false, properties: ['elements'] })],
]);
