## `IoNumber`

Extends `IoItem`.

Input element for `Number` data type. It clamps the `value` to `min` / `max` and rounds it to the nearest `step` increment. If `ladder` property is enabled, it displays an interactive float ladder element when clicked/taped. Alternatively, ladder can be expanded by middle click or ctrl key regardless of ladder property.

<io-element-demo element="io-number" width="5em" properties='{"value": 1337, "conversion": 1, "step": 0.1, "min": 0, "max": 10000, "ladder": true}'></io-element-demo>

<io-element-demo element="io-number" width="5em" properties='{"value": 1337, "conversion": 1, "step": 0.0002, "min": 0, "max": 10000, "ladder": true}'></io-element-demo>

Value can be displayed using `conversion` factor. For example, conversion factor of `180/Ï€` would display radians as degrees.

<io-element-demo element="io-number" width="5em" properties='{"value": 0, "step": 0.2617993877991494, "conversion": 57.29577951308232, "min": -6.283185307179586, "max": 6.283185307179586, "ladder": true}'></io-element-demo>