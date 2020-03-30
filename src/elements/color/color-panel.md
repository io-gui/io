## `IoColorPanel`

Extends `IoColorMixin(IoElement)`.

Input element for color displayed as a set of sliders.

<io-element-demo element="io-color-panel"
width= "192px"
height= "128px"
properties='{"mode": 0, "value": "demo:rgba", "horizontal": true}'
config='{"value": ["io-properties"], "mode": ["io-option-menu", {"options": [{"value": 0, "label": "0 - rgb"}, {"value": 1, "label": "1 - hsv"}, {"value": 2, "label": "2 - hsl"}, {"value": 3, "label": "3 - cmyk"}]}]}
'></io-element-demo>

## `IoColorPanelSingleton`

Implements `IoColorPanel` and `IoLayerSingleton`.

A singleton instance of `IoColorPanel` floating inside `IoLayerSingleton`. It is used by `IoColorPicker` and other elements.