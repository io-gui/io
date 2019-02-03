### `IoCoreMixin` `<io-core>` ###

### Methods ###

  `changed()` is automatically called every time a property is changed. If multiple properties are changed simultaneously in a template, the method is called only once.

  `[propertyName]Changed(value, oldValue)` If defined, it is automatically called every time the corresponding property changes.

  `dispose()` is called automatically when element is no longer needed. It removes all event listeners and data bindings.

  `bind(prop)` If used in templates or element constructors, this method creates bi-directional data-binding.

  `set(prop, value)` should be used when property value is set by **user action**. It will trigger non-bubbling `[prop]-set` event.

  `dispatchEvent(type, detail, bubbles = true, src = this)` Shorthand for custom event dispatch.
