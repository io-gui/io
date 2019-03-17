### `IoCoreMixin` ###

Core classes for all io objects and elements.

### Static Getters ###

**`static get properties()`** Should return property definitions. See readme.md for more info.

**`static get listeners()`** Should return a map of default listeners and handler function names.

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
|:--------:|:----:|:----------:|
| **`[prop]-set`** | Property set by user action | `property`, `value`, `oldValue` |
| **`[prop]-changed`** | Value changed | `property`, `value`, `oldValue` |
