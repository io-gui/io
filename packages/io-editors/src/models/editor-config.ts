import { IoElement, IoGl, IoTheme, Color } from 'io-gui';
import { AnyConstructor, VDOMArray } from 'io-gui';
import { MenuOptions, ioOptionMenu } from 'io-menus';
import { ioNumberSlider } from 'io-sliders';
import { ioColorRgba } from 'io-colors';
import { ioObject } from '../io-object';
import { ioVector } from '../io-vector';
import { ioString, ioNumber, ioBoolean, ioSwitch, ioInputBase } from 'io-inputs';

export type PropertyIdentifier = AnyConstructor | string | null | undefined;
export type PropertyConfig = [PropertyIdentifier, VDOMArray];
export type PropertyConfigMap = Map<PropertyIdentifier, VDOMArray>;
export type PropertyConfigRecord = Record<string, VDOMArray>;
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
  [IoElement, [
    ['reactivity', ioOptionMenu({options: new MenuOptions(['none', 'debounced', 'immediate'])})],
    ['tabindex', ioOptionMenu({options: new MenuOptions([{label: 'None', value: ''}, '-1', '0', '1', '2', '3'])})],
    ['role', ioOptionMenu({options: new MenuOptions(['alert','alertdialog','application','article','banner','button','cell','checkbox','columnheader','combobox','complementary','contentinfo','definition','dialog','directory','document','feed','figure','form','grid','gridcell','group','heading','img','link','list','listbox','listitem','log','main','marquee','math','menu','menubar','menuitem','menuitemcheckbox','menuitemradio','navigation','none','note','option','presentation','progressbar','radio','radiogroup','region','row','rowgroup','rowheader','scrollbar','search','searchbox','separator','slider','spinbutton','status','switch','tab','table','tablist','tabpanel','term','textbox','timer','toolbar','tooltip','tree','treegrid','treeitem'])})],
  ]],
  [IoGl, [
    ['size', ioVector({step: 1})],
    ['color', ioVector({step: 1})],
    ['pxRatio', ioNumber({step: 0.0001})],
  ]],
  [IoTheme, [
    [Number, ioNumberSlider({step: 1, min: 0, max: 20})],
    ['themeID', ioOptionMenu({options: new MenuOptions(['light', 'dark'])})],
    ['spacing2', ioInputBase()],
    ['spacing3', ioInputBase()],
    ['spacing5', ioInputBase()],
    ['spacing8', ioInputBase()],
    ['fieldHeight', ioInputBase()],
    ['fieldHeight2', ioInputBase()],
    ['fieldHeight3', ioInputBase()],
    ['fieldHeight4', ioInputBase()],
    ['fieldHeight5', ioInputBase()],
    ['fieldHeight6', ioInputBase()],
    ['fieldHeight7', ioInputBase()],
    ['fieldHeight8', ioInputBase()],
    ['fieldHeight9', ioInputBase()],
    ['fieldHeight10', ioInputBase()],
    ['fieldHeight11', ioInputBase()],
    ['fieldHeight12', ioInputBase()],
    ['borderRadius2', ioInputBase()],
    [Color, ioColorRgba()],
  ]]
]);

export function getEditorConfig(object: object, editorConfig: EditorConfig = new Map()): PropertyConfigRecord {
  debug: if (!(object instanceof Object) || object === null) {
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
      let element: VDOMArray | undefined;
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