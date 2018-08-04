# Io.js: element classes for data-driven web applications #

> ⚠️ Io.js is NOT production ready!
> This project uses modern web technologies such as
> [Custom Elements](https://caniuse.com/#feat=custom-elementsv1) and
> [ES6 modules](https://caniuse.com/#feat=es6-module) and may or may not work in some browsers.

Io.js is a collection of lightweight classes that let you build encapsulated and reusable custom elements.
It is inspired by [Polymer](https://github.com/Polymer/polymer) and
[DreemGL](https://github.com/dreemproject/dreemgl).

### Classes ###

`IoElement` class is an extension of `HTMLElement`.
It is designed to help you build complex user interfaces with minimal effort.
It includes dynamic templates, data binding and shorthands for element definitions and initialization.

`IoInteractable` is extends `IoElement` with handy pointer API for mouse+touch interactions.

`IoNode` class is same as `IoElement` except it extends `Object` class instead.
It excludes DOM APIs but includes event dispatch and listeners.
You can use this class as glue between `IoElement` and your core application logic.

### Core Principles ###

* io elements use **native web technologies**.
* io elements are **javascript-centric**.
* io elements are **styleable**.
* io elements are **data-driven**.
* io elements use **bi-directional** data binding.

### File Sizes ###

|             | Size | Gzipped |
| ----------- |:----:|:-------:|
| io.js       | 27KB |     7KB |
| io.min.js   | 19KB |     5KB |

### Defining Elements ###

Simply extend the core `IoElement` class and call `Register()` function on your class.

Define properties inside the `properties()` getter:

```javascript
static get properties() {
  return {
    fruits: { // name of the property
      type: Array, // type (constructor) of the property
      value: ['apple', 'banana', 'avocado'], // initial value
      observer: 'fruitsChanged', // when value changes, this.fruitsChanged() will be called.
      reflect: true, // reflect this.fruits to attribute
    },
    salad: {
      value: false
    }
  }
}
```

Alternatively, you can define properties by value or type only:

```javascript
static get properties() {
  return {
    fruits: Array, // Constructors are interpreted as type.
    salad: false // Type (Boolean) will be inferred from this value
  }
}
```

Define default listeners inside `listeners()` getter:

```javascript
static get listeners() {
  return {
    'keyup': '_keyupHandler' // on keyup event call this._keyupHandler
  }
}
```

Define default style inside `style()` getter.
Note that the CSS selectors have to be prefixed with `:host` in order to prevent style leakage.
Template handler `html` is optional and it is here only to help with syntax highlighting.

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

Use `template()` method to render DOM tree inside your element.
Internal DOM tree is expressed as an array of arrays.
For example an instance of `<my-color>` element can be expressed like this:

```javascript
  ['my-color', {color: "tomato"}, "this is my color"]
```

Note that the first array item is **always** element name.
The next is **optional** properties followed by innerText or an array of children.
The HTML equivalent of the array above would would be:

```HTML
  <my-color color="tomato">this is my color</my-color>
```

Here is a slightly more complex expression with dynamically generated DOM tree:

```javascript
const Fruit = (elem, i) => ['span', {className: 'fruit'}, elem];
this.template([
  ['h4', this.salad ? 'Salad ingredients:' : 'List of Fruits:'],
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
