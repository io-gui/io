Object property editor.

Implements `<io-breadcrumbs>`, `<io-inspector-link>`, `<io-collapsable>` and `<io-properties>`.

<io-element-demo element="io-inspector" properties='{"expanded": true, "label": "", "labeled": true, "value": {"number": 0.5, "string": "hello", "boolean": true, "null": null, "object": {"prop1": "1", "prop2": "2", "prop3": {}}, "array": [0, 0.5, 1]}, "properties": ["number", "string", "boolean", "null", "object", "array"], "config": {"type:number": ["io-slider", {"step": 0.1}], "type:string": ["io-option", {"options": ["hello", "goodbye"]}], "object": ["io-properties"]}, "crumbs": []}'></io-element-demo>

Displays a set of labeled property editors for the `value` object inside multiple `io-collapsable` elements. It can be configured to use custom property editors and display only specified properties. Properties of type `Object` are displayed as clickable links which can also be navigated in the `io-breadcrumbs` element.

#### Properties ####

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`value`**      | Object   | Current value object        | `{}` |
| **`properties`** | Array    | Property names to display   | `[]` |
| **`config`**     | Object   | Custom configuration object | `{}` |

#### Events ####

| Event | Description | Detail | Bubbles | Source |
|:------|:------------|:-------|:--------|:-------|
| **`object-mutated`** | Value set by user action | `object`, `property`, `value`, `oldValue` | false | window |
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false |
