# A lightweight UI framework for data-driven web applications #

Io consists of few simple classes that let you build complex web applications in JavaScript.
It is inspired by [Polymer](https://github.com/Polymer/polymer) and
[DreemGL](https://github.com/dreemproject/dreemgl). It combines the power of custom elements with expressive dynamic templates and bi-directional data binding.

For a quick start, continue reading this document. You can view [todo MVC demo app](http://arodic.github.io/io/demo/todoapp) ([source](https://github.com/arodic/io/tree/master/demo/todoapp)).
Check out [source code](https://github.com/arodic/io) and [unit tests](https://arodic.github.io/io/test).

> ⚠️ Io is a work in progress and it is NOT production ready!
> Io uses [Custom Elements](https://caniuse.com/#feat=custom-elementsv1) and [ES6 modules](https://caniuse.com/#feat=es6-module) and [classes](https://caniuse.com/#feat=es6-class).

### Classes ###

`IoElement` extends `HTMLElement` with `IoElementMixin`. It is designed to build data-driven user interfaces. It includes dynamic templates, encapsulated styling, data binding and shorthands for element definitions and initialization.

`IoInteractive` extends `IoElement` with [pointer events](https://caniuse.com/#feat=pointer) callbacks for pointer interactions.

`IoNode` extends `Object` with `IoElementMixin`.

### Core Principles ##

* io uses **native web technologies**.
* io is **javascript-centric**.
* io is **data-driven**.
* io uses **bi-directional** data binding.

### Defining Elements ###

Simply extend the core `IoElement` class and call `Register()` function on your class.

```javascript
class MySalad extends IoElement {}
MySalad.Register();
```
That is it! You now have ability to use `<my-salad>` in your document.

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

Notice that you can define a property by simply setting a value, or with a configuration object with following options:

- **value** default value. If not specified it will be initialized from specified type.
- **type** constructor of the property. If not specified, it will be inferred from value.
- **observer** name of the method to be called when value changes.
- **reflect** if true, value will be reflected to attribute.
- **enumerable** Specifies if property should be enumerable. Defaults to true.

property names prefixed with underscore `_` will be

If you want to initialize default value with an object, it has to be wrapped in a function.

```javascript
static get properties() {
  return {
    ingredients: function() { return ['rocket', 'tomatoes', 'avocado']; }
  }
}
```

### Observers ###

Observers are functions which get called when observed property changes. All Io elements have two observers by default.

First `.changed()` function gets called every time a property changes. If multiple properties get changed inside a template, the function will be called only once. Second, if you define `[propName]Changed()` function, it will be called when corresponding property changes.

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
Template handler `html` is optional and it is here only to trigger correct syntax highlighting in code editors.

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

### Dynamic DOM Templates ###

This is the most powerful feature of `IoElement`. It allows you to create dynamic DOM trees in pure javascript. Use `template()` method to render DOM tree inside your element. Instead of HTML, the templating system uses array of arrays. For example an instance of `<my-color>` element can be expressed like this:

```javascript
  ['my-color', {color: "tomato"}, "this is my color"]
```

Note that the first array item is **mandatory** element name.
Following are **optional** properties object, followed by innerText or an array of children.
The HTML output from the array above is:

```html
  <my-color color="tomato">this is my color</my-color>
```

Here is a slightly more complex expression with dynamically generated DOM tree:

```javascript
const ingredient = (elem, i) => ['span', {className: 'ingredient'}, elem];
this.template([
  ['h4', 'Salad ingredients:'],
  ['div', [
    ingredients.map(ingredient)
  ]]
]);
```

The output from the code above is converted to following HTML DOM:

```html
<h4>Salad ingredients:</h4>
<div>
  <span class="ingredient">rocket</span>
  <span class="ingredient">tomatoes</span>
  <span class="ingredient">avocado</span>
</div>
```

### Data Biding ###

This is a simple and powerfull feature designed to be used inside templates. You can data bind properties to children using `this.bind([propName])` function.
Keep in mind that this only works with IoElement-based children and properties defined in properties getter.
In other words, binding to native HTML elements will not work.

```javascript
this.template([
  ['my-child-element', { value: this.bind('value') }]
]);

```

You can also use `this.bind()` outside template or bind to `IoNode` object. However, make sure to unbind after you are done with the element's you are binding to.

```javascript
this.somethingChanged() {
  let object = new SomeElementOrNode({value: this.bind('something')}); // WARNING: memory garbage
}

```

Notice in the example above, we created a new element/node inside an observer function which is data-bound via constructor. This works but creates a reference between the two elements which is a potential problem for garbage collection.

### Methods ###

  `setAttribute(attr, value)` Override for native setAttribute method.
  It removes the attribute if value is false, empty string, undefined etc.

  `changed()` This method is automatically called every time a property is changed.
  If multiple properties are changed simultaneously in a template,
  the method is called only once after template is generated.

  `[propertyName]Changed(value, oldValue)` This method is automatically called every time The
  corresponding property changes.


  `dispose()` This method is called automatically when element is no longer needed.
  It removes all event listeners and data bindings.

  `bind(prop)` Use this method in templates or element constructors
  to create bi-directional data-binding.

  `set(prop, value)` Use this method when property value is set by **user action**.
  It will trigger non-bubbling `[prop]-set` event.

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
      label: "Button",
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
