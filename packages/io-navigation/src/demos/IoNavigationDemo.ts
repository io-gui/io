//@ts-nocheck
import { Register, IoElement, div, p, h1, h4 } from 'io-core'
import { MenuOption } from 'io-menus'
import { ioNavigator, ioSelector, ioCollapsible } from 'io-navigation'

function lorem(length) {
  const words = 'Lorem ipsum dolor sit amet consectetur adipiscing elit Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'.split(' ')
  let lorem = ''
  for (let i = 0; i < length; i++) {
    lorem += words[Math.floor(Math.random() * words.length)] + ' '
  }
  return lorem
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
]

const contentOption = new MenuOption({options:[
  {id: 'Doc 1', options: [
    {label: 'Section 1', id: 'Doc 1#Section 1'},
    {label: 'Section 2', id: 'Doc 1#Section 2'},
    {label: 'Section 3', id: 'Doc 1#Section 3'},
    {label: 'Section 4', id: 'Doc 1#Section 4'},
    {label: 'Section 4.1', id: 'Doc 1#Section 4.1'},
  ]},
  {id: 'Doc 2', options: [
    {label: 'Section 1', id: 'Doc 2#Section 1'},
    {label: 'Section 2', id: 'Doc 2#Section 2'},
    {label: 'Section 3', id: 'Doc 2#Section 3'},
    {label: 'Section 4', id: 'Doc 2#Section 4'},
    {label: 'Section 5', id: 'Doc 2#Section 5'},
    {label: 'Section 6', id: 'Doc 2#Section 6'},
    {label: 'Section 7', id: 'Doc 2#Section 7'},
  ]},
  {id: 'Doc 3', options: [
    {label: 'Section 1', id: 'Doc 3#Section 1'},
    {label: 'Section 2', id: 'Doc 3#Section 2'},
    {label: 'Section 3', id: 'Doc 3#Section 3'},
  ]},
  {id: 'Doc 4', options: [
    {label: 'Section 1', id: 'Doc 4#Section 1'},
    {label: 'Section 2', id: 'Doc 4#Section 2'},
    {label: 'Section 3', id: 'Doc 4#Section 3'},
    {label: 'Section 4', id: 'Doc 4#Section 4'},
    {label: 'Section 5', id: 'Doc 4#Section 5'},
  ]},
]})
contentOption.options[0].options[3].selected = true

export class IoNavigationDemo extends IoElement {
  static get Style() {
    return /* css */`
      :host p {
        padding: 0.5em 1em;
      }
      :host div[id] {
        padding: 0.5em 1em;
      }
      :host io-navigator,
      :host io-selector {
        max-height: 200px;
      }
    `
  }
  ready() {
    this.render([
      ioNavigator({
        menu: 'left',
        option: contentOption,
        elements: contentElements,
        select: 'deep',
        anchor: contentOption.bind('selectedID'),
      }),
      div({style: {display: 'flex'}}, [
        ioSelector({
          style: {'flex-basis': '50%'},
          elements: contentElements,
          selected: contentOption.bind('selectedID'),
          anchor: contentOption.bind('selectedID'),
        }),
        ioNavigator({
          style: {'flex-basis': '50%'},
          menu: 'top',
          option: contentOption,
          elements: contentElements,
          anchor: contentOption.bind('selectedID'),
        }),
      ])
    ])
  }
}
Register(IoNavigationDemo)
export const ioNavigationDemo = IoNavigationDemo.vConstructor
