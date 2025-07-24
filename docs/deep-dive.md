### Universal Reactive Architecture

Io-Gui implements the same features on top of its base classes - nodes and elements. The features include:
- Reactive property system
- Two-way data binding
- Component lifecycle management
- Event-driven architecture

By doing this, it achieves reactive interoperability with predictable data flow patterns between nodes and elements.

#### Node
Node is a base class extending `Object` with all of the core features provided by Io-Gui. It can be used to create reactive data models and state containers with business logic. Some examples of nodes are:
- `ThemeSingleton`: Io-Gui's theme system that responsively renders CSS variables to document 
- `StorageNode` and `Storage`: Data persistence node/factory for data storage in location.hash/localStorage
- `MenuOption`: A rich domain model for menu options and their state in io-menus
- `Tab`, `Panel` and `Split`: Rich domain models for tabbed-split-panel layout in io-layout

#### IoElement
IoElement is a custom element base class extending `HTMLElement` with Node functionality as well as some DOM functionality such as:
- Virtual DOM rendering
- Style declaration with inheritance

It can be used to create reactive custom elements that can be bound to node properties and are responsive to node mutations. The entire Io-Gui design system is built on top of this class.

### Reactive Data Flow
- Trunk-to-leaf data flow can be achieved using change handlers and value assignment
  - Property change events are automatically dispatched for all reactive properties
  - Example: `"label"` property change event `"label-changed"` includes `event.detail.value` and `event.detail.oldValue`
  - Change handlers get invoked automatically if they are defined
  - Example: change event `"label-changed"` invokes `.labelChanged()` handler if it exists
  - Generic property handler `.changed()` gets invoked after any property change
- Leaf-to-trunk data flow can be achieved using mutation events and handlers
  - Mutation events are automatically dispatched for all nodes and objects
  - Example: `"data"` property mutation event `"io-object-mutation"` includes `event.detail.object` that equals mutated object
  - Mutations of generic objects can be dispatched using `this.dispatchMutation(mutatedObject);`
  - Mutation handlers get invoked automatically if they are defined
  - Example: `"data"` property mutation event invokes `dataMutated()` handler if it exists
- Bi-directional data flow can be achieved using binding objects
  - Example: Binding function `this.bind('label')` returns a data-binding object to the `"label"` property
  - Binding object can synchronize reactive properties by simple assignment to a property
  - Binding objects rely on change events for bound properties

### Core Systems
- **ProtoChain** - Inheritance aggregator that also performs one-time class initialization
- **ReactiveProperty** - Creates and initializes responsive properties
- **EventDispatcher** - Manages DOM events on elements and bridges them to synthetic events on nodes
- **ChangeQueue** - Detects property changes and dispatches change/mutation events and handlers
- **Queue** - Generic queue manager with throttle and debounce capability
- **Binding** - Manages two-way data flow using change events
- **VDOM** - Virtual DOM implementation for efficient rendering

### Registration

All new classes must be registered before use.

```javascript
// Javascript flavor
class MyNode extends Node {}
Register(MyNode);

class MyElement extends IoElement {}
Register(MyElement);
```

```typescript
// Typescript flavor with experimentalDecorators: true
@Register
class MyNode extends Node {}

@Register
class MyElement extends IoElement {}
```

### Properties

Properties can be defined using property declarations in the `static get ReactiveProperties()` object or the `@ReactiveProperty()` decorator (preferred for TypeScript). These property declarations are loosely typed, meaning that properties don't have to be fully declared and default declarations can be inferred from what is specified.

In the following example, we define a boolean property called `selected` by specifying only the default value `false`.

```javascript
// Javascript version with `static get ReactiveProperties()` object
class MyNode extends Node {
  static get ReactiveProperties() {
    return {
      selected: false
    }
  }
}
```

Here we do the same using decorator syntax in typescript. Note that we use `declare` keyword to tell the compiler that this property definitely exists and has the `boolean` type. Without this keyword, typescript would override our custom property initialization logic.

```typescript
// Typescript version with `@Property()` decorator
class MyNode extends Node {
  @Property(false)
  declare selected: boolean;
}
```

### Initial Value Inference

Alternatively, a property can be declared by specifying only the type. The result of the following declaration is exactly the same since initial value for `Boolean` is inferred to `false`, just like `Number` is `0` and `String` is `""`. Properties with type `Object` and `Array` will be initialized with `new Object()` and `new Array()` respectively. In other words, when no initial value is specified, it will be inferred from the specified type.

