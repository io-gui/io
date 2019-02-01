# A lightweight UI library for data-driven web applications #

Io consists of few simple classes that let you build complex web applications in JavaScript.
It is inspired by [Polymer](https://github.com/Polymer/polymer) and [DreemGL](https://github.com/dreemproject/dreemgl).
It combines the power of custom elements with expressive dynamic templates and bi-directional data binding. In addition, io is bootstrapped with a bundle of basic UI elements.

For a quick start, continue reading this document.

Also check out `/docs`, `/src/elements`, `/demo` and `/demo/todomvc`.

## Principles ##

* io uses **native web technologies**.
* io is **javascript-centric** (jsnext).
* io is **data-driven**.
* io uses **bi-directional** data binding.
* io has **no dependencies**.

## Classes ##

### `IoCoreMixin` ###

This is the core of io. It is designed as a mixin so it can be included at any level of the inheritance chain.

### `IoElement` ###

The io core applied to `HTMLElement` class. It gives you the ability to quickly design and initialize a custom element. It includes features such as dynamic templates, encapsulated styling and data binding.

### `IoCore` ###

The io core mixin applied to `Object` class. It excludes DOM features such as templates and styles but otherwise provides same functionality as `IoElement`.

### Defining Custom Elements ###

Simply extend the core `IoElement` class and call `Register()`.

```javascript
class MyElement extends IoElement {}
MyElement.Register();
```
That is it! You now have ability to use `<my-element>` in your app.

### Properties ###

Define properties inside the `properties()` getter.

```javascript
static get properties() {
  return {
    items: {
      type: Array,
      observer: 'update',
    },
    enabled: true
  }
}
```

You can define a property by its default value, or by providing following configuration options:

- **value** default value. If not specified it will be initialized from specified type.
- **type** constructor of the property value. If not specified, it will be inferred from value.
- **observer** name of the method to be called when value changes.
- **reflect** if true, value will be reflected to attribute.
- **enumerable** Specifies if property should be enumerable. Defaults to `true`.

properties with names prefixed with underscore `_` will not be enumerable, nor will they trigger events, observers and bindings.

If you want to initialize default value with a custom object, wrap it in an anonymous function.

```javascript
static get properties() {
  return {
    items: function() { return [1, 2, 3]; }
  }
}
```

### Observers ###

Observers are methods which get called on observed property change. All io elements implement `.changed()` method as a default observer for all properties. Moreover, if `[propName]Changed()` method is defined, it will be called when corresponding property changes. You can also define custom observers inside property configuration object.

### Listeners ###

Define default listeners inside `listeners()` getter:

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

### Dynamic DOM Templates ###

This is the most powerful feature of `IoElement`. It allows you to create dynamic DOM trees in pure javascript. Use `template()` method to render DOM tree inside of your element. Instead of HTML, the templating system uses programmable yet declarative-looking syntax of nested arrays. For example an instance of `<my-color>` element can be expressed like this:

```javascript
  ['my-color', {color: "tomato"}, "this is my color"]
```

HTML output:

```html
<my-color color="tomato">this is my color</my-color>
```

Note that the first array item is **mandatory** element name, followed by **optional** properties and innerText or an array of children. Combining innerText and children elements is not supported at this time.

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

If a template property name is prefixed with `on-` it will be treated as a listener. Corresponding property value can be a string (element's method name) or a function from the current scope.

```javascript
  ['my-element', {'on-click': 'doSomething'}],
  ['my-element', {'on-click': doSomethingFunction}],
```

### Data Biding ###

This is a simple yet powerful feature designed to be used inside templates. You can data-bind properties to children using `this.bind([propName])` method.
Keep in mind that this only works with IoElement properties. In other words, binding to native HTML elements will not work.

```javascript
this.template([
  ['child-element', { value: this.bind('value') }]
]);

```

You can also use `this.bind()` outside template or bind to `IoCore` objects.

```javascript
let myNode = new MyNode({value: this.bind('value')});
// when node is no longer needed:
myNode.dispose();
```

Notice in the example above, we created a new node which is data-bound via constructor. In this case, make sure you call `dispose` when the node is no longer needed.

### Methods ###

  `changed()` is automatically called every time a property is changed. If multiple properties are changed simultaneously in a template, the method is called only once.

  `[propertyName]Changed(value, oldValue)` If defined, it is automatically called every time the corresponding property changes.

  `dispose()` is called automatically when element is no longer needed. It removes all event listeners and data bindings.

  `bind(prop)` If used in templates or element constructors, this method creates bi-directional data-binding.

  `set(prop, value)` should be used when property value is set by **user action**. It will trigger non-bubbling `[prop]-set` event.

  `dispatchEvent(type, detail, bubbles = true, src = this)` Shorthand for custom event dispatch.
