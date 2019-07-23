## &lt;io-vector&gt;

Input element for vector arrays and objects. Array `value` can have between 2 and 4 number elements. Object `value` can have keys `x`, `y`, `z` and `w`.

<io-element-demo element="io-vector" properties='{"value": {"x": 1, "y": 0.5}, "linkable": false}'></io-element-demo>

<io-element-demo element="io-vector" properties='{"value": [1, 0.5, 0.1, 0], "linkable": false}'></io-element-demo>

## &lt;io-matrix&gt;

Input element for vector arrays dispalayed as 2D matrices. Array `value` can have 4, 9, and 16 elements for 2x2, 3x3 and 4x4 matrices.

<io-element-demo element="io-matrix" properties='{"value": [1, 0, 0, 1]}'></io-element-demo>

<io-element-demo element="io-matrix" properties='{"value": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]}'></io-element-demo>

## &lt;io-rgba&gt;

Input element for colors. Array `value` can have 3 or 4 number elements. Object `value` can have keys `r`, `g`, `b` and optionally `a`.

<io-element-demo element="io-rgba" properties='{"value": [1, 0.5, 0, 0.5]}'></io-element-demo>

<io-element-demo element="io-rgba" properties='{"value": {"r": 1, "g": 0.5, "b": 0, "a": 0.5}}'></io-element-demo>

## &lt;io-hsva&gt;

Input element for colors in hsv color space. Array `value` can have 3 or 4 number elements. Object `value` can have keys `h`, `s`, `v` and optionally `a`.

<io-element-demo element="io-hsva" properties='{"value": [1, 0.5, 1, 0.5]}'></io-element-demo>

<io-element-demo element="io-hsva" properties='{"value": {"h": 1, "s": 0.5, "v": 1, "a": 0.5}}'></io-element-demo>

## &lt;io-hsva-sv&gt;

Input element for colors picking hsv color space (saturation and value). Array `value` can have 3 or 4 number elements. Object `value` can have keys `h`, `s`, `v` and optionally `a`.

<io-element-demo element="io-hsva-sv"
  width="128px"
  height="128px"
  properties='{"value": [0, 1, 0, 1]}'
  config='{"value": ["io-hsva"]}
'></io-element-demo>

## &lt;io-hsva-hue&gt;

Input element for colors picking hsv color space (hue only). Array `value` can have 3 or 4 number elements. Object `value` can have keys `h`, `s`, `v` and optionally `a`.

<io-element-demo element="io-hsva-hue"
  width="64px"
  height="64px"
  properties='{"value": [0.5, 0, 0], "horizontal": false}'
  config='{"value": ["io-hsva"]}
'></io-element-demo>

## &lt;io-hsva-alpha&gt;

Input element for colors picking hsv color space (alpha only). Array `value` can have 3 or 4 number elements. Object `value` can have keys `h`, `s`, `v` and optionally `a`.

<io-element-demo element="io-hsva-alpha"
  width="64px"
  height="64px"
  properties='{"value": [0, 0, 0, 0.5], "horizontal": false}'
  config='{"value": ["io-hsva"]}
'></io-element-demo>

## &lt;io-rgba-picker&gt;

Input element for colors picking in rgb color space. Array `value` can have 3 or 4 number elements. Object `value` can have keys `r`, `g`, `b` and optionally `a`.

<io-element-demo element="io-rgba-picker"
  width="192px"
  height="128px"
  properties='{"value": [0.2, 0.8, 0.5, 0.9], "horizontal": true}'
  config='{"value": ["io-rgba"]}
'></io-element-demo>

## &lt;io-hsva-picker&gt;

Input element for colors picking in hsv color space. Array `value` can have 3 or 4 number elements. Object `value` can have keys `h`, `s`, `v` and optionally `a`.

<io-element-demo element="io-hsva-picker"
  width="192px"
  height="128px"
  properties='{"value": [0.2, 0.8, 0.5, 0.9], "horizontal": true}'
  config='{"value": ["io-hsva"]}
'></io-element-demo>
