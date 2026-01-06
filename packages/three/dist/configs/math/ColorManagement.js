// Color managements is a singleton generic object, so we can't register it as a class
// TODO: Raise issue in three.js to make ColorManagement a class
import { registerEditorConfig } from '@io-gui/editors';
import { ioOptionSelect, MenuOption } from '@io-gui/menus';
import { SRGBColorSpace, LinearSRGBColorSpace } from 'three/webgpu';
registerEditorConfig(Object, [
    ['workingColorSpace', ioOptionSelect({ option: new MenuOption({ options: [SRGBColorSpace, LinearSRGBColorSpace] }) })],
    ['unpackColorSpace', ioOptionSelect({ option: new MenuOption({ options: [SRGBColorSpace, LinearSRGBColorSpace] }) })],
    ['drawingBufferColorSpace', ioOptionSelect({ option: new MenuOption({ options: [SRGBColorSpace, LinearSRGBColorSpace] }) })],
    ['outputColorSpace', ioOptionSelect({ option: new MenuOption({ options: [SRGBColorSpace, LinearSRGBColorSpace] }) })],
]);
//# sourceMappingURL=ColorManagement.js.map