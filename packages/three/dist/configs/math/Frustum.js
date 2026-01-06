import { registerEditorConfig, registerEditorGroups, ioPropertyEditor, ioObject } from '@io-gui/editors';
import { Frustum, Plane } from 'three/webgpu';
registerEditorConfig(Frustum, [
    ['planes', ioPropertyEditor({ labelWidth: '18px', config: [
                [Plane, ioPropertyEditor({ labelWidth: '62px' })],
            ] })],
]);
registerEditorGroups(Frustum, {});
registerEditorConfig(Object, [
    [Frustum, ioObject({ labeled: false })],
]);
//# sourceMappingURL=Frustum.js.map