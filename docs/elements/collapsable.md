A simple button element.

<io-element-demo element="io-collapsable" properties='{"label": "Collapsable", "expanded": true, "elements": [["div", "Content"]]}'></io-element-demo>

When clicked or activated by space/enter key, it calls the `action` function with optional `value` argument. It also emits a bubbling `button-clicked` event.

When focused, arrow keys will change focus to the nearest focusable element in the chosen direction.

#### Properties ####

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`label`**    | String  | Button text                   | `''`  |
| **`expanded`** | Boolean | Function to call when clicked | `false` |
| **`elements`** | Array   | Argument for function action  | `[]` |

#### Events ####

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`button-clicked`** | Clicked | `value`, `action` | false |
