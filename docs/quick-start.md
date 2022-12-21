# Usage

There are many ways to use Io-Gui. You can use its core classes `IoNode` and `IoElement` to bootstrap your own nodes and custom elements, build anything from a website to complex single-page applications, or you can simply import and use one of its nodes or elements in your own web architecture. You can learn more about nodes and elements in the [deep dive] guide.

 To quickly import Io-Gui and get your feet wet, continue reading this article.

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

> **Note:** You can simply add `<my-element>` to your page but keep in mind that properties have to be set imperatively.

## Making a Website

Here is a quick way to make a simple website `<my-website>` with navigation and 5 pages that display content from .md files. 

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


## Use a Built-in Element

Here is an example how to use `<io-slider>` element.

```javascript
import { IoSlider } from "io-gui";

const slider = new IoSlider({min: -1, max: 1, step: 0.1});

document.body.appendChild(slider);
```

There is a big library of [elements] to choose from. Reffer to elements demo [source code] end for usage examples.

[deep dive]: https://iogui.dev/io/#path=Docs,Deep%20Dive
[elements]: https://iogui.dev/io/#path=Demos,Elements
[source code]: https://github.com/io-gui/io/blob/main/demos/elements-dev.js