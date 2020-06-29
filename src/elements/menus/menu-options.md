## `IoMenuOptions`

Extends `IoElement`. Implements `IoMenuItem` and `IoLayerSingleton`.

It generates a list of `IoMenuItem` elements from `options` property. If `horizontal` property is set, menu items are displayed in horizontal direction.

<io-element-demo element="io-menu-options" properties='{
  "value": "hello world",
  "selectable": true,
  "searchable": true,
  "search": "",
  "expanded": false,
  "horizontal": false,
  "options": ["one", "two", "three"]
}' config='{
  "type:object": ["io-object"]
}'></io-element-demo>