import { registerEditorConfig, ioObject } from '@io-gui/editors';
import { ioMatrix2 } from '@io-gui/three';
import { Matrix2 } from 'three/webgpu';
registerEditorConfig(Matrix2, [
    ['elements', ioMatrix2()],
]);
registerEditorConfig(Object, [
    [Matrix2, ioObject({ labeled: false, properties: ['elements'] })],
]);
//# sourceMappingURL=Matrix2.js.map