import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors';
import { ioNumberSlider } from '@io-gui/sliders';
import { ioNumber } from '@io-gui/inputs';
import { PerspectiveCamera } from 'three/webgpu';
registerEditorWidget(PerspectiveCamera, ioPropertyEditor({
    properties: [
        'fov',
        'aspect',
        'near',
        'far',
        'zoom',
        'updateProjectionMatrix'
    ],
    labelWidth: '52px',
}));
registerEditorConfig(PerspectiveCamera, [
    ['fov', ioNumberSlider({ min: 1, max: 180, step: 0.01 })],
    ['zoom', ioNumberSlider({ min: 0.01, max: 10, step: 0.01, exponent: 3 })],
    ['near', ioNumber({ min: 0.01, max: Infinity, step: 0.01 })],
    ['far', ioNumber({ min: 0.1, max: Infinity, step: 0.01 })],
    ['aspect', ioNumber({ min: 0.01, max: Infinity, step: 0.01 })],
    ['focus', ioNumber({ min: 0, max: Infinity, step: 0.01 })],
    ['filmGauge', ioNumber({ min: 1, max: 100, step: 1 })],
    ['filmOffset', ioNumber({ min: -100, max: 100, step: 0.1 })],
]);
registerEditorGroups(PerspectiveCamera, {
    Film: [
        'focus',
        'filmGauge',
        'filmOffset',
    ],
    Advanced: ['view'],
    Hidden: [
        'fov',
        'aspect',
        'near',
        'far',
        'zoom',
    ]
});
//# sourceMappingURL=PerspectiveCamera.js.map