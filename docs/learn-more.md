## Core Classes

**IoNode**

`IoNode` class is the core of Io. It includes most of the core APIs. It is also available as mixin `IoNodeMixin` so it can be applied on top of existing classes.

```javascript
class myNode extends IoNode {}
// or
class myNode extends IoNodeMixin(OtherClass) {}
```

**IoElement**

`IoElement` is `IoNode` class applied to `HTMLElement` with some additinal DOM API. It is a simple base class for creating fast, lightweight and responsive custom elements.

```javascript
class myElement extends IoElement {}
```

## Creating Elements

You can create Io elements using different methods but to make the most out of Io, you should use the `template()` function inside elements created with `IoElement` class. See [virtual DOM arrays](#doc=learn-more#virtual-dom-arrays) for more information.

```javascript
// createElement
const e = document.createElement('io-object');
e.value = someObject;

// Constructor
const e = new IoObject({value: someObject});

// Io Template
this.template([['io-object', {value: someObject}]]);
```

## Properties

When defining new classes, you can use static getters to define properties. This evaluates once per class registration and it takes into account inherited property definitions for extended classes.

```javascript
static get Properties() {
  return {
    myProperty: false
  };
}
```

## Property Configuration

Property configuration can be done in different ways. For your convenience, you can simply assign a `value` or `type` and one will be inferred from the other. For example, if you define `myProperty: Hello World`, you dont have to specify type because configuration `type: String` will be inferred. For various type assignments, default values are following:

|Type     |Default Value          |
|:--------|:----------------------|
|`Boolean`|`false`                |
|`String` |`''`                   |
|`Number` |`0`                    |
|`Array`  |`[...value]` or `[]`   |
|`Object` |`{}`                   |
|`MyClass`|`new MyClass()`        |

In addition to setting `value` and `type`, you can be more specific when defining properties by providing configuration object which may include: `reflect`, `notify`, `enumerable` and `binding`.

|Property    |Values                   |Description                    |
|:-----------|:------------------------|:------------------------------|
|`reflect`   |`0` \| `1` \| `-1` \| `2`|Attribute reflection direction |
|`notify`    |`true` \| `false`        |Enables change events          |
|`enumerable`|`true` \| `false`        |Makes property enumerable      |
|`binding`   |`Binding`                |Binding object                 |


Specifying configuration options is not mandatory. In most cases, default values are fine. You can simply define a property by value or type alone. For example, following variants are effectively the same:

```javascript
// Configuration object
myProperty: {
  value: false,
  type: Boolean,
  reflect: 0,
  notify: true,
  enumerable: true,
  binding: null,
}
// Type only
myProperty: Boolean
// Value only
myProperty: false
```

The only difference with properties defined in the `Attributes()` getter is that property configurations have following values by default:

```javascript
reflect: 1,
notify: false,
enumerable: false,
```

## Functions

`changed()`
Change handler function.

`[prop]Changed()`
Property-specific change handler function.

`propChanged()`
Property-agnostic change handler function.

`[prop]Mutated()`
Property-specific mutation handler function.

`bind(prop)`
Returns data-binding for specified property.

`set(prop, value)`
Sets property and emits `value-set` event.

`dispatchEvent(type, detail, bubbles, src)`
Shorthand for custom event dispatch.

`template()`
Generates virtual DOM from nested arrays.

`onResized()`

<!-- `connect()` -->
<!-- `disconnect()` -->
<!-- `dispose()` -->
Handler function called when element size changes.

## Events

Assigned

| Event            | Detail                                  |
|:-----------------|:----------------------------------------|
| `[prop]-changed` |`property`, `value`, `oldValue`          |
| `value-set`      |`property`, `value`, `oldValue`          |
| `object-mutated` |`object`, `property`, `value`, `oldValue`|

## Virtual DOM Arrays

`IoElement.template()` uses virtual DOM structure similar to `React.createElement()` or `h()`, except the DOM tree is expressed as nested arrays to improve readability. For example, a virtual instance of `<my-element>` can be expressed like this:

```javascript
['my-element', {prop: "propvalue"}, "Hello io!"]
```

DOM output:

```html
<my-element prop="propvalue">Hello io!</my-element>
```

The first array item is element name, followed by **optional** properties and innerText or an array of children.

Here is a slightly more complex tree with array iterator:

```javascript
this.template([
  ['h4', 'Array indices:'],
  ['div', [
    this.items.map(i => ['span', {class: 'item'}, i])
  ]]
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

If a property name is prefixed with `on-` it will be treated as a listener. Assigned value can be a string or a function.

```javascript
['my-element', {'on-click': 'doSomething'}],
['my-element', {'on-click': doSomethingFunction}],
```

## Data Binding

This is a simple yet powerful feature designed to be used inside templates. You can data-bind properties to children using `this.bind([propName])` function.
Keep in mind that this only works with Io properties. In other words, binding to native HTML elements will not work.

```javascript
this.template([['child-element', {value: this.bind('value')}]]);
```

You can also use `this.bind()` outside template or bind to `IoNode` objects.

```javascript
let myNode = new MyNode({value: this.bind('value')});
myNode.dispose();
```

**Note:** When object is no longer needed, call `dispose()` to prevent memory leakage. Elements will do this automatically when removed from the DOM.

## Data-Flow

On a fundamental level, data-flow in Io is top down and UI designs with unidirectional data-flow are possible. However, elements and examples in this repository implement designs where certain elements have the ability to modify and manage the state. State changes are automatically communicated to the rest of the application following few simple rules.

* By convention state tree is passed down the UI tree as `value` property. This is not mandatory but it makes it easier to understand and debug the data-flow.

* An element's value can be an `object` (object element) or a primitive data type such as `string`, `number` or `boolean` (leaf element).

* Leaf elements with user-editable values should communicate the value change to their parent object element. This can be achieved with a built-in function `this.set('value', value)` which emits a non-bubbling `value-set` event. See `IoBoolean` for example.

* Object elements which are hosting editable leaf elements should listen to `value-set` event and dispatch `object-mutated` event on the window. See `IoProperties` for example.

That is all! Object elements will automatically listen to `object-mutated` event and update if needed.

**Note:** If the application state changed externally (e.g. server push), `object-mutated` event is required for UI update. Core application should also listen to `object-mutated` event from UI and react accordingly. `object-mutated` event payload should specify which object and property mutated. Otherwise brute-force UI update is performed.
