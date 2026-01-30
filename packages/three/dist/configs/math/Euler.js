import { registerEditorConfig } from '@io-gui/editors';
import { Euler } from 'three/webgpu';
import { ioEuler } from '../../elements/math/IoEuler.js';
registerEditorConfig(Object, [
    [Euler, ioEuler({ min: -2 * Math.PI, max: 2 * Math.PI, step: Math.PI / 180 * 0.1, conversion: 1 / Math.PI * 180 })],
]);
//# sourceMappingURL=Euler.js.map