import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors';
import { ioObject } from '@io-gui/editors';
import { WireframeGeometry } from 'three/webgpu';
import { ioBuildGeometry } from '../../elements/IoBuildGeometry.js';
registerEditorWidget(WireframeGeometry, ioBuildGeometry());
registerEditorConfig(WireframeGeometry, [
    ['parameters', ioPropertyEditor({ config: [
                // geometry is a BufferGeometry - displayed as object
                ['geometry', ioObject({})],
            ] })],
]);
registerEditorGroups(WireframeGeometry, {
    Hidden: ['parameters'],
});
//# sourceMappingURL=WireframeGeometry.js.map