```typescript
class MyNode extends Node {
  @Property(Boolean)
  declare selected: boolean;
}
```

Just like initial property value can be inferred from type, a property type can be inferred from its initial value. This is why `@Property(Boolean)` and `@Property(false)` are effectively the same.

When property type is a custom object class the initial value will NOT be inferred. Instead, the users are expected to provide the initial value in the constructor. Note that ANY initial value specified in property declaration can be overridden by a value specified in the constructor.

```typescript
class MyNode extends Node {
  @Property(Color)
  declare color: Color;
}

// Since we use `Color` type, the constructor argument is mandatory:
new MyNode({color: new Color()});
```

While it is possible to specify object instances as values in property declaration it is important to note that such initial values will be shared across all instances of the class.

```typescript
class MyNode extends Node {
  // This is not recommended!
  @ReactiveProperty({value: new Color()})
  declare color: Color;
}

new MyNode().color === new MyNode().color
// returns true
```

So instead of initializing with a shared value we can use `init` field to specify how we want to initialize an object. For example:

```typescript
// This will initialze value as new Color() for each instance
@ReactiveProperty({type: Color, init: null})
```

We can also declare a property with a declaration object. In the following example we declare the `selected` property with a fully specified declaration object. Note that the final result is exactly the same as before as all of the fields in this example are defaults. We will get into each specific field later.

```typescript
class MyNode extends Node {
  @ReactiveProperty({
    type: Boolean,
    value: false,
    reflect: false,
  })
  declare selected: boolean;
}
```

### Property Declaration Inheritance

Property definitions respect inheritance. This means that if a subclass extends a superclass and defines a property with the same name, the subclass's definition will overwrite the superclass's definition but only for explicitly specified parts of the property declaration. In the following example `MyNode` will inherit explicit property declaration from `MySuperNode` but it will override the initial value to `true`. 

```typescript
class MySuperNode extends Node {
  @ReactiveProperty({
    value: false,
    reflect: true,
  })
  declare selected: boolean;
}

class MyNode extends MySuperNode {
  @Property(true)
  declare selected: boolean;
}
```

### Property Declaration Fields

Now let's get into each specific field of the PropertyDeclaration object. Note that each field is optional.

| field | type | default | description |
| :---- | :--: | :-----: | :---------- |
| value | `any` | `undefined` | The initial value of the property |
| type  | `any` | `undefined` | The type of the property |
| init | `any` | `undefined` | Specifies how to initialize object property |
| reflect | `boolean` | `false` | Reflects property to attribute |

We already covered `value` and `type` in examples above. Now let's dig into the other fields.

**`init`** field is `undefined` by default and it can be used in conjunction with an object constructor in the `type` field. `init: null` will initialize the constructor without any arguments, `"this"` will pass node itself as the argument. You can also specify arguments as arrays.

**`reflect`** field is `false` by default and it can enable reflection of properties to attributes in DOM elements. Enabling this on properties of nodes makes no effect. Reflected attributes can be used for CSS selectors for example.

```typescript
class MyElement extends IoElement {
  // We will get into style syntax later.
  static get Style() {
    return /* css */`
      :host[selected] {
        color: tomato;
      }
    `;
  }
  @ReactiveProperty({value: false, reflect: true})
  declare selected: boolean;
}
```

### Styling

