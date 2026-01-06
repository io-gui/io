import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors';
import { ioObject } from '@io-gui/editors';
import { ioNumberSlider } from '@io-gui/sliders';
import { ioBuildGeometry } from '@io-gui/three';
import { EdgesGeometry } from 'three/webgpu';
registerEditorWidget(EdgesGeometry, ioBuildGeometry());
registerEditorConfig(EdgesGeometry, [
    ['parameters', ioPropertyEditor({ config: [
                // geometry is a BufferGeometry - displayed as object
                ['geometry', ioObject({})],
                ['thresholdAngle', ioNumberSlider({ min: 0, max: 180, step: 1 })],
            ] })],
]);
registerEditorGroups(EdgesGeometry, {
    Hidden: ['parameters'],
});
//# sourceMappingURL=EdgesGeometry.js.map