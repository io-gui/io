### `<io-number>` ###

Input element for `Number` data type. It can be configured to clamp its `value` to `min`/`max` values and display value using `conversion` factor.

When focused, the arrow keys navigate to the nearest focusable sibling element.

#### Properties ####

| Property | Type | Description | Default |
|:---------|:-----|:-----------|:--------|
| **`value`** | Number | Value | `1` |
| **`conversion`** | Number | Conversion factor | `1` |
| **`step`** | Number | Value increment/decimals | `0.001` |
| **`min`** | Number | Minimum value | `-Infinity` |
| **`max`** | Number | Maximum value | `Infinity` |

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false |
| **`focus-to`** | Attempted to change focus but no suitable sibling found | `direction` | true |
