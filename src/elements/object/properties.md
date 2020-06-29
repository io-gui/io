## `IoProperties`

Extends `IoElement`.

Object editor. It displays a set of labeled property editors for the `value` object. Labels can be omitted by setting `labeled` property to false. If `horizontal` property is set, keys and values are arranged horizontally.

<io-element-demo element="io-properties" properties='{
  "labeled": true,
  "horizontal": false,
  "value": {"hello": "world"}
}' config='{
  "value": ["io-object"],
  "properties": ["io-object"],
  "type:object": ["io-properties"]
}'></io-element-demo>

If `properties` list is set, only specified properties will be displayed.
By setting `config` property, `IoProperties` can be configured to use custom property editors.

<io-element-demo element="io-properties" properties='{
  "labeled": true,
  "horizontal": false,
  "value": {"hello": "world"},
  "properties": ["number", "array"],
  "config": {
    "type:number": ["io-number-slider", {"step": 0.01}],
    "constructor:Array": ["io-properties", {"labeled": false, "horizontal": true, "config": {
      "type:number": ["io-slider", {"step": 0.1, "horizontal": false, "style": {"height": "10em"}}]
    }}]
  }
}' config='{
  "value": ["io-object"],
  "properties": ["io-object"],
  "type:object": ["io-properties"]
}'></io-element-demo>