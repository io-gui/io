import { Register, IoElement, div, h1, h4, p, Storage as $ } from 'io-gui';
import { ioLayout, Split } from 'io-layout';
import { ioCollapsible } from 'io-navigation';
import { MenuItem } from 'io-menus';

function lorem(length) {
  const words = 'Lorem ipsum dolor sit amet consectetur adipiscing elit Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'.split(' ');
  let lorem = '';
  for (let i = 0; i < length; i++) {
    lorem += words[Math.floor(Math.random() * words.length)] + ' ';
  }
  return lorem;
}

const split = new Split({
  children: [
    {
      tabs: [{id: 'Doc 1'},{id: 'Doc 2'},{id: 'Doc 3'}],
    },
    {
      orientation: 'vertical',
      children: [
        {tabs: [{id: 'Doc 2', label: 'Doc 2'}]},
        {tabs: [{id: 'Doc 3', label: 'Doc 3', icon: 'io:numeric-3-box'}]},
        {tabs: [{id: 'Doc 3', label: 'Doc 3', icon: 'io:numeric-3-box'}]},
        {tabs: [{id: 'Doc 3', label: 'Doc 3', icon: 'io:numeric-3-box'}]},
      ]
    },
    {
      tabs: [{id: 'Doc 4', label: 'Doc 4', icon: 'io:numeric-4-box'}],
    }
  ]
});

export class IoLayoutDemo extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        position: relative;
        display: flex;
        overflow: hidden;
        flex: 1 1 100%;
        align-self: stretch;
      }
      :host io-layout {
        flex: 1 1 100%;
      }
      :host io-panel > io-selector > * {
        padding: var(--io_lineHeight);
      }
    `;
  }
  ready() {
    this.render([
      ioLayout({
        elements: [
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
          div({id: 'Doc 2', icon: 'io:numeric-2-box'}, [
            h1({'data-heading': 'Doc 2'}, 'Doc 2'),
            h4({'data-heading': 'Section 1'}, 'Section 1'), p(lorem(100)),
            h4({'data-heading': 'Section 2'}, 'Section 2'), p(lorem(100)),
            h4({'data-heading': 'Section 3'}, 'Section 3'), p(lorem(100)),
            h4({'data-heading': 'Section 4'}, 'Section 4'), p(lorem(100)),
            h4({'data-heading': 'Section 5'}, 'Section 5'), p(lorem(100)),
            h4({'data-heading': 'Section 6'}, 'Section 6'), p(lorem(100)),
            h4({'data-heading': 'Section 7'}, 'Section 7'), p(lorem(100)),
          ]),
          div({id: 'Doc 3', icon: 'io:numeric-3-box'}, [
            h1({'data-heading': 'Doc 3'}, 'Doc 3'),
            h4({'data-heading': 'Section 1'}, 'Section 1'), p(lorem(100)),
            h4({'data-heading': 'Section 2'}, 'Section 2'), p(lorem(100)),
            h4({'data-heading': 'Section 3'}, 'Section 3'), p(lorem(100)),
          ]),
          div({id: 'Doc 4', icon: 'io:numeric-4-box'}, [
            h1({'data-heading': 'Doc 4'}, 'Doc 4'),
            h4({'data-heading': 'Section 1'}, 'Section 1'), p(lorem(100)),
            h4({'data-heading': 'Section 2'}, 'Section 2'), p(lorem(100)),
            h4({'data-heading': 'Section 3'}, 'Section 3'), p(lorem(100)),
            h4({'data-heading': 'Section 4'}, 'Section 4'), p(lorem(100)),
            h4({'data-heading': 'Section 5'}, 'Section 5'), p(lorem(100)),
          ]),
        ],
        addMenuItem:  new MenuItem().fromJSON({
          mode: 'none',
          options: [
            {id: 'Doc 1', mode: 'none'},
            {id: 'Doc 2', mode: 'none'},
            {id: 'Doc 3', mode: 'none'},
            {id: 'Doc 4', mode: 'none'},
            {label: 'Sub Options', mode: 'none', options: [
              {id: 'Doc 1', icon: 'io:numeric-1-box', mode: 'none'},
              {id: 'Doc 2', icon: 'io:numeric-2-box', mode: 'none'},
              {id: 'Doc 3', icon: 'io:numeric-3-box', mode: 'none'},
              {id: 'Doc 4', icon: 'io:numeric-4-box', mode: 'none'},
            ]},
          ],
        }),
        split: $({key: 'split', storage: 'local', value: split})
      })
    ]);
  }
}
Register(IoLayoutDemo);
export const ioLayoutDemo = IoLayoutDemo.vConstructor;
