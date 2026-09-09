### Universal Reactive Architecture

Io-Gui implements the same features on top of its base classes - objects and elements. The features include:
- Reactive property system
- Two-way data binding
- Component lifecycle management
- Event-driven architecture

By doing this, it achieves reactive interoperability with predictable data flow patterns between objects and elements.

`ReactiveNode` is the union of the two concrete bases below — it names a vertex in the shared reactive graph and is matched by the `isReactiveNode` predicate.

#### ReactiveObject
ReactiveObject is a base class extending `Object` with all of the core features provided by Io-Gui.
It can be used to create reactive data models and state containers with business logic. Some examples of objects are:
- `ThemeSingleton`: Io-Gui's theme system that responsively renders CSS variables to document 
- `StorageNode` and `Storage`: Data persistence object/factory for data storage in location.hash or localStorage
- `MenuOption`: A rich domain model for menu options and their state in io-menus
- `Tab`, `Panel` and `Split`: Rich domain models for tabbed-split-panel layout in io-layout

#### ReactiveElement
ReactiveElement is a custom element base class extending `HTMLElement` with ReactiveObject functionality as well as some DOM functionality such as:
- Virtual DOM rendering
- Style declaration with inheritance

It can be used to create reactive custom elements that can be bound to object properties and are responsive to object mutations. The entire Io-Gui design system is built on top of this class.

### Reactive Data Flow
- Trunk-to-leaf data flow can be achieved using change handlers and value assignment
  - Property change events are automatically dispatched for all reactive properties
  - Example: `"label"` property change event `"label-changed"` includes `event.detail.value` and `event.detail.oldValue`
  - Change handlers get invoked automatically if they are defined
  - Example: change event `"label-changed"` invokes `.labelChanged()` handler if it exists
  - Generic catch-all handler `.mutated()` gets invoked after any property change
- Leaf-to-trunk data flow can be achieved using mutation events and handlers
  - Mutation events are automatically dispatched for all objects and elements
  - Example: `"data"` object property mutation event `"io-mutation"` includes `event.detail.object` that equals mutated object
  - Mutation events for generic objects can be dispatched using `this.dispatchMutation(mutatedObject);`
  - Mutation events for generic objects are emitted on a global event bus (window)
  - Mutation handlers get invoked automatically if they are defined
  - Example: `"data"` object property mutation event invokes `dataMutated()` handler if it exists
- Bi-directional data flow can be achieved using binding objects
  - Example: Binding function `this.bind('label')` returns a data-binding object to the `"label"` property
  - Binding object can synchronize reactive properties by simple assignment to a property
  - Source change triggers a transitive graph write inside a shared binding wave held open by `ChangeQueue.dispatch` for the whole property pass — parallel networks in one batch settle before any spoke flush

### Cross-Domain Reactivity

Most frameworks keep two worlds apart: a component/DOM tree the framework owns and renders, and plain data models that live outside it and only reach the UI through bindings or a store. Io-Gui collapses that split. `ReactiveObject` (non-DOM models) and `ReactiveElement` (custom elements) are both `ReactiveNode`s — vertices in one shared reactive graph. Properties, change/mutation propagation, bindings, and event bubbling behave the same on both, and they also work *across* the boundary between them. A data model can be the reactive parent of a DOM element, and an element can be the reactive parent of a plain object, without either needing to know what the other is.

That boundary-crossing is the design goal: a domain model deep in your data layer can emit a change or mutation that an element several hops away handles, even though the model has no DOM presence of its own.

#### Two kinds of parent/child

A `ReactiveElement` can take part in three overlapping but independent parent/child relations. For ordinary elements they often coincide, but they are not the same relation, and the space between them is where cross-domain reactivity lives:

- **Reactive graph** — `_parents`/`_children`, the edges used for event and mutation bubbling and for data ownership. Edges are created through `addParent()`/`removeParent()`, and they come from *data*, not layout: assigning a node-valued reactive property makes the owner a parent of that node, and `NodeArray` items are parented to the node that holds them. The graph follows ownership, not DOM placement.
- **DOM tree** — the real `parentElement`/`childNodes` the browser maintains after vDOM reconciliation. Used for layout and native DOM events.

Because the reactive graph is built from ownership rather than placement, a node can be a reactive child of one object while sitting elsewhere in the DOM — or nowhere in the DOM at all.

#### Multi-parenting

A `ReactiveObject` is not limited to a single parent. The same object can be held by several properties, live in several `NodeArray`s, or be passed to `addParent()` on several owners — including a mix of plain objects and DOM elements. `_parents` is an array precisely so one node can belong to many trunks at once. When that node mutates, the change reaches every parent it is attached to, regardless of whether those parents are data models or elements.

