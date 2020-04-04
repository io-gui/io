## `IoItem`

Extends [`IoElement`](/#doc=core-element).

This is the simplest element with a `value`, a building block for more complex elements.

It simply displays `value` or `label` property if set.

It changes its apparence if `selected` of `disabled` properties are `true`.

Arow keys up, down, left, right and tab change focus to the nearest focusable element in the chosen direction.

<io-element-demo element="io-item" properties='{"label": "Item", "value": "null", "selected": false, "disabled": false}'></io-element-demo>