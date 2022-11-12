# Development Guidelines

This document is a work in progress.

> Can you improve this document? 

Notes:

* Simplicity
  * Minimal Tooling
  * Rely on web platform features
  * Avoid complex tools and processes
  * Encapsulate complexity in <u>custom elements</u>
  * Define simple and consistent interfaces using custom element properties
* DOM Structure
  * Use minimal number of elements in the DOM tree
  * DOM mutations from ancestors of reactive elements should be avoided
  * Reactive elements render and manage their own children
* DOM Styling
  * Theme is a set of top-level CSS variables
  * Element's tagName is the primary CSS selector
  * Use properties reflected to attributes as CSS state-selectors
  * Use classes and id's as CSS selectors only if necessary
* State, Menu and DOM Trees
  * Trees: data structures with <u>node</u> and <u>leaf</u> elements
  * State tree: Object representing application state
  * State node: Object representing part of application state
  * State leaf: Basic values at the end of state three

  * Option tree: Recursive structures of menu options and suboptions.
    - Menu options can have labels, values and actions
    - Menu options can be "selected" or "picked"
    - Each menu option and suboption has a bi-directionally reactive "path" utiliy object
  * Option node: Menu option with one or more suboptions.
  * Option leaf: Terminal menu option without suboptions.

  * Menu tree: A DOM structure representing interactive menus
    - Menu trees are generated automatically from menu option trees
    - Menu trees usualy have the same hierarchical structure as their option trees
    - Menu trees can filter and search or represent path of option trees

  * Application tree: A DOM structure at the root of the application
    - Defines application layouts, menus, selectors and views.
    - Assigns menu options to menus and selectors.
    - Assigns application state nodes to views.

  * GUI DOM tree should match the state tree whenever possible
  * Node elements observe contained user input elements and communicate object mutations.
  * All Node elements observe all node mutations
  * Each element handles its own updates and reactively changes
  * Leaf elements handle and communicate user inputs
  * Allow customized/filtered views of the state trees

* Runtime type checking
  * Use `debug: {}` labeled scoped blocks to write runtime debug code such as type checking etc.
  * Debug code should not alter the state in any way.
  * Bundled build does not include debug blocks.
