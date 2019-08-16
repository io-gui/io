## &lt;io-color&gt;

## &lt;io-color-vector&gt;

Input element for colors. Array `value` can have 3 or 4 number elements. Object `value` can have keys `r`, `g`, `b` and optionally `a`.

<io-element-demo element="io-color-vector" properties='{"value": [1, 0.5, 0, 0.5]}'></io-element-demo>

<io-element-demo element="io-color-vector" properties='{"value": {"r": 1, "g": 0.5, "b": 0, "a": 0.5}}'></io-element-demo>

<io-element-demo element="io-color-vector" properties='{"value": {"h": 1, "s": 0.5, "v": 1, "a": 0.5}}'></io-element-demo>

## &lt;io-color-swatch&gt;

## &lt;io-color-slider&gt;

Base class for color sliders. It should not be used as it is.

<io-element-demo element="io-color-slider"
  width="64px"
  height="64px"
  properties='{"value": [0.5, 0.5, 0.5, 0.5], "colorMode": 0}
'></io-element-demo>

## &lt;io-color-panel&gt;

## &lt;io-color-picker&gt;

Input element for colors picking in rgb color space. Array `value` can have 3 or 4 number elements. Object `value` can have keys `r`, `g`, `b` and optionally `a`.

<io-element-demo element="io-color-picker"
  width="192px"
  height="128px"
  properties='{"value": [0.2, 0.8, 0.5, 0.9], "horizontal": true}'
  config='{"value": ["io-color-vector"]}
'></io-element-demo>

<io-element-demo element="io-color-picker"
  width="192px"
  height="128px"
  properties='{"value": [0.2, 0.8, 0.5, 0.9], "horizontal": true}'
  config='{"value": ["io-hsva"]}
'></io-element-demo>
