# Usage

There are many ways to use Io-Gui. You can use its core classes `IoNode` and `IoElement` to bootstrap your own nodes and custom elements, build anything from a website to complex single-page applications, or you can simply import and use one of its nodes or elements in your own web architecture. You can learn more about nodes and elements in the [deep dive] guide.

To quickly import Io-Gui and get started, continue reading this article.

## Making a Simple Element

Here is a basic example of a reaciteve element `<my-element>` with a `message` property that renders the value of the `message` property in its contents.

```javascript
import { IoElement, RegisterIoElement } from "io-gui";

class MyElement extends IoElement {
  static get Properties() {
    return {
      message: ''
    };
  }
  messageChanged() {
    this.template([['p', this.message]]);
  }
}
RegisterIoElement(MyElement);

const myElement = new MyElement({message: 'Hello World'});
document.body.appendChild(myElement);
```

> **Note:** You can also add `<my-element>` to your HTML code but keep in mind that properties have to be set imperatively. Setting HTML attributes won't work.

## Making a Website

Here is a quick way to make a simple website `<my-website>` with navigation and pages that display contents from .md files. 

```javascript
import { IoNavigator, RegisterIoElement, MenuOptions } from "io-gui";
import { IoStorage as $ } from "io-gui";

export class MyWebsite extends IoNavigator {
  static get Properties() {
    return {
      menu: 'top', // This can also be 'left', 'right' or 'bottom'.
      options: new MenuOptions(
        ['About', 'Products', 'Services', 'Testemonials', 'Contact'], {
          // This will store selected page in url hash.
          path: $({key: 'page', storage: 'hash', value: 'About'}),
        }
      ),
      elements: [
        ['io-md-view', {id: 'About', src: './page/about.md'}],
        ['io-md-view', {id: 'Products', src: './page/products.md'}],
        ['io-md-view', {id: 'Services', src: './page/services.md'}],
        ['io-md-view', {id: 'Testemonials', src: './page/testemonials.md'}],
        ['io-md-view', {id: 'Contact', src: './page/contact.md'}],
      ]
    };
  }
}
RegisterIoElement(MyWebsite);
```


## Built-in Elements

Here is an example how to use `IoSlider` element:

```javascript
import { IoSlider } from "io-gui";

const slider = new IoSlider({value: 0, min: -1, max: 1, step: 0.1});

document.body.appendChild(slider);
```

In another example we use `IoContextMenu` to add an interactive context menu with actions to our page:

```javascript
import { IoContextMenu, MenuOptions } from "io-gui";

const menu = new IoContextMenu({
  options: new MenuOptions([
    {label: 'First', value: 'First clicked', action: console.log},
    {label: 'Second', value: 'Second clicked', action: console.log},
    {label: 'Third', value: 'Third clicked', action: console.log},
  ])
});

document.body.appendChild(menu);
```

We can also use `IoInspector` to edit property values of any javascript object:

```javascript
import { IoInspector } from "io-gui";

// We can use IoInspector to edit `window.location` object.
const inspector = new IoInspector({value: window.location});

document.body.appendChild(inspector);
```

These are just a few examples. There is a big library of [elements] to choose from.

## Learn More

To continue learning about Io-Gui, read the [deep dive] guide.

Reffer to the elements demo [source code] for usage examples.

[deep dive]: https://iogui.dev/io/#path=Docs,Deep%20Dive
[elements]: https://iogui.dev/io/#path=Demos,Elements
[source code]: https://github.com/io-gui/io/blob/main/demos/elements-dev.js