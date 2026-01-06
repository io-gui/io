import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors';
import { ioObject } from '@io-gui/editors';
import { ioBuildGeometry } from '@io-gui/three';
import { ExtrudeGeometry } from 'three/webgpu';
registerEditorWidget(ExtrudeGeometry, ioBuildGeometry());
registerEditorConfig(ExtrudeGeometry, [
    ['parameters', ioPropertyEditor({ config: [
                // shapes is a Shape or array - displayed as object
                ['shapes', ioObject({})],
                // options is a complex object with many properties
                ['options', ioObject({})],
            ] })],
]);
registerEditorGroups(ExtrudeGeometry, {
    Hidden: ['parameters'],
});
//# sourceMappingURL=ExtrudeGeometry.js.map