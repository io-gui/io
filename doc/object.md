### `IoObject` `<io-object>` ###

Input element for `Object` data type. It can be used as an object inspector or configured for custom data-centric user interfaces.

#### Properties ####

| Property | Type | Description | Default |
|:--------:|:----:|:----------:|:-------:|
| **`value`** | Object | Value. | `undefined` |
| **`expanded`** | Boolean | Show/hide properties. | `true` |
| **`label`** | String | Text to replace constructor name. | `''` |
| **`props`** | Array | List of properties to show. | `[]` |
| **`config`** | Object | _Experimental_. | `{}` |

#### Events ####

| Event | Description | Detail |
|:--------:|:----:|:----------:|
| **`'value-set'`** | Value set by user action | `value`, `oldValue` |
| **`'object-mutated'`** (window) | Value set by user action | `object`, `key`, `value`, `oldValue` |
