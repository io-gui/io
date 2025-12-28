import { IoElement, IoGl, Theme, Color, AnyConstructor, VDOMElement, Node, } from '@io-gui/core'
import { ioString, ioNumber, ioSwitch, ioField } from '@io-gui/inputs'
import { MenuOption, ioOptionSelect } from '@io-gui/menus'
import { ioNumberSlider } from '@io-gui/sliders'
import { ioColorRgba } from '@io-gui/colors'
import { ioVectorArray } from '../elements/IoVectorArray.js'
import { ioObject } from '../elements/IoObject.js'
import { getAllPropertyNames } from './EditorGroups.js'

type PropertyIdentifier = AnyConstructor | string | RegExp | null | undefined
export type PropertyConfig = [PropertyIdentifier, VDOMElement]
export type PropertyConfigMap = Map<PropertyIdentifier, VDOMElement>
export type PropertyConfigRecord = Record<string, VDOMElement>
export type EditorConfig = Map<AnyConstructor, PropertyConfig[]>

function makeSelect(options: any[]) {
  for (let i = 0; i < options.length; i++) {
    if (options[i] === null) {
      options[i] = {value: null, id: 'Null'}
    }
  }
  const option = new MenuOption({options: options})
  return ioOptionSelect({option})
}

// TODO: Make sure multiple editors dont share the same menu options.
// TODO: Consider using function to return new view each time editor is configured at runtime.

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
    ['tabIndex', ioOptionSelect({option: new MenuOption({options: [{value: '', id: 'None'}, '-1', '0', '1', '2', '3']})})],
    ['innerHTML', ioString({disabled: true, style: {maxWidth: '10em'}})],//TODO
    ['outerHTML', ioString({disabled: true, style: {maxWidth: '10em'}})],//TODO
    ['autocapitalize', ioOptionSelect({option: new MenuOption({options: ['off', 'sentences', 'words', 'characters', {value: '', id: 'None'}]})})],
    ['writingSuggestions', ioOptionSelect({option: new MenuOption({options: ['true', 'false']})})],
    ['dir', ioOptionSelect({option: new MenuOption({options: ['ltr','rtl','auto',{value:'', id: 'None'}]})})],
    ['virtualKeyboardPolicy', ioOptionSelect({option: new MenuOption({options: ['manual','auto',{value:'', id: 'None'}]})})],
    ['enterKeyHint', ioOptionSelect({option: new MenuOption({options: ['enter','done','go','next','previous','search','send',{value:'', id: 'None'}]})})],
    ['contentEditable', ioOptionSelect({option: new MenuOption({options: ['true','false','plaintext-only','inherit']})})],
    ['inputMode', ioOptionSelect({option: new MenuOption({options: ['decimal','email','numeric','tel','search','url','text',{value:'', id: 'None'}]})})],
    ['lang', ioOptionSelect({option: new MenuOption({options: [
      {value: '', id: 'None'},
      'ab','aa','af','ak','sq','am','ar','an','hy','as','av','ae','ay','az','bm','ba','eu','be','bn','bh','bi','bs','br','bg','my','ca','ch','ce',
      'ny','zh','zh-ans','zh-ant','cv','kw','co','cr','hr','cs','da','dv','nl','dz','en','eo','et','ee','fo','fj','fi','fr','ff','gl','gd',
      'ka','de','el','kl','gn','gu','ht','ha','he','hz','hi','ho','hu','is','io','ig','id in','ia','ie','iu','ik','ga','it','ja','jv','kn',
      'kr','ks','kk','km','ki','rw','rn','ky','kv','kg','ko','ku','kj','lo','la','lv','li','ln','lt','lu','lg','lb','gv','mk','mg','ms','ml','mt',
      'mi','mr','mh','mo','mn','na','nv','ng','nd','ne','no','nb','nn','oc','oj','cu','or','om','os','pi','ps','fa','pl','pt','pa','qu','rm',
      'ro','ru','se','sm','sg','sa','sr','sh','st','tn','sn','ii','sd','si','ss','sk','sl','so','nr','es','su','sw','sv','tl','ty','tg','ta',
      'tt','te','th','bo','ti','to','ts','tr','tk','tw','ug','uk','ur','uz','ve','vi','vo','wa','cy','wo','fy','xh','yi','ji','yo','za','zu'
    ]})})],
    ['role', ioOptionSelect({option: new MenuOption({options: [
      'alert','alertdialog','application','article','banner','button','cell','checkbox','columnheader','combobox','complementary',
      'contentinfo','definition','dialog','directory','document','feed','figure','form','grid','gridcell','group','heading','img',
      'link','list','listbox','listitem','log','main','marquee','math','menu','menubar','menuitem','menuitemcheckbox','menuitemradio',
      'navigation','none','note','option','presentation','progressbar','radio','radiogroup','region','row','rowgroup','rowheader',
      'scrollbar','search','searchbox','separator','slider','spinbutton','status','switch','tab','table','tablist','tabpanel','term',
      'textbox','timer','toolbar','tooltip','tree','treegrid','treeitem',
    ]})})],
    ['ariaAtomic', makeSelect(['true','false',null])],
    ['ariaAutoComplete', ioOptionSelect({option: new MenuOption({options: ['inline','list','both','none']})})],
    ['ariaBusy', makeSelect(['true','false',null])],
    ['ariaBrailleLabel', ioString()],
    ['ariaBrailleRoleDescription', ioString()],
    ['ariaChecked', makeSelect(['true','false','mixed',null])],
    ['ariaColCount', makeSelect([...[...Array(32)].map((_, i) => i + 1),null])],
    ['ariaColIndex', makeSelect([...[...Array(32)].map((_, i) => i + 1),null])],
    ['ariaColSpan', makeSelect([...[...Array(32)].map((_, i) => i + 1),null])],
    ['ariaCurrent', makeSelect(['true','false','page','step','location','date','time',null])],
    ['ariaDescription', ioString()],
    ['ariaDisabled', makeSelect(['true','false',null])],
    ['ariaExpanded', makeSelect(['true','false',null])],
    ['ariaHasPopup', makeSelect(['true','false','menu','listbox','tree','grid','dialog',null])],
    ['ariaHidden', makeSelect(['true','false',null])],
    ['ariaInvalid', makeSelect(['true','false','grammar','spelling',null])],
    ['ariaKeyShortcuts', ioString()],
    ['ariaLabel', ioString()],
    ['ariaLevel', makeSelect([...[...Array(32)].map((_, i) => i + 1),null])],
    ['ariaLive', ioOptionSelect({option: new MenuOption({options: ['assertive','polite','off']})})],
    ['ariaModal', makeSelect(['true','false',null])],
    ['ariaMultiLine', makeSelect(['true','false',null])],
    ['ariaMultiSelectable', makeSelect(['true','false',null])],
    ['ariaOrientation', ioOptionSelect({option: new MenuOption({options: ['horizontal','vertical','undefined']})})],
    ['ariaPlaceholder', ioString()],
    ['ariaPosInSet', makeSelect([...[...Array(32)].map((_, i) => i + 1),null])],
    ['ariaPressed', makeSelect(['true','false','mixed',null])],
    ['ariaReadOnly', makeSelect(['true','false',null])],
    ['ariaRequired', makeSelect(['true','false',null])],
    ['ariaRelevant', ioOptionSelect({option: new MenuOption({options: ['additions','all','removals','text']})})],
    ['ariaRoleDescription', ioString()],
    ['ariaRowCount', makeSelect([...[...Array(32)].map((_, i) => i + 1),null])],
    ['ariaRowIndex', makeSelect([...[...Array(32)].map((_, i) => i + 1),null])],
    ['ariaRowSpan', makeSelect([...[...Array(32)].map((_, i) => i + 1),null])],
    ['ariaSelected', makeSelect(['true','false',null])],
    ['ariaSetSize', makeSelect([...[...Array(32)].map((_, i) => i + 1),null])],
    ['ariaSort', ioOptionSelect({option: new MenuOption({options: ['none','ascending','descending','other']})})],
    ['ariaValueMax', makeSelect([...[...Array(32)].map((_, i) => i + 1),null])],
    ['ariaValueMin', makeSelect([...[...Array(32)].map((_, i) => i + 1),null])],
    ['ariaValueNow', makeSelect([...[...Array(32)].map((_, i) => i + 1),null])],
    ['ariaValueText', ioString()],
    ['ariaColIndexText', ioString()],
    ['ariaRowIndexText', ioString()],
  ]],
  [Element, [
  ]],
  [HTMLElement, [
  ]],
  [Node, [
    ['reactivity', ioOptionSelect({option: new MenuOption({options: ['none', 'debounced', 'immediate']})})],
  ]],
  [IoElement, [
    ['reactivity', ioOptionSelect({option: new MenuOption({options: ['none', 'debounced', 'immediate']})})],
  ]],
  [IoGl, [
    ['size', ioVectorArray({step: 1})],
    ['color', ioVectorArray({step: 1})],
  ]],
  [Theme, [
    [Number, ioNumberSlider({step: 1, min: 0, max: 20})],
    ['themeID', ioOptionSelect({option: new MenuOption({options: ['light','dark']})})],
    ['spacing2', ioField({disabled: true})],
    ['spacing3', ioField({disabled: true})],
    ['spacing5', ioField({disabled: true})],
    ['spacing8', ioField({disabled: true})],
    ['fieldHeight', ioField({disabled: true})],
    [Color, ioColorRgba()],
  ]]
])

