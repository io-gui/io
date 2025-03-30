import { IoElement, IoGl, IoTheme, Color } from 'io-gui';
import { Constructor, VDOMArray } from 'io-gui';
import { MenuOptions } from 'io-menus';
import 'io-colors';
import 'io-inputs';

export type PropertyIdentifier = Constructor | string | null | undefined;
export type PropertyConfig = [PropertyIdentifier, VDOMArray];
export type PropertyConfigMap = Map<PropertyIdentifier, VDOMArray>;
export type PropertyConfigRecord = Record<string, VDOMArray>;
export type EditorConfig = Map<Constructor, PropertyConfig[]>

const editorConfigSingleton: EditorConfig = new Map<Constructor, PropertyConfig[]>([
  [Object, [
    [String, ['io-string', {}]],
    [Number, ['io-number', {step: 0.01}]],
    [Boolean, ['io-switch']],
    [Object, ['io-object']],
    [null, ['io-field', {appearance: 'neutral'}]],
    [undefined, ['io-field', {appearance: 'neutral'}]],
  ]],
  [Array, [
    [Number, ['io-number', {step: 0.01}]],
  ]],
  [IoElement, [
    ['reactivity', ['io-option-menu', {options: new MenuOptions(['none', 'debounced', 'immediate'])}]],
    ['tabindex', ['io-option-menu', {options: new MenuOptions([{label: 'None', value: ''}, '-1', '0', '1', '2', '3'])}]],
    ['contenteditable', ['io-boolean', {}]],
    ['role', ['io-option-menu', {options: new MenuOptions(['alert','alertdialog','application','article','banner','button','cell','checkbox','columnheader','combobox','complementary','contentinfo','definition','dialog','directory','document','feed','figure','form','grid','gridcell','group','heading','img','link','list','listbox','listitem','log','main','marquee','math','menu','menubar','menuitem','menuitemcheckbox','menuitemradio','navigation','none','note','option','presentation','progressbar','radio','radiogroup','region','row','rowgroup','rowheader','scrollbar','search','searchbox','separator','slider','spinbutton','status','switch','tab','table','tablist','tabpanel','term','textbox','timer','toolbar','tooltip','tree','treegrid','treeitem'])}]],
  ]],
  [IoGl, [
    ['size', ['io-vector', {step: 1}]],
    ['color', ['io-vector', {step: 1}]],
    ['transparent', ['io-boolean', {}]],
    ['pxRatio', ['io-number', {step: 0.0001}]],
  ]],
  [IoTheme, [
    ['themeID', ['io-option-menu', {options: new MenuOptions(['light', 'dark'])}]],
    [Number, ['io-number-slider', {step: 1, min: 0, max: 20}]],
    ['spacing2', ['io-field', {appearance: 'neutral'}]],
    ['spacing3', ['io-field', {appearance: 'neutral'}]],
    ['spacing5', ['io-field', {appearance: 'neutral'}]],
    ['spacing8', ['io-field', {appearance: 'neutral'}]],
    ['fieldHeight', ['io-field', {appearance: 'neutral'}]],
    ['fieldHeight2', ['io-field', {appearance: 'neutral'}]],
    ['fieldHeight3', ['io-field', {appearance: 'neutral'}]],
    ['fieldHeight4', ['io-field', {appearance: 'neutral'}]],
    ['fieldHeight5', ['io-field', {appearance: 'neutral'}]],
    ['fieldHeight6', ['io-field', {appearance: 'neutral'}]],
    ['fieldHeight7', ['io-field', {appearance: 'neutral'}]],
    ['fieldHeight8', ['io-field', {appearance: 'neutral'}]],
    ['fieldHeight9', ['io-field', {appearance: 'neutral'}]],
    ['fieldHeight10', ['io-field', {appearance: 'neutral'}]],
    ['fieldHeight11', ['io-field', {appearance: 'neutral'}]],
    ['fieldHeight12', ['io-field', {appearance: 'neutral'}]],
    ['borderRadius2', ['io-field', {appearance: 'neutral'}]],
    [Color, ['io-color-rgba']],
  ]]
]);

export function getEditorConfig(object: object, editorConfig: EditorConfig = new Map()): PropertyConfigRecord {
  debug: if (!(object instanceof Object)) {
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
      } else if (typeof PropertyIdentifier === 'function' && value.constructor === PropertyIdentifier) {
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