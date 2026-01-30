import { registerEditorConfig, ioObject } from '@io-gui/editors';
import { Matrix3 } from 'three/webgpu';
import { ioMatrix3 } from '../../elements/math/IoMatrix3.js';
registerEditorConfig(Matrix3, [
    ['elements', ioMatrix3()],
]);
registerEditorConfig(Object, [
    [Matrix3, ioObject({ labeled: false, properties: ['elements'] })],
]);
//# sourceMappingURL=Matrix3.js.map