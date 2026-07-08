// Color managements is a singleton generic object, so we can't register it as a class
// TODO: Raise issue in three.js to make ColorManagement a class
import { registerEditorConfig } from '@io-gui/editors';
import { ioOptionSelect, Menu } from '@io-gui/menus';
import { SRGBColorSpace, LinearSRGBColorSpace } from 'three/webgpu';
registerEditorConfig(Object, [
    ['workingColorSpace', ioOptionSelect({ model: new Menu({ options: [SRGBColorSpace, LinearSRGBColorSpace] }) })],
    ['unpackColorSpace', ioOptionSelect({ model: new Menu({ options: [SRGBColorSpace, LinearSRGBColorSpace] }) })],
    ['drawingBufferColorSpace', ioOptionSelect({ model: new Menu({ options: [SRGBColorSpace, LinearSRGBColorSpace] }) })],
    ['outputColorSpace', ioOptionSelect({ model: new Menu({ options: [SRGBColorSpace, LinearSRGBColorSpace] }) })],
]);
