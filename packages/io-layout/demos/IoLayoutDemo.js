import { Register, IoElement, div, h1, h4, p, Storage as $ } from 'io-gui';
import { ioLayout, Split } from 'io-layout';
import { ioCollapsible } from 'io-navigation';
import { ioMarkdown } from 'io-markdown';
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
      orientation: 'vertical',
      children: [
        {
          tabs: [
            {id: 'Inputs', icon: 'io:toggle_on'},
            {id: 'Sliders', icon: 'io:sliders'},
            {id: 'Colors', icon: 'io:color_palette'},
          ],
        },
        {
          tabs: [
            {id: 'Getting Started'},
            {id: 'Deep Dive'},
          ]
        }
      ],
      flex: '0 0 350px',
    },
    {
      orientation: 'vertical',
      children: [
        {tabs: [{id: 'Change Visualization', icon: 'io:hub'}]},
        {tabs: [{id: 'Editors', icon: 'io:developer'}]},
        {tabs: [{id: 'Icons', icon: 'io:image'}], flex: '1 1 50%'},
      ]
    },
    {
      tabs: [{id: 'Theme Editor', icon: 'io:tune'}],
      flex: '0 0 350px',
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
      :host io-panel > io-selector > div {
        padding: var(--io_lineHeight);
      }
    `;
  }
  ready() {
    this.render([
      ioLayout({
        elements: [
          {tag: 'io-inputs-demo', props: {id: 'Inputs', import: './packages/io-inputs/demos/IoInputsDemo.js'}},
          {tag: 'io-icons-demo', props: {id: 'Icons', import: './packages/io-icons/demos/IoIconsDemo.js'}},
          {tag: 'io-sliders-demo', props: {id: 'Sliders', import: './packages/io-sliders/demos/IoSlidersDemo.js'}},
          {tag: 'io-colors-demo', props: {id: 'Colors', import: './packages/io-colors/demos/IoColorsDemo.js'}},
          {tag: 'io-editors-demo', props: {id: 'Editors', import: './packages/io-editors/demos/IoEditorsDemo.js'}},
          {tag: 'io-menus-demo', props: {id: 'Menus', import: './packages/io-menus/demos/IoMenusDemo.js'}},
          {tag: 'io-navigation-demo', props: {id: 'Navigation', import: './packages/io-navigation/demos/IoNavigationDemo.js'}},
          {tag: 'io-theme-editor', props: {id: 'Theme Editor', import: './packages/io-gui/demos/IoThemeEditor.js'}},
          {tag: 'io-element-inspector-demo', props: {id: 'Element Inspector', import: './packages/io-gui/demos/IoElementInspectorDemo.js'}},
          {tag: 'io-change-visualization', props: {id: 'Change Visualization', import: './packages/io-gui/demos/IoChangeVisualization.js'}},
          ioMarkdown({id: 'Getting Started', strip: ['https://iogui.dev/io/'], sanitize: false, src: './docs/quick-start.md'}),
          ioMarkdown({id: 'Deep Dive', strip: ['https://iogui.dev/io/'], sanitize: false, src: './docs/deep-dive.md'}),
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
            {label: 'Docs', mode: 'none', options: [
              {id: 'Doc 1', icon: 'io:numeric-1-box', mode: 'none'},
              {id: 'Doc 2', icon: 'io:numeric-2-box', mode: 'none'},
              {id: 'Doc 3', icon: 'io:numeric-3-box', mode: 'none'},
              {id: 'Doc 4', icon: 'io:numeric-4-box', mode: 'none'},
            ]},
            {label: 'Demos', mode: 'none', options: [
              {id: 'Inputs', mode: 'none', icon: 'io:toggle_on'},
              {id: 'Icons', mode: 'none', icon: 'io:image'},
              {id: 'Sliders', mode: 'none', icon: 'io:sliders'},
              {id: 'Colors', mode: 'none', icon: 'io:color_palette'},
              {id: 'Editors', mode: 'none', icon: 'io:developer'},
              {id: 'Menus', mode: 'none', icon: 'io:hamburger'},
              {id: 'Navigation', mode: 'none', icon: 'io:dashboard'},
              {id: 'Theme Editor', icon: 'io:tune', mode: 'none'},
              {id: 'Element Inspector', icon: 'io:visibility', mode: 'none'},
              {id: 'Change Visualization', icon: 'io:hub', mode: 'none'},
            ]},
          ],
        }),
        // split: split,
        split: $({key: 'split', storage: 'local', value: split})
      })
    ]);
  }
}
Register(IoLayoutDemo);
export const ioLayoutDemo = IoLayoutDemo.vConstructor;
