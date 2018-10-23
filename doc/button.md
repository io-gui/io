### `IoButton` `<io-button>` ###

Simple button element. When clicked, it calls the `action` function with optional `value` argument.

#### Properties ####

| Property | Type | Description | Default |
|:--------:|:----:|:----------:|:-------:|
| **`action`** | Function | Function to call when clicked. | `undefined` |
| **`value`** | _any_ | Argument for function. | `undefined` |
| **`label`** | String | Button text. | `'Button'` |
| **`pressed`** | Boolean | True when pressed (internal). | `false` |

#### Events ####

| Event | Description | Detail |
|:--------:|:----:|:----------:|
| **`'button-clicked'`** | Clicked |  `value`, `action` |
