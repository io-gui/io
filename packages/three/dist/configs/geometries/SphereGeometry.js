import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors';
import { ioNumberSlider } from '@io-gui/sliders';
import { SphereGeometry } from 'three/webgpu';
import { ioBuildGeometry } from '../../elements/IoBuildGeometry.js';
registerEditorWidget(SphereGeometry, ioBuildGeometry());
registerEditorConfig(SphereGeometry, [
    ['parameters', ioPropertyEditor({ config: [
                ['radius', ioNumberSlider({ min: 0, max: 1000, step: 0.1 })],
                ['widthSegments', ioNumberSlider({ min: 3, max: 64, step: 1 })],
                ['heightSegments', ioNumberSlider({ min: 2, max: 32, step: 1 })],
                ['phiStart', ioNumberSlider({ min: 0, max: Math.PI * 2, step: Math.PI / 180, conversion: 1 / Math.PI * 180 })],
                ['phiLength', ioNumberSlider({ min: 0, max: Math.PI * 2, step: Math.PI / 180, conversion: 1 / Math.PI * 180 })],
                ['thetaStart', ioNumberSlider({ min: 0, max: Math.PI, step: Math.PI / 180, conversion: 1 / Math.PI * 180 })],
                ['thetaLength', ioNumberSlider({ min: 0, max: Math.PI, step: Math.PI / 180, conversion: 1 / Math.PI * 180 })],
            ] })],
]);
registerEditorGroups(SphereGeometry, {
    Hidden: ['parameters'],
});
//# sourceMappingURL=SphereGeometry.js.map