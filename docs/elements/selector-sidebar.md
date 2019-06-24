Element selector with selectable sidebar interfce. Extends `<io-selector>`.

Extends `<io-selector>`. Implements `<io-sidebar>`.

<io-element-demo element="io-selector-sidebar" properties='{"elements": [["div", {"name": "first"}, "First content"], ["div", {"name": "second"}, "Second content"], ["div", {"name": "third"}, "Third content"], ["div", {"name": "fourth"}, "Fourth content"]], "value": "first", "cache": false, "precache": false, "options": [{"label": "elements", "options": ["first", "second", "third", "fourth"]}], "left": true, "minWidth": 410}' config='{"value": ["io-option", {"options": ["first", "second", "third", "fourth"]}]}'></io-element-demo>

#### Properties ####

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`options`**  | Array    | Filtered element options    | `[]`    |
| **`left`**     | Boolean  | Sidebar on the left side    | `true`  |
| **`minWidth`** | Number   | Sidebar collapse width      | `410`   |

#### Events ####

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false |
