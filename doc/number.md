### `IoNumber` `<io-number>` ###

Input element for `Number` data type. It can be configured to clamp its `value` to `min` and `max` values and display value using `conversion` factor.

#### Properties ####

| Property | Type | Description | Default |
|:--------:|:----:|:----------:|:-------:|
| **`value`** | Number | Value. | `1` |
| **`conversion`** | Number | Conversion factor. | `1` |
| **`step`** | Number | Value increment/decimals. | `0.001` |
| **`min`** | Number | Minimum value. | `-Infinity` |
| **`max`** | Number | Maximum value. | `Infinity` |

#### Events ####

| Event | Description | Detail |
|:--------:|:----:|:----------:|
| **`'value-set'`** | Value set by user action | `value`, `oldValue` |
