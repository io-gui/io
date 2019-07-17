## &lt;io-color-picker&gt;

<io-element-demo element="io-color-picker"
  properties='{
    "hsva": [0, 1, 1, 1],
    "horizontal": true
  }'
  config='{
    "type:number": ["io-slider", {"step": 1, "min": 0, "max": 64}],
    "type:object": ["io-properties", {"config": {"type:number": ["io-slider", {"step": 0.01}]}}],
    "size": ["io-properties", {"horizontal": true, "labeled": false, "config": {
      "type:number": ["io-slider-knob", {"step": 8, "minValue": 32, "maxValue": 256}]
    }}]
  }
'></io-element-demo>

## &lt;io-hsv-sv&gt;

<io-element-demo element="io-hsv-sv"
  properties='{
    "size": [128, 128],
    "hsva": [0, 1, 0, 1]
  }'
  config='{
    "type:object": ["io-properties", {"config": {"type:number": ["io-slider", {"step": 0.01}]}}],
    "size": ["io-properties", {"horizontal": true, "labeled": false, "config": {
      "type:number": ["io-slider-knob", {"step": 8, "minValue": 32, "maxValue": 256}]
    }}]
  }
'></io-element-demo>

## &lt;io-hsv-hue&gt;

<io-element-demo element="io-hsv-hue"
  properties='{
    "size": [32, 128],
    "hsva": [0, 1, 0, 1],
    "horizontal": false
  }'
  config='{
    "type:object": ["io-properties", {"config": {"type:number": ["io-slider", {"step": 0.01}]}}],
    "size": ["io-properties", {"horizontal": true, "labeled": false, "config": {
      "type:number": ["io-slider-knob", {"step": 8, "minValue": 32, "maxValue": 256}]
    }}]
  }
'></io-element-demo>

## &lt;io-hsv-alpha&gt;

<io-element-demo element="io-hsv-alpha"
  properties='{
    "size": [32, 128],
    "hsva": [0, 1, 0, 1],
    "horizontal": false
  }'
  config='{
    "type:object": ["io-properties", {"config": {"type:number": ["io-slider", {"step": 0.01}]}}],
    "size": ["io-properties", {"horizontal": true, "labeled": false, "config": {
      "type:number": ["io-slider-knob", {"step": 8, "minValue": 32, "maxValue": 256}]
    }}]
  }
'></io-element-demo>

## &lt;io-vector2&gt;

<io-element-demo element="io-vector2" properties='{"value": [1, 0.5]}'></io-element-demo>

<io-element-demo element="io-vector2" properties='{"value": {"x": 1, "y": 0.5}, "canlink": true}'></io-element-demo>

## &lt;io-vector3&gt;

<io-element-demo element="io-vector3" properties='{"value": [1, 0.5, 0.1], "canlink": true}'></io-element-demo>

## &lt;io-vector4&gt;

<io-element-demo element="io-vector4" properties='{"value": [1, 0.5, 0.1, 0], "canlink": true}'></io-element-demo>

## &lt;io-matrix2&gt;

<io-element-demo element="io-matrix2" properties='{"value": [1, 0, 0, 1]}'></io-element-demo>

## &lt;io-matrix3&gt;

<io-element-demo element="io-matrix3" properties='{"value": [1, 0, 0, 0, 1, 0, 0, 0, 1]}'></io-element-demo>

## &lt;io-matrix4&gt;

<io-element-demo element="io-matrix4" properties='{"value": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]}'></io-element-demo>

## &lt;io-rgb&gt;

<io-element-demo element="io-rgb" properties='{"value": [1, 0.5, 0]}'></io-element-demo>

## &lt;io-rgba&gt;

<io-element-demo element="io-rgba" properties='{"value": [1, 0.5, 0, 1]}'></io-element-demo>
