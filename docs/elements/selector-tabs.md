Element selector with selectable tabs interfce. Extends `<io-selector>`.

<io-element-demo element="io-selector-tabs" properties='{"elements": [["div", {"name": "first"}, "First content"], ["div", {"name": "second"}, "Second content"]], "selected": "first", "cache": false, "precache": false}'></io-element-demo>

#### Properties ####

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`elements`** | Array    | Array with virtual elements | `[]`    |
| **`selected`** | String   | Selected element            | `''`    |
| **`cache`**    | Boolean  | Cache elements for reuse    | `false` |
| **`precache`** | Boolean  | Precache elements           | `false` |

#### Events ####

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false |
