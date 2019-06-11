Input element for `Boolean` data type displayed as switch toggle.

<io-element-demo element="io-switch" properties='{"value": true}'></io-element-demo>

Extends `<io-button>`.

#### Properties ####

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`value`** | Boolean | Value | `false` |

#### Events ####

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`button-clicked`** | Clicked | `value`, `action` | false |
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false |
