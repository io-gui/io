## About Io ##

Io is a JavaScript UI framework for reactive web applications. It implements custom elements, virtual DOM, data binding and a simple data-flow design.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/io-gui/io/blob/master/LICENSE)

For a quick start, read this document, then check out the [source code](https://github.com/io-gui/io/).

## Usage ##

Import Io module from `build/io.js` or `src/io.js`.

```javascript
import {IoElement} from "./io/build/io.js";
```

The library includes a collection of useful UI elements suitable for use with other UI libraries and frameworks. To use one of the elements, such as [`<io-menu-options>`](#page=docs&doc=menu) for example, create the element, assign the options property, and add it to your DOM.

```javascript
const menu = document.createElement('io-menu-options');
menu.options = options;
element.appendChild(menu);
```

## Simple App Example ##

You can extend `IoElement` to create elements and applications.

```javascript
class MyApp extends IoElement {}
MyApp.Register();
```
You should call `Register()` immediately after defining the class. Custom elements are registered as kebab-case. For example `MyApp` class will register as `<my-app>`.

Now you can use the `template()` function to add contents to your application.

```javascript
class MyApp extends IoElement {
  changed() {
    this.template([['p', 'Hello io!']]);
  }
}
MyApp.Register();
```

Then, add `<my-app>` element to your document and you are done!

```html
<my-app></my-app>
```

Once the element has been connected and `change()` function evoked, the template will be applied to the DOM.

```html
<my-app>
  <p>Hello io!</p>
</my-app>
```

> To learn more about template function read [vitrual DOM array](#page=docs&doc=advanced#virtual-dom-array).

## Style ##

Styles are defined inside `static get style()` return string. Let's specify text color for the `<p>` element.

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

**Note:** CSS selectors have to be prefixed with `:host` in order to prevent style leakage. Template literal handler `html` is optional but recommended for correct syntax highlighting.

> For more details about style read [advanced style](#page=docs&doc=advanced#style).

## Properties ##

Properties are defined inside `static get properties()` return object. Let's define a `message` property with default value `'Hello io!'`.

```javascript
static get properties() {
  return {
    message: 'Hello io!'
  }
}
```

Now you can use the message property inside the template.

```javascript
this.template([['p', this.message]]);
```

> For more details about properties read [advanced properties](#page=docs&doc=advanced#properties-and-attributes).

## Attributes ##

Attributes are defined inside `static get attributes()` return object.

Attributes are also properties but they behave in such way that their values are automatically reflected to HTML attributes so they can be used as CSS selectors.

For example we can use `clicked` attribute to change text color.

```javascript
static get style() {
  return html`
    <style>
      :host[clicked] > p {
        color: tomato;
      }
    </style>
  `;
}
static get attributes() {
  return {
    clicked: false
  }
}
```

> For more details about attributes read [advanced attributes](#page=docs&doc=advanced#properties-and-attributes).

## Listeners ##

Listeners are defined inside `static get listeners()` return object. Following listener will call `this.onClick(event)` handler function when `click` event is captured.

```javascript
static get listeners() {
  return {
    'click': 'onClick'
  }
}
```

**Note:** Event handler function names should start with `on` or `_on`.

> For more details about listeners read [advanced listeners](#page=docs&doc=advanced#listeners).

## Change Functions ##

Change functions are automatically called when properties change. If `[propName]Changed(value, oldValue)` function is defined, it will be called when corresponding property changes.

If property value is an object, `[propName]Mutated()` function will be called immediately after object mutation (see data-flow requirements).

Lastly, `changed()` function will be called **after** all of the property-specific change/mutation functions are called.

> For more details about change functions read [advanced change functions](#page=docs&doc=advanced#change-functions).

## Simple App Recap ##

Here is `MyApp` element with all of the basic concepts applied. The element should change message text and color when clicked.

```javascript
class MyApp extends IoElement {
  static get style() {
    return html`
      <style>
        :host[clicked] > p {
          color: tomato;
        }
      </style>
    `;
  }
  static get attributes() {
    return {
      clicked: false
    }
  }
  static get properties() {
    return {
      message: 'Hello io!',
    }
  }
  static get listeners() {
    return {
      'click': 'onClick'
    }
  }
  onClick() {
    this.clicked = true;
  }
  clickedChanged() {
    if (this.clicked) this.message = 'Thanks for clicking!';
  }
  changed() {
    this.template([['p', this.message]]);
  }
}
MyApp.Register();
```

> Cotinue reading [advanced usage](#page=docs&doc=advanced#usage).
