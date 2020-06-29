## `IoOptionMenu`

Extends `IoMenuItem`

Option select element. Similar to `IoMenuItem`, except it is displayed as a button and uses `options` property instead of ~~`option.options`~~  and it is `selectable` by default. It displays selected `value` or `label` followed by the `â–¾` character.

<io-element-demo element="io-option-menu" properties='{
  "label": "",
  "value": 0,
  "options": [1,2,3]}
' config='{"type:object": ["io-properties"]}'></io-element-demo>

<io-element-demo element="io-option-menu" properties='{
  "label": "",
  "value": 0,
  "options": [
    {"value": 0, "label": "zero"},
    {"value": 1, "label": "one"},
    {"value": 2, "label": "two"},
    {"value": 3, "label": "three"}
  ]
}' config='{"type:object": ["io-properties"]}'></io-element-demo>

When clicked or activated by space/enter key, it expands a menu with selectable options.