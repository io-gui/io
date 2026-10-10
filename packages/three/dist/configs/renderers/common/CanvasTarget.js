import { ioSwitch, ioNumber } from '@io-gui/inputs';
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
import { CanvasTarget, Vector4 } from 'three/webgpu';
import { threeVector4 } from '../../../elements/math/ThreeVector4.js';
registerEditorConfig(CanvasTarget, [
    [Number, ioNumber({ disabled: true })],
    [Vector4, threeVector4({ disabled: true })],
    [Boolean, ioSwitch({ disabled: true })],
]);
registerEditorGroups(CanvasTarget, {
    Main: [
        'colorTexture',
        'depthTexture',
    ],
    Advanced: [
        'domElement',
        '_width',
        '_height',
        '_pixelRatio',
        '_viewport',
        '_scissor',
        '_scissorTest',
    ],
});
