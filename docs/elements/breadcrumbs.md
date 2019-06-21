Breadcrumbs select element.

Implements `<io-button>`.

<io-element-demo element="io-breadcrumbs" properties='{"value": 1, "options": [1,2,3], "trim": false}'></io-element-demo>

<io-element-demo element="io-breadcrumbs" properties='{"value": 1, "options": [{"value": 1, "label": "one"}, {"value": 2, "label": "two"}, {"value": 3, "label": "three"}], "trim": true}'></io-element-demo>

When breadcrumb item is clicked or activated by space/enter key, it sets the value to corresponding option value. Optionally, it can trim the `options` array to selected option index.

#### Properties ####

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`value`**   | _any_    | Current value               | `undefined` |
| **`options`** | Array    | Array with options          | `[]` |
| **`trim`**    | Boolean  | Trim options to value index | `false` |

#### Events ####

| Event | Description | Detail | Bubbles | Source |
|:------|:------------|:-------|:--------|:-------|
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false ||
| **`object-mutated`** | Value set by user action | `object`, `property`, `value`, `oldValue` | false | window |
