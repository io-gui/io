import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
import { ioNumber } from '@io-gui/inputs';
import { ioOptionSelect, MenuOption } from '@io-gui/menus';
import { InterleavedBuffer, StaticDrawUsage, DynamicDrawUsage, StreamDrawUsage, StaticReadUsage, DynamicReadUsage, StreamReadUsage, StaticCopyUsage, DynamicCopyUsage, StreamCopyUsage, } from 'three/webgpu';
registerEditorConfig(InterleavedBuffer, [
    ['stride', ioNumber({ min: 1, max: 64, step: 1 })],
    ['usage', ioOptionSelect({ selectBy: 'value', option: new MenuOption({ options: [
                    { value: StaticDrawUsage, id: 'StaticDraw' },
                    { value: DynamicDrawUsage, id: 'DynamicDraw' },
                    { value: StreamDrawUsage, id: 'StreamDraw' },
                    { value: StaticReadUsage, id: 'StaticRead' },
                    { value: DynamicReadUsage, id: 'DynamicRead' },
                    { value: StreamReadUsage, id: 'StreamRead' },
                    { value: StaticCopyUsage, id: 'StaticCopy' },
                    { value: DynamicCopyUsage, id: 'DynamicCopy' },
                    { value: StreamCopyUsage, id: 'StreamCopy' },
                ] }) })],
    ['version', ioNumber({ min: 0, max: Infinity, step: 1 })],
]);
registerEditorGroups(InterleavedBuffer, {
    Main: [
        'array',
        'stride',
        'count',
    ],
    GPU: [
        'usage',
        'version',
        'updateRanges',
    ],
    Hidden: ['onUploadCallback'],
});
//# sourceMappingURL=InterleavedBuffer.js.map