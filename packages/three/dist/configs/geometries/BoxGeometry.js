import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors';
import { BoxGeometry } from 'three/webgpu';
import { ioNumberSlider } from '@io-gui/sliders';
import { ioBuildGeometry } from '@io-gui/three';
registerEditorWidget(BoxGeometry, ioBuildGeometry());
registerEditorConfig(BoxGeometry, [
    ['parameters', ioPropertyEditor({ config: [
                ['width', ioNumberSlider({ min: 0, max: 100, step: 0.1 })],
                ['height', ioNumberSlider({ min: 0, max: 100, step: 0.1 })],
                ['depth', ioNumberSlider({ min: 0, max: 100, step: 0.1 })],
                ['widthSegments', ioNumberSlider({ min: 1, max: 10, step: 1 })],
                ['heightSegments', ioNumberSlider({ min: 1, max: 10, step: 1 })],
                ['depthSegments', ioNumberSlider({ min: 1, max: 10, step: 1 })],
            ],
        })],
]);
registerEditorGroups(BoxGeometry, {
    Hidden: ['parameters'],
});
//# sourceMappingURL=BoxGeometry.js.map