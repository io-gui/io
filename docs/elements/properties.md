Object property editor.

<io-element-demo element="io-properties" properties='{"labeled": true, "value": {"number": 0.5, "string": "hello", "boolean": true, "null": null, "object": {"prop": "prop"}, "array": [1, 2, 3]}, "properties": ["number", "string", "boolean", "null", "object", "array"], "config": {"type:number": ["io-slider", {"step": 0.01}],"boolean": ["io-switch"]}}'></io-element-demo>

Displays a set of labeled property editors for the `value` object. It can be configured to use custom property editors and display only specified properties.

#### Properties ####

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`labeled`**    | Boolean  | Show property labels        | `{}` |
| **`value`**      | Object   | Current value object        | `{}` |
| **`properties`** | Array    | Property names to display   | `[]` |
| **`config`**     | Object   | Custom configuration object | `{}` |

#### Events ####

| Event | Description | Detail | Bubbles | Source |
|:------|:------------|:-------|:--------|:-------|
| **`object-mutated`** | Value set by user action | `object`, `property`, `value`, `oldValue` | false | window |
