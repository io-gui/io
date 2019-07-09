## &lt;io-item&gt; ##

A simple focusable element.

<io-element-demo element="io-item" properties='{"label": "Item", "value": "undefined"}'></io-element-demo>

When clicked or activated by space/enter key, it calls the `_onClick()` function with optional `value` argument. This element is used as a base class for other elements.

When focused, arrow keys will change focus to the nearest focusable element in the chosen direction.

**Properties**

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`label`**  | String   | Button text                   | `'Button'`  |
| **`value`**  | _any_    | Argument for function action  | `undefined` |

&nbsp;

## &lt;io-button&gt; ##

A simple button element.

Extends `<io-item>`.

<io-element-demo element="io-button" properties='{"label": "Button"}'></io-element-demo>

When clicked or activated by space/enter key, it calls the `action` function with optional `value` argument.

**Properties**

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`action`** | Function | Function to call when clicked | `undefined` |

&nbsp;

## &lt;io-boolean&gt; ##

Input element for `Boolean` data type displayed as text.

Extends `<io-button>`.

<io-element-demo element="io-boolean" properties='{"value": true, "true": "true", "false": "false"}'></io-element-demo>

It can be configured to display custom `true` or `false` string depending on its `value`.

**Properties**

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`value`** | Boolean | Value                               | `false`   |
| **`true`**  | String  | Text to display when value is True  | `'true'`  |
| **`false`** | String  | Text to display when value is False | `'false'` |

**Events**

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false |

&nbsp;

## &lt;io-switch&gt; ##

Input element for `Boolean` data type displayed as switch toggle.

Extends `<io-button>`.

<io-element-demo element="io-switch" properties='{"value": true}'></io-element-demo>

**Properties**

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`value`** | Boolean | Value | `false` |

**Events**

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false |

&nbsp;

## &lt;io-string&gt; ##

Input element for `String` data type.

<io-element-demo element="io-string" properties='{"value": "Hello io!"}'></io-element-demo>

When focused, arrow keys will change focus to the nearest focusable element in the chosen direction.

**Properties**

| Property | Type | Description | Default |
|:---------|:-----|:-----------|:--------|
| **`value`** | String | Value | `''` |

**Events**

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false |

&nbsp;

## &lt;io-number&gt; ##

Input element for `Number` data type.

<io-element-demo element="io-number" properties='{"value": 1337, "conversion": 1, "step": 0.001, "min": 0, "max": 10000}'></io-element-demo>

It can be configured to clamp the `value` to `min`/`max` and round it to the nearest `step` increment. Value can be displayed using `conversion` factor. For example, conversion factor of `180/π` would display radians as degrees.

When focused, arrow keys will change focus to the nearest focusable element in the chosen direction.

**Properties**

| Property | Type | Description | Default |
|:---------|:-----|:-----------|:--------|
| **`value`** | Number | Value | `0` |
| **`conversion`** | Number | Conversion factor | `1` |
| **`step`** | Number | Value increment/decimals | `0.001` |
| **`min`** | Number | Minimum value | `-Infinity` |
| **`max`** | Number | Maximum value | `Infinity` |

**Events**

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false |

&nbsp;

## &lt;io-slider&gt; ##

Input element for `Number` data type displayed as interactive slider with a number field.

Implements `<io-number>` and `<io-slider-knob>`.

<io-element-demo element="io-slider" properties='{"value": 0.1, "step": 0.1, "min": 0, "max": 1}'></io-element-demo>

<io-element-demo element="io-slider-knob" properties='{"value": 0.1, "step": 0.1, "minValue": 0, "maxValue": 1}'></io-element-demo>

It can be configured to clamp the `value` to `min`/`max` and round it to the nearest `step` increment.

To change the value with arrow keys on focused slider, users should hold down the shift key.

**Properties**

| Property | Type | Description | Default |
|:---------|:-----|:-----------|:--------|
| **`value`** | Number | Value | `0` |
| **`step`** | Number | Value increment/decimals | `0.001` |
| **`min`** | Number | Minimum value | `0` |
| **`max`** | Number | Maximum value | `1` |

**Events**

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false |

&nbsp;

## &lt;io-option&gt; ##

Option select element.

Extends `<io-button>`. Implements `<io-menu-options>`.

<io-element-demo element="io-option" properties='{"value": 1, "options": [1,2,3], "label": ""}'></io-element-demo>

<io-element-demo element="io-option" properties='{"value": 1, "options": [{"value": 1, "label": "one"}, {"value": 2, "label": "two"}, {"value": 3, "label": "three"}], "label": ""}'></io-element-demo>

When clicked or activated by space/enter key, it expands a menu with selectable options.

<!-- TODO: document menu events  -->

**Properties**

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`options`** | Array    | Array with options | `[]` |

**Events**

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false |

&nbsp;

## &lt;io-menu&gt; ##

<io-element-demo element="io-menu" properties='{"value": "", "button": 0, "position": "pointer", "options": [{"label": "Red", "icon": "❤️", "options": ["red1", "red2", "red3"]}, {"label": "Green", "icon": "💚", "options": ["green1", "green2", "green3"]}, {"label": "Blue", "icon": "💙", "options": ["blue1", "blue2", "blue3"]}]}' config='{"button": ["io-option", {"options": [0, 1, 2]}], "position": ["io-option", {"options": ["pointer", "top", "right", "bottom", "left"]}]}'></io-element-demo>

<io-element-demo element="io-menu-options" properties='{"value": "", "horizontal": false, "options": [{"label": "Red", "icon": "❤️", "options": ["red1", "red2", "red3"]}, {"label": "Green", "icon": "💚", "options": ["green1", "green2", "green3"]}, {"label": "Blue", "icon": "💙", "options": ["blue1", "blue2", "blue3"]}]}'></io-element-demo>

<io-element-demo element="io-menu-item" properties='{"value": "", "direction": "right", "option": {"label": "Hearts", "icon": "❤", "hint": "colors", "options": [{"label": "Red", "icon": "❤️", "options": ["red1", "red2", "red3"]}, {"label": "Green", "icon": "💚", "options": ["green1", "green2", "green3"]}, {"label": "Blue", "icon": "💙", "options": ["blue1", "blue2", "blue3"]}]}}' config='{"position": ["io-option", {"options": ["top", "right", "bottom", "left"]}]}'></io-element-demo>

## &lt;io-gl&gt; ##

WebGL canvas for rendering elements as shaders.

<io-element-demo element="io-gl" properties='{"background": [0, 0, 0, 1], "color": [1, 1, 1, 1], "size": [257, 257]}' config='{"size": ["io-properties", {"config": {"type:number": ["io-slider", {"min": 1, "max": 257, "step": 8}]}}]}'></io-element-demo>

This is a base class for WebGL shader elemenents.

The element will automatically create shader uniforms for `Number` and `Array` properties and update canvas on property change.

You can define custom shader code in `static get vert()` and `static get frag()` return string.

See `IoSliderKnob` for custom shader example.

**Properties**

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`background`** | Array    | Background color   | `[0, 0, 0, 1]` |
| **`color`**      | Array    | Foreground color   | `[1, 1, 1, 1]` |
| **`size`**       | Array    | Canvas size        | `[0, 0]`       |

**Events**

| Event | Description | Detail | Bubbles | Source |
|:------|:------------|:-------|:--------|:-------|
| **`object-mutated`** | Value set by user action | `object: this.size` | false | window |
