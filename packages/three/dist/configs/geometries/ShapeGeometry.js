import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors';
import { ioObject } from '@io-gui/editors';
import { ioNumberSlider } from '@io-gui/sliders';
import { ioBuildGeometry } from '@io-gui/three';
import { ShapeGeometry } from 'three/webgpu';
registerEditorWidget(ShapeGeometry, ioBuildGeometry());
registerEditorConfig(ShapeGeometry, [
    ['parameters', ioPropertyEditor({ config: [
                // shapes is a Shape or array - displayed as object
                ['shapes', ioObject({})],
                ['curveSegments', ioNumberSlider({ min: 1, max: 64, step: 1 })],
            ] })],
]);
registerEditorGroups(ShapeGeometry, {
    Hidden: ['parameters'],
});
//# sourceMappingURL=ShapeGeometry.js.map