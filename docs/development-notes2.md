### Unit Tests

* Chai and Mocha
* Extensive unit tests for reactivity and binding.

### Interesting Core Feature

* Disposals are skipped if cache flag is set.
* `lazy: true` property.

# Core internals

* ProtoChain
    - ProtoChain is an inheritance aggregator that also performs one-time class initialization.
    - `@RegisterIoNode` and `@RegisterIoElement` decorators to harness the class prototype with `ProtoChain`.


# Core Classes

* IoThemeSingleton for themes with property-bound CSS variables.

* IoOverlaySingleton Singleton for top-level 

* Data-storge nodes for persistant data between sessions.
    - Supports storing to localStorage and hash string.
    - this.bind(prop) returns a data-binding object.

Design system

* Menu system
    - Versatile Menu Model With MenuOptions and MenuItem
    - Menu elements

* Content navigation and routing

Benefits of custom frameworks

* You can change design and features without worrying about someone depending on it.
* You can add core class features to simplify high level systems.

Problems

* Virtual DOM arrays are non-standard and take time getting used to.
* Typescript and mixins don't play well.
* TypeScript type checking not fully supported in Virtual DOM arrays.
* Accessibility and aria-attributes not fully implemented.
* SSR - not even once