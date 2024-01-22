import ColorConvertTest from './lib/convert.test.js';
import ColorBaseTest from './io-color-base.test.js';
import ColorPanelTest from './io-color-panel.test.js';
import ColorPickerTest from './io-color-picker.test.js';
import ColorRgbaTest from './io-color-rgba.test.js';
import ColorSlidersTest from './io-color-sliders.test.js';
import ColorSwatchTest from './io-color-swatch.test.js';
export default class {
    run() {
        new ColorConvertTest().run();
        new ColorBaseTest().run();
        new ColorPanelTest().run();
        new ColorPickerTest().run();
        new ColorRgbaTest().run();
        new ColorSlidersTest().run();
        new ColorSwatchTest().run();
    }
}
//# sourceMappingURL=index.test.js.map