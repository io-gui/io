import { registerEditorConfig, ioMatrix, ioObject } from '@io-gui/editors';
import { Matrix4 } from 'three/webgpu';
registerEditorConfig(Matrix4, [
    ['elements', ioMatrix()],
]);
registerEditorConfig(Object, [
    [Matrix4, ioObject({ labeled: false, properties: ['elements'] })],
]);
//# sourceMappingURL=Matrix4.js.map