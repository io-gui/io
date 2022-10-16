## Usage

Import Io-Gui module.

```javascript
import "io-gui";
```

In this example, we import the `<io-option-menu>` element and set its properties imperatively:

```javascript
import { IoOptionMenu } from "io-gui";
const menu = new IoOptionMenu();
menu.options = ["one","two","three"];
menu.value = "one";
document.body.appendChild(menu);
```

Alternatively, you can create the `<io-option-menu>` element declaratively in HTML. But keep in mind that some properties may not be settable via attributes.

```html
<io-option-menu value="one" options='["one", "two", "three"]'></io-option-menu>
```

Result:

<io-option-menu value="one" options='["one", "two", "three"]'></io-option-menu>

## Simple App Example

You can extend `IoElement` to create anything from simple elements to complex applications.

```javascript
class MyApp extends IoElement {}
RegisterIoElement(MyApp);
```
You should call `RegisterIoElement(MyApp)` immediately after defining the class.

Element names are kebab-case derived from class names in CamelCase. For example `MyApp` class will register as `<my-app>`.

Now you can use the `template()` function to add contents to your application.

```javascript
class MyApp extends IoElement {
  changed() {
    this.template([['p', 'Hello io!']]);
  }
}
RegisterIoElement(MyApp);
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

Styles are defined inside `static get Style()` return string. Alternatively, styles can be defined in external CSS files.

Let's specify text color for the `<p>` element.

```javascript
static get Style() {
  return /* css */`
    :host > p {
      color: tomato;
    }
  `;
}
```

**Note:** CSS selectors have to be prefixed with `:host` in order to prevent style leakage. Template literal comment `/*css*/` is optional but recommended for correct syntax highlighting (editor plug-in required).

CSS selectors starting with `--` and ending with `:` are treated as mixins (CSS property declaration lists). They can be appied using `@apply` CSS rule to any element class derived from `IoElement`.

```javascript
static get Style() {
  return /* css */`
    --io-field: {
      display: flex;
      flex-direction: column;
    }
    :host {
      @apply --io-field;
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

**Note:** Event handler function names should start with `on` or `_on` to get bound to class instance automatically.

## Change Functions

Change functions are automatically called when properties change. If `[propName]Changed(event)` function is defined, it will be called when corresponding property changes.

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
RegisterIoElement(MyApp);
```

<!-- > Continue reading [advanced usage](#doc=learn-more#creating-elements) or check out the [included elements](#doc=elements-core#IoItem). -->
