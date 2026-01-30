import { registerEditorConfig, ioObject } from '@io-gui/editors';
import { Matrix4 } from 'three/webgpu';
import { ioMatrix4 } from '../../elements/math/IoMatrix4.js';
registerEditorConfig(Matrix4, [
    ['elements', ioMatrix4()],
]);
registerEditorConfig(Object, [
    [Matrix4, ioObject({ labeled: false, properties: ['elements'] })],
]);
//# sourceMappingURL=Matrix4.js.map