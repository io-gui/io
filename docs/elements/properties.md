Option select element.

<io-element-demo element="io-properties" properties='{"labeled": true, "value": {"number": 0.5, "string": "hello", "boolean": true, "null": null, "object": {"prop": "prop"}, "array": [1, 2, 3]}, "properties": ["number", "string", "boolean", "null", "object", "array"], "config": {"type:number": ["io-slider", {"step": 0.01}],"boolean": ["io-switch"]}}'></io-element-demo>

Displays a set of labeled object property editors. It can be configured to use custom property editors.

#### Properties ####

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`labeled`**    | Boolean  | Show property labels        | `{}` |
| **`value`**      | Object   | Current value               | `{}` |
| **`properties`** | Array    | Array with property names   | `[]` |
| **`config`**     | Object   | Custom configuration object | `{}` |

#### Events ####

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`object-mutated`** | Value set by user action | `object`, `property`, `value`, `oldValue` | false |
