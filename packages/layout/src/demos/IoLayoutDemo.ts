//@ts-nocheck
import { Register, ReactiveElement, div, h1, h4, p, Storage as $ } from '@io-gui/core'
import { ioLayout, Layout } from '@io-gui/layout'
import { ioCollapsible } from '@io-gui/navigation'
import { ioMarkdown } from '@io-gui/markdown'


const VERSION = 3

function lorem(length) {
  const words = 'Lorem ipsum dolor sit amet consectetur adipiscing elit Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'.split(' ')
  let lorem = ''
  for (let i = 0; i < length; i++) {
    lorem += words[Math.floor(Math.random() * words.length)] + ' '
  }
  return lorem
}

const defaultLayout = new Layout({
  child: {
    type: 'split',
    children: [
      {
        type: 'split',
        size: '350px',
        orientation: 'vertical',
        children: [
          {
            type: 'panel',
            size: '260px',
            tabs: [
              {id: 'Inputs', icon: 'io:inputs'},
              {id: 'Sliders', icon: 'io:sliders'},
              {id: 'Colors', icon: 'io:colors'},
            ],
          },
          {
            type: 'panel',
            tabs: [
              {id: 'Getting Started', icon: 'io:book'},
              {id: 'Deep Dive', icon: 'io:book'},
            ]
          }
        ],
      },
      {
        type: 'split',
        orientation: 'vertical',
        children: [
          {
            type: 'panel',
            tabs: [
              {id: 'Editors', icon: 'io:editors'}
            ]
          },
          {
            type: 'panel',
            size: '280px',
            tabs: [
              {id: 'Icons', icon: 'io:icons'}
            ]
          },
        ]
      },
      {
        type: 'panel',
        size: '330px',
        tabs: [
          {id: 'Theme Editor', icon: 'io:theme'}
        ],
      }
    ]
  },
})

const $layoutStorage = $({key: `io-layout-demo-${VERSION}`, storage: 'none', value: defaultLayout})

@Register
export class IoLayoutDemo extends ReactiveElement {
  static get Style() {
    return /* css */`
      :host {
        position: relative;
        display: flex;
        overflow: hidden;
        flex: 1 1 100%;
        align-self: stretch;
      }
      :host io-panel > io-selector > div {
        padding: var(--io_lineHeight);
      }
    `
  }
  ready() {
    this.render([
      ioLayout({
        elements: [
          {tag: 'io-inputs-demo', props: {id: 'Inputs', icon: 'io:inputs', import: './packages/inputs/dist/demos/IoInputsDemo.js'}},
          {tag: 'io-icons-demo', props: {id: 'Icons', icon: 'io:icons', import: './packages/icons/dist/demos/IoIconsDemo.js'}},
          {tag: 'io-sliders-demo', props: {id: 'Sliders', icon: 'io:sliders', import: './packages/sliders/dist/demos/IoSlidersDemo.js'}},
          {tag: 'io-colors-demo', props: {id: 'Colors', icon: 'io:colors', import: './packages/colors/dist/demos/IoColorsDemo.js'}},
          {tag: 'io-editors-demo', props: {id: 'Editors', icon: 'io:editors', import: './packages/editors/dist/demos/IoEditorsDemo.js'}},
          {tag: 'io-menus-demo', props: {id: 'Menus', icon: 'io:menus', import: './packages/menus/dist/demos/IoMenusDemo.js'}},
          {tag: 'io-navigation-demo', props: {id: 'Navigation', icon: 'io:navigation', import: './packages/navigation/dist/demos/IoNavigationDemo.js'}},
          {tag: 'io-theme-editor', props: {id: 'Theme Editor', icon: 'io:theme', import: './packages/core/dist/demos/IoThemeEditor.js'}},
          ioMarkdown({id: 'Getting Started', icon: 'io:book', strip: ['https://iogui.dev/io/'], sanitize: false, src: './docs/quick-start.md'}),
          ioMarkdown({id: 'Deep Dive', icon: 'io:book', strip: ['https://iogui.dev/io/'], sanitize: false, src: './docs/deep-dive.md'}),
          div({id: 'Doc 1', icon: 'io:book'}, [
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
          div({id: 'Doc 2', icon: 'io:book'}, [
            h1({'data-heading': 'Doc 2'}, 'Doc 2'),
            h4({'data-heading': 'Section 1'}, 'Section 1'), p(lorem(100)),
            h4({'data-heading': 'Section 2'}, 'Section 2'), p(lorem(100)),
            h4({'data-heading': 'Section 3'}, 'Section 3'), p(lorem(100)),
            h4({'data-heading': 'Section 4'}, 'Section 4'), p(lorem(100)),
            h4({'data-heading': 'Section 5'}, 'Section 5'), p(lorem(100)),
            h4({'data-heading': 'Section 6'}, 'Section 6'), p(lorem(100)),
            h4({'data-heading': 'Section 7'}, 'Section 7'), p(lorem(100)),
          ]),
          div({id: 'Doc 3', icon: 'io:book'}, [
            h1({'data-heading': 'Doc 3'}, 'Doc 3'),
            h4({'data-heading': 'Section 1'}, 'Section 1'), p(lorem(100)),
            h4({'data-heading': 'Section 2'}, 'Section 2'), p(lorem(100)),
            h4({'data-heading': 'Section 3'}, 'Section 3'), p(lorem(100)),
          ]),
          div({id: 'Doc 4', icon: 'io:book'}, [
            h1({'data-heading': 'Doc 4'}, 'Doc 4'),
            h4({'data-heading': 'Section 1'}, 'Section 1'), p(lorem(100)),
            h4({'data-heading': 'Section 2'}, 'Section 2'), p(lorem(100)),
            h4({'data-heading': 'Section 3'}, 'Section 3'), p(lorem(100)),
            h4({'data-heading': 'Section 4'}, 'Section 4'), p(lorem(100)),
            h4({'data-heading': 'Section 5'}, 'Section 5'), p(lorem(100)),
          ]),
        ],
        model: $layoutStorage
      })
    ])
  }
}

export const ioLayoutDemo = (arg0: any) => IoLayoutDemo.vConstructor(arg0)
