import { Register, IoElement, div, span } from 'io-gui';
import { MenuOptions } from 'io-menus';
import { ioNavigatorSelector, ioNavigatorScroller, ioSelector } from 'io-navigation';

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
  {value: 'devs', options: [
    {value: 'devs#dev1'},
    {value: 'devs#dev2'},
    {value: 'devs#dev3'},
    {value: 'devs#dev4'},
    {value: 'devs#dev5'},
    {value: 'devs#dev6'},
    {value: 'devs#dev7'},
  ]},
  {value: 'foos', options: [
    {value: 'foos#foo1'},
    {value: 'foos#foo2'},
    {value: 'foos#foo3'},
    {value: 'foos#foo4'},
    {value: 'foos#foo5'},
    {value: 'foos#foo6'},
    {value: 'foos#foo7'},
  ]},
  {value: 'bazs', options: [
    {value: 'bazs#baz1'},
    {value: 'bazs#baz2'},
    {value: 'bazs#baz3'},
    {value: 'bazs#baz4'},
    {value: 'bazs#baz5'},
    {value: 'bazs#baz6'},
    {value: 'bazs#baz7'},
  ]},
  {value: 'bars', options: [
    {value: 'bars#bar1'},
    {value: 'bars#bar2'},
    {value: 'bars#bar3'},
    {value: 'bars#bar4'},
    {value: 'bars#bar5'},
    {value: 'bars#bar6'},
    {value: 'bars#bar7'},
  ]},
]);
contentOptions[0].selected = true;
contentOptions[0].options[3].selected = true;

export class IoNavigationDemo extends IoElement {
  static get Style() {
    return /* css */`
      :host .row {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        overflow: hidden;
        margin-bottom: var(--io_spacing);
      }
      :host .row > *:not(:last-child) {
        margin-right: var(--io_spacing);
      }
    `;
  }
  static get ReactiveProperties() {
    return {
      string: 'Hello!',
      number: 1,
      boolean: true,
    };
  }
  init() {
    this.template([
      ioNavigatorScroller({
        menu: 'left',
        collapseWidth: 100,
        options: contentOptions[0].options,
        elements: [contentElements[0]]
      }),
      ioNavigatorSelector({
        menu: 'top',
        depth: 0,
        options: contentOptions,
        elements: contentElements
      }),
      ioSelector({
        elements: contentElements,
        options: contentOptions,
      }),
    ]);
  }
}
Register(IoNavigationDemo);
export const ioNavigationDemo = IoNavigationDemo.vConstructor;
