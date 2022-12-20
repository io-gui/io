# Development Notes

This document is a rough draft.

> Can you improve this document? 

- Simplicity
  - Minimal Tooling
  - Avoid complex tools and processes
  - Rely on <u>web platform</u> features
  - Encapsulate complexity in <u>custom elements</u>
  - Define simple and consistent interfaces

- DOM Structure
  - Use minimal number of elements in the DOM tree
  - DOM mutations should be articulated by custom elements
  - Reactive elements render and manage their own children

- Styling
  - Element's tagName is the primary CSS selector
  - Use properties reflected to attributes as CSS state-selectors
  - Theme is a set of top-level CSS variables
  - Use classes and id's as CSS selectors only if necessary

- TODO: define architectural pattern(s)
  - Model agnostic 
  - Requires global events for mutation observers
  - Utilizes generic views
  - configurable views and widgets
  - Specialized models for navigation, routing and menus

- Runtime type checking
  - Use `debug: {}` labeled scoped blocks to write runtime debug code such as type checking etc.
  - Debug code should not alter the state in any way.
  - Bundled build does not include debug blocks.






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