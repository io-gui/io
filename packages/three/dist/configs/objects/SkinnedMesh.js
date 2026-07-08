import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
import { ioOptionSelect, Menu } from '@io-gui/menus';
import { SkinnedMesh, AttachedBindMode, DetachedBindMode } from 'three/webgpu';
registerEditorConfig(SkinnedMesh, [
    ['bindMode', ioOptionSelect({ model: new Menu({ options: [
                    { value: AttachedBindMode, id: 'Attached' },
                    { value: DetachedBindMode, id: 'Detached' },
                ] }) })],
]);
registerEditorGroups(SkinnedMesh, {
    Main: ['skeleton', 'bindMode', 'bindMatrix', 'bindMatrixInverse'],
    Rendering: ['boundingBox', 'boundingSphere'],
});
