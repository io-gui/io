## `IoSlider`

Extends `IoGl`.

Input element for `Number` data type displayed as slider.
It can be configured to clamp the `value` to `min` / `max` and round it to the nearest `step` increment. `exponent` property can be changed for non-linear scale.

Keys left/right/up/down+shift and pageup/pagedown change the value in step incements. Home/end keys set the value to min/max.

<io-element-demo element="io-slider" properties='{"value": "demo:number", "step": 0.01, "min": -0.5, "max": 0.5, "exponent": 1}'></io-element-demo>