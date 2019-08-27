## &lt;io-menu&gt;

TODO

## &lt;io-menu-item&gt;

<io-element-demo element="io-menu-item" expanded properties='{
  "value": "",
  "option": {
    "label": "Hearts",
    "icon": "❤",
    "hint": "colors",
    "options": [
      {"label": "Red", "icon": "❤️", "options": ["red1", "red2", "red3"]},
      {"label": "Green", "icon": "💚", "options": ["green1", "green2", "green3"]},
      {"label": "Blue", "icon": "💙", "options": ["blue1", "blue2", "blue3"]}
    ]},
    "expanded": false,
    "direction": "right",
    "selectable": false
}' config='{
  "direction": ["io-option-menu", {"options": ["top", "right", "bottom", "left"]}], "type:object": ["io-object", {"config": {"type:object": ["io-properties"]}}]
}'></io-element-demo>

## &lt;io-menu-options&gt;

<io-element-demo element="io-menu-options" properties='{
  "value": "",
  "selectable": false,
  "expanded": false,
  "horizontal": false,
  "options": [
    {"label": "Red", "icon": "❤️", "options": ["red1", "red2", "red3"]},
    {"label": "Green", "icon": "💚", "options": ["green1", "green2", "green3"]},
    {"label": "Blue", "icon": "💙", "options": ["blue1", "blue2", "blue3"]}]
}' config='{
  "type:object": ["io-object", {"config": {"type:object": ["io-properties"]}}]
}'></io-element-demo>

## &lt;io-option-menu&gt;

Option select element.

Extends `<io-button>`. Implements `<io-menu-options>`.

<io-element-demo element="io-option-menu" properties='{"label": "", "value": 1, "options": [1,2,3]}' config='{"type:object": ["io-object", {"config": {"type:object": ["io-properties"]}}]}'></io-element-demo>

<io-element-demo element="io-option-menu" properties='{"label": "", "value": 1, "options": [{"value": 1, "label": "one"}, {"value": 2, "label": "two"}, {"value": 3, "label": "three"}]}' config='{"type:object": ["io-object", {"config": {"type:object": ["io-properties"]}}]}'></io-element-demo>

When clicked or activated by space/enter key, it expands a menu with selectable options.

## &lt;io-menu-layer-singleton&gt;