editorConfigSingleton.forEach((propertyTypes, constructor) => {
  const descriptors = Object.getOwnPropertyDescriptors(constructor.prototype)
  for (const [key, descriptor] of Object.entries(descriptors)) {
    const isWritable = descriptor.writable !== false
    const hasGetter = descriptor.get !== undefined
    const hasSetter = descriptor.set !== undefined
    if ((hasGetter && !hasSetter) || !isWritable) {
      const hasType = propertyTypes.find(propertyType => propertyType[0] === key)
      if (hasType) {
        debug: {
          console.warn(constructor, `.${key} has getter but no setter or is not writable. Invalidating editor config.`)
        }
        (hasType as any).length = 0
        hasType.push(key, ioField({disabled: true}))
      } else {
        propertyTypes.push([key, ioField({disabled: true})])
      }
    }
  }
})

export function getEditorConfig(object: object, editorConfig: EditorConfig = new Map()): PropertyConfigRecord {
  debug: if (!object || !(object instanceof Object)) {
    console.warn('`getObjectConfig` should be used with an Object instance')
    return {}
  }

  const aggregatedConfig: PropertyConfigMap = new Map()
  for (const [constructorKey, propertyTypes] of editorConfigSingleton) {
    if (object instanceof constructorKey) {
      for (const [PropertyIdentifier, config] of propertyTypes) {
        aggregatedConfig.set(PropertyIdentifier, config)
      }
    }
  }

  for (const [constructorKey, propertyTypes] of editorConfig) {
    if (object instanceof constructorKey) {
      for (const [PropertyIdentifier, config] of propertyTypes) {
        aggregatedConfig.set(PropertyIdentifier, config)
      }
    }
  }

  const configRecord: PropertyConfigRecord = {}
  for (const key of getAllPropertyNames(object)) {
    const value = (object as any)[key]
    for (const [PropertyIdentifier, elementCandidate] of aggregatedConfig) {
      let element: VDOMElement | undefined
      if (typeof PropertyIdentifier === 'function' && value instanceof PropertyIdentifier) {
        element = elementCandidate
      } else if (typeof PropertyIdentifier === 'function' && value?.constructor === PropertyIdentifier) {
        element = elementCandidate
      } else if (typeof PropertyIdentifier === 'string' && key === PropertyIdentifier) {
        // ignore io-field elements assigned to read-only object properties
        if (!(typeof value === 'object' && value !== null && elementCandidate.tag === 'io-field')) {
          element = elementCandidate
        }
      } else if (PropertyIdentifier instanceof RegExp && PropertyIdentifier.test(key)) {
        element = elementCandidate
      } else if (PropertyIdentifier === null && value === null) {
        element = elementCandidate
      } else if (PropertyIdentifier === undefined && value === undefined) {
        element = elementCandidate
      }
      if (element) {
        // element = {...element};
        // if (element.props) {
        //   element.props = {...element.props};
        // }
        // console.log(key, element);
        configRecord[key] = element
      }
    }
  }

  debug: for (const key of getAllPropertyNames(object)) {
    if (key === 'textNode') continue
    const value = (object as any)[key]
    if (!configRecord[key]) console.warn('No config found for', key, value)
  }

  return configRecord
}

export function registerEditorConfig(constructor: AnyConstructor, propertyTypes: PropertyConfig[]) {
  const existingConfigs = editorConfigSingleton.get(constructor) || []
  for (const [PropertyIdentifier, elementCandidate] of propertyTypes) {
    const existingConfig = existingConfigs.find(config => config[0] === PropertyIdentifier)
    if (existingConfig) {
      existingConfig[1] = elementCandidate
    } else {
      existingConfigs.push([PropertyIdentifier, elementCandidate])
    }
  }
  editorConfigSingleton.set(constructor, existingConfigs)
}
