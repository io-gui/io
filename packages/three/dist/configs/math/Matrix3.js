import { registerEditorConfig, ioMatrix, ioObject } from '@io-gui/editors';
import { Matrix3 } from 'three/webgpu';
registerEditorConfig(Matrix3, [
    ['elements', ioMatrix()],
]);
registerEditorConfig(Object, [
    [Matrix3, ioObject({ labeled: false, properties: ['elements'] })],
]);
//# sourceMappingURL=Matrix3.js.map