A simple focusable element.

<io-element-demo element="io-item" properties='{"label": "Item", "value": null}'></io-element-demo>

When clicked or activated by space/enter key, it calls the `_onClick()` function with optional `value` argument. This element is used as a base class for other elements.

When focused, arrow keys will change focus to the nearest focusable element in the chosen direction.

#### Properties ####

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`label`**  | String   | Button text                   | `'Button'`  |
| **`value`**  | _any_    | Argument for function action  | `undefined` |
