Element selector with selectable tabs interfce. Extends `<io-selector>`.

Extends `<io-selector>`. Implements `<io-tabs>`.

<io-element-demo element="io-selector-tabs" properties='{"elements": [["div", {"name": "first"}, "First content"], ["div", {"name": "second"}, "Second content"], ["div", {"name": "third"}, "Third content"], ["div", {"name": "fourth"}, "Fourth content"]], "selected": "first", "cache": false, "precache": false, "options": ["first", "second", "third", "fourth"]}' config='{"selected": ["io-option", {"options": ["first", "second", "third", "fourth"]}]}'></io-element-demo>

#### Properties ####

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`elements`** | Array    | Array with virtual elements | `[]`    |
| **`selected`** | String   | Selected element            | `''`    |
| **`cache`**    | Boolean  | Cache elements for reuse    | `false` |
| **`precache`** | Boolean  | Precache elements           | `false` |
| **`options`**  | Array    | Filtered element options    | `[]`    |

#### Events ####

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false |
