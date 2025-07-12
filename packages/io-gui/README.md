## Io-Gui Overview
Io-Gui is a lightweight (~16KB gzipped) library that provides core features for Io-Gui components (nodes and elements).

### Nodes and IoElements
At the core of IoGui there are two basic classes. First, there is `Node` - essentially an `Object` with core Io-Gui features built-in. Second, there is `IoElement` - a custom `HTMLElement` with all of the same features as well as some DOM-specific ones. You can extend these classes to create your own nodes and custom elements.

### Reactive Properties
Simply define properties using `@Property()` decorator or in the `static get ReactiveProperties() {}` function, and your components will automatically dispatch `'[propertyName]-changed'` events and invoke `.[propertyName]Changed(change)` handlers. Lastly, `changed()` handler will be invoked.

### Observed Object Mutations
If a property is defined with a type of `Node` or `IoElement`, it will automatically be observed for mutations. After object mutation, the `'[propertyName]Mutated()'` handler will be invoked. While properties of other object types are also observed for mutations, the `'io-object-mutation'` event must be manually dispatched by the component responsible for the mutation.

### Data Binding
Io-Gui allows you to two-way bind its properties using `this.bind('[propertyName]')` function. Its reactive properties are specifically designed to handle two-way data binding with a robust event system that prevents unintentional side-effects. This feature should be used in moderation alongside one-way data flow.

### Virtual DOM
For optimal DOM rendering, `IoElement` renders its contents using virtual DOM and updates actual DOM elements only when necessary. This feature is implemented using simple functions and requires no build step.

### WebGL Elements
One of the unique features of Io-Gui is its ability to render custom elements using WebGL shaders. Elements that extend the `IoGl` element have the ability to render their contents using GLSL shading language. Element properties and CSS theme variables are reactively bound to shader uniforms.

### Event System
You can attach event listeners to nodes and elements at instantiation using `static get Listeners() {}` function, or you can add them as constructor/vDOM arguments using `'@eventName': handler` syntax.

### Theming and Styling
The theme engine uses simple yet effective approach with CSS variables that define a spacing, element sizes, colors, borders, and so on. It propagates changes throughout the entire UI while maintaining a small footprint. Colors are represented as RGBA objects that automatically convert to CSS variables and WebGL shader uniforms, and all variables are accessible in CSS, JavaScript and GLSL. It comes with both light and dark theme and supports theme customization at runtime.

### Storage
`Storage` allows you to quickly create persistent values in your web app by specifying key and storage type ('hash' or 'local').

### Core Elements
Aside from the basic `IoElement`, there are a few other elements:
* `IoGl` - Base element class for WebGL elements
* `IoOverlaySingleton` - document-level full-page container for floating UI elements such as menus, modals and tooltips
* Native element vDOM factories such as `div()`, `a()`, `img()` etc.