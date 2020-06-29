## `IoMenuItem`

Extends `IoItem`. Implements `IoMenuOptions` and `IoLayerSingleton`.

It displays `option.icon`, `option.label` and `option.hint` property and it creates expandable `IoMenuOptions` from the `option.options` array. Options are expand in the direction specified by `direction` property. If `selectable` property is set, selecting an option sets its `value` to the entire menu tree and `selected` atribute is set on menu items whose `option.value` matches selected value.

<io-element-demo element="io-menu-item" properties='{
  "value": "hello world",
  "option": {"label": "options", "options": ["one", "two", "three"]},
  "expanded": false,
  "direction": "right",
  "selectable": true
}' config='{
  "direction": ["io-option-menu", {"options": ["top", "right", "bottom", "left"]}], "type:object": ["io-object"]
}'></io-element-demo>