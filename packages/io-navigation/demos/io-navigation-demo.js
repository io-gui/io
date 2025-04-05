import { Register, IoElement } from 'io-gui';
import { MenuOptions } from 'io-menus';
import 'io-navigation';

const contentElements = [
  ['div', {id: 'devs', class: 'vertical'}, [
    ['span', {id: 'dev1'}, 'io-dev 1'],
    ['span', {id: 'dev2'}, 'io-dev 2'],
    ['span', {id: 'dev3'}, 'io-dev 3'],
    ['span', {id: 'dev4'}, 'io-dev 4'],
    ['span', {id: 'dev5'}, 'io-dev 5'],
    ['span', {id: 'dev6'}, 'io-dev 6'],
    ['span', {id: 'dev7'}, 'io-dev 7'],
  ]],
  ['div', {id: 'foos', class: 'vertical'}, [
    ['span', {id: 'foo1'}, 'io-foo 1'],
    ['span', {id: 'foo2'}, 'io-foo 2'],
    ['span', {id: 'foo3'}, 'io-foo 3'],
    ['span', {id: 'foo4'}, 'io-foo 4'],
    ['span', {id: 'foo5'}, 'io-foo 5'],
    ['span', {id: 'foo6'}, 'io-foo 6'],
    ['span', {id: 'foo7'}, 'io-foo 7'],
  ]],
  ['div', {id: 'bazs', class: 'vertical'}, [
    ['span', {id: 'baz1'}, 'io-baz 1'],
    ['span', {id: 'baz2'}, 'io-baz 2'],
    ['span', {id: 'baz3'}, 'io-baz 3'],
    ['span', {id: 'baz4'}, 'io-baz 4'],
    ['span', {id: 'baz5'}, 'io-baz 5'],
    ['span', {id: 'baz6'}, 'io-baz 6'],
    ['span', {id: 'baz7'}, 'io-baz 7'],
  ]],
  ['div', {id: 'bars', class: 'vertical'}, [
    ['span', {id: 'bar1'}, 'io-bar 1'],
    ['span', {id: 'bar2'}, 'io-bar 2'],
    ['span', {id: 'bar3'}, 'io-bar 3'],
    ['span', {id: 'bar4'}, 'io-bar 4'],
    ['span', {id: 'bar5'}, 'io-bar 5'],
    ['span', {id: 'bar6'}, 'io-bar 6'],
    ['span', {id: 'bar7'}, 'io-bar 7'],
  ]],
];

const contentOptions = new MenuOptions([
  {value: 'devs', options: [
    {value: 'dev1', mode: 'scroll'},
    {value: 'dev2', mode: 'scroll'},
    {value: 'dev3', mode: 'scroll'},
    {value: 'dev4', mode: 'scroll'},
    {value: 'dev5', mode: 'scroll'},
    {value: 'dev6', mode: 'scroll'},
    {value: 'dev7', mode: 'scroll'},
  ]},
  {value: 'foos', options: [
    {value: 'foo1', mode: 'scroll'},
    {value: 'foo2', mode: 'scroll'},
    {value: 'foo3', mode: 'scroll'},
    {value: 'foo4', mode: 'scroll'},
    {value: 'foo5', mode: 'scroll'},
    {value: 'foo6', mode: 'scroll'},
    {value: 'foo7', mode: 'scroll'},
  ]},
  {value: 'bazs', options: [
    {value: 'baz1', mode: 'scroll'},
    {value: 'baz2', mode: 'scroll'},
    {value: 'baz3', mode: 'scroll'},
    {value: 'baz4', mode: 'scroll'},
    {value: 'baz5', mode: 'scroll'},
    {value: 'baz6', mode: 'scroll'},
    {value: 'baz7', mode: 'scroll'},
  ]},
  {value: 'bars', options: [
    {value: 'bar1', mode: 'scroll'},
    {value: 'bar2', mode: 'scroll'},
    {value: 'bar3', mode: 'scroll'},
    {value: 'bar4', mode: 'scroll'},
    {value: 'bar5', mode: 'scroll'},
    {value: 'bar6', mode: 'scroll'},
    {value: 'bar7', mode: 'scroll'},
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
  static get Properties() {
    return {
      string: 'Hello!',
      number: 1,
      boolean: true,
    };
  }
  init() {
    this.template([
      ['io-navigator-scroller', {
        menu: 'left',
        collapseWidth: 100,
        options: contentOptions[0].options,
        elements: [contentElements[0]]
      }],
      ['io-navigator-selector', {
        menu: 'top',
        depth: 0,
        options: contentOptions,
        elements: contentElements
      }],
      ['io-selector', {
        elements: contentElements,
        options: contentOptions,
      }]
    ]);
  }
}
Register(IoNavigationDemo);
export const ioNavigationDemo = IoNavigationDemo.vConstructor;
