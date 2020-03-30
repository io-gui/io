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