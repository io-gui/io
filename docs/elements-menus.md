## `IoMenuItem`

Extends `IoItem`. Implements `IoMenuOptions` and `IoLayerSingleton`.

It displays `option.icon`, `option.label` and `option.hint` property and it creates expandable `IoMenuOptions` from the `option.options` array. Options are expand in the direction specified by `direction` property. If `selectable` property is set, selecting an option sets its `value` to the entire menu tree and `selected` atribute is set on menu items whose `option.value` matches selected value.

<io-element-demo element="io-menu-item" properties='{
  "value": "demo:string",
  "option": "demo:menuoption",
  "expanded": false,
  "direction": "right",
  "selectable": true
}' config='{
  "direction": ["io-option-menu", {"options": ["top", "right", "bottom", "left"]}], "type:object": ["io-object"]
}'></io-element-demo>

## `IoMenuOptions`

Extends `IoElement`. Implements `IoMenuItem` and `IoLayerSingleton`.

It generates a list of `IoMenuItem` elements from `options` property. If `horizontal` property is set, menu items are displayed in horizontal direction.

<io-element-demo element="io-menu-options" properties='{
  "value": "demo:string",
  "selectable": true,
  "searchable": true,
  "search": "",
  "expanded": false,
  "horizontal": false,
  "options": "demo:menuoptions"
}' config='{
  "type:object": ["io-object"]
}'></io-element-demo>

## `IoOptionMenu`

Extends `IoMenuItem`

Option select element. Similar to `IoMenuItem`, except it is displayed as a button and uses `options` property instead of ~~`option.options`~~  and it is `selectable` by default. It displays selected `value` or `label` followed by the `▾` character.

<io-element-demo element="io-option-menu" properties='{
  "label": "",
  "value": "demo:number",
  "options": [1,2,3]}
' config='{"type:object": ["io-properties"]}'></io-element-demo>

<io-element-demo element="io-option-menu" properties='{
  "label": "",
  "value": "demo:number",
  "options": [
    {"value": 0, "label": "zero"},
    {"value": 1, "label": "one"},
    {"value": 2, "label": "two"},
    {"value": 3, "label": "three"}
  ]
}' config='{"type:object": ["io-properties"]}'></io-element-demo>

When clicked or activated by space/enter key, it expands a menu with selectable options.

## `IoContextMenu`

Extends `IoElement`.

An invisible element that inserts a floating menu when its `parentElement` is clicked. Menu position is set by the pointer by default but it can be configured to expand to the side of the parent element by setting the `position` property. Default `button` property for menu expansion is `0` (left mouse button), but it can be configured for other buttons. You can have multiple `IoContextMenu` instances under the same `parentElement` as long as the `button` properties are different.

<io-element-demo element="io-context-menu"
  height="256px"
  properties='{
  "value": "demo:string",
  "button": 0,
  "options": "demo:menuoptions",
  "expanded": false,
  "position": "pointer",
  "selectable": false
}' config='{
  "position": ["io-option-menu", {"options": ["pointer", "top", "right", "bottom", "left"]}], "type:object": ["io-object"]
}'></io-element-demo>
