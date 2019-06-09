### `<io-number>` ###

<io-number value="1337"></io-number>

Input element for `Number` data type. It can be configured to clamp its `value` to `min`/`max` and round it to the nearest `step` increment. Value can be displayed using `conversion` factor. For example, conversion factor of `180/π` would display radians as degrees.

When focused, arrow keys will change focus to the nearest focusable element in the chosen direction.

#### Properties ####

| Property | Type | Description | Default |
|:---------|:-----|:-----------|:--------|
| **`value`** | Number | Value | `1` |
| **`conversion`** | Number | Conversion factor | `1` |
| **`step`** | Number | Value increment/decimals | `0.001` |
| **`min`** | Number | Minimum value | `-Infinity` |
| **`max`** | Number | Maximum value | `Infinity` |

#### Events ####

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false |
