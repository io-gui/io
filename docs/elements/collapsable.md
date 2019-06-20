An element with collapsable content.

Implements `<io-boolean>`.

<io-element-demo element="io-collapsable" properties='{"label": "Collapsable", "expanded": true, "elements": [["div", "Content"]]}'></io-element-demo>

When clicked or activated by space/enter key, it toggles the visibility of the child elements defined as `elements` property.

When focused, arrow keys will change focus to the nearest focusable element in the chosen direction.

#### Properties ####

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`label`**    | String  | Expand/collapse button text                | `''`  |
| **`expanded`** | Boolean | Expanded state                             | `false` |
| **`elements`** | Array   | Elements to add as children when expanded  | `[]` |

#### Events ####

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false |
