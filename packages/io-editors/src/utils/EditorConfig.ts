import { IoElement, IoGl, Theme, Color, AnyConstructor, VDOMElement, Node, } from 'io-gui';
import { ioString, ioNumber, ioSwitch, ioField } from 'io-inputs';
import { MenuOptions, ioOptionSelect } from 'io-menus';
import { ioNumberSlider } from 'io-sliders';
import { ioColorRgba } from 'io-colors';
import { ioVector } from '../elements/IoVector';
import { ioObject } from '../elements/IoObject';
import { getAllPropertyNames } from './EditorGroups';

type PropertyIdentifier = AnyConstructor | string | RegExp | null | undefined;
export type PropertyConfig = [PropertyIdentifier, VDOMElement];
export type PropertyConfigMap = Map<PropertyIdentifier, VDOMElement>;
export type PropertyConfigRecord = Record<string, VDOMElement>;
export type EditorConfig = Map<AnyConstructor, PropertyConfig[]>

function optionMenu(options: any[]) {
  return ioOptionSelect({options: new MenuOptions().fromJSON(options)});
}

const editorConfigSingleton: EditorConfig = new Map<AnyConstructor, PropertyConfig[]>([
  [Object, [
    [String, ioString()],
    [Number, ioNumber({step: 0.01})],
    [Boolean, ioSwitch()],
    [Object, ioObject()],
    [null, ioField({disabled: true})],
    [undefined, ioField({disabled: true})],
  ]],
  [Array, [
    [Number, ioNumber({step: 0.01})],
  ]],
  [window.Node, [
    ['tabIndex', ioOptionSelect({options: new MenuOptions().fromJSON([
      {value: '', label: 'none'}, '-1', '0', '1', '2', '3',
    ])})],
    ['innerHTML', ioString({disabled: true, style: {maxWidth: '10em'}})],//TODO
    ['outerHTML', ioString({disabled: true, style: {maxWidth: '10em'}})],//TODO
    ['autocapitalize', ioOptionSelect({options: new MenuOptions().fromJSON(['off', 'sentences', 'words', 'characters', {value: '', label: 'None'}])})],
    ['writingSuggestions', ioOptionSelect({options: new MenuOptions().fromJSON(['true', 'false'])})],
    ['dir', ioOptionSelect({options: new MenuOptions().fromJSON(['ltr','rtl','auto',{value:'', label: 'None'}])})],
    ['virtualKeyboardPolicy', ioOptionSelect({options: new MenuOptions().fromJSON(['manual','auto',{value:'', label: 'None'}])})],
    ['enterKeyHint', ioOptionSelect({options: new MenuOptions().fromJSON([
      'enter','done','go','next','previous','search','send',{value:'', label: 'None'}])})
    ],
    ['contentEditable', ioOptionSelect({options: new MenuOptions().fromJSON([
      'true','false','plaintext-only','inherit'])})
    ],
    ['inputMode', ioOptionSelect({options: new MenuOptions().fromJSON([
      'decimal','email','numeric','tel','search','url','text',{value:'', label: 'None'}])})
    ],
    ['lang', ioOptionSelect({options: new MenuOptions().fromJSON([
      {value: '', label: 'None'},
      'ab','aa','af','ak','sq','am','ar','an','hy','as','av','ae','ay','az','bm','ba','eu','be','bn','bh','bi','bs','br','bg','my','ca','ch','ce',
      'ny','zh','zh-ans','zh-ant','cv','kw','co','cr','hr','cs','da','dv','nl','dz','en','eo','et','ee','fo','fj','fi','fr','ff','gl','gd',
      'ka','de','el','kl','gn','gu','ht','ha','he','hz','hi','ho','hu','is','io','ig','id in','ia','ie','iu','ik','ga','it','ja','jv','kn',
      'kr','ks','kk','km','ki','rw','rn','ky','kv','kg','ko','ku','kj','lo','la','lv','li','ln','lt','lu','lg','lb','gv','mk','mg','ms','ml','mt',
      'mi','mr','mh','mo','mn','na','nv','ng','nd','ne','no','nb','nn','oc','oj','cu','or','om','os','pi','ps','fa','pl','pt','pa','qu','rm',
      'ro','ru','se','sm','sg','sa','sr','sh','st','tn','sn','ii','sd','si','ss','sk','sl','so','nr','es','su','sw','sv','tl','ty','tg','ta',
      'tt','te','th','bo','ti','to','ts','tr','tk','tw','ug','uk','ur','uz','ve','vi','vo','wa','cy','wo','fy','xh','yi','ji','yo','za','zu'
    ])})],
    ['role', ioOptionSelect({options: new MenuOptions().fromJSON([
      'alert','alertdialog','application','article','banner','button','cell','checkbox','columnheader','combobox','complementary',
      'contentinfo','definition','dialog','directory','document','feed','figure','form','grid','gridcell','group','heading','img',
      'link','list','listbox','listitem','log','main','marquee','math','menu','menubar','menuitem','menuitemcheckbox','menuitemradio',
      'navigation','none','note','option','presentation','progressbar','radio','radiogroup','region','row','rowgroup','rowheader',
      'scrollbar','search','searchbox','separator','slider','spinbutton','status','switch','tab','table','tablist','tabpanel','term',
      'textbox','timer','toolbar','tooltip','tree','treegrid','treeitem',
    ])})],
    ['ariaAtomic', optionMenu(['true','false', null])],
    ['ariaAutoComplete', ioOptionSelect({options: new MenuOptions().fromJSON(['inline','list','both','none'])})],
    ['ariaBusy', optionMenu(['true','false', null])],
    ['ariaBrailleLabel', ioString()],
    ['ariaBrailleRoleDescription', ioString()],
    ['ariaChecked', optionMenu(['true','false','mixed', null])],
    ['ariaColCount', optionMenu([...[...Array(32)].map((_, i) => i + 1), null])],
    ['ariaColIndex', optionMenu([...[...Array(32)].map((_, i) => i + 1), null])],
    ['ariaColSpan', optionMenu([...[...Array(32)].map((_, i) => i + 1), null])],
    ['ariaCurrent', optionMenu(['true','false','page','step','location','date','time', null])],
    ['ariaDescription', ioString()],
    ['ariaDisabled', optionMenu(['true','false', null])],
    ['ariaExpanded', optionMenu(['true','false', null])],
    ['ariaHasPopup', optionMenu(['true','false','menu','listbox','tree','grid','dialog', null])],
    ['ariaHidden', optionMenu(['true','false', null])],
    ['ariaInvalid', optionMenu(['true','false','grammar','spelling', null])],
    ['ariaKeyShortcuts', ioString()],
    ['ariaLabel', ioString()],
    ['ariaLevel', optionMenu([...[...Array(32)].map((_, i) => i + 1), null])],
    ['ariaLive', ioOptionSelect({options: new MenuOptions().fromJSON(['assertive','polite','off'])})],
    ['ariaModal', optionMenu(['true','false', null])],
    ['ariaMultiLine', optionMenu(['true','false', null])],
    ['ariaMultiSelectable', optionMenu(['true','false', null])],
    ['ariaOrientation', ioOptionSelect({options: new MenuOptions().fromJSON(['horizontal','vertical','undefined'])})],
    ['ariaPlaceholder', ioString()],
    ['ariaPosInSet', optionMenu([...[...Array(32)].map((_, i) => i + 1), null])],
    ['ariaPressed', optionMenu(['true','false','mixed', null])],
    ['ariaReadOnly', optionMenu(['true','false', null])],
    ['ariaRequired', optionMenu(['true','false', null])],
    ['ariaRelevant', ioOptionSelect({options: new MenuOptions().fromJSON(['additions','all','removals','text'])})],
    ['ariaRoleDescription', ioString()],
    ['ariaRowCount', optionMenu([...[...Array(32)].map((_, i) => i + 1), null])],
    ['ariaRowIndex', optionMenu([...[...Array(32)].map((_, i) => i + 1), null])],
    ['ariaRowSpan', optionMenu([...[...Array(32)].map((_, i) => i + 1), null])],
    ['ariaSelected', optionMenu(['true','false', null])],
    ['ariaSetSize', optionMenu([...[...Array(32)].map((_, i) => i + 1), null])],
    ['ariaSort', ioOptionSelect({options: new MenuOptions().fromJSON(['none','ascending','descending','other'])})],
    ['ariaValueMax', optionMenu([...[...Array(32)].map((_, i) => i + 1), null])],
    ['ariaValueMin', optionMenu([...[...Array(32)].map((_, i) => i + 1), null])],
    ['ariaValueNow', optionMenu([...[...Array(32)].map((_, i) => i + 1), null])],
    ['ariaValueText', ioString()],
    ['ariaColIndexText', ioString()],
    ['ariaRowIndexText', ioString()],
  ]],
  [Element, [
  ]],
  [HTMLElement, [
  ]],
  [Node, [
    ['reactivity', ioOptionSelect({options: new MenuOptions().fromJSON([
      'none', 'debounced', 'immediate',
    ])})],
  ]],
  [IoElement, [
    ['reactivity', ioOptionSelect({options: new MenuOptions().fromJSON([
      'none', 'debounced', 'immediate',
    ])})],
  ]],
  [IoGl, [
    ['size', ioVector({step: 1})],
    ['color', ioVector({step: 1})],
  ]],
  [Theme, [
    [Number, ioNumberSlider({step: 1, min: 0, max: 20})],
    ['themeID', ioOptionSelect({options: new MenuOptions().fromJSON([
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

editorConfigSingleton.forEach((propertyTypes, constructor) => {
  const descriptors = Object.getOwnPropertyDescriptors(constructor.prototype);
  for (const [key, descriptor] of Object.entries(descriptors)) {
    const isWritable = descriptor.writable !== false;
    const hasGetter = descriptor.get !== undefined;
    const hasSetter = descriptor.set !== undefined;
    if ((hasGetter && !hasSetter) || !isWritable) {
      const hasType = propertyTypes.find(propertyType => propertyType[0] === key);
      if (hasType) {
        debug: {
          console.warn(constructor, `.${key} has getter but no setter or is not writable. Invalidating editor config.`);
        }
        (hasType as any).length = 0;
        hasType.push(key, ioField({disabled: true}));
      } else {
        propertyTypes.push([key, ioField({disabled: true})]);
      }
    }
  }
});

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
  for (const key of getAllPropertyNames(object)) {
    const value = (object as any)[key];
    for (const [PropertyIdentifier, elementCandidate] of aggregatedConfig) {
      let element: VDOMElement | undefined;
      if (typeof PropertyIdentifier === 'function' && value instanceof PropertyIdentifier) {
        element = elementCandidate;
      } else if (typeof PropertyIdentifier === 'function' && value?.constructor === PropertyIdentifier) {
        element = elementCandidate;
      } else if (typeof PropertyIdentifier === 'string' && key === PropertyIdentifier) {
        // ignore io-field elements assigned to read-only object properties
        if (!(typeof value === 'object' && value !== null && elementCandidate.tag === 'io-field')) {
          element = elementCandidate;
        }
      } else if (PropertyIdentifier instanceof RegExp && PropertyIdentifier.test(key)) {
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

  debug: for (const key of getAllPropertyNames(object)) {
    if (key === 'textNode') continue;
    const value = (object as any)[key];
    if (!configRecord[key]) console.warn('No config found for', key, value);
  }

  return configRecord;
}

export function registerEditorConfig(constructor: AnyConstructor, propertyTypes: PropertyConfig[]) {
  const existingConfigs = editorConfigSingleton.get(constructor) || [];
  for (const [PropertyIdentifier, elementCandidate] of propertyTypes) {
    const existingConfig = existingConfigs.find(config => config[0] === PropertyIdentifier);
    if (existingConfig) {
      existingConfig[1] = elementCandidate;
    } else {
      existingConfigs.push([PropertyIdentifier, elementCandidate]);
    }
  }
  editorConfigSingleton.set(constructor, existingConfigs);
}
