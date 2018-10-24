# A lightweight UI library for data-driven web applications #

Io consists of few simple classes that let you build complex web applications in JavaScript.
It is inspired by [Polymer](https://github.com/Polymer/polymer) and [DreemGL](https://github.com/dreemproject/dreemgl).
It combines the power of custom elements with expressive dynamic templates and bi-directional data binding.

For a quick start, continue reading this document.

Also check out [demo page](http://arodic.github.io/io/demo), [todo app](http://arodic.github.io/io/demo/todoapp) and [unit tests](https://arodic.github.io/io/test).

## Principles ##

* io uses **native web technologies**.
* io is **javascript-centric**.
* io is **data-driven**.
* io uses **bi-directional** data binding.
* io runtime has **no dependencies**.

## Classes ##

### `IoCoreMixin` ###

This is the core of Io. It is designed as a mixin so it can be included at any level of the inheritance chain.

### `IoElement` ###

The Io core applied to `HTMLElement` class. It gives you the ability to quickly design and initialize a custom element. It includes features such as dynamic templates, encapsulated styling and data binding.

### `IoNode` ###

The Io core applied to `Object` class. It excludes DOM features such as templates and styles but otherwise provides same functionality as `IoElement`.

## Elements ##

Io comes with several [basic element classes](https://github.com/arodic/io/tree/master/src/classes) to get you started and familiarized with the library. All basic classes are simple and come with minimal default styling. Input elements use `value` property by convention and emit `value-set` event when value is changed by user action. See [element docs](http://arodic.github.io/io/doc) for details.

### `IoButton` `<io-button>` ###

Simple button element. When clicked, it calls the `action` function with optional `value` argument.

### `IoBoolean` `<io-boolean>` ###

Input element for `Boolean` data type. It can be configured to display custom `true` or `false` text depending on its `value`.

### `IoString` `<io-string>` ###

Input element for `String` data type.

### `IoNumber` `<io-number>` ###

Input element for `Number` data type. It can be configured to clamp its `value` to `min` and `max` values and display value using `conversion` factor.

### `IoObject` `<io-object>` ###

Input element for `Object` data type. It can be used as an object inspector or configured for custom data-centric user interfaces.

### Defining Custom Elements ###

Simply extend the core `IoElement` class and call `Register()`.

```javascript
class MySalad extends IoElement {}
MySalad.Register();
```
That is it! You now have ability to use `<my-salad>` in your document.

Alternatively, apply `IoElementMixin` onto existing element class.
```javascript
class MySalad extends IoElementMixin(HTMLElement) {}
MySalad.Register();
```

### Properties ###

Next, define properties inside the `properties()` getter.

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

You can define a property by its default value, or by providing following configuration options:

- **value** default value. If not specified it will be initialized from specified type.
- **type** constructor of the property value. If not specified, it will be inferred from value.
- **observer** name of the method to be called when value changes.
- **reflect** if true, value will be reflected to attribute.
- **enumerable** Specifies if property should be enumerable. Defaults to true.

property names prefixed with underscore `_` will not be enumerable regardless of `enumerable` property, nor will they trigger any events, observers or bindings.

If you want to initialize default value with a custom object, wrap it in an anonymous function.

```javascript
static get properties() {
  return {
    ingredients: function() { return ['rocket', 'tomatoes', 'avocado']; }
  }
}
```

### Observers ###

Observers are methods which get called on observed property change. All Io elements implement `.changed()` method as a default observer for all properties. If `[propName]Changed()` method is defined, it will be called when corresponding property changes. You can also define custom observers inside property configuration object.

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

Note that the first array item is **mandatory** element name, followed by **optional** properties and innerText or an array of children. Combining innerText and children elements is not supported at the moment.

Here is a slightly more complex expression with dynamically generated DOM tree:

```javascript
this.template([
  ['h4', 'Salad ingredients:'],
  ['div', [
    this.ingredients.map(i => ['span', {className: 'ingredient'}, i])
  ]]
]);
```

HTML output:

```html
<h4>Salad ingredients:</h4>
<div>
  <span class="ingredient">rocket</span>
  <span class="ingredient">tomatoes</span>
  <span class="ingredient">avocado</span>
</div>
```

### Data Biding ###

This is a simple yet powerful feature designed to be used inside templates. You can data-bind properties to children using `this.bind([propName])` method.
Keep in mind that this only works with IoElement properties. In other words, binding to native HTML elements will not work.

```javascript
this.template([
  ['my-child-element', { value: this.bind('value') }]
]);

```

You can also use `this.bind()` outside template or bind to `IoNode` objects. However, make sure to unbind after you are done with it to prevent memory garbage.

```javascript
this.somethingChanged() {
  let object = new MyNode({value: this.bind('otherValue')}); // WARNING: memory garbage
}

```

Notice in the example above, we created a new node inside an observer function which is data-bound via constructor. This works but creates a reference between the two elements which is a potential problem for garbage collection.

### Methods ###

  `setAttribute(attr, value)` Override for native setAttribute method.
  It removes the attribute if the value is falsey.

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
