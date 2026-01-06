import { registerEditorConfig, ioMatrix, ioObject } from '@io-gui/editors';
import { Matrix2 } from 'three/webgpu';
registerEditorConfig(Matrix2, [
    ['elements', ioMatrix()],
]);
registerEditorConfig(Object, [
    [Matrix2, ioObject({ labeled: false, properties: ['elements'] })],
]);
//# sourceMappingURL=Matrix2.js.map