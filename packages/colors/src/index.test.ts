import ColorConvertTest from './lib/color.convert.test.js'
import ColorBaseTest from './elements/IoColorBase.test.js'
import ColorPanelTest from './elements/IoColorPanelSingleton.test.js'
import ColorPickerTest from './elements/IoColorPicker.test.js'
import ColorRgbaTest from './elements/IoColorRgba.test.js'
import ColorSlidersTest from './elements/IoColorSliders.test.js'
import ColorSwatchTest from './elements/IoColorSwatch.test.js'

export default class {
  run() {
    new ColorConvertTest().run()
    new ColorBaseTest().run()
    new ColorPanelTest().run()
    new ColorPickerTest().run()
    new ColorRgbaTest().run()
    new ColorSlidersTest().run()
    new ColorSwatchTest().run()
  }
}