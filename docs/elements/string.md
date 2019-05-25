### `<io-string>` ###

Input element for `String` data type.

When focused, the arrow keys navigate to the nearest focusable sibling element.

#### Properties ####

| Property | Type | Description | Default |
|:---------|:-----|:-----------|:--------|
| **`value`** | String | Value | `''` |

#### Events ####

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false |
| **`focus-to`** | Attempted to change focus but no suitable sibling found | `direction` | true |
