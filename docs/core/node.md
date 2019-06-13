# `IoNodeMixin` #

Core mixin for io classes. It can be applied as a mixin to any class such as `Object` or `HTMLElement`.

### Getters ###

Static getters are evaluated once per class when the

**`static get properties()`** Should return property definitions. See readme.md for more info.

**`static get listeners()`** Should return a map of default listeners and handler function names.

**`get compose()`** Experimental

### Functions ###

**`changed()`** Change handler function. Called when any property changes.

**`[propertyName]Changed()`** Change handler function. Called when specific property changes.

**`[propertyName]Mutated()`** Change handler for object property mutation. Triggered by `object-mutated` event on window if specified object is a property value.

**`connect()`** Triggers connectedCallback() for io objects (non-elements).

**`disconnect()`** Triggers disconnectedCallback() for io objects (non-elements).

**`dispose()`** Removes all event listeners and data bindings. It is called automatically for elements, manually for objects.

**`bind(prop)`** Creates bi-directional data-binding. If can be assigned to properties in templates or constructors.

**`set(prop, value)`** Used when property value is set by **user action**. It will trigger non-bubbling `[prop]-set` event.

**`dispatchEvent(type, detail, bubbles = true, src = this)`** Shorthand for custom event dispatch.

#### Events ####

| Event | Description | Detail |
|:------:|:-----------:|:----------:|
| **`[prop]-changed`** | Property changed     | `property`, `value`, `oldValue`           |
| **`value-set`**      | Property set by user | `property`, `value`, `oldValue`           |
| **`object-mutated`** | Object mutated       | `object`, `property`, `value`, `oldValue` |


# `IoNode` #

`IoNodeMixin` applied to `Object` class.
