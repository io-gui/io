import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors';
import { ioNumberSlider } from '@io-gui/sliders';
import { ioBuildGeometry } from '@io-gui/three';
import { OctahedronGeometry } from 'three/webgpu';
registerEditorWidget(OctahedronGeometry, ioBuildGeometry());
registerEditorConfig(OctahedronGeometry, [
    ['parameters', ioPropertyEditor({ config: [
                ['radius', ioNumberSlider({ min: 0, max: 10, step: 0.1 })],
                ['detail', ioNumberSlider({ min: 0, max: 5, step: 1 })],
            ] })],
]);
registerEditorGroups(OctahedronGeometry, {
    Hidden: ['parameters'],
});
//# sourceMappingURL=OctahedronGeometry.js.map