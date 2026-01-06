import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors';
import { ioNumberSlider } from '@io-gui/sliders';
import { ioBuildGeometry } from '@io-gui/three';
import { CircleGeometry } from 'three/webgpu';
registerEditorWidget(CircleGeometry, ioBuildGeometry());
registerEditorConfig(CircleGeometry, [
    ['parameters', ioPropertyEditor({ config: [
                ['radius', ioNumberSlider({ min: 0, max: 10, step: 0.1 })],
                ['segments', ioNumberSlider({ min: 3, max: 64, step: 1 })],
                ['thetaStart', ioNumberSlider({ min: 0, max: Math.PI * 2, step: Math.PI / 180, conversion: 1 / Math.PI * 180 })],
                ['thetaLength', ioNumberSlider({ min: 0, max: Math.PI * 2, step: Math.PI / 180, conversion: 1 / Math.PI * 180 })],
            ] })],
]);
registerEditorGroups(CircleGeometry, {
    Hidden: ['parameters'],
});
//# sourceMappingURL=CircleGeometry.js.map