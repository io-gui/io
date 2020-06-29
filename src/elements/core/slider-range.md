## `IoSliderRange`

Extends `IoSlider`.

Input element for `Array(2)` data type displayed as slider.
It can be configured to clamp the `value` compoents to `min` / `max` and round it to the nearest `step` increment. `exponent` property can be changed for non-linear scale.

Keys left/right/up/down+shift and pageup/pagedown change the value in step incements. Home/end keys set the value to min/max.

<io-element-demo element="io-slider-range" properties='{"value": [0, 0], "step": 0.1, "min": -1, "max": 2, "exponent": 1}'></io-element-demo>