import { registerEditorConfig, ioObject } from '@io-gui/editors';
import { Matrix2 } from 'three/webgpu';
import { threeMatrix2 } from '../../elements/math/ThreeMatrix2.js';
registerEditorConfig(Matrix2, [
    ['elements', threeMatrix2()],
]);
registerEditorConfig(Object, [
    [Matrix2, ioObject({ labeled: false, properties: ['elements'] })],
]);
