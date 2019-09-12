## `IoVector`

Extends `IoElement`. Implements `IoNumber` and `IoBoolicon`.

Input element for vector arrays and objects.

<io-element-demo element="io-vector" properties='{"value": {"x": 1, "y": 0.5}, "linkable": false}'></io-element-demo>

<io-element-demo element="io-vector" properties='{"value": [0, 0.5, 1], "linkable": true}'></io-element-demo>

## `IoMatrix`

Extends `IoElement`. Implements `IoNumber`.

Input element for vector arrays dispalayed as 2D matrices. Array `value` can have 4, 9, and 16 elements for 2x2, 3x3 and 4x4 matrices.

<io-element-demo element="io-matrix" properties='{"value": [1, 0, 0, 1]}'></io-element-demo>

<io-element-demo element="io-matrix" properties='{"value": [1, 0, 0, 0, 1, 0, 0, 0, 1]}'></io-element-demo>

<io-element-demo element="io-matrix" properties='{"value": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]}'></io-element-demo>
