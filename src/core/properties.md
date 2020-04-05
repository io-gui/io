## Property

**Internal** class for each property on [IoNode](/#doc=core-node). It is instantiated for each property automatically during instance construction and it is stored inside `__properties` object. It holds both property configuration and state. Its constructor expects a configuration object containing following options:

Arguments:

## ProtoProperty
## ProtoProperties

`IoNode` class is the core of Io. It includes most of the core APIs. It is also available as mixin `IoNodeMixin` so it can be applied on top of existing classes.

```javascript
class myNode extends IoNode {}
// or
class myNode extends IoNodeMixin(OtherClass) {}
```
