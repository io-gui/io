# Io GUI library for web applications #

Io library is designed to help you build data-driven web applications using native web technologies.
It implements custom elements, virtual DOM, programmable templates, data binding and automatic data-flow management.

For a quick start, read this document and check out included elements and examples.

### Defining New Classes ###

To define a new class, extend `IoCore` or `IoElement` and call `Register()`.

```javascript
// object
class MyObject extends IoCore {}
MyObject.Register();

// element
class MyElement extends IoElement {}
MyElement.Register();
```
**Note:** Element name is converted to kebab-case `<my-element>`.

### Properties ###

Define properties inside the static `properties()` getter.

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

You can define a property by value, type, or configuration object:

- **value** default value.
- **type** constructor of value.
- **observer** function to call on value change.
- **reflect** reflects to HTML attribute.
- **enumerable** makes property enumerable.

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

Observers are functions which get called on observed property change. All io elements implement `.changed()` function as a default observer for all properties. Moreover, if `[propName]Changed()` function is defined, it will be called when corresponding property changes. You can also define custom observers inside property configuration object.

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

### Programmable Templates ###

This is the most powerful feature of `IoElement`. It allows you to create dynamic DOM trees in pure javascript. Use `template()` function to render DOM tree inside of your element. Instead of HTML, the templating system uses programmable yet declarative-looking syntax of nested arrays. For example an instance of `<my-color>` element can be expressed like this:

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

If a template property name is prefixed with `on-` it will be treated as a listener. Corresponding property value can be a string (element's function name) or a function from the current scope.

```javascript
['my-element', {'on-click': 'doSomething'}],
['my-element', {'on-click': doSomethingFunction}],
```

### Data Biding ###

This is a simple yet powerful feature designed to be used inside templates. You can data-bind properties to children using `this.bind([propName])` function.
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

### Automatic Data-Flow ###
