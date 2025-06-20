import { Register, IoElement, div, h1, h4, p } from 'io-gui';
import { ioPanel } from 'io-layout';
import { ioCollapsible } from 'io-navigation';
import { MenuOptions } from 'io-menus';

function lorem(length) {
  const words = 'Lorem ipsum dolor sit amet consectetur adipiscing elit Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'.split(' ');
  let lorem = '';
  for (let i = 0; i < length; i++) {
    lorem += words[Math.floor(Math.random() * words.length)] + ' ';
  }
  return lorem;
}

const contentElements = [
  div({id: 'Doc 1'}, [
    h1({'data-heading': 'Doc 1'}, 'Doc 1'),
    h4({'data-heading': 'Section 1'}, 'Section 1'), p(lorem(100)),
    h4({'data-heading': 'Section 2'}, 'Section 2'), p(lorem(100)),
    h4({'data-heading': 'Section 3'}, 'Section 3'), p(lorem(100)),
    div([
      h4({'data-heading': 'Section 4'}, 'Section 4'),
      p(lorem(10)),
      ioCollapsible({
        expanded: true,
        'data-heading': 'Section 4.1',
        label: 'Sub Section 4.1',
        elements: [p(lorem(100))],
      })
    ])
  ]),
  div({id: 'Doc 2'}, [
    h1({'data-heading': 'Doc 2'}, 'Doc 2'),
    h4({'data-heading': 'Section 1'}, 'Section 1'), p(lorem(100)),
    h4({'data-heading': 'Section 2'}, 'Section 2'), p(lorem(100)),
    h4({'data-heading': 'Section 3'}, 'Section 3'), p(lorem(100)),
    h4({'data-heading': 'Section 4'}, 'Section 4'), p(lorem(100)),
    h4({'data-heading': 'Section 5'}, 'Section 5'), p(lorem(100)),
    h4({'data-heading': 'Section 6'}, 'Section 6'), p(lorem(100)),
    h4({'data-heading': 'Section 7'}, 'Section 7'), p(lorem(100)),
  ]),
  div({id: 'Doc 3'}, [
    h1({'data-heading': 'Doc 3'}, 'Doc 3'),
    h4({'data-heading': 'Section 1'}, 'Section 1'), p(lorem(100)),
    h4({'data-heading': 'Section 2'}, 'Section 2'), p(lorem(100)),
    h4({'data-heading': 'Section 3'}, 'Section 3'), p(lorem(100)),
  ]),
  div({id: 'Doc 4'}, [
    h1({'data-heading': 'Doc 4'}, 'Doc 4'),
    h4({'data-heading': 'Section 1'}, 'Section 1'), p(lorem(100)),
    h4({'data-heading': 'Section 2'}, 'Section 2'), p(lorem(100)),
    h4({'data-heading': 'Section 3'}, 'Section 3'), p(lorem(100)),
    h4({'data-heading': 'Section 4'}, 'Section 4'), p(lorem(100)),
    h4({'data-heading': 'Section 5'}, 'Section 5'), p(lorem(100)),
  ]),
];

export class IoLayoutDemo extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        overflow: hidden;
      }
      :host > io-panel > io-selector {
        padding: var(--io_lineHeight);
      }
    `;
  }
  ready() {
    this.render([
      ioPanel({
        tabs: new MenuOptions({items: [
          {id: 'Doc 1', icon: 'io:numeric-1-box', selected: true},
          {id: 'Doc 2'},
          {id: 'Doc 3'},
        ]}),
        elements: contentElements,
      })
    ]);
  }
}
Register(IoLayoutDemo);
export const ioLayoutDemo = IoLayoutDemo.vConstructor;
