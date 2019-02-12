### `IoLite` `<io-lite>` ###

A lightweight version of `IoCore` class. It provides the most basic features such as property configuration, property change events and ability to be binding target.

### Functions ###

**`defineProperties()`** Defines properties like `IoCore` `properties()` getter. Except is should be called in `constructor()`.

**`changed()`** Change handler function. Called when any property changes.

**`[propertyName]Changed()`** Change handler function. Called when specific property changes.

**`addEventListener(eventName, handler)`** Added event listener.

**`hasEventListener(eventName, handler)`** Checks if specified listener exists.

**`removeEventListener(eventName, handler)`** Removes specified listener.

**`removeListeners()`** Removes all listeners.

**`dispatchEvent(type, detail, bubbles = true, src = this)`** Shorthand for custom event dispatch.

#### Events ####

| Event | Description | Detail |
|:--------:|:----:|:----------:|
| **`[prop]-set`** | Property set by user action | `property`, `value`, `oldValue` |
| **`[prop]-changed`** | Value changed | `property`, `value`, `oldValue` |
