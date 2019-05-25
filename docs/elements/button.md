### `<io-button>` ###

A simple button element.

When clicked or activated by space/enter key, it calls the `action` function with optional `value` argument. It also emits a bubbling `button-clicked` event.

When focused, the arrow keys navigate to the nearest focusable sibling element.

#### Properties ####

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`label`**  | String   | Button text                   | `'Button'`  |
| **`action`** | Function | Function to call when clicked | `undefined` |
| **`value`**  | _any_    | Argument for function action  | `undefined` |

#### Events ####

| Event | Description | Detail |
|:------|:------------|:-------|
| **`button-clicked`** | Clicked | `value`, `action` |
