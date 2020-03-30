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