import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors';
import { ioNumberSlider } from '@io-gui/sliders';
import { DodecahedronGeometry } from 'three/webgpu';
import { threeBuildGeometry } from '../../elements/ThreeBuildGeometry.js';
registerEditorWidget(DodecahedronGeometry, threeBuildGeometry());
registerEditorConfig(DodecahedronGeometry, [
    ['parameters', ioPropertyEditor({ config: [
                ['radius', ioNumberSlider({ min: 0, max: 1000, step: 0.1 })],
                ['detail', ioNumberSlider({ min: 0, max: 6, step: 1 })],
            ] })],
]);
registerEditorGroups(DodecahedronGeometry, {
    Hidden: ['parameters'],
});
