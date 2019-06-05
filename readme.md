
<img alt="IO UI Logo" src="./images/logo/io.svg" width="150px" style="margin: 1em 0 0 1em;">

# UI library for web applications #

Io library is designed to help web developers build data-driven web applications using modern web technologies. It implements custom elements, virtual DOM, data binding and a simple data-flow design. This library is an experiment. **Use at own risk!**

For a quick start, read this document, then check out the [source code](https://github.com/arodic/io/tree/master/src) and [demos](https://akirodic.com/io/#page=Demo).

## Usage ##

Io library can be imported as a module from `build/io.js` or `src/io.js`.

```javascript
import {IoElement} from "[path_to_io]/build/io.js";
```

To use the built-in elements, such as `io-inspector`, simply create the element, add it to your application DOM and set the `value` property to object you want to inspect.

```javascript
// Create <io-inspector> element, add it to DOM and assign value.
const inspector = document.createElement('io-inspector');
document.body.appendChild(inspector);
inspector.value = myObject;
```

To achieve the same in an application built with `IoElement`,
simply use the `template()` function to add it as virtual DOM array (more on that later).

```javascript
this.template([
  ['io-inspector', {value: myObject}]
])
```

### Defining New Classes ###

To define a new class, extend `IoNode` or `IoElement` and call `Register()`.

```javascript
// Custom object node
class MyObject extends IoNode {}

// Custom element
class MyApp extends IoElement {}
MyApp.Register();
```
**Note:** Custom elements are registered as kebab-case.
For example `MyApp` class will register as `<my-app>`.

### Creating a Simple Application ###

First, define your main application class by extending `IoElement` and use the `template()` function to add content.

```javascript
class MyApp extends IoElement {
  changed() {
    this.template([
      ['p', 'Hello io!'] // Look at me! I'm the DOM now!
    ]);
  }
}
MyApp.Register();
```

Then, simply add the `<my-app>` element to your document and you are done!

```html
<my-app></my-app>
```

Once the element has been connected and `change()` function evoked, virtual DOM array will be applied to the inner DOM tree.

```html
<my-app>
  <p>Hello io!</p>
</my-app>
```

### Styling ###

You can define default element style inside `style()` getter.

```javascript
static get style() {
  return html`
    <style>
      :host > p {
        color: tomato;
      }
    </style>
  `;
}
```

**Note:** CSS selectors have to be prefixed with `:host` in order to prevent style leakage. Template literal handler `html` is optional but recommended for correct syntax highlighting in common editors.

### Defining Properties ###

Define properties inside the static `properties()` getter.

```javascript
static get properties() {
  return {
    message: 'Hello io!'
  }
}
```

You can define properties by value, type or configuration object which may include: `type`, `value`, `reflect`, `binding` and `enumerable`.

Specifying configuration options is optional since in most cases, default values are just fine. You can simply define a property by value or type. For example, following property definitions are effectively the same:

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

### Listeners ###

Very often elements need to setup and default listeners at initialization. Io will setup and dispose listeners automatically if you specify them inside static `listeners()` getter.

```javascript
static get listeners() {
  return {
    'click': 'clickHandler'
  }
}
```

### Change Handler Functions ###

Certain functions will get called when properties change. All io objects call `.changed()` function by default. Moreover, if `[propName]Changed()` function is defined, it will be called when the corresponding property changes. Furthermore, if property value is an object `[propName]Mutated()` function will be called immediately after object mutation (see [data-flow](#simple-data-flow) requirements).

### Simple App Recap ###

Finally, lets create the `MyApp` element again with some of the concepts above applied. The following element will change message property and text color when clicked.

```javascript
class MyApp extends IoElement {
  static get style() {
    return html`
      <style>
        :host {
          cursor: pointer;
        }
        /* custom attribute selector */
        :host[clicked] > p {
          color: tomato;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      message: 'Hello io!',
      clicked: {
        type: Boolean,
        reflect: true // reflect for CSS selector
      }
    }
  }
  static get listeners() {
    return {
      'click': 'clickHandler'
    }
  }
  clickHandler() {
    this.clicked = true;
  }
  clickedChanged() {
    if (this.clicked) this.message = 'Thanks for clicking!';
  }
  changed() {
    this.template([
      ['p', this.message]
    ]);
  }
}
MyApp.Register();
```

### Virtual DOM Arrays ###

This is the most powerful feature of `IoElement` that bridges the gap between code, data and DOM.
It lets you to create and update DOM in javascript efficiently.

Use `template()` function to render virtual DOM tree using programmable yet declarative-looking syntax of nested arrays.
For example an instance of `<my-element>` element can be expressed like this:

```javascript
['my-element', {prop: "propvalue"}, "Hello io!"]
```

HTML output:

```html
<my-element prop="propvalue">Hello io!</my-element>
```

The first array item is **mandatory** element name, followed by **optional** properties and innerText or an array of children.

**Note:** Combining innerText and children elements is not supported yet. Also, setting element attributes is not supported (only properties).

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

You can also use `this.bind()` outside template or bind to `IoNode` objects.

```javascript
let myNode = new MyNode({value: this.bind('value')});
myNode.dispose();
```

**Note:** When object is no longer needed, call `dispose()` to prevent memory leakage. Elements will do this automatically when removed from the DOM.

### Simple Data-Flow ###

On a fundamental level, data-flow in io is top down and UI designs with unidirectional data-flow are possible. However, elements and examples in this repository implement a different design where certain elements have the ability to modify the application state. State changes are then communicated to the rest of the application automatically following few simple rules.

* By convention state tree is passed down the UI tree as `value` property. This is not mandatory but it makes it easier to understand and debug the data-flow.

* An element's value can be an `object` (object element) or a primitive data type such as `string`, `number` or `boolean` (leaf element).

* Leaf elements with user-editable values should communicate the value change to their parent object element. This can be achieved with a built-in function `this.set('value', value)` which emits a non-bubbling `value-set` event. See `IoBoolean` for example.

* Object elements which are hosting editable leaf elements should listen to `value-set` event and dispatch `object-mutated` event on the window. See `IoProperties` for example.

That is all! Object elements will automatically listen to `object-mutated` event and update if needed.

### Events

| Event | Description | Detail |
|:------:|:-----------:|:----------:|
| **`[prop]-changed`** | Property changed | `property`, `value`, `oldValue` |
| **`[prop]-set`** | Property set by user | `property`, `value`, `oldValue` |
| **`object-mutated`** | Object mutated | `object`, `property`, `value`, `oldValue` |

**Note:** If the application state changed externally (e.g. server push), `object-mutated` event is required for UI update. Core application should also listen to `object-mutated` event from UI and react accordingly. `object-mutated` event payload should specify which object and property mutated. Otherwise brute-force UI update is performed.
