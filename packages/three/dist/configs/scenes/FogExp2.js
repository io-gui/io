import { ioPropertyEditor, registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
import { ioNumberSlider } from '@io-gui/sliders';
import { FogExp2 } from 'three/webgpu';
registerEditorConfig(FogExp2, [
    ['density', ioNumberSlider({ min: 0, max: 0.1, step: 0.0001, exponent: 3 })],
]);
registerEditorGroups(FogExp2, {
    Main: [
        'name',
        'color',
        'density',
    ],
});
registerEditorConfig(Object, [
    [FogExp2, ioPropertyEditor()],
]);
//# sourceMappingURL=FogExp2.js.map