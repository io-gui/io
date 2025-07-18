# Usage

Io-Gui is incrementally adoptable. You can use its core classes `Node` and `IoElement` to create your own nodes and custom elements, build anything from a simple website to an app, or you can import and use one of its nodes and elements in your own architecture.

You can learn more about nodes and elements in the [deep dive] guide. To quickly import Io-Gui and get started, continue reading this article.

## Making an Element

Here is a basic example of a reactive element `<my-element>` with style declaration and a `message` property.

```javascript
import { IoElement, Register, span } from 'io-gui'

class MyElement extends IoElement {

  static get Style() {
    return /* css */`
      :host {
        display: inline-block;
      }
    `;
  }

  static get ReactiveProperties() {
    return {
      message: 'hello'
    }
  }

  ready() {
    this.changed();
  }
  
  changed() {
    this.render([
      span(this.message)
    ]);
  }

}

Register(MyElement);

document.body.appendChild(
  new MyElement({message: 'Hello World'})
)
```

Alternatively, you can use convinient "@" decorator syntax to define reactive properties and register the element. This syntax requires a transpiler such as Babel or TypeScript.

```javascript
import { IoElement, Register, ReactiveProperty, span } from 'io-gui'

@Register
class MyElement extends IoElement {

  static get Style() {
    return /* css */`
      :host {
        display: inline-block;
      }
    `;
  }

  @ReactiveProperty('hello')
  declare message: string;

  ready() {
    this.changed();
  }
  
  changed() {
    this.render([
      span(this.message)
    ]);
  }

}
```

## Making a Website

Here is a quick way to make a simple static website with navigation and 5 pages that load contents from .md files. 

```javascript
import { IoNavigator } from 'io-navigation'
import { MenuOption } from 'io-menus'
import { Storage } from 'io-gui'
import { ioMarkdown } from 'io-markdown'

document.body.appendChild(
  new IoNavigator({
    menu: 'top',
    option: new MenuOption({
      options: ['About', 'Products', 'Services', 'Testimonials', 'Contact'],
      path: new Storage({storage: 'hash', key: 'page', value: 'About'})
    }),
    elements: [
      // ioMarkdown is a virtual DOM factory, a vDOM counterpart to IoMarkdown constructor
      ioMarkdown({id: 'About', src: './page/about.md'}),
      ioMarkdown({id: 'Products', src: './page/products.md'}),
      ioMarkdown({id: 'Services', src: './page/services.md'}),
      ioMarkdown({id: 'Testimonials', src: './page/testimonials.md'}),
      ioMarkdown({id: 'Contact', src: './page/contact.md'}),
    ]
  })
);
```

See [index.html] of iogui.dev for more advanced `ioNavigator` usage examples.

## Built-in Elements

You can import and use built-in Io-Gui elements such as `IoSlider` or `IoOptionSelect`:

```javascript
import { IoSlider } from 'io-sliders';
import { IoOptionSelect, MenuOption } from 'io-menus';

const slider = new IoSlider({value: 0, min: -3, max: 3, step: 1});
const contextMenu = new IoOptionSelect({
  value: 0,
  option: new MenuOption({options: [
    {id: 'Zero', value: 0},
    {id: 'One', value: 1},
    {id: 'Two', value: 2},
    {id: 'Three', value: 3},
  ]})
});

document.body.appendChild(slider);
document.body.appendChild(contextMenu);
```

These are just a few examples. There is an extensive library of nodes and elements to choose from.

## Virtual DOM

Just like most modern frameworks, Io-Gui uses a virtual DOM to efficiently update the actual DOM tree.

Here, we can replicate the previous example using the `render()` function and virtual DOM constructors inside a custom element.

```typescript
import { IoElement, Register, span } from 'io-gui'
import { ioSlider } from 'io-sliders';
import { ioOptionSelect, MenuOption } from 'io-menus';

@Register
class MyElement extends IoElement {

  static get Style() {
    return /* css */`
      :host {
        display: inline-block;
        width: 160px;
      }
    `;
  }

  @ReactiveProperty(0)
  declare numberValue: number;

  declare menuOption: MenuOption;

  init() {
    // Create a MenuOption Node. It is a good practice to reuse nodes whenever possible.
    this.menuOption = new MenuOption({options: [
      {id: 'Zero', value: 0},
      {id: 'One', value: 1},
      {id: 'Two', value: 2},
      {id: 'Three', value: 3},
    ]})
  }

  ready() {
    this.changed();
  }

  changed() {
    this.render([
      ioSlider({value: this.bind('numberValue'), min: -3, max: 3, step: 1}),
      ioOptionSelect({
        value: this.bind('numberValue'),
        option: this.menuOption
      })
    ]);
  }

  onValueInput(event: CustomEvent) {
    this.numberValue = event.detail.value;
  }

  changed() {
    this.render([
      // Notice that, unlike constructors, vDOM factories start with lowercase "i"
      ioSlider({
        value: this.numberValue,
        min: -1,
        max: 3,
        step: 1,
        '@value-input': this.onValueInput,
      }),
      ioOptionSelect({
        value: this.numberValue,
        option: this.menuOption,
        '@value-input': this.onValueInput,
      })
    ]);
  }
}

document.body.appendChild(
  new MyElement()
)
```

In this example, we also introduced event listeners to update value on user input. Alternatively, you can achieve this using two-way data binding function `.bind()`. For example:

```typescript
ioOptionSelect({
  value: this.bind('numberValue'),
  option: this.menuOption,
})
```

Note that two-way data flow can introduce unexpected states in more complex scenarios, especially when used in conjunction with user input. Use binding only when implications od two-way data flow is completely understood and predictable.

To learn more read the [deep dive] guide.

[index.html]: https://github.com/io-gui/io/blob/main/index.html#L104
[deep dive]: https://iogui.dev/io/#path=Docs,Deep%20Dive