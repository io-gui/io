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