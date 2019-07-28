## &lt;io-properties&gt;

Object property editor.

<io-element-demo element="io-properties" properties='{"labeled": true, "horizontal": false, "value": {"number": 0.5, "string": "hello", "boolean": true, "object": {"prop": "prop"}, "array": [1, 2, 3]}, "config": {"type:number": ["io-slider", {"step": 0.01}]}}' config='{"value": ["io-object"], "properties": ["io-object"], "type:object": ["io-properties"]}'></io-element-demo>

Displays a set of labeled property editors for the `value` object. It can be configured to use custom property editors and display only specified properties.

## &lt;io-object&gt;

Object property editor.

Implements `<io-properties>` and `<io-boolean>`.

<io-element-demo element="io-object" properties='{"expanded": true, "label": "Custom Object Label", "labeled": true, "value": {"number": 0.5, "string": "hello", "boolean": true, "object": {"prop": "prop"}, "array": [1, 2, 3]}, "properties": ["number", "string", "boolean", "null", "object", "array"]}'></io-element-demo>

Displays a set of labeled property editors for the `value` object inside io-collapsable element. It can be configured to use custom property editors and display only specified properties.

## &lt;io-breadcrumbs&gt;

Breadcrumbs select element.

Implements `<io-button>`.

<io-element-demo element="io-breadcrumbs" properties='{"value": 1, "options": [1,2,3], "trim": false}' config='{"options": ["io-object", {"expanded": true}]}'></io-element-demo>

<io-element-demo element="io-breadcrumbs" properties='{"value": 1, "options": [{"value": 1, "label": "one"}, {"value": 2, "label": "two"}, {"value": 3, "label": "three"}], "trim": true}' config='{"options": ["io-object", {"expanded": true}]}'></io-element-demo>

When breadcrumb item is clicked or activated by space/enter key, it sets the value to corresponding option value. Optionally, it can trim the `options` array to selected option index.

## &lt;io-inspector&gt;

Object property editor.

Implements `<io-breadcrumbs>`, `<io-inspector-link>`, `<io-collapsable>` and `<io-properties>`.

<io-element-demo element="io-inspector" properties='{"value": {"number": 0.5, "string": "hello", "boolean": true, "array": [0, 0.5, 1]}, "config": {"type:number": ["io-slider", {"step": 0.1}], "type:string": ["io-menu-option", {"options": ["hello", "goodbye"]}]}, "crumbs": []}' config='{"value": ["io-object"], "type:object": ["io-properties"]}'></io-element-demo>

Displays a set of labeled property editors for the `value` object inside multiple `io-collapsable` elements. It can be configured to use custom property editors and display only specified properties. Properties of type `Object` are displayed as clickable links which can also be navigated in the `io-breadcrumbs` element.
