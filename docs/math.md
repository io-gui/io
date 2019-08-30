## &lt;io-vector&gt;

Input element for vector arrays and objects. Array `value` can have between 2 and 4 number elements. Object `value` can have keys `x`, `y`, `z` and `w`.

<io-element-demo element="io-vector" properties='{"value": {"x": 1, "y": 0.5}, "linkable": false}'></io-element-demo>

<io-element-demo element="io-vector" properties='{"value": [1, 0.5, 0.1, 0], "linkable": true}'></io-element-demo>

## &lt;io-matrix&gt;

Input element for vector arrays dispalayed as 2D matrices. Array `value` can have 4, 9, and 16 elements for 2x2, 3x3 and 4x4 matrices.

<io-element-demo element="io-matrix" properties='{"value": [1, 0, 0, 1]}'></io-element-demo>

<io-element-demo element="io-matrix" properties='{"value": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]}'></io-element-demo>
