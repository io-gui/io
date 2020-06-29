## `IoContextMenu`

Extends `IoElement`.

An invisible element that inserts a floating menu when its `parentElement` is clicked. Menu position is set by the pointer by default but it can be configured to expand to the side of the parent element by setting the `position` property. Default `button` property for menu expansion is `0` (left mouse button), but it can be configured for other buttons. You can have multiple `IoContextMenu` instances under the same `parentElement` as long as the `button` properties are different.

<io-element-demo element="io-context-menu"
  height="256px"
  properties='{
  "value": "hello world",
  "button": 0,
  "options": ["one", "two", "three"],
  "expanded": false,
  "position": "pointer",
  "selectable": false
}' config='{
  "position": ["io-option-menu", {"options": ["pointer", "top", "right", "bottom", "left"]}], "type:object": ["io-object"]
}'></io-element-demo>