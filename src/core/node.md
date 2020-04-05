## `IoNode` and `IoNodeMixin`

Core `IoNode` class, also available as `IoNodeMixin`. You can use it to create your own Io classes as following:

```javascript
// Extend `IoNode` to create a new Io class.
class MyClass extends IoNode {}

// Or use `IoNodeMixin` to add Io features to anoher class.
class MyClass extends IoNodeMixin(SomeOtherClass) {}
```

### `.Register()`

Register function should be called on the class itself before it can be used.

```javascript
MyClass.Register()
```

### `static get Properties()`

Properties are defined with a static property configuration object:

```javascript
static get Properties() {
  return {
    myProperty: {
      type: String,
      notify: true,
    },
    myOtherProperty: Boolean,
  };
}
```

See [Proprties](/#doc=core-properties) for more.

## Internal references

`.__bindingManager`: Reference to node's [BindingManager](/#doc=core-binding).

`.__queueManager`: Reference to node's [QueueManager](/#doc=core-queue).

`.__properties`: Reference to node's [Properties](/#doc=core-properties).

`.__listeners`: Reference to node's [Listeners](/#doc=core-listeners).

`.__isConnected`: Set to `true` when the node is connected.

`.__isRegistered`: Set to `true` when the node is registered.

`.__isIoNode`: Always `true` for decendants of `IoNode` class.

`.__protochain`: An array of all prototypes in the prototype chain.

`.__protoProperties`: All properties inherited from the prototype chain.

`.__protoListeners`: All listeners inherited from the prototype chain.

`.__functions`: A list of all auto-binding functions names starting with `_` or `on`.

`.__observedProps`: A list of all mutaion-observed object-properties. 