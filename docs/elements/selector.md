Element selector. Displays one of the virtual elements assigned in the `elements` property as its child if the name of the element matches the `selected` property.

<io-element-demo element="io-selector" properties='{"elements": [["div", {"name": "first"}, "First content"], ["div", {"name": "second"}, "Second content"], ["div", {"name": "third"}, "Third content"], ["div", {"name": "fourth"}, "Fourth content"]], "selected": "first", "cache": false, "precache": false}' config='{"selected": ["io-option", {"options": ["first", "second", "third", "fourth"]}]}'></io-element-demo>

If `cache` property is set to `true`, a reference to the element will be kept fo later use.

If `precache` property is set to `true`, all elements will be created for immediate use.

#### Properties ####

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`elements`** | Array    | Array with virtual elements | `[]`    |
| **`selected`** | String   | Selected element            | `''`    |
| **`scrollid`** | String   | Scrolled element id         | `''`    |
| **`cache`**    | Boolean  | Cache elements for reuse    | `false` |
| **`precache`** | Boolean  | Precache elements           | `false` |
