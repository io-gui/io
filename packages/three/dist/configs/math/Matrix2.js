import { registerEditorConfig, ioObject } from '@io-gui/editors';
import { Matrix2 } from 'three/webgpu';
import { ioMatrix2 } from '../../elements/math/IoMatrix2.js';
registerEditorConfig(Matrix2, [
    ['elements', ioMatrix2()],
]);
registerEditorConfig(Object, [
    [Matrix2, ioObject({ labeled: false, properties: ['elements'] })],
]);
//# sourceMappingURL=Matrix2.js.map