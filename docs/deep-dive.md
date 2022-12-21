# Nodes and Elements

In Io-Gui, there are two types of objects: nodes and elements. Both nodes and elements use features provided by the `IoNodeMixin` such as reactivity, data binding and various helper methods.

A node is any `Object` that has been extended with the `IoNodeMixin` or an object that extends `IoNode`.

```javascript
class IoNode extends IoNodeMixin(Object) {}
class MyNode extends IoNode {}
```

An element is a custom element that extends `IoElement` which is essentially `IoNodeMixin` applied to `HTMLElement`. Elements have all of the core features of nodes, as well as additional DOM-specific features such as template rendering and CSS styling.

```javascript
class IoElement extends IoNodeMixin(HTMLElement) { ... }
class MyElement extends IoElement {}
```

Elements are used to build the "view", meaning they are responsible for rendering the user interface that users can see and interact with. Nodes, on the other hand, have no visual representation and are more suitable for creating "models" and application business logic.

DOM Events (CustomEvents) work with nodes just like with elements, allowing nodes to communicate and interact with the elements as if they are part of the DOM.

## Registration

All new classes must be registered before use. You should use `RegisterIoNode` decorator for nodes and `RegisterIoElement` for elements.

```javascript
// Javascript flavor
class MyNode extends IoNode {}
RegisterIoNode(MyNode);

class MyElement extends IoElement {}
RegisterIoElement(MyElement);
```

```typescript
// Typescript flavor with experimentalDecorators: true
@RegisterIoNode
class MyNode extends IoNode {}

@RegisterIoElement
class MyElement extends IoElement {}
```

# Properties

Properties can be defined using property declarations in the `static get Properties()` object or the `@Property({})` decorator (preffered for TypeScript). These property declarations are loosely typed, meaning that properties don't have to be fully declared and default declarations can be inferred from what is specified.

In the following example, we define a boolean property called `selected` by specifying only the default value `false`.

```javascript
// Javascript version with `static get Properties()` object
class MyNode extends IoNode {
  static get Properties() {
    return {
      selected: false
    }
  }
}
```

Here we do the same using decorator syntax in typescript. Note that we use `declare` keyword to tell the compiler that this property definitly exists and has the `boolean` type. Without this keyword, typescript would override our custom property initialization logic.

```typescript
// Typescript version with `@Property({})` decorator
class MyNode extends IoNode {
  @Property(false)
  declare selected: boolean;
}
```

## Initial Value Inference

Alternatively, a property can be declared by specifying only the type. The result of the following declaration is exactly the same since initial value for `Boolean` is inferred to `false`, just like `Number` is `0` and `String` is `""`. Properties with type `Object` and `Array` will be initialized with `new Object()` and `new Array()` respectively. In other words, when no initial value is specified, it will be inferred from the specified type.

```typescript
class MyNode extends IoNode {
  @Property(Boolean)
  declare selected: boolean;
}
```

Just like initial property value can be inferred from type, a property type can be inferred from its initial value. This is why `@Property(Boolean)` and `@Property(false)` are effectively the same.

When property type is a custom object class the initial value will NOT be inferred. Instead, the users are expected to provide the initial value in the constructor. Note that ANY initial value specified in property declaration can be overriden by a value specified in the constructor.

```typescript
class MyNode extends IoNode {
  @Property(Color)
  declare color: Color;
}

// Since we use `Color` type, the constructor argument is mandatory:
new MyNode({color: new Color()});
```

While it is possible to specify object instances as values in property declaration it is important to note that such initial values will be shared across all instances of the class.

```typescript
class MyNode extends IoNode {
  // This is not recommended!
  @Property({value: new Color()})
  declare color: Color;
}

new MyNode().color === new MyNode().color
// returns true
```

We can also declare a property with a declaration object. In the following example we declare the `selected` property with a fully specified declaration object. Note that the final result is exactly the same as before as all of the fields in this example are defaults. We will get into each specific field later.

```typescript
class MyNode extends IoNode {
  @Property({
    value: false,
    type: Boolean,
    reactive: true,
    observe: false,
    reflect: false,
  })
  declare selected: boolean;
}
```

## Property Declaration Inheritance

Property definitions respect inheritance. This means that if a subclass extends a superclass and defines a property with the same name, the subclass's definition will overwrite the superclass's definition but only for explicitly specified parts of the property declaration. In the following example `MyNode` will inherit explicit property declaration from `MySuperNode` but it will override the initial value to `true`. 

```typescript
class MySuperNode extends IoNode {
  @Property({
    value: false,
    reactive: true,
    reflect: true,
  })
  declare selected: boolean;
}

class MyNode extends MySuperNode {
  @Property(true)
  declare selected: boolean;
}
```

## Property Declaration Fields

Now let's get into each specific field of the PropertyDeclaration object. Note that each field is optional.

