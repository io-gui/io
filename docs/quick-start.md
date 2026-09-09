# Usage

Io-Gui is incrementally adoptable. You can use its core classes `ReactiveObject` and `ReactiveElement` to create your own objects and elements, build anything from a simple website to an app, or you can import and use one of its objects and elements in your own architecture.

Both base classes share one reactive graph, so plain data models and custom elements propagate changes, mutations, and events through the same system — across the object/element boundary, not just down the DOM tree. The [deep dive] covers this cross-domain reactivity in detail.

To quickly import Io-Gui and get started, continue reading this article.

## Making an Element

Here is a basic example of a reactive element `<my-element>` with style declaration and a `message` property. Use "@" decorator syntax to register the element (`@Register`), define reactive properties (`@Property`) and non-reactive fields (`@Field`).

```javascript
import { ReactiveElement, Register, Property, Field, span } from 'io-core'

@Register
class MyElement extends ReactiveElement {
  static get Style() {
    return /* css */`
      :host {
        display: inline-block;
      }
    `;
  }

  @Field('hello')
  declare greeting: string;

  @Property('world')
  declare message: string;

  ready() {
    this.mutated();
  }

  mutated() {
    this.render([
      span(`${this.greeting} ${this.message}`)
    ]);
  }
}

document.body.appendChild(
  new MyElement({message: 'Hello World'})
)
```

## Making a Website

Here is a quick way to make a simple static website with navigation and 5 pages that load contents from .md files. 

```javascript
import { IoNavigator } from 'io-navigation'
import { MenuOption } from 'io-menus'
import { Storage } from 'io-core'
import { ioMarkdown } from 'io-markdown'

document.body.appendChild(
  new IoNavigator({
    menu: 'top',
    option: new MenuOption({
      options: ['About', 'Products', 'Services', 'Testimonials', 'Contact'],
      path: Storage({storage: 'hash', key: 'page', value: 'About'})
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
const optionSelect = new IoOptionSelect({
  value: 0,
  option: new MenuOption({options: [
    {id: 'Zero', value: 0},
    {id: 'One', value: 1},
    {id: 'Two', value: 2},
    {id: 'Three', value: 3},
  ]})
});

document.body.appendChild(slider);
document.body.appendChild(optionSelect);
```

These are just a few examples. There is an extensive library of objects and elements to choose from.

## Virtual DOM

Just like most modern frameworks, Io-Gui uses a virtual DOM to efficiently update the actual DOM tree.

Here, we can replicate the previous example using the `render()` function and virtual DOM constructors inside a custom element.

```typescript
import { ReactiveElement, Register, Property, span } from 'io-core'
import { ioSlider } from 'io-sliders'
import { ioOptionSelect, MenuOption } from 'io-menus'

class MyElement extends ReactiveElement {

  static get Style() {
    return /* css */`
      :host {
        display: inline-block;
        width: 160px;
      }
    `;
  }

  @Property({type: Number, value: 0})
  declare numberValue: number

  @Property({type: MenuOption, value: new MenuOption({options: [
    {id: 'Zero', value: 0},
    {id: 'One', value: 1},
    {id: 'Two', value: 2},
    {id: 'Three', value: 3},
  ]})})
  declare menuOption: MenuOption

  ready() {
    this.mutated()
  }

  onValueInput(event) {
    this.numberValue = event.detail.value
  }

  mutated() {
    this.render([
      // Notice that, unlike constructors, vDOM factories start with lowercase "i"
      ioSlider({value: this.numberValue, min: -3, max: 3, step: 1, '@value-input': this.onValueInput}),
      ioOptionSelect({
        value: this.numberValue,
        option: this.menuOption,
        '@value-input': this.onValueInput,
      })
    ])
  }
}
Register(MyElement)

document.body.appendChild(
  new MyElement()
)
```

In the example above, we also introduced event listeners to update value on user input. Alternatively, you can achieve this using two-way data binding function `.bind()`. For example:

```typescript
ioOptionSelect({
  value: this.bind('numberValue'),
  option: this.menuOption,
})
```

Note that two-way data flow can introduce unexpected states in more complex scenarios, especially when used in conjunction with user input and multiple binding targets. Use binding only when implications of two-way data flow is completely understood and predictable.

To learn more read the [deep dive] guide.

[index.html]: https://github.com/io-gui/io/blob/main/index.html
[deep dive]: https://iogui.dev/io/#path=Docs,Deep%20Dive