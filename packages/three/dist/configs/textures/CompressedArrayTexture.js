import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
import { ioOptionSelect, MenuOption } from '@io-gui/menus';
import { CompressedArrayTexture, RepeatWrapping, ClampToEdgeWrapping, MirroredRepeatWrapping, } from 'three/webgpu';
registerEditorConfig(CompressedArrayTexture, [
    ['wrapR', ioOptionSelect({ selectBy: 'value', option: new MenuOption({ options: [
                    { value: ClampToEdgeWrapping, id: 'Clamp' },
                    { value: RepeatWrapping, id: 'Repeat' },
                    { value: MirroredRepeatWrapping, id: 'Mirrored' },
                ] }) })],
]);
registerEditorGroups(CompressedArrayTexture, {
    Source: ['layerUpdates'],
    Wrapping: ['wrapR'],
});
//# sourceMappingURL=CompressedArrayTexture.js.map