#### Bubbling and the circuit breaker

Synthetic events (including `io-mutation`) bubble by walking `_parents` recursively, and elements additionally dispatch a `composed` native `CustomEvent` so the same event also travels the DOM tree. A graph that permits multiple parents and shared nodes can contain diamonds and cycles, so propagation needs a circuit breaker. The dispatcher carries a `visited` set: every node it reaches is recorded, and re-entering an already-visited node returns immediately. Each node therefore handles a given dispatch at most once, and infinite loops are impossible no matter how tangled the parenting is. The same set reconciles the two bubbling domains — before a native DOM bubble fires, the dispatcher checks whether a DOM ancestor was already visited by the synthetic walk and suppresses the duplicate — so an event that crosses both the reactive graph and the DOM tree is still handled once per node.

### Core Systems
- **ProtoChain** - Inheritance aggregator that also performs one-time class initialization
- **Property** - Creates and initializes reactive properties
- **EventDispatcher** - Manages DOM events on elements and synthetic events on objects
- **ChangeQueue** - Detects property changes and dispatches change/mutation events and handlers
- **FrameScheduler** - Generic frame scheduler with throttle and debounce capability
- **Binding** - Manages two-way data flow; forward sync settles the outbound binding graph inside a shared binding wave
- **BindingWave** - Epoch that defers spoke `dispatchQueue` until parallel networks in one ChangeQueue pass have all settled
- **VDOM** - Virtual DOM implementation for efficient rendering

### Registration

All new classes must be registered before use.

```javascript
// Javascript flavor
class MyObject extends ReactiveObject {}
Register(MyObject)

class MyElement extends ReactiveElement {}
Register(MyElement)
```

```typescript
// Typescript flavor with experimentalDecorators: true
@Register
class MyObject extends ReactiveObject {}

@Register
class MyElement extends ReactiveElement {}
```

### Properties

Properties are reactive by default and can be defined using property declarations in the `static get Properties()` object or the `@Property()` decorator (preferred for TypeScript). These property declarations are loosely typed, meaning that properties don't have to be fully declared and default declarations can be inferred from what is specified. For non-reactive values, use `static get Fields()` or the `@Field()` decorator instead.

In the following example, we define a boolean property called `selected` by specifying only the default value `false`.

```javascript
// Javascript version with `static get Properties()` object
class MyObject extends ReactiveObject {
  static get Properties() {
    return {
      selected: false
    }
  }
}
```

Here we do the same using decorator syntax in typescript. Note that we use `declare` keyword to inform typescript compiler that this property is defined and has the `boolean` type.

```typescript
// Typescript version with `@Property()` decorator
class MyObject extends ReactiveObject {
  @Property(false)
  declare selected: boolean
}
```

### Initial Value Inference

Alternatively, a property can be declared by specifying only the type. The result of the following declaration is exactly the same since initial value for `Boolean` is inferred to `false`, just like `Number` is `0` and `String` is `""`. In other words, when no initial value is specified, it will be inferred from the specified type. Properties with type `Object` and `Array` will be initialized with `new Object()` and `new Array()` only if the `init: null` flag is specified. Otherwise, they will be initialized with `undefined`. You can also specify custom initialization arguments in the `init` field. e.g. `{type: Array, init: [1, 2, 3]}` will initialize the property with `new Array(1, 2, 3)`.

```typescript
class MyObject extends ReactiveObject {
  @Property(Boolean)
  declare selected: boolean
}
```

Just like initial property value can be inferred from type, a property type can be inferred from its initial value. This is why `@Property(Boolean)` and `@Property(false)` are effectively the same.

Note that ANY initial value specified in property declaration can be overridden by a value specified in the constructor.

```typescript
class MyObject extends ReactiveObject {
  @Property(Color)
  declare color: Color
}

new MyObject({color: new Color()})
```

While it is possible to specify object instances as values in property declaration it is important to note that such initial values will be shared across all instances of the class.

```typescript
class MyObject extends ReactiveObject {
  // This is not recommended!
  @Property({value: new Color()})
  declare color: Color
}

new MyObject().color === new MyObject().color
// returns true
```

As mentioned above, we can use `init` field to specify how we want to initialize an object. For example:

```typescript
// This will initialze value as new Color() for each instance
@Property({type: Color, init: null})
```

### Property Declaration Inheritance

Property definitions respect inheritance. This means that if a subclass extends a superclass and defines a property with the same name, the subclass's definition will overwrite the superclass's definition but only for explicitly specified parts of the property declaration. In the following example `MyObject` will inherit explicit property declaration from `MySuperObject` but it will override the initial value to `true`. 

