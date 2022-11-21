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
