## &lt;io-collapsable&gt;

An element with collapsable content.

Implements `<io-boolean>`.

<io-element-demo element="io-collapsable" properties='{"label": "Collapsable", "expanded": true, "elements": [["div", "Content"]]}'></io-element-demo>

When clicked or activated by space/enter key, it toggles the visibility of the child elements defined as `elements` property.

## &lt;io-selector&gt;

Element selector. Displays one of the virtual elements assigned in the `elements` property as its child if the name of the element matches the `value` property.

<io-element-demo element="io-selector" properties='{"elements": [["div", {"name": "first"}, "First content"], ["div", {"name": "second"}, "Second content"], ["div", {"name": "third"}, "Third content"], ["div", {"name": "fourth"}, "Fourth content"]], "selected": "first", "cache": false, "precache": false}' config='{"selected": ["io-option", {"options": ["first", "second", "third", "fourth"]}]}'></io-element-demo>

If `cache` property is set to `true`, a reference to the element will be kept fo later use.

If `precache` property is set to `true`, all elements will be created for immediate use.

## &lt;io-selector-tabs&gt;

Element selector with selectable tabs interfce. Extends `<io-selector>`.

Extends `<io-selector>`. Implements `<io-tabs>`.

<io-element-demo element="io-selector-tabs" properties='{"elements": [["div", {"name": "first"}, "First content"], ["div", {"name": "second"}, "Second content"], ["div", {"name": "third"}, "Third content"], ["div", {"name": "fourth"}, "Fourth content"], ["div", {"name": "fifth"}, "Fifth content"], ["div", {"name": "sixth"}, "Sixth content"]], "selected": "first", "cache": false, "precache": false, "options": ["first", "second", "third", "fourth", {"label" : "more", "options": ["fifth", "sixth"]}]}' config='{"selected": ["io-option", {"options": ["first", "second", "third", "fourth"]}]}'></io-element-demo>

## &lt;io-selector-sidebar&gt;

Element selector with selectable sidebar interfce. Extends `<io-selector>`.

Extends `<io-selector>`. Implements `<io-sidebar>`.

<io-element-demo element="io-selector-sidebar" properties='{"elements": [["div", {"name": "first"}, "First content"], ["div", {"name": "second"}, "Second content"], ["div", {"name": "third"}, "Third content"], ["div", {"name": "fourth"}, "Fourth content"]], "selected": "first", "cache": false, "precache": false, "options": [{"label": "elements", "options": ["first", "second", "third", "fourth"]}], "left": true, "minWidth": 410}' config='{"selected": ["io-option", {"options": ["first", "second", "third", "fourth"]}]}'></io-element-demo>

## &lt;io-sidebar&gt;

Labeled tabs for selection.

Implements `<io-option>` and `<io-button>`.

<io-element-demo element="io-sidebar" properties='{"selected": 1, "options": [1,2,3], "overflow": false}'></io-element-demo>

<io-element-demo element="io-sidebar" properties='{"selected": 1, "options": [{"label": "Options", "options": [{"value": 1, "label": "one"}, {"value": 2, "label": "two"}, {"value": 3, "label": "three"}]}], "overflow": false}'></io-element-demo>

When tabs are clicked, `selected` value is set.

## &lt;io-breadcrumbs&gt;

Breadcrumbs select element.

Implements `<io-button>`.

<io-element-demo element="io-breadcrumbs" properties='{"value": 1, "options": [1,2,3], "trim": false}'></io-element-demo>

<io-element-demo element="io-breadcrumbs" properties='{"value": 1, "options": [{"value": 1, "label": "one"}, {"value": 2, "label": "two"}, {"value": 3, "label": "three"}], "trim": true}'></io-element-demo>

When breadcrumb item is clicked or activated by space/enter key, it sets the value to corresponding option value. Optionally, it can trim the `options` array to selected option index.