```typescript
class MySuperObject extends ReactiveObject {
  @Property({
    value: false,
    reflect: true,
  })
  declare selected: boolean
}

class MyObject extends MySuperObject {
  @Property(true)
  declare selected: boolean
}
```

### Property Declaration Fields

Now let's get into each specific field of the PropertyDeclaration object. Note that each field is optional.

| field   | type       | default     | description                                 |
| :------ | :--------: | :---------: | :------------------------------------------ |
| value   | `any`      | `undefined` | The initial value of the property           |
| type    | `Function` | `undefined` | The type of the property                    |
| init    | `any`      | `undefined` | Specifies how to initialize object property |
| reflect | `boolean`  | `false`     | Reflects property to attribute              |

We already covered `value` and `type` in examples above. Now let's dig into the other fields.

**`init`** field is `undefined` by default and it can be used in conjunction with an object constructor in the `type` field. `init: null` will initialize the constructor without any arguments, `"this"` will pass the object itself as the argument. You can also specify arguments as arrays.

**`reflect`** field is `false` by default and it can enable reflection of properties to attributes in DOM elements. Enabling this on properties of objects makes no effect. Reflected attributes can be used for CSS selectors for example.

```typescript
class MyElement extends ReactiveElement {
  // We will get into style syntax later.
  static get Style() {
    return /* css */`
      :host[selected] {
        color: tomato;
      }
    `;
  }
  @Property({value: false, reflect: true})
  declare selected: boolean
}
```

### Styling

