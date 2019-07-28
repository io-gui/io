## About Io

Io is a UI framework for building web applications and custom elements. It supports virtual DOM, reactive rendering and data binding. It comes with a collection of UI elements for basic interactions, menus, layout and presentation.

For a quick start, read this document, then check out included [collection of elements](https://io-gui.dev/#page=elements) and the [source code](https://github.com/io-gui/io/).

**Core UI library**

The core library includes the most basic classes for buliding custom elements with minimal boilerplate. It also provides data binding, reactive functions and event-based data synchronization.

**Design System**

Io design system includes a [collection of UI elements](https://io-gui.dev/#page=elements) that range from simple input fields, to [menu systems](#page=elements&element=elements-menus) and [responsive layouts](#page=elements&element=layout-navigation).

## Usage

Import Io core module from `dist/io.js` or `src/io.js`.

```javascript
import {IoElement} from "./io/dist/io.js";
```

To use one of the elements, such as `<io-menu-options>` for example, import the corresponding element collection, create the element, assign the options property, and add it to your DOM.

```javascript
import "./io/dist/io-elements-menus.js";
const menu = document.createElement('io-menu-options');
menu.options = ["one", "two", "three"];
element.appendChild(menu);
```

## Simple App Example

You can extend `IoElement` to create anything from simple elements to complex applications.

```javascript
class MyApp extends IoElement {}
MyApp.Register();
```
You should call `Register()` immediately after defining a new class. Elements are registered as kebab-case. For example `MyApp` class will register as `<my-app>`.

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

Once the element has been connected, `change()` function will fire and template will be applied to the DOM.

```html
<my-app>
  <!-- Automatically generated! -->
  <p>Hello io!</p>
</my-app>
```

## Style

Styles are defined inside `static get Style()` return string. Alternatively, styles can be defined in external CSS files as usual. Let's specify text color for the `<p>` element.

```javascript
static get Style() {
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

## Properties

Properties are defined inside `static get Properties()` return object. Let's define a `message` property with default value `'Hello io!'`.

```javascript
static get Properties() {
  return {
    message: 'Hello io!'
  }
}
```

Now you can use the message property inside the template.

```javascript
this.template([['p', this.message]]);
```

## Attributes

Attributes are defined inside `static get Attributes()` return object.

Attributes are also properties but they behave in such way that their values are automatically reflected to HTML attributes so they can be used as CSS selectors.

For example we can use `clicked` attribute to change text color.

```javascript
static get Style() {
  return html`
    <style>
      :host[clicked] > p {
        color: tomato;
      }
    </style>
  `;
}
static get Attributes() {
  return {
    clicked: false
  }
}
```

## Listeners

Listeners are defined inside `static get Listeners()` return object. Following listener will call `this.onClick(event)` handler function when `click` event is captured.

```javascript
static get Listeners() {
  return {
    'click': 'onClick'
  }
}
```

**Note:** Event handler function names should start with `on` or `_`.

## Change Functions

Change functions are automatically called when properties change. If `[propName]Changed(event)` function is defined, it will be called when corresponding property changes. Alternatively, you can define a generic `propChanged(event)` function instead and get property name from the event detail.

If property value is an object, `[propName]Mutated()` function will be called immediately after object mutation (see [data-flow requirements](#doc=learn-more#data-flow)).

Lastly, `changed()` function will be called **after** all of the property-specific change/mutation functions are called.

## Simple App Recap

Here is `MyApp` element with all of the basic concepts applied. The element should change message text and color when clicked.

```javascript
class MyApp extends IoElement {
  static get Style() {
    return html`
    <style>
      :host[clicked] > p {
        color: tomato;
      }
    </style>
    `;
  }
  static get Attributes() {
    return {
      clicked: {
        value: false,
        notify: true,
      }
    }
  }
  static get Properties() {
    return {
      message: 'Hello io!',
    }
  }
  static get Listeners() {
    return {
      'click': 'onClick'
    }
  }
  onClick() {
    this.clicked = true;
  }
  clickedChanged() {
    this.message = 'Clicked!';
  }
  changed() {
    this.template([['p', this.message]]);
  }
}
MyApp.Register();
```

> Continue reading [advanced usage](#page=docs&doc=learn-more) or check out the [included elements](#page=elements).
