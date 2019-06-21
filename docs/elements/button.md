A simple button element.

<io-element-demo element="io-button" properties='{"label": "Button"}'></io-element-demo>

When clicked or activated by space/enter key, it calls the `action` function with optional `value` argument.

When focused, arrow keys will change focus to the nearest focusable element in the chosen direction.

#### Properties ####

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`label`**  | String   | Button text                   | `'Button'`  |
| **`action`** | Function | Function to call when clicked | `undefined` |
| **`value`**  | _any_    | Argument for function action  | `undefined` |

#### Events ####

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`button-action`** | Clicked | `value`, `action` | false |
