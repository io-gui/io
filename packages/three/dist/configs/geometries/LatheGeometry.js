import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors';
import { ioNumberSlider } from '@io-gui/sliders';
import { ioBuildGeometry } from '@io-gui/three';
import { LatheGeometry } from 'three/webgpu';
registerEditorWidget(LatheGeometry, ioBuildGeometry());
registerEditorConfig(LatheGeometry, [
    ['parameters', ioPropertyEditor({ config: [
                // points is an array of Vector2 - not easily editable
                ['segments', ioNumberSlider({ min: 3, max: 64, step: 1 })],
                ['phiStart', ioNumberSlider({ min: 0, max: Math.PI * 2, step: Math.PI / 180, conversion: 1 / Math.PI * 180 })],
                ['phiLength', ioNumberSlider({ min: 0, max: Math.PI * 2, step: Math.PI / 180, conversion: 1 / Math.PI * 180 })],
            ] })],
]);
registerEditorGroups(LatheGeometry, {
    Hidden: ['parameters'],
});
//# sourceMappingURL=LatheGeometry.js.map