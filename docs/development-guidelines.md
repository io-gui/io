# Development Guidelines

This is a WIP document

* Pursue Simplicity
  * Minimal Tooling
  * Rely on web platform features
  * Avoid complex tools and processes
  * Encapsulate complexity in custom elements
* DOM Structure and Styling
  * Use minimal number of elements in the DOM tree
  * Use classes and id's as CSS selectors only if necessary
  * Element's tagName is the key CSS selector
  * Use properties reflected to attributes as state-selectors
* State, Structure and Reactivity
  * Application State is an `Object`, which is a tree
  * GUI DOM tree should match the state tree whenever possible
  * Allow customized/filtered views of the state trees
  * "value" property should be used to assign primary state to elements.
