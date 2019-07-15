## &lt;io-item&gt; ##

A simple focusable element.

<io-element-demo element="io-item" properties='{"label": "Item", "value": "null"}'></io-element-demo>

When clicked or activated by space/enter key, it calls the `_onClick()` function with optional `value` argument. This element is used as a base class for other elements.

When focused, arrow keys will change focus to the nearest focusable element in the chosen direction.

## &lt;io-button&gt; ##

A simple button element.

Extends `<io-item>`.

<io-element-demo element="io-button" properties='{"label": "Button", "action": "null"}'></io-element-demo>

When clicked or activated by space/enter key, it calls the `action` function with optional `value` argument.

## &lt;io-boolean&gt; ##

Input element for `Boolean` data type displayed as text.

Extends `<io-button>`.

<io-element-demo element="io-boolean" properties='{"value": true, "true": "true", "false": "false"}'></io-element-demo>

It can be configured to display custom `true` or `false` string depending on its `value`.

## &lt;io-switch&gt; ##

Input element for `Boolean` data type displayed as switch toggle.

Extends `<io-button>`.

<io-element-demo element="io-switch" properties='{"value": true}'></io-element-demo>

## &lt;io-string&gt; ##

Input element for `String` data type.

<io-element-demo element="io-string" properties='{"value": "Hello io!"}'></io-element-demo>

When focused, arrow keys will change focus to the nearest focusable element in the chosen direction.

## &lt;io-number&gt; ##

Input element for `Number` data type.

<io-element-demo element="io-number" properties='{"value": 1337, "conversion": 1, "step": 0.001, "min": 0, "max": 10000}'></io-element-demo>

It can be configured to clamp the `value` to `min`/`max` and round it to the nearest `step` increment. Value can be displayed using `conversion` factor. For example, conversion factor of `180/π` would display radians as degrees.

When focused, arrow keys will change focus to the nearest focusable element in the chosen direction.

## &lt;io-gl&gt; ##

WebGL canvas for rendering shader-based elements.

<io-element-demo element="io-gl" properties='{"background": [0, 0, 0, 1], "color": [1, 1, 1, 1], "size": [257, 257]}' config='{"size": ["io-properties", {"config": {"type:number": ["io-slider", {"min": 1, "max": 257, "step": 8}]}}], "background": ["io-rgba"], "color": ["io-rgba"]}'></io-element-demo>

This is a base class for WebGL shader elemenents.

The element will automatically create shader uniforms for `Number` and `Array` properties and update canvas on property change.

You can define custom shader code in `static get Vert()` and `static get Frag()` return string.

See `IoSliderKnob` for custom shader example.

## &lt;io-slider&gt; ##

Input element for `Number` data type displayed as interactive slider with a number field.

Implements `<io-number>` and `<io-slider-knob>`.

<io-element-demo element="io-slider" properties='{"value": 0.1, "step": 0.1, "min": 0, "max": 1}'></io-element-demo>

<io-element-demo element="io-slider-knob" properties='{"value": 0.1, "step": 0.1, "minValue": 0, "maxValue": 1}'></io-element-demo>

It can be configured to clamp the `value` to `min`/`max` and round it to the nearest `step` increment.

To change the value with arrow keys on focused slider, users should hold down the shift key.

## &lt;io-option&gt; ##

Option select element.

Extends `<io-button>`. Implements `<io-menu-options>`.

<io-element-demo element="io-option" properties='{"label": "", "value": 1, "options": [1,2,3]}' config='{"type:object": ["io-object", {"config": {"type:object": ["io-properties"]}}]}'></io-element-demo>

<io-element-demo element="io-option" properties='{"label": "", "value": 1, "options": [{"value": 1, "label": "one"}, {"value": 2, "label": "two"}, {"value": 3, "label": "three"}]}' config='{"type:object": ["io-object", {"config": {"type:object": ["io-properties"]}}]}'></io-element-demo>

When clicked or activated by space/enter key, it expands a menu with selectable options.

## &lt;io-menu&gt; ##

<io-element-demo element="io-menu" properties='{"value": "", "button": 0, "position": "pointer", "options": [{"label": "Red", "icon": "❤️", "options": ["red1", "red2", "red3"]}, {"label": "Green", "icon": "💚", "options": ["green1", "green2", "green3"]}, {"label": "Blue", "icon": "💙", "options": ["blue1", "blue2", "blue3"]}]}' config='{"button": ["io-option", {"options": [0, 1, 2]}], "position": ["io-option", {"options": ["pointer", "top", "right", "bottom", "left"]}], "type:object": ["io-object", {"config": {"type:object": ["io-properties"]}}]}'></io-element-demo>

<io-element-demo element="io-menu-options" properties='{"value": "", "horizontal": false, "options": [{"label": "Red", "icon": "❤️", "options": ["red1", "red2", "red3"]}, {"label": "Green", "icon": "💚", "options": ["green1", "green2", "green3"]}, {"label": "Blue", "icon": "💙", "options": ["blue1", "blue2", "blue3"]}]}' config='{"type:object": ["io-object", {"config": {"type:object": ["io-properties"]}}]}'></io-element-demo>

<io-element-demo element="io-menu-item" properties='{"value": "", "direction": "right", "option": {"label": "Hearts", "icon": "❤", "hint": "colors", "options": [{"label": "Red", "icon": "❤️", "options": ["red1", "red2", "red3"]}, {"label": "Green", "icon": "💚", "options": ["green1", "green2", "green3"]}, {"label": "Blue", "icon": "💙", "options": ["blue1", "blue2", "blue3"]}]}}' config='{"direction": ["io-option", {"options": ["top", "right", "bottom", "left"]}], "type:object": ["io-object", {"config": {"type:object": ["io-properties"]}}]}'></io-element-demo>
