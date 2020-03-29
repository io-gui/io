## IoNode

`IoNode` class is the core of Io. It includes most of the core APIs. It is also available as mixin `IoNodeMixin` so it can be applied on top of existing classes.

```javascript
class myNode extends IoNode {}
// or
class myNode extends IoNodeMixin(OtherClass) {}
```

## IoElement

`IoElement` is `IoNode` class applied to `HTMLElement` with some additinal DOM API. It is a simple base class for creating fast, lightweight and responsive custom elements.

```javascript
class myElement extends IoElement {}
```
