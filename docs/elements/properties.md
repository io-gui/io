Option select element.

<io-element-demo element="io-properties" properties='{"value": {"number": 0.5, "string": "hello", "boolean": true, "null": null, "object": {"prop": "prop"}, "array": [1, 2, 3]}}'></io-element-demo>

Extends `<io-button>`.

When clicked or activated by space/enter key, it expands a menu with selectable options.

When focused, arrow keys will change focus to the nearest focusable element in the chosen direction.

<!-- TODO: document menu events  -->

#### Properties ####

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`label`**   | String   | Label text         | `''`  |
| **`value`**   | _any_    | Current value      | `undefined` |
| **`options`** | Array    | Array with options | `[]` |

#### Events ####

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false |
