
import ColorConvertTest from './lib/convert.test.js';
import ColorBaseTest from './color-base.test.js';
// import ColorPanelTest from './color-panel.test.js';
// import ColorPickerTest from './color-picker.test.js';
// import ColorRgbaTest from './color-rgba.test.js';
// import ColorSlidersTest from './color-sliders.test.js';
// import ColorSwatchTest from './color-swatch.test.js';

export default class {
  run() {
    new ColorConvertTest().run();
    new ColorBaseTest().run();
    // new ColorPanelTest().run();
    // new ColorPickerTest().run();
    // new ColorRgbaTest().run();
    // new ColorSlidersTest().run();
    // new ColorSwatchTest().run();
  }
}