import { IoElement, IoGl, Theme, Color, AnyConstructor, VDOMElement, Node } from 'io-gui';
import { MenuOptions, ioOptionMenu } from 'io-menus';
import { ioNumberSlider } from 'io-sliders';
import { ioColorRgba } from 'io-colors';
import { ioVector } from '../elements/IoVector';
import { ioString, ioNumber, ioSwitch, ioInputBase, ioField } from 'io-inputs';
import { ioObject } from '../elements/IoObject';

type PropertyIdentifier = AnyConstructor | string | null | undefined;
export type PropertyConfig = [PropertyIdentifier, VDOMElement];
export type PropertyConfigMap = Map<PropertyIdentifier, VDOMElement>;
export type PropertyConfigRecord = Record<string, VDOMElement>;
export type EditorConfig = Map<AnyConstructor, PropertyConfig[]>

const editorConfigSingleton: EditorConfig = new Map<AnyConstructor, PropertyConfig[]>([
  [Object, [
    [String, ioString()],
    [Number, ioNumber({step: 0.01})],
    [Boolean, ioSwitch()],
    [Object, ioObject()],
    [null, ioInputBase()],
    [undefined, ioInputBase()],
  ]],
  [Array, [
    [Number, ioNumber({step: 0.01})],
  ]],
  [Node, [
    ['reactivity', ioOptionMenu({options: new MenuOptions().fromJSON([
      'none', 'debounced', 'immediate',
    ])})],
  ]],
  [IoElement, [
    ['reactivity', ioOptionMenu({options: new MenuOptions().fromJSON([
      'none', 'debounced', 'immediate',
    ])})],
    ['tabindex', ioOptionMenu({options: new MenuOptions().fromJSON([
      {value: '', label: 'none'}, '-1', '0', '1', '2', '3',
    ])})],
    ['role', ioOptionMenu({options: new MenuOptions().fromJSON([
      'alert','alertdialog','application','article','banner','button','cell','checkbox','columnheader','combobox','complementary',
      'contentinfo','definition','dialog','directory','document','feed','figure','form','grid','gridcell','group','heading','img',
      'link','list','listbox','listitem','log','main','marquee','math','menu','menubar','menuitem','menuitemcheckbox','menuitemradio',
      'navigation','none','note','option','presentation','progressbar','radio','radiogroup','region','row','rowgroup','rowheader',
      'scrollbar','search','searchbox','separator','slider','spinbutton','status','switch','tab','table','tablist','tabpanel','term',
      'textbox','timer','toolbar','tooltip','tree','treegrid','treeitem',
    ])})],
  ]],
  [IoGl, [
    ['size', ioVector({step: 1})],
    ['color', ioVector({step: 1})],
    ['pxRatio', ioNumber({step: 0.0001})],
  ]],
  [Theme, [
    [Number, ioNumberSlider({step: 1, min: 0, max: 20})],
    ['themeID', ioOptionMenu({options: new MenuOptions().fromJSON([
      'light',
      'dark',
    ])})],
    ['spacing2', ioField({disabled: true})],
    ['spacing3', ioField({disabled: true})],
    ['spacing5', ioField({disabled: true})],
    ['spacing8', ioField({disabled: true})],
    ['fieldHeight', ioField({disabled: true})],
    ['fieldHeight2', ioField({disabled: true})],
    ['fieldHeight3', ioField({disabled: true})],
    ['fieldHeight4', ioField({disabled: true})],
    ['fieldHeight5', ioField({disabled: true})],
    ['fieldHeight6', ioField({disabled: true})],
    ['fieldHeight7', ioField({disabled: true})],
    ['fieldHeight8', ioField({disabled: true})],
    ['fieldHeight9', ioField({disabled: true})],
    ['fieldHeight10', ioField({disabled: true})],
    ['fieldHeight11', ioField({disabled: true})],
    ['fieldHeight12', ioField({disabled: true})],
    ['borderRadius2', ioField({disabled: true})],
    [Color, ioColorRgba()],
  ]]
]);

export function getEditorConfig(object: object, editorConfig: EditorConfig = new Map()): PropertyConfigRecord {
  debug: if (!object || !(object instanceof Object)) {
    console.warn('`getObjectConfig` should be used with an Object instance');
    return {};
  }

  const aggregatedConfig: PropertyConfigMap = new Map();
  for (const [constructorKey, propertyTypes] of editorConfigSingleton) {
    if (object instanceof constructorKey) {
      for (const [PropertyIdentifier, config] of propertyTypes) {
        aggregatedConfig.set(PropertyIdentifier, config);
      }
    }
  }

  for (const [constructorKey, propertyTypes] of editorConfig) {
    if (object instanceof constructorKey) {
      for (const [PropertyIdentifier, config] of propertyTypes) {
        aggregatedConfig.set(PropertyIdentifier, config);
      }
    }
  }

  const configRecord: PropertyConfigRecord = {};
  for (const [key, value] of Object.entries(object)) {
    for (const [PropertyIdentifier, elementCandidate] of aggregatedConfig) {
      let element: VDOMElement | undefined;
      if (typeof PropertyIdentifier === 'function' && value instanceof PropertyIdentifier) {
        element = elementCandidate;
      } else if (typeof PropertyIdentifier === 'function' && value?.constructor === PropertyIdentifier) {
        element = elementCandidate;
      } else if (typeof PropertyIdentifier === 'string' && key === PropertyIdentifier) {
        element = elementCandidate;
      } else if (PropertyIdentifier === null && value === null) {
        element = elementCandidate;
      } else if (PropertyIdentifier === undefined && value === undefined) {
        element = elementCandidate;
      }
      if (element) {
        configRecord[key] = element;
      }
    }
  }

  debug: for (const [key, value] of Object.entries(object)) {
    if (!configRecord[key]) console.warn('No config found for', key, value);
  }

  return configRecord;
}