Custom element styles are defined inside `static get Style()` template literal string. To get proper CSS syntax highlighting you can add `/* css */` comment just before the string and use code editor plugin such as [comment-tagged-templates for VSCode](https://marketplace.visualstudio.com/items?itemName=bierner.comment-tagged-templates).

Each CSS style rule set has to be prefixed with `:host` selector. This selector ensures that style rules will not leak outside of the element and it makes it possible to apply inherited rules to subclassed elements.

```typescript
@Register
class MyElement extends ReactiveElement {
  static get Style() {
    return /* css */`
      :host {
        display: block;
      }
    `;
  }
}
```

The above style rule is effectively the same as adding the following style block to your document head.

```html
<style>
  my-element {
    display: block;
  }
</style>
```

In fact, this is automatically done by the `Register` decorator. Each element will have its own style block inside the document head.

### Theming

The theme engine uses simple yet effective approach with CSS variables that define a spacing, element sizes, colors, borders, and so on. It propagates changes throughout the entire UI while maintaining a small footprint. Colors are represented as RGBA objects that automatically convert to CSS variables and WebGL shader uniforms, and all variables are accessible in CSS, JavaScript and GLSL. It comes with both light and dark theme and supports theme customization at runtime.

### CSS Mixin Polyfill

CSS mixins are a feature polyfilled by `ReactiveElement`. It allows you to define style rule sets to be reused across multiple elements. To create a mixin, make a style rule set with a CSS selector starting with `--` and ending with `:`.

```css
--grid: {
  display: grid;
  gap: 1em;
}
```

To use the mixin in any element use `@apply` CSS rule. It is important that the element defining the mixin is declared before the element(s) using the mixin.

```css
:host {
  @apply --grid;
}
```

### Listeners

Listeners are defined inside the `static get Listeners()` object and the following listener will call `onClick` handler function when `"click"` event happens.

```typescript
@Register
class MyElement extends ReactiveElement {
  static get Listeners() {
    return {
      'click': 'onClick'
    }
  }
  onClick(event: MouseEvent) {
    console.log(event)
  }
}
```

Listeners with handlers specified with `string` value assume that a function with that name exists on the class.

> **Note:** Function names prefixed with `on` or `_` are automatically bound to class instances. Also functions suffixed with `Changed`, `Debounced` or `Throttled` are automatically bound to instance.

You can also specify handlers as functions such as:

```typescript
static get Listeners() {
  return {
    'click': console.log
  }
}
```

You can also specify event listener options by using the array syntax.

```typescript
static get Listeners() {
  return {
    'touchstart': ['onTouchstart', {passive: false}]
  }
}
```

### Reactivity

[comment]: <`[prop]Mutated()` throttled if called multiple times per frame.>
[comment]: <Runtime type checking available in debug mode.>
[comment]: <Can receive data `Binding` objects.>

All properties are reactive by default, meaning that changing a property value will emit a change event and invoke change handler functions if they exist. Lastly, `mutated()` function will be called when any one or more reactive properties change.

Here is an example of an object fully rigged to handle changes of its `selected` property.

```typescript
@Register
class MyObject extends ReactiveObject {
  @Property(false)
  declare selected: boolean
  selectedChanged(change: Change) {
    // This will happen first
    console.log(change.property)
    console.log(change.value)
    console.log(change.oldValue)
  }
  mutated() {
    // This will happen last
    console.log('Something changed')
  }
}

const object = new MyObject()
object.addEventListener('selected-changed',
  (event: CustomEvent) => {
    // This will happen second
    console.log(event.detail.property)
    console.log(event.detail.value)
    console.log(event.detail.oldValue)
  }
)

object.selected = true
```

Note that change handler functions are provided with a `change` payload that includes property name as well as `oldValue` and new `value`. Similarly, the change event provides the same change payload as `event.detail`.

### Property Change Batching

Since `mutated()` function gets invoked every time a reactive property changes we can get into a scenario where multiple property changes invoke `mutated()` function causing it to do unnecessary work. For example changing `prop1` and `prop2` in sequence will invoke following sequence of change functions.

```javascript
this.prop1 = value1
this.prop2 = value2

// Sequence of change functions:
this.prop1Changed(change)
this.mutated() // This can be avoided!
this.prop2Changed(change)
this.mutated()
```

This sequence of invocations is fine but we can avoid executing the `mutated()` function twice by using the `setProperties()` method to set both properties at the same time.

```javascript
this.setProperties({
  prop1: value1,
  prop2: value2,
})

// Sequence of change functions:
this.prop1Changed(change)
this.prop2Changed(change)
this.mutated()
```

### Template Syntax

Io-Gui elements use hypertext-like array structures to express virtual DOM templates. Internally, the arrays are converted to virtual DOM and rendered as actual DOM elements. During a re-render, the templates will be compared against the existing elements and states so only necessary DOM changes will be performed. Template rendering also takes care of disposing unused elements and connections.

Here is a simple element expressed in the Io-Gui template syntax:

```javascript
myElement({prop: "propvalue"}, "Hello io!")
// returns {tag: 'my-element', props: {prop: "propvalue"}, children: 'Hello io!'}
```

DOM output:

```html
<my-element prop="propvalue">Hello io!</my-element>
```

The first array item is element name's, followed by **optional** properties and innerText or an array of children.

Here is a slightly more complex vDOM tree with array iterator:

```javascript
this.render([
  h4('Array indices:'),
  div([
    this.items.map(i => span({class: 'item'}, i))
  ])
])
```

DOM output:

```html
<h4>Array indices:</h4>
<div>
  <span class="item">1</span>
  <span class="item">2</span>
  <span class="item">3</span>
  <!-- ... -->
</div>
```

* render() function handles disposal of removed elements.
* render() can be brute-forced while DOM updates as performed when needed.
* Inline event listeners can be added using `"@"` syntax
* References are created using `"id"` property and are accessible as `this.$[id]`.
* VDOM templates do not set HTML attributes - only properties are set.

### Data Binding

This is a simple yet powerful feature designed to be used with Io-Gui objects and elements by simply invoking the `bind(propName)` method:

```javascript
// Returns a binding object to source property "value".
this.bind('value')
```

To create a two-way data binding between two or more properties, simply assign a binding object to a property:

```javascript
const myObject = new MyObject()
const slider = new IoSlider()
slider.value = myObject.bind('value')
```

We can also assign bindings in the constructor:

```javascript
new IoSlider({value: myObject.bind('value')})
```

Or we can assign it to an element using template syntax:

```javascript
this.render([ioSlider({value: this.bind('value')})])
```

Bindings listen for `[prop]-changed` on the source and on each target. Leaf→hub (target changed) writes the source property normally. Hub→leaf (source changed) is a **graph write** inside a shared **binding wave**, not an event cascade: the binding walks every outbound spoke transitively (including nested hubs that bind the same property onward) and debounce-writes the full closure. `ChangeQueue.dispatch` holds one wave open across the entire property-dispatch pass, so independent networks updated in the same batch (e.g. `setProperties({a, b})`) all settle before any spoke flushes — handlers never observe a half-updated network. The wave closes before the source node's own `mutated()`. Cycles are cut with a visited set; nested hubs that re-enter during flush are no-ops once values already match.

## Reactive WebGL Elements

One of the unique features of Io-Gui is its ability to render custom elements using WebGL shaders. Elements that extend the `IoGl` element have the ability to render their contents using GLSL shading language. Element properties and CSS theme variables are reactively mapped to shader uniforms.  