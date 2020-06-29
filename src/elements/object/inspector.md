## `IoInspector`

Extends `IoElement`. Implements `IoBreadcrumbs`, `IoInspectorLink`, `IoCollapsable` and `IoProperties`.

Object property editor. It displays a set of labeled property editors for the `value` object inside multiple `io-collapsable` elements. It can be configured to use custom property editors and display only specified properties. Properties of type `Object` are displayed as clickable links which can also be navigated in the `io-breadcrumbs` element.

<io-element-demo element="io-inspector" properties='{"value": {"hello": "world"}, "config": {"type:number": ["io-slider", {"step": 0.1}], "type:string": ["io-option-menu", {"options": ["hello", "goodbye"]}]}, "crumbs": []}' config='{"value": ["io-object"], "type:object": ["io-properties"]}'></io-element-demo>