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