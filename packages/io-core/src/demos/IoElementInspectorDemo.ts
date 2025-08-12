//@ts-nocheck
import { Register, IoElement, div, Storage as $, pre, code } from 'io-core';
import { ioInspector } from 'io-editors';
import { ioField, ioNumber, ioString, ioBoolean, ioSwitch, ioButton } from 'io-inputs';
import { ioSlider, ioSliderRange, ioSlider2d, ioNumberSlider, ioNumberSliderRange } from 'io-sliders';
import { ioIcon } from 'io-icons';
import { ioOptionSelect, MenuOption } from 'io-menus';
import { ioColorRgba, ioColorSlider, ioColorSwatch, ioColorPicker } from 'io-colors';
import { ioStyleContainer } from './IoStyleContainer.js';

// TODO: Implement IDs in menu options. use ID for selection
const option = new MenuOption({
  options: [{
    id: 'native',
    options: [
      {id: 'div', value: div('div content')},
    ]
  }, {
    id: 'io-icons',
    options: [
      {id: 'io-icon:check', value: ioIcon({value: 'io:check'})},
      {id: 'io-icon:close', value: ioIcon({value: 'io:close'})},
      {id: 'io-icon:circle', value: ioIcon({value: 'io:circle'})},
    ]
  }, {
    id: 'io-inputs',
    options: [
      {id: 'io-boolean', value: ioBoolean()},
      {id: 'io-button', value: ioButton({label: 'Button'})},
      {id: 'io-number', value: ioNumber()},
      {id: 'io-string', value: ioString()},
      {id: 'io-switch', value: ioSwitch()},
    ]
  }, {
    id: 'io-sliders',
    options: [
      {id: 'io-number-slider', value: ioNumberSlider()},
      {id: 'io-number-slider-range', value: ioNumberSliderRange()},
      {id: 'io-slider', value: ioSlider()},
      {id: 'io-slider-2d', value: ioSlider2d()},
      {id: 'io-slider-range', value: ioSliderRange()},
    ]
  }, {
    id: 'io-colors',
    options: [
      {id: 'io-color-rgba', value: ioColorRgba()},
      {id: 'io-color-slider:r', value: ioColorSlider({channel: 'r'})},
      {id: 'io-color-slider:g', value: ioColorSlider({channel: 'g'})},
      {id: 'io-color-slider:b', value: ioColorSlider({channel: 'b'})},
      {id: 'io-color-slider:sv', value: ioColorSlider({channel: 'sv'})},
      {id: 'io-color-swatch', value: ioColorSwatch()},
      {id: 'io-color-picker', value: ioColorPicker()},
    ]
  }],
  selectedID: $({key: 'element-demo', storage: 'local', value: 'io-slider'})
});

export class IoElementInspectorDemo extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex: 0 1 auto;
      min-width: 350px;
      max-width: 500px;
      flex-direction: column;
      align-self: flex-start;
      background-color: var(--io_bgColorStrong);
      padding: var(--io_spacing3);
    }
    :host > io-option-select {
      margin-bottom: var(--io_spacing2);
    }
    :host > .element-wrap {
      border: var(--io_border);
      border-color: var(--io_borderColorStrong);
      background-color: var(--io_bgColorLight);
      padding: var(--io_spacing3);
    }
    :host > pre > #element-html {
      overflow-x: auto;
      scrollbar-width: none;
      font-size: 0.65em !important;
    }
    :host > io-property-editor {
      border: var(--io_border);
      border-color: var(--io_borderColorStrong);
      background-color: var(--io_bgColorLight);
      border-top: none;
      padding: 0 var(--io_spacing2);
    }
    :host io-property-editor > div.row {
      border-bottom: var(--io_border);
      padding: var(--io_spacing2) 0;
    }
    :host io-property-editor > div.row:last-child {
      border-bottom: none;
    }
    :host io-property-editor > div.row > span {
      width: 130px;
      text-align: right;
    }
    :host io-property-editor > div.row > io-number {
      min-width: 60px;
    }
    :host io-property-editor > div.row > io-string {
      min-width: 120px;
    }
    :host code {
      color: var(--io_color);
    }
    `;
  }
  static get ReactiveProperties() {
    return {
      selected: option.bind('selectedID'),
    };
  }
  ready() {
    this.selectedChanged();
  }
  onElementMutated() {
    this.selectedChanged();
  }
  selectedChanged() {
    const oldElement = this.querySelector('.element-wrap')?.children[0];
    if (oldElement) oldElement.removeEventListener('io-object-mutation', this.onElementMutated);

    if (this.selected) {
      const vElement = option.findItemById(this.selected).value;
      this.render([
        ioOptionSelect({
          value: this.bind('selected'),
          option: option,
          selectBy: 'id'
        }),
        div({class: 'element-wrap'}, [vElement]),
        pre([
          code({id: 'element-html', style: {display: 'block', whiteSpace: 'pre-wrap'}}),
        ]),
        ioStyleContainer([
          ioInspector({id: 'inspector'}),
        ]),
      ]);
      const element = this.querySelector('.element-wrap').children[0];
      element.addEventListener('io-object-mutation', this.onElementMutated);
      const inspector = this.$['inspector'];
      if (inspector.value !== element) {
        inspector.value = element;
      }
      const elementHtml = this.$['element-html'];
      elementHtml.innerHTML = formatHtml(element.outerHTML);
    } else {
      this.render([
        ioField({value: 'Element property not set.'}),
      ]);
    }
  }
}
Register(IoElementInspectorDemo);

function formatHtml(html, indentSize = 2) {
  const indent = ' '.repeat(indentSize);
  let result = '';
  let level = 0;
  const cleanHtml = html.replace(/>\s+</g, '><');
  const tokens = cleanHtml.split(/(<[^>]*>)/);
  tokens.forEach(token => {
    if (token.trim()) {
      if (token.startsWith('</')) {
        level--;
        result += indent.repeat(level) + token + '\n';
      } else if (token.startsWith('<') && !token.endsWith('/>')) {
        result += indent.repeat(level) + token + '\n';
        level++;
      } else if (token.startsWith('<') && token.endsWith('/>')) {
        result += indent.repeat(level) + token + '\n';
      } else {
        result += indent.repeat(level) + token.trim() + '\n';
      }
    }
  });
  return result.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export const ioElementInspectorDemo = IoElementInspectorDemo.vConstructor;
