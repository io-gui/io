# Io.js: UI library for data-driven web applications #

Io.js consists of few lightweight classes that let you build encapsulated and reusable custom elements in javascript.
It is inspired by [Polymer](https://github.com/Polymer/polymer) and
[DreemGL](https://github.com/dreemproject/dreemgl).
You can view [todo MVC demo app here](http://arodic.github.io/io/demo/todoapp).
For a quick start, continue reading this document.

> ⚠️ Io.js is NOT production ready!

> This project uses modern web technologies such as
> [Custom Elements](https://caniuse.com/#feat=custom-elementsv1) and
> [ES6 modules](https://caniuse.com/#feat=es6-module).

### Classes ###

`IoElement` class extends `HTMLElement`.
It is designed to help you build complex user interfaces with minimal effort.
It includes dynamic templates, encapsulated styling, data binding and shorthands for element definitions and initialization.

`IoInteractable` extends `IoElement` with handy pointer callbacks for mouse and touch interactions.

`IoNode` class extends `Object` class and provides same API as IoElement.
You can use this class as glue between `IoElement` and your core application logic.

### Core Principles ##

* io elements use **native web technologies**.
* io elements are **javascript-centric**.
* io elements are **styleable**.
* io elements are **data-driven**.
* io elements use **bi-directional** data binding.
* io elements use **properties**, while **attributes** can be used for styling.

### File Sizes ###

|             | Size | Gzipped |
| ----------- |:----:|:-------:|
| io.js       | 29KB |     7KB |
| io.min.js   | 20KB |     5KB |

### Defining Elements ###

Simply extend the core `IoElement` class and call `Register()` function on your class.

```javascript
class MySalad extends IoElement {}
MySalad.Register();
```
That is it! You now have ability to use `<my-element>` in your document.

Alternatively, you can use `IoElementMixin` wo wrap an existing element class instead.
```javascript
class MySalad extends IoElementMixin(HTMLElement) {}
MySalad.Register();
```

### Properties ###

Next, define your element's properties inside the `properties()` getter.

```javascript
static get properties() {
  return {
    ingredients: {
      type: Array,
      observer: 'mixSalad',
    },
    dressing: {
      value: false,
      reflect: true,
    },
    isMixed: false
  }
}
```

Notice that you can define a property by simply setting a value, or with a configuration object.
Properties can have following configuration options:

- **value** default value. If not specified it will be initialized from specified type.
- **type** constructor of the property. If not specified, it will be inferred from value.
- **observer** name of the method to be called when value changes.
- **reflect** if true, value will be reflected to attribute.
- **enumerable** Specifies if property should be enumerable. Defaults to true.

If you want to initialize default value with an object, it has to be wrapped in a function.

```javascript
static get properties() {
  return {
    ingredients: function() { return ['rocket', 'tomatoes', 'avocado']; }
  }
}
```

### Observers ###

Observers are functions that get called when some observed property changes. All Io elements have two observers by default.

First `.changed()` function gets called every time a property changes. It multiple properties get changed inside a template, the function will be called only once. Second, if you define `[propName]Changed()` function, it will be called when corresponding property changes.

Also, you can define custom observers inside property configuration object (see example above).

### Listeners ###

You can define default listeners inside `listeners()` getter:

```javascript
static get listeners() {
  return {
    'keyup': '_keyupHandler' // on keyup event call this._keyupHandler
  }
}
```

### Styling ###

Define default style inside `style()` getter.
Note that the CSS selectors have to be prefixed with `:host` in order to prevent style leakage.
Template handler `html` is optional and it is here only to help with syntax highlighting in code editors.

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

### Dynamic DOM templates ###

This is the most powerful feature of `IoElement`. It allows you to create dynamic DOM trees in pure javascript. Use `template()` method to render DOM tree inside your element. Instead of HTML, the templating system uses array of arrays. For example an instance of `<my-color>` element can be expressed like this:

```javascript
  ['my-color', {color: "tomato"}, "this is my color"]
```

Note that the first array item is **mandatory** element name.
Following are **optional** properties object, followed by innerText or an array of children.
The HTML output from the array above is:

```HTML
  <my-color color="tomato">this is my color</my-color>
```

Here is a slightly more complex expression with dynamically generated DOM tree:

```javascript
const Fruit = (elem, i) => ['span', {className: 'fruit'}, elem];
this.template([
  ['h4', this.isMixed ? 'Salad ingredients:' : 'List of Fruits:'],
  ['div', [
    elements.map(this.fruits)
  ]]
]);
```

The output from the code above is converted to following HTML DOM:

```html
<h4>List of Fruits:</h4>
<div>
  <span class="fruit">apple</span>
  <span class="fruit">banana</span>
  <span class="fruit">avocado</span>
</div>
```

You can data bind properties to children using `bind()` function.
Keep in mind that this only works with IoElement-based children.
In other words, binding to `div`, `span` etc. will not work.

```javascript
this.template([
  ['my-child-element', { value: this.bind('value') }]
]);

```

### Methods ###

  `setAttribute(attr, value)` Override for native setAttribute method.
  It removes the attribute if value is false, empty string, undefined etc.

  `changed()` This method is automatically called every time a property is changed.
  If multiple properties are changed simultaneously in a template,
  the method is called only once after template is generated.

  `dispose()` This method is called automatically when element is no longer needed.
  It removes all event listeners and data bindings.

  `bind(prop)` Use this method in templates or element constructors
  to create bi-directional data-binding.

  `set(prop, value)` Use this method when property value is set by **user action**.
  It will trigger non-bubbling `[prop]-set` event.

  `setProperties(props)` This method is used internally to set multiple properties in a batch.
  It does not trigger `change()` method until `queueDispatch()` is called.

  `objectMutated` This method is automatically called if element properties include
  an object value and 'object-mutated' event has been broadcasted on window. Internally, this method checks if mutated object is its property
  and calls `changed()` method if appropriate.

  `queueDispatch()` This method is used internally to dispatch events and
  observers triggered y property changes.

  `dispatchEvent(type, detail, bubbles = true, src = this)` Shorthand for custom event dispatch.

### Example ###

Here is a basic example for a button element:

```javascript
export class MyButton extends IoElement {
  static get style() {
    return html`<style>
    :host {
      cursor: pointer;
    }
    :host[pressed] {
      background: rgba(0,0,0,0.5);
    }
    </style>`;
  }
  static get properties() {
    return {
      label: String,
      pressed: {
        type: Boolean,
        reflect: true
      },
      action: Function,
      tabindex: 1
    };
  }
  static get listeners() {
    return {
      'mousedown': '_onDown',
      'touchstart': '_onDown'
    };
  }
  _onAction(event) {
    if (this.pressed && typeof this.action === 'function') this.action();
    this.pressed = false;
  }
  _onDown(event) {
    this.pressed = true;
    this.addEventListener('mouseup', this._onAction);
    this.addEventListener('touchend', this._onAction);
    this.addEventListener('mouseleave', this._onLeave);
  }
  _onUp(event) {
    this.pressed = false;
    this.removeEventListener('mouseup', this._onAction);
    this.removeEventListener('touchend', this._onAction);
    this.removeEventListener('mouseleave', this._onLeave);
  }
  _onLeave() {
    this.pressed = false;
  }
  changed() {
    this.template([['span', this.label]]);
  }
}

MyButton.Register();

```
