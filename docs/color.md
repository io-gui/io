## `IoColorMixin`

A mixin class for all `IoColor*` elements. Its `value` property is color of `Array` or `Object` type in **rgb**, **hsv**, **hsl** or **cmyk** color space. If `value` is an array, its color space is inferred as **rgb** unless explicit color mode is specified with `mode` property which can have values **0 - rgb**, **1 - hsv**, **2 - hsl**, **3 - cmyk**. If `value` is an object, it should have keys corresponding to the color space components and color space will be determined automatically. Alpha component `a` is optional.

## `IoColorVector`

Extends `IoColorMixin(IoElement)`.

Implements `IoNumber` and `IoColorPicker`.

Input element for color displayed as vector and an interactive picker.

<io-element-demo element="io-color-vector"
properties='{"mode": 0, "value": "demo:rgba"}'
config='{"value": ["io-properties"], "mode": ["io-option-menu", {"options": [{"value": 0, "label": "0 - rgb"}, {"value": 1, "label": "1 - hsv"}, {"value": 2, "label": "2 - hsl"}, {"value": 3, "label": "3 - cmyk"}]}]}
'></io-element-demo>


## `IoColorPanel`

Extends `IoColorMixin(IoElement)`.

Input element for color displayed as a set of sliders.

<io-element-demo element="io-color-panel"
width= "192px"
height= "128px"
properties='{"mode": 0, "value": "demo:rgba", "horizontal": true}'
config='{"value": ["io-properties"], "mode": ["io-option-menu", {"options": [{"value": 0, "label": "0 - rgb"}, {"value": 1, "label": "1 - hsv"}, {"value": 2, "label": "2 - hsl"}, {"value": 3, "label": "3 - cmyk"}]}]}
'></io-element-demo>

## `IoColorPanelSingleton`

Implements `IoColorPanel` and `IoLayerSingleton`.

A singleton instance of `IoColorPanel` floating inside `IoLayerSingleton`. It is used by `IoColorPicker` and other elements.

## `IoColorSwatch`

Extends `IoColorMixin(IoGl)`.

Display element for color.

<io-element-demo element="io-color-swatch"
properties='{"value": "demo:rgba"}'
config='{"value": ["io-properties"]}
'></io-element-demo>

## `IoColorPicker`

Extends `IoColorMixin(IoItem)`.

Implements `IoColorSwatch`, `IoColorPanelSingleton` and `IoLayerSingleton`.

Input element for color picking. Expands a floating color panel when clicked or activated by keyboard.

<io-element-demo element="io-color-picker"
  properties='{"value": "demo:rgba"}'
  config='{"value": ["io-color-vector"]}
'></io-element-demo>

## `IoColorSlider`

Extends `IoColorMixin(IoSlider)`.

Base class for color sliders for any color type.

## `IoColorSliderHs`

Extends `IoColorSlider`.

2D slider. Modifies **hue** and **saturation** of the color `value` in **hsv** or **hsl** color space.

<io-element-demo element="io-color-slider-hs"
width="64px" height="64px"
properties='{"value": "demo:rgba", "horizontal": true}'
config='{"value": ["io-properties"]}
'></io-element-demo>

## `IoColorSliderSv`

2D slider. Modifies **saturation** and **value** of the color `value` in **hsv** color space.

<io-element-demo element="io-color-slider-sv"
  width="64px" height="64px"
  properties='{"value": "demo:rgba", "horizontal": true}'
  config='{"value": ["io-properties"]}
'></io-element-demo>

## `IoColorSliderSl`

2D slider. Modifies **saturation** and **level** of the color `value` in **hsl** color space.

<io-element-demo element="io-color-slider-sl"
  width="64px" height="64px"
  properties='{"value": "demo:rgba", "horizontal": true}'
  config='{"value": ["io-properties"]}
'></io-element-demo>

## `IoColorSliderRed`

Modifies **red** component the color `value` in **rgb** color space.

<io-element-demo element="io-color-slider-red"
  properties='{"value": "demo:rgba"}'
  config='{"value": ["io-properties"]}
'></io-element-demo>

## `IoColorSliderGreen`

Modifies **green** component the color `value` in **rgb** color space.

<io-element-demo element="io-color-slider-green"
  properties='{"value": "demo:rgba"}'
  config='{"value": ["io-properties"]}
'></io-element-demo>

## `IoColorSliderBlue`

Modifies **blue** component the color `value` in **rgb** color space.

<io-element-demo element="io-color-slider-blue"
  properties='{"value": "demo:rgba"}'
  config='{"value": ["io-properties"]}
'></io-element-demo>

## `IoColorSliderAlpha`

Modifies **alpha** component the color `value`.

<io-element-demo element="io-color-slider-alpha"
  properties='{"value": "demo:rgba"}'
  config='{"value": ["io-properties"]}
'></io-element-demo>

## `IoColorSliderHue`

Modifies **hue** component the color `value` in **hsv** color space.

<io-element-demo element="io-color-slider-hue"
  properties='{"value": "demo:rgba"}'
  config='{"value": ["io-properties"]}
'></io-element-demo>

## `IoColorSliderSaturation`

Modifies **saturation** component the color `value` in **hsv** or **hsl** color space.

<io-element-demo element="io-color-slider-saturation"
  properties='{"value": "demo:rgba"}'
  config='{"value": ["io-properties"]}
'></io-element-demo>

## `IoColorSliderValue`

Modifies **value** component the color `value` in **hsv** color space.

<io-element-demo element="io-color-slider-value"
  properties='{"value": "demo:rgba"}'
  config='{"value": ["io-properties"]}
'></io-element-demo>

## `IoColorSliderLevel`

Modifies **level** component the color `value` in **hsl** color space.

<io-element-demo element="io-color-slider-level"
  properties='{"value": "demo:rgba"}'
  config='{"value": ["io-properties"]}
'></io-element-demo>

## `IoColorSliderCyan`

Modifies **cyan** component the color `value` in **cmyk** color space.

<io-element-demo element="io-color-slider-cyan"
  properties='{"value": "demo:cmyk"}'
  config='{"value": ["io-properties"]}
'></io-element-demo>

## `IoColorSliderMagenta`

Modifies **magenta** component the color `value` in **cmyk** color space.

<io-element-demo element="io-color-slider-magenta"
  properties='{"value": "demo:cmyk"}'
  config='{"value": ["io-properties"]}
'></io-element-demo>

## `IoColorSliderYellow`

Modifies **yellow** component the color `value` in **cmyk** color space.

<io-element-demo element="io-color-slider-yellow"
  properties='{"value": "demo:cmyk"}'
  config='{"value": ["io-properties"]}
'></io-element-demo>

## `IoColorSliderKey`

Modifies **key** component the color `value` in **cmyk** color space.

<io-element-demo element="io-color-slider-key"
  properties='{"value": "demo:cmyk"}'
  config='{"value": ["io-properties"]}
'></io-element-demo>
