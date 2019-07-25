## &lt;io-item&gt;

A simple focusable element.

<io-element-demo element="io-item" properties='{"label": "Item", "value": "null"}'></io-element-demo>

When clicked or activated by space/enter key, it calls the `_onClick()` function with optional `value` argument. This element is used as a base class for other elements.

When focused, arrow keys will change focus to the nearest focusable element in the chosen direction.

## &lt;io-button&gt;

A simple button element.

Extends `<io-item>`.

<io-element-demo element="io-button" properties='{"label": "Button", "action": "null"}'></io-element-demo>

When clicked or activated by space/enter key, it calls the `action` function with optional `value` argument.

## &lt;io-boolean&gt;

Input element for `Boolean` data type displayed as text.

Extends `<io-button>`.

<io-element-demo element="io-boolean" properties='{"value": true, "true": "true", "false": "false"}'></io-element-demo>

<io-element-demo element="io-boolean" properties='{"value": true, "display": "icon", "true": "icons:link", "false": "icons:unlink"}'></io-element-demo>

<io-element-demo element="io-boolean" properties='{"value": true, "display": "switch"}'></io-element-demo>

It can be configured to display custom `true` or `false` string depending on its `value`.

## &lt;io-string&gt;

Input element for `String` data type.

<io-element-demo element="io-string" properties='{"value": "Hello io!"}'></io-element-demo>

When focused, arrow keys will change focus to the nearest focusable element in the chosen direction.

## &lt;io-number&gt;

Input element for `Number` data type.

<io-element-demo element="io-number" properties='{"value": 1337, "conversion": 1, "step": 0.001, "min": 0, "max": 10000, "ladder": false}'></io-element-demo>

It can be configured to clamp the `value` to `min`/`max` and round it to the nearest `step` increment. Value can be displayed using `conversion` factor. For example, conversion factor of `180/π` would display radians as degrees.

Enable `ladder` property to use interactive float ladder element.

When focused, arrow keys will change focus to the nearest focusable element in the chosen direction.

## &lt;io-slider&gt;

Input element for `Number` data type displayed as interactive slider with a number field.

Implements `<io-number>` and `<io-slider-knob>`.

<io-element-demo element="io-slider" properties='{"value": 0.1, "step": 0.01, "min": -0.5, "max": 0.5}'></io-element-demo>

<io-element-demo element="io-slider-knob" properties='{"value": 0.1, "step": 0.1, "minV": 0, "max": 1}'></io-element-demo>

It can be configured to clamp the `value` to `min`/`max` and round it to the nearest `step` increment.

To change the value with arrow keys on focused slider, users should hold down the shift key.

## &lt;io-icon&gt;

SVG icon element.

<io-element-demo element="io-icon" properties='{"icon": "icons:link"}'></io-element-demo>

## &lt;io-theme-singleton&gt;

`IoThemeSingleton` holds top-level CSS variables for Io design system. Variables are grouped in different themes and can be collectively switched by changing `theme` property.

```javascript
IoThemeSingleton.theme = 'dark';
```

Moreover, some of the key theme variables such as `'--io-color'` and `'--io-background-color'` are mapped to numeric properties `cssColor` and `cssBackgroundColor` source code for more advanced example.

## &lt;io-gl&gt;

`IoGL` is a base class for WebGL-based custom elements. The appearance of such elements is defined with fragment shader programs that execute on the GPU. All numeric properties are automatically bound to shader uniforms, including `IoThemeSingleton` properties. You can define your custom shaders inside `static get Frag()` return string.

<io-element-demo element="io-gl" width="257px" height="257px" properties='{"color": [0, 0, 0, 1]}' config='{"size": ["io-properties", {"labeled": false, "config": {"type:number": ["io-slider", {"min": 1, "max": 257, "step": 8}]}}], "background": ["io-rgba"], "color": ["io-rgba"]}'></io-element-demo>


An example of the most basic fragment shader program:

```javascript
class myElement extends IoGL {
  static get Frag() {
    return `
    void main(void) {
      gl_FragColor = cssBackgroundColor;
    }`;
  }
}
```

See `IoSliderKnob` and `IoHsvaSv` for more advanced example.
