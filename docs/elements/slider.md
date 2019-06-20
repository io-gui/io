Input element for `Number` data type displayed as interactive slider with a number field.

Implements `<io-number>` and `<io-slider-knob>`.

<io-element-demo element="io-slider" properties='{"value": 0.1, "step": 0.1, "min": 0, "max": 1}'></io-element-demo>

It can be configured to clamp the `value` to `min`/`max` and round it to the nearest `step` increment.

When the element is focused, arrow keys will change focus to the nearest focusable element in the chosen direction. To change the value with arrow keys, users should hold down the shift key.

#### Properties ####

| Property | Type | Description | Default |
|:---------|:-----|:-----------|:--------|
| **`value`** | Number | Value | `0` |
| **`step`** | Number | Value increment/decimals | `0.001` |
| **`min`** | Number | Minimum value | `0` |
| **`max`** | Number | Maximum value | `1` |

#### Events ####

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false |
