## About Io

Io is a UI framework for computer graphics applications on the web. It supports virtual DOM, reactive rendering and data binding. It comes with a collection of UI elements for basic interactions, menus, layout and presentation.

For a quick start, read this document, then check out included [collection of elements](#doc=elements-core#ioitem) and the [source code](https://github.com/io-gui/io/).

**Core UI library**

The core library includes the most basic classes for buliding custom elements with minimal boilerplate. It also provides data binding, reactive functions and event-based data synchronization.

**Design System**

Io design system includes a [collection of UI elements](#doc=elements-core#ioitem) that range from simple input fields, to [menu systems](#doc=elements-menus#io-menu-item) and [responsive layouts](#doc=elements-layout#io-collapsable).

## Usage

Import Io core module from `dist/io.js` or `src/io.js`.

```javascript
import {IoElement} from "./io/dist/io.js";
```

To use one of the elements, such as `<io-menu-options>` for example, import the corresponding element collection, create the element, assign the options property, and add it to your DOM.

```javascript
import "./io/dist/io-menus.js";
const menu = document.createElement('io-option-menu');
menu.options = ["one", "two", "three"];
element.appendChild(menu);
```

Result:

<io-option-menu value="one" options='["one", "two", "three"]'></io-option-menu>

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
  return /* css */`
    :host > p {
      color: tomato;
    }
  `;
}
```

**Note:** CSS selectors have to be prefixed with `:host` in order to prevent style leakage. Template literal comment `/* css */` is optional but recommended for correct syntax highlighting.

CSS selectors starting with `--` and ending with `:` are treated as mixins (CSS property declaration lists). They can be appied using `@apply` CSS rule to any element class derived from `IoElement`.

```javascript
static get Style() {
  return /* css */`
    --io-column: {
      display: flex;
      flex-direction: column;
    }
    :host {
      @apply --io-column;
    }
  `;
}
```

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

If you specify a property with `reflect: 1` configuration option, it will be automatically reflected to HTML attributes.

For example we can use `clicked` attribute to change text color in CSS.

```javascript
static get Style() {
  return /* css */`
    :host[clicked] > p {
      color: tomato;
    }
  `;
}
static get Properties() {
  return {
    clicked: {
      value: false,
      reflect: 1,
    }
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
    return /* css */`
    :host[clicked] > p {
      color: tomato;
    }
    `;
  }
  static get Properties() {
    return {
      message: 'Hello io!',
      clicked: {
        value: false,
        reflect: 1,
      }
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

> Continue reading [advanced usage](#doc=learn-more) or check out the [included elements](#doc=elements-core#ioitem).
