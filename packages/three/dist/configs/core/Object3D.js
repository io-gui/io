import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
import { ioNumberSlider } from '@io-gui/sliders';
import { Object3D } from 'three/webgpu';
import { threeVector3 } from '../../elements/math/ThreeVector3.js';
import { threeEuler } from '../../elements/math/ThreeEuler.js';
import { threeQuaternion } from '../../elements/math/ThreeQuaternion.js';
registerEditorConfig(Object3D, [
    ['renderOrder', ioNumberSlider({ min: 0, max: 100, step: 1 })],
    ['up', threeVector3({ min: -1, max: 1, step: 0.01 })],
    ['position', threeVector3({ step: 0.001 })],
    ['quaternion', threeQuaternion({ step: 0.001 })],
    ['scale', threeVector3({ step: 0.001, linkable: true })],
    ['rotation', threeEuler({ min: -2 * Math.PI, max: 2 * Math.PI, step: Math.PI / 180 * 0.1, conversion: 1 / Math.PI * 180 })],
]);
registerEditorGroups(Object3D, {
    Main: [
        'name', 'visible', 'position', 'rotation', 'scale'
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
        'matrixAutoUpdate', 'matrixWorldAutoUpdate', 'matrixWorldNeedsUpdate', 'static', 'parent', 'children'
    ],
    Hidden: [],
});
