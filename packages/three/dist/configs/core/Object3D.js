import { ioVector, registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
import { ioNumberSlider } from '@io-gui/sliders';
import { Object3D } from 'three/webgpu';
registerEditorConfig(Object3D, [
    ['renderOrder', ioNumberSlider({ min: 0, max: 100, step: 1 })],
    ['up', ioVector({ min: -1, max: 1, step: 0.01 })],
    ['position', ioVector({ step: 0.001 })],
    ['quaternion', ioVector({ step: 0.001 })],
    ['rotation', ioVector({ min: -1, max: 1, step: Math.PI / 180 * 0.1, conversion: 1 / Math.PI * 180 })],
]);
registerEditorGroups(Object3D, {
    Main: [
        'name', 'visible', 'position', 'rotation', 'scale', 'parent', 'children'
    ],
    Rendering: [
        'castShadow',
        'receiveShadow',
        'frustumCulled',
        'renderOrder',
        'layers',
        'customDepthMaterial',
        'customDistanceMaterial',
    ],
    Animation: ['animations'],
    Advanced: [
        'quaternion', 'up',
        'matrix', 'matrixWorld', 'normalMatrix', 'matrixWorldInverse', 'modelViewMatrix',
        'matrixAutoUpdate', 'matrixWorldAutoUpdate', 'matrixWorldNeedsUpdate'
    ],
    Hidden: [
        'static',
    ],
});
//# sourceMappingURL=Object3D.js.map