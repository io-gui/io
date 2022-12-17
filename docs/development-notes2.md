Primary features:

* Core features work with objects (nodes) and elements alike.
    - `class IoNode extends IoNodeMixin(Object)`
    - `class IoElement extends IoNodeMixin(HTMLElement)`
    - DOM Events (CustomEvents) work with nodes
    - Template rendering and styling features are specific to IoElement.
    - Nodes can be assigned as property values.
    - Elements are the "view", nodes are the "model".

* Properties easy to define with `static get Properties` object or `@Property` decorator
    - Supports weakly typed property definitions
    - Property definitions respect inheritance.

* Reactive properties.
    - Object properties can observe object mutations.
    - Property values can be reflected to attributes.
    - Runtime type checking available in debug mode.
    - Can recieve data binding objects.
    - Property changes can be batched.

* HTML attributes used only as CSS selectors
    - setAttribute removes attribute for falsey values.

* Robust event-based two-way data binding that works.

* Tamplate syntax uses nested array representation of (virtual) DOM.
    - Template function handles disposal of removed elements.
    - Templates can be brute-forced while DOM updates as performed when needed.
    - disposals are skipped if cache flag is set.

* Element styles defined in `static get Style` string.
    - CSS scoped with `:host` selector.
    - Each element adds its own `<style>` block to document.

* `@RegisterIoNode` and `@RegisterIoElement` decorators to harness the class prototype with `ProtoChain`.

* dispatchEvent shorthand for CustomEvents.

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

* Typescript and mixins don't play well.
* TypeScript type checking not fully supported in Virtual DOM arrays.
* Accessibility and aria-attributes not fully implemented.