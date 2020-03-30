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