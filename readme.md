# io: custom elements for data-centric web applications #

**DISCLAIMER**: io elements are NOT production ready! This project uses modern web technologies such as [Custom Elements](https://caniuse.com/#feat=custom-elementsv1), [Shadow DOM](https://caniuse.com/#search=shadow%20dom%20v1) and [ES6 modules](https://caniuse.com/#feat=es6-module) and may or may not work in your browser.

io custom elements are designed to help you build complex user interfaces with minimal effort. All elements extend the core `Io` class which enables a simple declarative syntax inspired by [polymer](https://github.com/Polymer/polymer), as well as a powerful and efficient virtual DOM instancer inspired by [dreemgl](https://github.com/dreemproject/dreemgl).

This collection includes basic editors such as `io-boolean`, `io-string` and `io-number` as well as more complex elements such as `io-object` and `io-menu` which demonstrate io's ability to automatically generate complex UI systems from data. With its configurable design, `io-object` can easily be customized to handle any sort of data.

### Core Principles ###

* io elements use **native** web technologies and are expected to run in all major browsers eventually.
* the core `Io` class is a **lightweight** extension of `HTMLElement`.
* io elements are fully **styleable**.
* Auto-generated ui systems are **configurable** to handle more specific use cases.
* io elements are **data-driven** but also allow users to modify the data.
* io applications implement **bi-directional/transversal** dataflow.
* io elements can reflect properties to attributes but not vice-versa.

### Getting Started ###

Simply clone this repository and run a server which supports ES6 modules. For example, install [polymer-cli](https://github.com/Polymer/polymer-cli) and run `polymer serve`. [More info and examples coming soon]

### Defining Properties, Listeners and Default Attributes ###

You can define and configure properties on your element inside the `properties()` getter. Note in the example below that `fruits` is a property while `listeners` and `attributes` are two special keywords reserved for defining default attributes and listeners.

```javascript
static get properties() {
  return {
    fruits: { // name of the property will be this.fruits
      type: Array, // type of this.fruits
      value: ['apple', 'banana', 'avocado'], // initial value
      observer: '_update', // when value changes, call this._update()
      reflectToAttribute: true, // reflect this.fruits to attribute
      notify: true, // emit fruits-changed event when this.fruits changed
      bubbles: true // fruits-changed bubbles
    },
    listeners: { // not a property
      'keyup': '_keyupHandler' // on keyup event call this._keyupHandler
    },
    attributes: { // not a property
      'tabindex': 0  // initialize with tabindex="0" attribute
    }
  }
}
```

### Styling Elements ###

Styling io elements is easy. Simply add CSS in HTML format inside `style()` getter for light DOM and `shadowStyle()` getter for Shadow DOM. Note that the selectors of `style()` have to be prefixed with `:host` in order to prevent style leakage.

```javascript
static get shadowStyle() {
  return html`
    <style>
      :host {
        display: inline-block;
      }
    </style>
  `;
}
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

### Rendering DOM and Shadow DOM ###

Use `Io.render()` method like described below to render virtual DOM which will automatically get translated into real DOM:

```javascript
let elements = ['apple', 'banana', 'avocado'];

const Fruit = (elem, i) => ['span', {className: 'fruit'}, elem];
this.render([
  ['h4', 'List of Fruits:'],
  ['div', [
    elements.map(Fruit)
  ]]
]);

```

The output from code above after it's converted to HTML DOM:

```html
<h4>List of Fruits:</h4>
<div>
  <span class="fruit">apple</span>
  <span class="fruit">banana</span>
  <span class="fruit">avocado</span>
</div>
```

Note that the second argument of `Io.render()` is render target. You can use it to render into a specific element or into Shadow DOM:

```javascript
this.render([
  ['style'],
  ['slot']
], this.shadowRoot);

```

[TODO: Handler funcitons]
