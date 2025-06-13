import { Register, IoElement, div, span } from 'io-gui';
import { MenuOptions } from 'io-menus';
import { ioNavigator, ioSelector } from 'io-navigation';

const contentElements = [
  div({id: 'devs', class: 'vertical'}, [
    span({id: 'dev1'}, 'io-dev 1'),
    span({id: 'dev2'}, 'io-dev 2'),
    span({id: 'dev3'}, 'io-dev 3'),
    span({id: 'dev4'}, 'io-dev 4'),
    span({id: 'dev5'}, 'io-dev 5'),
    span({id: 'dev6'}, 'io-dev 6'),
    span({id: 'dev7'}, 'io-dev 7'),
  ]),
  div({id: 'foos', class: 'vertical'}, [
    span({id: 'foo1'}, 'io-foo 1'),
    span({id: 'foo2'}, 'io-foo 2'),
    span({id: 'foo3'}, 'io-foo 3'),
    span({id: 'foo4'}, 'io-foo 4'),
    span({id: 'foo5'}, 'io-foo 5'),
    span({id: 'foo6'}, 'io-foo 6'),
    span({id: 'foo7'}, 'io-foo 7'),
  ]),
  div({id: 'bazs', class: 'vertical'}, [
    span({id: 'baz1'}, 'io-baz 1'),
    span({id: 'baz2'}, 'io-baz 2'),
    span({id: 'baz3'}, 'io-baz 3'),
    span({id: 'baz4'}, 'io-baz 4'),
    span({id: 'baz5'}, 'io-baz 5'),
    span({id: 'baz6'}, 'io-baz 6'),
    span({id: 'baz7'}, 'io-baz 7'),
  ]),
  div({id: 'bars', class: 'vertical'}, [
    span({id: 'bar1'}, 'io-bar 1'),
    span({id: 'bar2'}, 'io-bar 2'),
    span({id: 'bar3'}, 'io-bar 3'),
    span({id: 'bar4'}, 'io-bar 4'),
    span({id: 'bar5'}, 'io-bar 5'),
    span({id: 'bar6'}, 'io-bar 6'),
    span({id: 'bar7'}, 'io-bar 7'),
  ]),
];

const contentOptions = new MenuOptions().fromJSON([
  {id: 'devs', options: [
    {id: 'devs#dev1'},
    {id: 'devs#dev2'},
    {id: 'devs#dev3'},
    {id: 'devs#dev4'},
    {id: 'devs#dev5'},
    {id: 'devs#dev6'},
    {id: 'devs#dev7'},
  ]},
  {id: 'foos', options: [
    {id: 'foos#foo1'},
    {id: 'foos#foo2'},
    {id: 'foos#foo3'},
    {id: 'foos#foo4'},
    {id: 'foos#foo5'},
    {id: 'foos#foo6'},
    {id: 'foos#foo7'},
  ]},
  {id: 'bazs', options: [
    {id: 'bazs#baz1'},
    {id: 'bazs#baz2'},
    {id: 'bazs#baz3'},
    {id: 'bazs#baz4'},
    {id: 'bazs#baz5'},
    {id: 'bazs#baz6'},
    {id: 'bazs#baz7'},
  ]},
  {id: 'bars', options: [
    {id: 'bars#bar1'},
    {id: 'bars#bar2'},
    {id: 'bars#bar3'},
    {id: 'bars#bar4'},
    {id: 'bars#bar5'},
    {id: 'bars#bar6'},
    {id: 'bars#bar7'},
  ]},
]);
contentOptions[0].options[3].selected = true;

export class IoNavigationDemo extends IoElement {
  static get Style() {
    return /* css */`
      :host {}
    `;
  }
  static get ReactiveProperties() {
    return {
      string: 'Hello!',
      number: 1,
      boolean: true,
    };
  }
  ready() {
    this.render([
      ioNavigator({
        menu: 'left',
        options: contentOptions,
        elements: contentElements
      }),
      // ioSelector({
      //   elements: contentElements,
      //   options: contentOptions,
      // }),
    ]);
  }
}
Register(IoNavigationDemo);
export const ioNavigationDemo = IoNavigationDemo.vConstructor;
