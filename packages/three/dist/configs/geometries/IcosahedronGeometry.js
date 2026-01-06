import { ioPropertyEditor, registerEditorConfig, registerEditorWidget, registerEditorGroups } from '@io-gui/editors';
import { ioNumberSlider } from '@io-gui/sliders';
import { ioBuildGeometry } from '@io-gui/three';
import { IcosahedronGeometry } from 'three/webgpu';
registerEditorWidget(IcosahedronGeometry, ioBuildGeometry());
registerEditorConfig(IcosahedronGeometry, [
    ['parameters', ioPropertyEditor({ config: [
                ['radius', ioNumberSlider({ min: 0, max: 100, step: 0.1 })],
                ['detail', ioNumberSlider({ min: 0, max: 10, step: 1 })],
            ] })],
]);
registerEditorGroups(IcosahedronGeometry, {
    Hidden: ['parameters'],
});
//# sourceMappingURL=IcosahedronGeometry.js.map