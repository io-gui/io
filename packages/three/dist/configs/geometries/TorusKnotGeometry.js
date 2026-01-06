import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors';
import { ioNumberSlider } from '@io-gui/sliders';
import { ioBuildGeometry } from '@io-gui/three';
import { TorusKnotGeometry } from 'three/webgpu';
registerEditorWidget(TorusKnotGeometry, ioBuildGeometry());
registerEditorConfig(TorusKnotGeometry, [
    ['parameters', ioPropertyEditor({ config: [
                ['radius', ioNumberSlider({ min: 0, max: 10, step: 0.1 })],
                ['tube', ioNumberSlider({ min: 0, max: 5, step: 0.1 })],
                ['tubularSegments', ioNumberSlider({ min: 3, max: 256, step: 1 })],
                ['radialSegments', ioNumberSlider({ min: 3, max: 32, step: 1 })],
                ['p', ioNumberSlider({ min: 1, max: 10, step: 1 })],
                ['q', ioNumberSlider({ min: 1, max: 10, step: 1 })],
            ] })],
]);
registerEditorGroups(TorusKnotGeometry, {
    Hidden: ['parameters'],
});
//# sourceMappingURL=TorusKnotGeometry.js.map