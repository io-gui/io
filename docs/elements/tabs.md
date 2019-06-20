Labeled tabs for selection.

<io-element-demo element="io-tabs" properties='{"selected": 1, "options": [1,2,3]}'></io-element-demo>

<io-element-demo element="io-tabs" properties='{"selected": 1, "options": [{"value": 1, "label": "one"}, {"value": 2, "label": "two"}, {"value": 3, "label": "three"}]}'></io-element-demo>

When tabs are clicked, `selected` value is set.

#### Properties ####

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`selected`** | _any_    | Current value      | `undefined` |
| **`options`**  | Array    | Array with options | `[]` |

#### Events ####

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false |
