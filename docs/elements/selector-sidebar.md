Element selector with selectable sidebar interfce. Extends `<io-selector>`.

Extends `<io-selector>`. Implements `<io-sidebar>`.

<io-element-demo element="io-selector-sidebar" properties='{"elements": [["div", {"name": "first"}, "First content"], ["div", {"name": "second"}, "Second content"]], "selected": "first", "cache": false, "precache": false, "options": [{"label": "elements", "options": ["first", "second"]}], "left": true, "minWidth": 460}'></io-element-demo>

#### Properties ####

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`elements`** | Array    | Array with virtual elements | `[]`    |
| **`selected`** | String   | Selected element            | `''`    |
| **`cache`**    | Boolean  | Cache elements for reuse    | `false` |
| **`precache`** | Boolean  | Precache elements           | `false` |
| **`options`**  | Array    | Filtered element options    | `[]`    |
| **`left`**     | Boolean  | Sidebar on the left side    | `true`  |
| **`minWidth`** | Number   | Sidebar collapse width      | `460`   |

#### Events ####

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false |
