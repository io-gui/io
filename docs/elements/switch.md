### `<io-switch>` ###

Extends `<io-button>`.

Input element for `Boolean` data type displayed as switch toggle.

#### Properties ####

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`value`** | Boolean | Value | `false` |

#### Events ####

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`button-clicked`** | Clicked | `value`, `action` | true |
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false |
| **`focus-to`** | Attempted to change focus but no suitable sibling found | `direction` | true |
