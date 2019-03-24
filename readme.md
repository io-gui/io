
<img alt="IO UI Logo" src="./images/logo/io.svg" width="150px" style="margin: 1em 0 0 1em;">

# UI library for web applications #

Io library is designed to help web developers build data-driven web applications using modern web technologies.
It implements custom elements, virtual DOM, data binding and a simple data-flow design.
This library is an experiment with limited browser support, incomplete documentation, partial test coverage, and design which is subject to change. **Use at own risk!**

For a quick start, read this document and check out included elements and examples.

[Source Code](https://github.com/arodic/io) on GitHub. [Live Demo](https://akirodic.com/io/#page=2)

## Usage ##

Bundled io library can be imported as a module from `build/io-core.js` (core classes), `build/io-elements.js` (elements), or `build/io.js` (all classes and elements). Alternatively, you can import specific elements and classes directly from `src/`.

```javascript
import {IoNode, IoElement} from "[path_to_io]/build/io-core.js";
```

If you only want to use the built-in elements, simply add them to your application and set the values.
For example to create an object inspector:

```javascript
// create <io-obect>
const objectInspector = document.createElement('io-object');

// Assign value
objectInspector.value = myObjectToInspect;
```

### Creating a Simple Application ###

First, define your main application class in javascript and use `template()` function to add contents.

```javascript
class MyApp extends IoElement {
  changed() {
    this.template([
      ['p', 'Hello world!'] // Look at me! I'm the DOM now!
    ]);
  }
}
MyApp.Register();
```

Then, simply add the main-app element to you HTML page and you are done!

```html
<my-app></my-app>
```

### Defining New Classes ###

To define a new class, extend `IoNode` or `IoElement` and call `Register()`.

```javascript
class MyObject extends IoNode {}

class MyElement extends IoElement {}
MyElement.Register();
```
**Note:** Custom elements are registered as kebab-case `<my-element>`.

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

You can define properties by value, type or configuration options such as: `type`, `value`, `reflect`, `binding` and `enumerable`. However, fully specified configuration options are optional since in most cases, default values are just fine. You can simply define a property by value or type. For example, following property configurations are effectively the same:

```javascript
  myProperty: {
    type: Boolean,
    value: false,
    reflect: false,
    binding: null,
    enumerable: true
  }

  myProperty: Boolean

  myProperty: false
```

### Change Handler Functions ###

Certain functions will get called when properties change. All io objects call `.changed()` function by default. Moreover, if `[propName]Changed()` function is defined, it will be called when the corresponding property changes. Furthermore, if property value is an object `[propName]Mutated()` function will be called immediately after object mutation (see [data-flow](#simple-data-flow) requirements).

### Listeners ###

Very often elements need to setup and default listeners at initialization. Io will setup and dispose listeners automatically if you specify them inside static `listeners()` getter.

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
Template literal handler `html` is optional but recommended for correct syntax highlighting in common editors.

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

<a name="virtual-dom"></a>

### Virtual DOM ###

This is the most powerful feature of `IoElement`.
It allows you to create dynamic DOM trees in pure javascript.
Use `template()` function to render DOM tree.
Instead of HTML, the template system uses programmable yet declarative-looking syntax of nested arrays.
For example an instance of `<my-color>` element can be expressed like this:

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

<a name="data-binding"></a>
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

<a name="simple-data-flow"></a>
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
