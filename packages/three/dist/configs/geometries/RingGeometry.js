import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors';
import { ioNumberSlider } from '@io-gui/sliders';
import { ioBuildGeometry } from '@io-gui/three';
import { RingGeometry } from 'three/webgpu';
registerEditorWidget(RingGeometry, ioBuildGeometry());
registerEditorConfig(RingGeometry, [
    ['parameters', ioPropertyEditor({ config: [
                ['innerRadius', ioNumberSlider({ min: 0, max: 10, step: 0.1 })],
                ['outerRadius', ioNumberSlider({ min: 0, max: 10, step: 0.1 })],
                ['thetaSegments', ioNumberSlider({ min: 3, max: 64, step: 1 })],
                ['phiSegments', ioNumberSlider({ min: 1, max: 10, step: 1 })],
                ['thetaStart', ioNumberSlider({ min: 0, max: Math.PI * 2, step: Math.PI / 180, conversion: 1 / Math.PI * 180 })],
                ['thetaLength', ioNumberSlider({ min: 0, max: Math.PI * 2, step: Math.PI / 180, conversion: 1 / Math.PI * 180 })],
            ] })],
]);
registerEditorGroups(RingGeometry, {
    Hidden: ['parameters'],
});
//# sourceMappingURL=RingGeometry.js.map