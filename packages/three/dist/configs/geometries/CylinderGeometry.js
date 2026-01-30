import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors';
import { ioSwitch } from '@io-gui/inputs';
import { ioNumberSlider } from '@io-gui/sliders';
import { CylinderGeometry } from 'three/webgpu';
import { ioBuildGeometry } from '../../elements/IoBuildGeometry.js';
registerEditorWidget(CylinderGeometry, ioBuildGeometry());
registerEditorConfig(CylinderGeometry, [
    ['parameters', ioPropertyEditor({ config: [
                ['radiusTop', ioNumberSlider({ min: 0, max: 1000, step: 0.1 })],
                ['radiusBottom', ioNumberSlider({ min: 0, max: 1000, step: 0.1 })],
                ['height', ioNumberSlider({ min: 0, max: 1000, step: 0.1 })],
                ['radialSegments', ioNumberSlider({ min: 3, max: 64, step: 1 })],
                ['heightSegments', ioNumberSlider({ min: 1, max: 64, step: 1 })],
                ['openEnded', ioSwitch({})],
                ['thetaStart', ioNumberSlider({ min: 0, max: Math.PI * 2, step: Math.PI / 180, conversion: 1 / Math.PI * 180 })],
                ['thetaLength', ioNumberSlider({ min: 0, max: Math.PI * 2, step: Math.PI / 180, conversion: 1 / Math.PI * 180 })],
            ] })],
]);
registerEditorGroups(CylinderGeometry, {
    Hidden: ['parameters'],
});
//# sourceMappingURL=CylinderGeometry.js.map