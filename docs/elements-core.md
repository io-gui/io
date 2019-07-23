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

It can be configured to display custom `true` or `false` string depending on its `value`.

## &lt;io-switch&gt;

Input element for `Boolean` data type displayed as switch toggle.

Extends `<io-button>`.

<io-element-demo element="io-switch"></io-element-demo>

## &lt;io-string&gt;

Input element for `String` data type.

<io-element-demo element="io-string" properties='{"value": "Hello io!"}'></io-element-demo>

When focused, arrow keys will change focus to the nearest focusable element in the chosen direction.

## &lt;io-number&gt;

Input element for `Number` data type.

<io-element-demo element="io-number" properties='{"value": 1337, "conversion": 1, "step": 0.001, "min": 0, "max": 10000}'></io-element-demo>

It can be configured to clamp the `value` to `min`/`max` and round it to the nearest `step` increment. Value can be displayed using `conversion` factor. For example, conversion factor of `180/π` would display radians as degrees.

When focused, arrow keys will change focus to the nearest focusable element in the chosen direction.

## &lt;io-slider&gt;

Input element for `Number` data type displayed as interactive slider with a number field.

Implements `<io-number>` and `<io-slider-knob>`.

<io-element-demo element="io-slider" properties='{"value": 0.1, "step": 0.3, "min": 0.1, "max": 1}'></io-element-demo>

<io-element-demo element="io-slider-knob" properties='{"value": 0.1, "step": 0.1, "minV": 0, "max": 1}'></io-element-demo>

It can be configured to clamp the `value` to `min`/`max` and round it to the nearest `step` increment.

To change the value with arrow keys on focused slider, users should hold down the shift key.
