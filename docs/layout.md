## `IoCollapsable`

An element with collapsable content.

Extends `IoElement`. Implements `IoBoolean` and `IoContent`.

<io-element-demo element="io-collapsable"
    properties='{
        "elements": [["div", "Content"]],
        "label": "Collapsable",
        "expanded": true}'>
</io-element-demo>

When clicked or activated by space/enter key, it toggles the visibility of the child elements defined as `elements` property.

## `IoSelector`

Extends `IoElement` and `IoContent`.

Element selector. Displays one of the virtual elements assigned in the `elements` property as its child if the name of the element matches the `value` property.

<io-element-demo element="io-selector"
    properties='{
        "elements": [
            ["div", {"name": "first"}, "First content"],
            ["div", {"name": "second"}, "Second content"],
            ["div", {"name": "third"}, "Third content"],
            ["div", {"name": "fourth"}, "Fourth content"]],
        "selected": "first",
        "cache": false}'
    config='{
        "selected": ["io-option-menu", {"options": [
            "first",
            "second",
            "third",
            "fourth"]}]}'>
</io-element-demo>

If `cache` property is set to `true`, a reference to the element will be kept fo later use.

## `IoSelectorTabs`

Extends `IoSelector`. Implements `IoMenuOptions`.

Element selector with selectable tabs interfce.

<io-element-demo element="io-selector-tabs"
    properties='{
        "elements": [
            ["div", {"name": "first"}, "First content"],
            ["div", {"name": "second"}, "Second content"],
            ["div", {"name": "third"}, "Third content"],
            ["div", {"name": "fourth"}, "Fourth content"],
            ["div", {"name": "fifth"}, "Fifth content"],
            ["div", {"name": "sixth"}, "Sixth content"]],
        "selected": "first",
        "cache": false,
        "options": [
            "first",
            "second",
            "third",
            "fourth",
            {"label" : "more", "options": ["fifth", "sixth"]}]}'
    config='{"options": ["io-properties"]}'>
</io-element-demo>

## `IoSelectorSidebar`

Extends `IoSelector`. Implements `IoSidebar`.

Element selector with selectable sidebar interfce.

<io-element-demo element="io-selector-sidebar"
    properties='{
        "elements": [
            ["div", {"name": "first"}, "First content"],
            ["div", {"name": "second"}, "Second content"],
            ["div", {"name": "third"}, "Third content"],
            ["div", {"name": "fourth"}, "Fourth content"]],
        "selected": "first",
        "cache": false,
        "options": [
            "first",
            "second",
            "third",
            "fourth"],
        "right": false,
        "collapseWidth": 410}'
    config='{"options": ["io-properties"]}'>
</io-element-demo>

## `IoSidebar`

Labeled tabs for selection.

Implements `<io-option-menu>` and `<io-button>`.

<io-element-demo element="io-sidebar"
    properties='{
        "selected": 1,
        "options": [1,2,3],
        "collapsed": false}'
    config='{"options": ["io-properties"]}'>
</io-element-demo>

<io-element-demo element="io-sidebar"
    properties='{
        "selected": 1,
        "options": [{"value": 1, "label": "one"}, {"value": 2, "label": "two"}, {"value": 3, "label": "three"}],
        "collapsed": false}'
    config='{"type:object": ["io-properties"]}'>
</io-element-demo>

When tabs are clicked, `selected` value is set.

## `IoLayout`

TODO