| field | type | default | description |
| :---- | :--: | :-----: | :---------- |
| value | `any` | `undefined` | The initial value of the property |
| type  | `any` | `undefined` | The type of the property |
| reactive | `boolean` | `true` | Enables reactive behavior |
| observe | `boolean` | `false` | Enables object observer |
| reflect | `boolean` | `false` | Reflects property to attribute |

We already covered `value` and `type` in exampes above. Now lets dig into the other fields.

**`reactive`** field is `true` by default and it enables all of the reactive callbacks and events that happen when a property value changes. You can disable it if you don't need reactivity. Disabling it will also prevent data binding to that property.

**`observe`** field is `false` by default and it can be used to enable object mutation observer for properties that are objects. Do not enable this for properties of basic data types such as `Boolean`, `String` and `Number`.

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
  @Property({value: false, reflect: true})
  declare selected: boolean;
}
```

# Styling

Custom element styles are defined inside `static get Style()` template literal string. To get proper CSS syntax highlighting you can add `/* css */` comment just before the string and use code editor plugin such as [comment-tagged-templates for VSCode](https://marketplace.visualstudio.com/items?itemName=bierner.comment-tagged-templates).

Each CSS style rule set has to be prefixed with `:host` selector. This selector ensures that style rules will not leak outside of the element and it makes it possible to apply inherited rules to subclassed elements.

```typescript
@RegisterIoElement
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

In fact, this is automatically done by the `RegisterIoElement` decorator. Each element will have its own style block inside document head.

## CSS Mixin Polyfill

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

# Listeners

[comment]: <Added automatically in `constructor()`>
[comment]: <Removed automatically in `dispose()`>

Listeners are defined inside `static get Listeners()` object and .Following listener will call `onClick` handler function when `"click"` event happens.

```typescript
@RegisterIoElement
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

Listeners with handlers specified with `string` value assume that function with that name exists on the class.

> **Note:** Function names prefixed with `on` or `_` are automatically bound to class instance. This feature might be deprecated in the future.

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

# Reactivity

[comment]: <`[prop]Mutated()` throttled if called multiple times per frame.>
[comment]: <Property values can be reflected to attributes.>
[comment]: <Nodes can be assigned as property values.>
[comment]: <Object properties can observe object mutations.>
[comment]: <Runtime type checking available in debug mode.>
[comment]: <Can recieve data `Binding` objects.>
[comment]: <Property changes can be batched with `setProperties()`.>
[comment]: <Reactivity can be disabled per property by setting `reactive: false`.>

All properties are reactive by default, meaning that changing a property value will emit change event and invoke change handler functions if they exist. Lastly, `changed()` function will be called when any one or more reactive properties change.

Here is an example of a node fully rigged to handle changes of its `selected` property.

```typescript
@RegisterIoNode
class MyNode extends IoNode {
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

## Property Change Batching

Since `change()` function gets invoked every time a reacitive property changes we can get into a scenario where multiple property changes invoke `change()` function causing it to do unnecessary work. For example changing `prop1` and `prop2` in sequence will invoke following sequence of change functions.

```javascript
this.prop1 = value1;
this.prop2 = value2;

// Sequence of change functions:
this.prop1Changed(change);
this.changed(); // This can be avoided!
this.prop2Changed(change);
this.changed();
```

This sequence of invocations is fine but we can avoid executing `change()` function twice by using `setProperties()` method to set both properties at the same time.

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

## Lazy Reactivity

> **Warning!** This feature is not fully tested!

By default, all nodes and elements handle changes synchronously, meaning that change handler functions and events happen immediately after the change. While this means that nodes react as fast as possible, it can also lead to inneficiencies in complex systems where multiple properties are changing frequently.

Just like in the batching example above we can get into a scenario where change handler fuctions are called excessively. Again, this is fine but we can avoid redundant work by setting node's `lazy` property to `true`. This will effectively change node's reactivity to lazy (asynchronous) regime.

In lazy regime, nodes don't invoke change events until the next `requestAnimationFrame` cycle. Multiple property changes can happen during this time and the resulting sequence of change events and handler function invocations will be automatically batched.

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

# Data Binding

[comment]: <Robust event-based two-way data binding that works.>
[comment]: <Uses `[prop]-changed` events to connect source node/prop to target node(s)/prop(s).>

# Tamplate Syntax

[comment]: <Uses nested array representation of (virtual) DOM.>
[comment]: <Template function handles disposal of removed elements.>
[comment]: <Templates can be brute-forced while DOM updates as performed when needed.>
[comment]: <Can assign bindings to properties.>
[comment]: <Inline event listeners can be added using `"on-"` (`"@"` TBD)>
[comment]: <Element references can be created using `"$"` property.>

# Helper Methods

[comment]: <`dispatchEvent()` shorthand for CustomEvents.>
[comment]: <`setAttribute()` removes attribute for falsey values.>
[comment]: <`throttle()` method.>
[comment]: <`dispose()` method.>