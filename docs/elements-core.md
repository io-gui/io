## &lt;io-item&gt;

Extends `<io-element>`.

A superclass for various other elements.
InnerText displays label or value property converted to string.
When clicked or activated by space/enter key, it calls the `_onClick(event)` function.
When focused, arrow keys will change focus to the nearest focusable element in the chosen direction using `.focusTo(direction)` method.

<io-element-demo element="io-item" properties='{"label": "Item", "value": "null"}'></io-element-demo>

## &lt;io-button&gt;

Extends `<io-item>`.

Button element. When clicked or activated by space/enter key, it calls the `action` property function with optional `value` argument.

<io-element-demo element="io-button" properties='{"label": "Button", "action": "null"}'></io-element-demo>

## &lt;io-boolean&gt;

Extends `<io-button>`.

Input element for `Boolean` data type displayed as text. It can be configured to display custom `true` or `false` string depending on its `value`.

<io-element-demo element="io-boolean" properties='{"value": true, "true": "true", "false": "false"}'></io-element-demo>

## &lt;io-boolicon&gt;

Extends `<io-boolean>`. Implements `<io-icon>`.

Input element for `Boolean` data type displayed as switch. It can be configured to display custom `true` or `false` icon depending on its `value`.

<io-element-demo element="io-boolicon" properties='{"value": true, "true": "icons:check", "false": "icons:uncheck"}'></io-element-demo>

## &lt;io-switch&gt;

Extends `<io-boolean>`.

Input element for `Boolean` data type displayed as icon.

<io-element-demo element="io-switch" properties='{"value": true}'></io-element-demo>

## &lt;io-string&gt;

Extends `<io-item>`.

Input element for `String` data type.

<io-element-demo element="io-string" properties='{"value": "Hello io!"}'></io-element-demo>

## &lt;io-number&gt;

Extends `<io-item>`.

Input element for `Number` data type. It can be configured to clamp the `value` to `min`/`max` and round it to the nearest `step` increment. Value can be displayed using `conversion` factor. For example, conversion factor of `180/π` would display radians as degrees. Enable `ladder` property to use interactive float ladder element.

<io-element-demo element="io-number" properties='{"value": 1337, "conversion": 1, "step": 0.001, "min": 0, "max": 10000, "ladder": false}'></io-element-demo>

## &lt;io-gl&gt;

`IoGL` is a base class for WebGL-based custom elements. The appearance of such elements is defined with fragment shader programs that execute on the GPU. All numeric properties are automatically bound to shader uniforms, including `IoThemeSingleton` properties. You can define your custom shaders inside `static get Frag()` return string.

<io-element-demo element="io-gl" width="255px" height="255px" properties='{"color": [0, 0, 0, 1]}' config='{"size": ["io-properties", {"labeled": false, "config": {"type:number": ["io-slider", {"min": 1, "max": 257, "step": 8}]}}], "background": ["io-color-vector"], "color": ["io-color-vector"]}'></io-element-demo>


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

## &lt;io-slider&gt;

Input element for `Number` data type displayed as interactive slider with a number field.

Implements `<io-number>` and `<io-slider-knob>`.

<io-element-demo element="io-slider" properties='{"value": 0.1, "step": 0.01, "min": -0.5, "max": 0.5}'></io-element-demo>

It can be configured to clamp the `value` to `min`/`max` and round it to the nearest `step` increment.

To change the value with arrow keys on focused slider, users should hold down the shift key.

## &lt;io-number-slider&gt;

TODO

## &lt;io-ladder&gt;

TODO

## &lt;io-icon&gt;

SVG icon element. Displays SVG content specified via `icon` parameter. Custom SVG assets need to be registered with `IoIconsetSingleton`.

<io-element-demo element="io-icon" properties='{"icon": "icons:link"}' config='{"icon": ["io-menu-option", {"options": ["icons:link", "icons:unlink", "icons:check", "icons:uncheck"]}]}'></io-element-demo>

## IoIconsetSingleton

Extends `IoNode`.

Global database for SVG assets to be used with `<io-icon>`. Icons are registered using `namespace` and `id` attribute.

```javascript
import {IoIconsetSingleton} from "./path_to/io-elements-core.js";
const svgString = `<svg><g id="myicon"><path d="..."/></g></svg>`;

/* register icons under "custom" namespace */
IoIconsetSingleton.registerIcons('custom', svgString);
/* retrieve specific icon */
const icon = IoIconsetSingleton.getIcon('custom:myicon');
```

## &lt;io-layer-singleton&gt;

TODO

## &lt;io-theme-singleton&gt;

`IoThemeSingleton` holds top-level CSS variables for Io design system. Variables are grouped in different themes and can be collectively switched by changing `theme` property.

```javascript
IoThemeSingleton.theme = 'dark';
```

Moreover, some of the key theme variables such as `'--io-color'` and `'--io-background-color'` are mapped to numeric properties `cssColor` and `cssBackgroundColor` source code for more advanced example.
