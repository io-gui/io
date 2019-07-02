## Usage ##

```javascript
const menu = document.createElement('io-menu-options');
menu.options = options;
element.appendChild(menu);
```

Alternatively, you can create the element with its constructor and assign properties in the configuration argument.

```javascript
element.appendChild(new IoMenu({value: options}));
```

Even better, you can create elements with `IoElement.template()` function with virtual DOM arrays (see virtual-dom-arrays).

```javascript
this.template([['io-menu-options', {value: options}]]);
```
## IoNode ##

To define a new class, extend `IoNode` or `IoElement` and call `Register()`.

```javascript
// Custom object node
class MyObject extends IoNode {}

```

## Style ##

## Properties and Attributes ##

You can define properties by value, type or configuration object which may include: `type`, `value`, `reflect`, `binding` and `enumerable`.

Specifying configuration options is optional. In most cases, default values are just fine. You can simply define a property by value or type. For example, following variants are effectively the same:

```javascript
// Variant 1 (full property configuration)
myProperty: {
  type: Boolean,
  value: false,
  reflect: false,
  binding: null,
  enumerable: true
}
// Variant 2 (type only)
myProperty: Boolean
// Variant 3 (value only)
myProperty: false
```

## Listeners ##



## Change Functions ##



## Virtual DOM Array ##

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

## Data Binding ##

This is a simple yet powerful feature designed to be used inside templates. You can data-bind properties to children using `this.bind([propName])` function.
Keep in mind that this only works with io properties. In other words, binding to native HTML elements will not work.

```javascript
this.template([
  ['child-element', {value: this.bind('value')}]
]);
```

You can also use `this.bind()` outside template or bind to `IoNode` objects.

```javascript
let myNode = new MyNode({value: this.bind('value')});
myNode.dispose();
```

**Note:** When object is no longer needed, call `dispose()` to prevent memory leakage. Elements will do this automatically when removed from the DOM.

## Data-Flow ##

On a fundamental level, data-flow in io is top down and UI designs with unidirectional data-flow are possible. However, elements and examples in this repository implement designs where certain elements have the ability to modify and manage their own state. State changes are automatically communicated to the rest of the application following few simple rules.

* By convention state tree is passed down the UI tree as `value` property. This is not mandatory but it makes it easier to understand and debug the data-flow.

* An element's value can be an `object` (object element) or a primitive data type such as `string`, `number` or `boolean` (leaf element).

* Leaf elements with user-editable values should communicate the value change to their parent object element. This can be achieved with a built-in function `this.set('value', value)` which emits a non-bubbling `value-set` event. See `IoBoolean` for example.

* Object elements which are hosting editable leaf elements should listen to `value-set` event and dispatch `object-mutated` event on the window. See `IoProperties` for example.

That is all! Object elements will automatically listen to `object-mutated` event and update if needed.

## Events ##

| Event | Description | Detail |
|:------:|:-----------:|:----------:|
| **`[prop]-changed`** | Property changed | `property`, `value`, `oldValue` |
| **`[prop]-set`** | Property set by user | `property`, `value`, `oldValue` |
| **`object-mutated`** | Object mutated | `object`, `property`, `value`, `oldValue` |

**Note:** If the application state changed externally (e.g. server push), `object-mutated` event is required for UI update. Core application should also listen to `object-mutated` event from UI and react accordingly. `object-mutated` event payload should specify which object and property mutated. Otherwise brute-force UI update is performed.
