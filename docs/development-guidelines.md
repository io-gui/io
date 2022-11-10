# Development Guidelines

This document is a work in progress.

> Can you improve this document? 

Notes:

* Pursue Simplicity
  * Minimal Tooling
  * Rely on web platform features
  * Avoid complex tools and processes
  * Encapsulate complexity in custom elements
* DOM Structure and Styling
  * Use minimal number of elements in the DOM tree
  * Each element renders and manages it's own children
  * Element's tagName is the key CSS selector
  * Use properties reflected to attributes as state-selectors
  * Use classes and id's as CSS selectors only if necessary
* State, Structure and Reactivity
  * Application State is an `Object`, which is a tree
  * GUI DOM tree should match the state tree whenever possible
  * DOM tree, therefore, includes node and leaf elements
  * Node elements observe contained user input elements and communicate object mutations.
  * All Node elements observe all node mutations
  * Each element handles its own updates and reactively changes
  * Leaf elements handle and communicate user inputs
  * Allow customized/filtered views of the state trees

* Runtime type checking
  * Use `debug: {}` labeled scoped blocks to write runtime debug code such as type checking etc.
  * Debug code should not alter the state in any way.
  * Bundled build does not include debug blocks.
