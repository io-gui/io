import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors';
import { ioSwitch } from '@io-gui/inputs';
import { ioNumberSlider } from '@io-gui/sliders';
import { ConeGeometry } from 'three/webgpu';
import { ioBuildGeometry } from '../../elements/IoBuildGeometry.js';
registerEditorWidget(ConeGeometry, ioBuildGeometry());
registerEditorConfig(ConeGeometry, [
    ['parameters', ioPropertyEditor({ config: [
                ['radius', ioNumberSlider({ min: 0, max: 1000, step: 0.1 })],
                ['height', ioNumberSlider({ min: 0, max: 1000, step: 0.1 })],
                ['radialSegments', ioNumberSlider({ min: 3, max: 64, step: 1 })],
                ['heightSegments', ioNumberSlider({ min: 1, max: 64, step: 1 })],
                ['openEnded', ioSwitch({})],
                ['thetaStart', ioNumberSlider({ min: 0, max: Math.PI * 2, step: Math.PI / 180, conversion: 1 / Math.PI * 180 })],
                ['thetaLength', ioNumberSlider({ min: 0, max: Math.PI * 2, step: Math.PI / 180, conversion: 1 / Math.PI * 180 })],
            ] })],
]);
registerEditorGroups(ConeGeometry, {
    Hidden: ['parameters'],
});
//# sourceMappingURL=ConeGeometry.js.map