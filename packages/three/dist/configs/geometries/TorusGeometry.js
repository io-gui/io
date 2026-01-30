import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors';
import { ioNumberSlider } from '@io-gui/sliders';
import { TorusGeometry } from 'three/webgpu';
import { ioBuildGeometry } from '../../elements/IoBuildGeometry.js';
registerEditorWidget(TorusGeometry, ioBuildGeometry());
registerEditorConfig(TorusGeometry, [
    ['parameters', ioPropertyEditor({ config: [
                ['radius', ioNumberSlider({ min: 0, max: 1000, step: 0.1 })],
                ['tube', ioNumberSlider({ min: 0, max: 1000, step: 0.1 })],
                ['radialSegments', ioNumberSlider({ min: 3, max: 32, step: 1 })],
                ['tubularSegments', ioNumberSlider({ min: 3, max: 128, step: 1 })],
                ['arc', ioNumberSlider({ min: 0, max: Math.PI * 2, step: Math.PI / 180, conversion: 1 / Math.PI * 180 })],
            ] })],
]);
registerEditorGroups(TorusGeometry, {
    Hidden: ['parameters'],
});
//# sourceMappingURL=TorusGeometry.js.map