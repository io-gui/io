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