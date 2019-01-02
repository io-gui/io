### `IoObjectProps` `<io-object-props>` ###

Automatically creates an array of input elements for object properties.
It can be configured to use specific elements for individual properties (see configuration).

#### Properties ####

| Property | Type | Description | Default |
|:--------:|:----:|:----------:|:-------:|
| **`value`** | Object | Value. | `undefined` |
| **`props`** | Array | List of properties to show. | `[]` |
| **`config`** | Object | TODO | `{}` |
| **`labeled`** | Boolean | Labels property names | `true` |

#### Events ####

| Event | Description | Detail |
|:--------:|:----:|:----------:|
| **`'value-set'`** | Value set by user action | `object`, `key`, `value`, `oldValue` |
| **`'object-mutated'`** (window) | Value set by user action | `object`, `key`, `value`, `oldValue` |

#### Configuration ####

TODO
