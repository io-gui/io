Input element for `Boolean` data type displayed as text.

Extends `<io-button>`.

<io-element-demo element="io-boolean" properties='{"value": true, "true": "true", "false": "false"}'></io-element-demo>

It can be configured to display custom `true` or `false` string depending on its `value`.

#### Properties ####

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`value`** | Boolean | Value                               | `false`   |
| **`true`**  | String  | Text to display when value is True  | `'true'`  |
| **`false`** | String  | Text to display when value is False | `'false'` |

#### Events ####

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`button-clicked`** | Clicked | `value`, `action` | false |
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false |
