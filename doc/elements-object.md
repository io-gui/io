## `IoProperties`

Extends `IoElement`.

Object editor. It displays a set of labeled property editors for the `value` object. Labels can be omitted by setting `labeled` property to false. If `horizontal` property is set, keys and values are arranged horizontally.

<io-element-demo element="io-properties" properties='{
  "labeled": true,
  "horizontal": false,
  "value": "demo:object"
}' config='{
  "value": ["io-object"],
  "properties": ["io-object"],
  "type:object": ["io-properties"]
}'></io-element-demo>

If `properties` list is set, only specified properties will be displayed.
By setting `config` property, `IoProperties` can be configured to use custom property editors.

<io-element-demo element="io-properties" properties='{
  "labeled": true,
  "horizontal": false,
  "value": "demo:object",
  "properties": ["number", "array"],
  "config": {
    "type:number": ["io-number-slider", {"step": 0.01}],
    "constructor:Array": ["io-properties", {"labeled": false, "horizontal": true, "config": {
      "type:number": ["io-slider", {"step": 0.1, "horizontal": false, "style": {"height": "10em"}}]
    }}]
  }
}' config='{
  "value": ["io-object"],
  "properties": ["io-object"],
  "type:object": ["io-properties"]
}'></io-element-demo>

## `IoObject`

Extends `IoElement`. Implements `IoProperties` and `IoBoolean`.

Object property editor. It displays a set of labeled property editors for the `value` object inside io-collapsable element. It can be configured to use custom property editors and display only specified properties.

<io-element-demo element="io-object" properties='{"expanded": true, "label": "Custom Object Label", "labeled": true, "value": "demo:object"}'></io-element-demo>

## `IoInspector`

Extends `IoElement`. Implements `IoBreadcrumbs`, `IoInspectorLink`, `IoCollapsable` and `IoProperties`.

Object property editor. It displays a set of labeled property editors for the `value` object inside multiple `io-collapsable` elements. It can be configured to use custom property editors and display only specified properties. Properties of type `Object` are displayed as clickable links which can also be navigated in the `io-breadcrumbs` element.

<io-element-demo element="io-inspector" properties='{"value": "demo:object", "config": {"type:number": ["io-slider", {"step": 0.1}], "type:string": ["io-option-menu", {"options": ["hello", "goodbye"]}]}, "crumbs": []}' config='{"value": ["io-object"], "type:object": ["io-properties"]}'></io-element-demo>

## `IoBreadcrumbs`

Extends `IoElement`. Implements `IoButton`.

Breadcrumbs select element. When breadcrumb item is clicked or activated by space/enter key, it sets the value to corresponding option value. Optionally, it can trim the `options` array to selected option index.

<io-element-demo element="io-breadcrumbs" properties='{"value": 1, "options": [1,2,3], "trim": false}' config='{"options": ["io-object", {"expanded": true}]}'></io-element-demo>

<io-element-demo element="io-breadcrumbs" properties='{"value": 1, "options": [{"value": 1, "label": "one"}, {"value": 2, "label": "two"}, {"value": 3, "label": "three"}], "trim": true}' config='{"options": ["io-object", {"expanded": true}]}'></io-element-demo>
