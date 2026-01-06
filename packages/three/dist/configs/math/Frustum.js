import { registerEditorConfig, registerEditorGroups, ioPropertyEditor, ioObject } from '@io-gui/editors';
import { Frustum, Plane } from 'three/webgpu';
registerEditorConfig(Frustum, [
    ['planes', ioPropertyEditor({ config: [
                [Plane, ioPropertyEditor()],
            ] })],
]);
registerEditorGroups(Frustum, {});
registerEditorConfig(Object, [
    [Frustum, ioObject({ labeled: false })],
]);
//# sourceMappingURL=Frustum.js.map