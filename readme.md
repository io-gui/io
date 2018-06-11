# io: custom elements base class for data-centric web applications #

**DISCLAIMER**: io class is NOT production ready! This project uses modern web technologies such as [Custom Elements](https://caniuse.com/#feat=custom-elementsv1) and [ES6 modules](https://caniuse.com/#feat=es6-module) and may or may not work in some browsers.

`IoElement` class is an extension of `HTMLElement` class and it is designed to help you build complex user interfaces with minimal effort.

`IoNode` class is similar to `IoElement` except it extends `Object` class instead and therefore excludes DOM APIs.

### Core Principles ###

* io elements rely on **native** web technologies.
* io elements are **javascript-centric**.
* io elements are fully **styleable**.
* io elements are **data-driven**.
* io elements use **bi-directional** data binding.

### Defining Elements ###

Define your element by extending the core `IoElement` class and calling `Register()` function on your class.

Define properties inside the `properties()` getter:

```javascript
static get properties() {
  return {
    fruits: { // name of the property
      type: Array, // type (constructor) of the property
      value: ['apple', 'banana', 'avocado'], // initial value
      observer: 'fruitsChanged', // when value changes, this.fruitsChanged() will be called.
      reflect: true, // reflect this.fruits to attribute
    }
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
Note that the selectors of `style()` have to be prefixed with `:host` in order to prevent style leakage.

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

### Rendering DOM ###

Use `IoElement.render()` method to render DOM tree inside your element:

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

The output from the code above is automatically converted to following HTML DOM:

```html
<h4>List of Fruits:</h4>
<div>
  <span class="fruit">apple</span>
  <span class="fruit">banana</span>
  <span class="fruit">avocado</span>
</div>
```

Note that the second argument of `IoElement.render()` is render target.

```javascript
this.render([
  ['style'],
  ['slot']
], myDOMElement);

```

### Example ###

Here is a basic example for a button element:

```javascript
import {html, IoElement} from "../../io.js";

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
  update() {
    this.render([['span', this.label]]);
  }
}

MyButton.Register();

```
