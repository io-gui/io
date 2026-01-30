import { registerEditorConfig } from '@io-gui/editors';
import { Vector2 } from 'three/webgpu';
import { ioVector2 } from '../../elements/math/IoVector2.js';
registerEditorConfig(Object, [
    [Vector2, ioVector2({ min: -Infinity, max: Infinity, step: 0.1 })],
]);
//# sourceMappingURL=Vector2.js.map