Custom element styles are defined inside `static get Style()` template literal string. To get proper CSS syntax highlighting you can add `/* css */` comment just before the string and use code editor plugin such as [comment-tagged-templates for VSCode](https://marketplace.visualstudio.com/items?itemName=bierner.comment-tagged-templates).

Each CSS style rule set has to be prefixed with `:host` selector. This selector ensures that style rules will not leak outside of the element and it makes it possible to apply inherited rules to subclassed elements.

```typescript
@Register
class MyElement extends IoElement {
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

### CSS Mixin Polyfill

CSS mixins are a feature polyfilled by `IoElement`. It allows you to define style rule sets to be reused across multiple elements. To create a mixin, make a style rule set with a CSS selector starting with `--` and ending with `:`.

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
class MyElement extends IoElement {
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

> **Note:** Function names prefixed with `on` or `_` are automatically bound to class instances. This feature might be deprecated in the future.

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

All properties are reactive by default, meaning that changing a property value will emit a change event and invoke change handler functions if they exist. Lastly, `changed()` function will be called when any one or more reactive properties change.

Here is an example of a node fully rigged to handle changes of its `selected` property.

```typescript
@Register
class MyNode extends Node {
  @Property(false)
  declare selected: boolean;
  selectedChanged(change: Change) {
    // This will happen first
    console.log(change.property);
    console.log(change.value);
    console.log(change.oldValue);
  }
  changed() {
    // This will happen last
    console.log('Something changed');
  }
}

const node = new MyNode();
node.addEventListener('selected-changed',
  (event: CustomEvent) => {
    // This will happen second
    console.log(event.detail.property);
    console.log(event.detail.value);
    console.log(event.detail.oldValue);
  }
)

node.selected = true;
```

Note that change handler functions are provided with a `change` payload that includes property name as well as `oldValue` and new `value`. Similarly, the change event provides the same change payload as `event.detail`.

### Property Change Batching

Since `change()` function gets invoked every time a reactive property changes we can get into a scenario where multiple property changes invoke `change()` function causing it to do unnecessary work. For example changing `prop1` and `prop2` in sequence will invoke following sequence of change functions.

```javascript
this.prop1 = value1;
this.prop2 = value2;

// Sequence of change functions:
this.prop1Changed(change);
this.changed(); // This can be avoided!
this.prop2Changed(change);
this.changed();
```

This sequence of invocations is fine but we can avoid executing the `change()` function twice by using the `setProperties()` method to set both properties at the same time.

```javascript
this.setProperties({
  prop1: value1,
  prop2: value2,
});

// Sequence of change functions:
this.prop1Changed(change);
this.prop2Changed(change);
this.changed();
```

### Debounced Reactivity

By default, all nodes and elements handle changes synchronously, meaning that change handler functions and events happen immediately after the change. While this means that nodes react as fast as possible, it can also lead to inefficiencies in complex systems where multiple properties are changing frequently.

Just like in the batching example above we can get into a scenario where change handler functions are called excessively. Again, this is fine but we can avoid redundant work by setting node's `reactivity` property to `debounced` or `throttled`. This will effectively change node's reactivity to an asynchronous regime.

In asynchronous regime, nodes don't invoke change events until the next `requestAnimationFrame` cycle. Multiple property changes can happen during this time and the resulting sequence of change events and handler function invocations will be automatically batched.

```javascript
this.prop1 = 1;
this.prop1 = 2;
this.prop1 = 3;
this.prop2 = 'a';
this.prop2 = 'b';
this.prop2 = 'c';

// Sequence of change functions:
this.prop1Changed(change); // change.oldValue === 1
this.prop2Changed(change); // change.oldValue === 'a'
this.changed();
```

### Template Syntax

[comment]: <Uses nested array representation of (virtual) DOM.>
[comment]: <Template function handles disposal of removed elements.>
[comment]: <Templates can be brute-forced while DOM updates as performed when needed.>
[comment]: <Can assign bindings to properties.>
[comment]: <Inline event listeners can be added using `"on-"` (`"@"` TBD)>
[comment]: <Element references can be created using `"$"` property.>

Io-Gui elements use hypertext-like array structures to express virtual DOM templates. Internally, the arrays are converted to virtual DOM and rendered as actual DOM elements. During a re-render, the templates will be compared against the existing elements and states so only necessary DOM changes will be performed. Template rendering also takes care of disposing unused elements and connections.

Here is a simple element expressed in the Io-Gui template syntax:

```javascript
myElement({prop: "propvalue"}, "Hello io!")
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
]);
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

> **Note:** Io-Gui templates do not set HTML attributes - only properties are set.


### Data Binding

This is a simple yet powerful feature designed to be used with Io-Gui nodes and elements by simply invoking the `bind(propName)` method:

```javascript
// Returns a binding object to source property "value".
this.bind('value');

```

To create a two-way data binding between two or more properties, simply assign a binding object to a property:

```javascript
const myNode = new MyNode();
const slider = new IoSlider();
slider.value = myNode.bind('value');
```

We can also assign bindings in the constructor:

```javascript
new IoSlider({value: myNode.bind('value')});
```

Or we can assign it to an element using template syntax:

```javascript
this.render([ioSlider({value: this.bind('value')})]);
```

The binding is event-based, meaning that the binding object will assign change event listeners to its source node and its targets.