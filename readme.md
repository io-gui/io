# Io GUI library for web applications #

Io library is designed to help you build data-driven web applications using native web technologies.
It implements custom elements, virtual DOM, programmable templates, data binding and automatic data-flow management.

For a quick start, read this document and check out included elements and examples.

### Defining New Classes ###

To define a new class, extend `IoCore` or `IoElement` and call `Register()`.

```javascript
class MyObject extends IoCore {}
MyObject.Register();

class MyElement extends IoElement {}
MyElement.Register();
```
**Note:** Element name is registered as kebab-case `<my-element>`.

### Properties ###

Define properties inside the static `properties()` getter.

```javascript
static get properties() {
  return {
    items: {
      type: Array
    },
    enabled: true
  }
}
```

You can define properties by value, type or configuration parameters:

- **value** default value.
- **type** constructor of value.
- **change** function to call on value change.
- **reflect** reflects to HTML attribute.
- **enumerable** makes property enumerable.

### Change Handlers ###

Certain handler functions will get called when properties change. All io objects call `.changed()` function by default. Moreover, if `[propName]Changed()` function is defined, it will be called when the corresponding property changes. You can also specify custom handler functions with a property configuration parameter.

### Listeners ###

Very often elements need to setup default listeners at initialization. Io will set up listeners automatically if you specify them inside static `listeners()` getter.

```javascript
static get listeners() {
  return {
    'keyup': 'keyupHandler'
  }
}
```

### Styling ###

You can define default element style inside `style()` getter.
Note that the CSS selectors have to be prefixed with `:host` in order to prevent style leakage.
Template literal handler `html` is optional but recommended for correct syntax highlighting.

```javascript
static get style() {
  return html`
    <style>
      :host > div > span {
        color: tomato;
      }
    </style>
  `;
}
```

### Programmable Templates ###

This is the most powerful feature of `IoElement`. It allows you to create dynamic DOM trees in pure javascript. Use `template()` function to render DOM tree inside of your element. Instead of HTML, the template system uses programmable yet declarative-looking syntax of nested arrays. For example an instance of `<my-color>` element can be expressed like this:

```javascript
['my-color', {color: "tomato"}, "this is my color"]
```

HTML output:

```html
<my-color color="tomato">this is my color</my-color>
```

**Note:** The first array item is **mandatory** element name, followed by **optional** properties and innerText or an array of children. Combining innerText and children elements is not supported at this time.

Here is a slightly more complex expression with dynamically generated DOM tree:

```javascript
this.template([
  ['h4', 'Array items:'],
  ['div', [
    this.items.map(i => ['span', {className: 'item'}, i])
  ]]
]);
```

HTML output:

```html
<h4>Array items:</h4>
<div>
  <span class="item">1</span>
  <span class="item">2</span>
  <span class="item">3</span>
</div>
```

If a template property name is prefixed with `on-` it will be treated as a listener. Corresponding property value can be a string (element's function name) or a function from the current scope.

```javascript
['my-element', {'on-click': 'doSomething'}],
['my-element', {'on-click': doSomethingFunction}],
```

### Data Biding ###

This is a simple yet powerful feature designed to be used inside templates. You can data-bind properties to children using `this.bind([propName])` function.
Keep in mind that this only works with io properties. In other words, binding to native HTML elements will not work.

```javascript
this.template([
  ['child-element', { value: this.bind('value') }]
]);
```

You can also use `this.bind()` outside template or bind to `IoCore` objects.

```javascript
let myNode = new MyNode({value: this.bind('value')});
myNode.dispose();
```

**Note:** When object is no longer needed, call `dispose()` to prevent memory leakage. Elements will do this automatically when removed from the DOM.

### Automatic* Data-Flow ###

On a fundamental level, data-flow in io is top down and GUI designs with unidirectional data-flow are possible. However, elements and examples in this repository implement a different design where leaf elements have the ability to modify the application state directly via data binding. State changes are then communicated to the rest of the application automatically following few simple rules.

* By convention state tree is passed down the GUI tree as `value` property. This is not mandatory but it makes it easier to understand and debug the data-flow.

* An element's value can be an `object` (object element) or a primitive data type such as `string`, `number` or `boolean` (leaf element).

* User-editable leaf elements should have their values data-bound to their corresponding properties of the hosting object element and their `id` property should match the name of the property.

* When a leaf element's value is changed by user action, it should be done with a built-in function `this.set('value', value)`. This will make sure that a non-bubbling `value-set` event is emitted.

* Object elements hosting editable leaf elements should listen to their `value-set` events and broadcast `object-mutated` event on the window.

That's it! Object elements will automatically listen to `object-mutated` event and update if needed.

### Events

| Event | Description | Detail |
|:------:|:-----------:|:----------:|
| **`[prop]-changed`** | Bound property changed | `property`, `value`, `oldValue` |
| **`[prop]-set`** | Property set by user | `property`, `value`, `oldValue` |
| **`object-mutated`** | Object mutated | `object`, `property`, `value`, `oldValue` |

**Note:** If the application state changed externally (e.g. server push), `object-mutated` event is required for GUI update. Core application should also listen to `object-mutated` event from GUI and react accordingly. `object-mutated` event payload should specify which object and property mutated. Otherwise brute-force GUI update is performed.
