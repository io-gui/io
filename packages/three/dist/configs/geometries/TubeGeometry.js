import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors';
import { ioSwitch } from '@io-gui/inputs';
import { ioNumberSlider } from '@io-gui/sliders';
import { ioBuildGeometry } from '@io-gui/three';
import { TubeGeometry } from 'three/webgpu';
registerEditorWidget(TubeGeometry, ioBuildGeometry());
registerEditorConfig(TubeGeometry, [
    ['parameters', ioPropertyEditor({ config: [
                // path is a Curve - not easily editable
                ['tubularSegments', ioNumberSlider({ min: 3, max: 256, step: 1 })],
                ['radius', ioNumberSlider({ min: 0, max: 5, step: 0.1 })],
                ['radialSegments', ioNumberSlider({ min: 3, max: 32, step: 1 })],
                ['closed', ioSwitch({})],
            ] })],
]);
registerEditorGroups(TubeGeometry, {
    Hidden: ['parameters'],
});
//# sourceMappingURL=TubeGeometry.js.map