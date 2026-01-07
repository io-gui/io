import { AnyConstructor, Node as IoNode, IoElement } from '@io-gui/core'

export const SKIPPED_PROPERTIES = [
  '$',
  'ELEMENT_NODE','ATTRIBUTE_NODE','TEXT_NODE','CDATA_SECTION_NODE','ENTITY_REFERENCE_NODE','ENTITY_NODE',
  'PROCESSING_INSTRUCTION_NODE','COMMENT_NODE','DOCUMENT_NODE','DOCUMENT_TYPE_NODE','DOCUMENT_FRAGMENT_NODE',
  'NOTATION_NODE','DOCUMENT_POSITION_DISCONNECTED','DOCUMENT_POSITION_PRECEDING','DOCUMENT_POSITION_FOLLOWING',
  'DOCUMENT_POSITION_CONTAINS','DOCUMENT_POSITION_CONTAINED_BY','DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC',  // Event Handlers
  'onbeforecopy','onbeforecut','onbeforepaste','onsearch','onfullscreenchange',
  'onfullscreenerror','onwebkitfullscreenchange','onwebkitfullscreenerror','namespaceURI',
  'onbeforexrselect','onabort','onbeforeinput','onbeforematch','onbeforetoggle','onblur','oncancel','oncanplay',
  'oncanplaythrough','onchange','onclick','onclose','oncontentvisibilityautostatechange','oncontextlost','oncontextmenu',
  'oncontextrestored','oncuechange','ondblclick','ondrag','ondragend','ondragenter','ondragleave','ondragover','ondragstart',
  'ondrop','ondurationchange','onemptied','onended','onerror','onfocus','onformdata','oninput','oninvalid','onkeydown',
  'onkeypress','onkeyup','onload','onloadeddata','onloadedmetadata','onloadstart','onmousedown','onmouseenter','onmouseleave',
  'onmousemove','onmouseout','onmouseover','onmouseup','onmousewheel','onpause','onplay','onplaying','onprogress',
  'onratechange','onreset','onresize','onscroll','onsecuritypolicyviolation','onseeked','onseeking','onselect','onslotchange',
  'onstalled','onsubmit','onsuspend','ontimeupdate','ontoggle','onvolumechange','onwaiting','onwebkitanimationend',
  'onwebkitanimationiteration','onwebkitanimationstart','onwebkittransitionend','onwheel','onauxclick','ongotpointercapture',
  'onlostpointercapture','onpointerdown','onpointermove','onpointerrawupdate','onpointerup','onpointercancel','onpointerover',
  'onpointerout','onpointerenter','onpointerleave','onselectstart','onselectionchange','onanimationend','onanimationiteration',
  'onanimationstart','ontransitionrun','ontransitionstart','ontransitionend','ontransitioncancel','oncopy','oncut','onpaste',
  'oncommand','onscrollend','onscrollsnapchange','onscrollsnapchangin','onscrollsnapchanging','onafterprint','onbeforeprint',
  'onbeforeunload','onhashchange','onlanguagechange','onmessage','onmessageerror','onoffline','ononline','onpagehide','onpageshow',
  'onpopstate','onrejectionhandled','onstorage','onunhandledrejection','onunload','onenterpictureinpicture','onreadystatechange',
  'onpointerlockchange','onpointerlockerror','onfreeze','onprerenderingchange','onresume','onvisibilitychange',
  'onleavepictureinpicture',
]

export function getAllPropertyNames(obj: object): string[] {
  const allProps: string[] = []
  let curr = obj
  do {
    const props = Object.getOwnPropertyNames(curr)
    props.forEach((prop) => {
      if (allProps.indexOf(prop) === -1 && !SKIPPED_PROPERTIES.includes(prop)) {
        allProps.push(prop)
      }
    })
    if (curr.constructor === Node) break
    //@ts-ignore no-cond-assign
  } while ((curr = Object.getPrototypeOf(curr)))
  return allProps
}

type PropertyIdentifier = string | RegExp
export type PropertyGroups = Record<string, Array<PropertyIdentifier>>
export type PropertyGroupsRecord = Record<string, Array<string>>
export type EditorGroups = Map<AnyConstructor, PropertyGroups>

const editorGroupsSingleton: EditorGroups = new Map<AnyConstructor, PropertyGroups>([
  [Object, {
    Hidden: [
      'constructor','hasOwnProperty','isPrototypeOf','propertyIsEnumerable','toString','valueOf','toLocaleString',
      new RegExp(/^__/),
    ],
    Advanced: [new RegExp(/^_(?!_)/)],
  }],
  [Array, {
    Hidden: [
      'length', 'constructor', 'at', 'concat', 'copyWithin', 'fill', 'find', 'findIndex', 'findLast', 'findLastIndex', 'lastIndexOf', 'pop', 'push', 'reverse', 'shift', 'unshift', 'slice', 'sort', 'splice', 'includes', 'indexOf', 'join', 'keys', 'entries', 'values', 'forEach', 'filter', 'flat', 'flatMap', 'map', 'every', 'some', 'reduce', 'reduceRight', 'toReversed', 'toSorted', 'toSpliced', 'with', 'toLocaleString', 'toString',
    ],
  }],
  [Node, {
    Main: [
      'textContent',
    ],
    Input: [
      'lang','translate','dir','inert','accessKey','draggable','writingSuggestions','spellcheck','autocapitalize','editContext',
      'contentEditable','enterKeyHint','inputMode','virtualKeyboardPolicy',
    ],
    Hierarchy: [
      'isConnected','ownerDocument','parentNode','parentElement','childNodes','firstChild','lastChild','previousSibling',
      'nextSibling',
      'children','firstElementChild','lastElementChild','childElementCount','previousElementSibling',
      'nextElementSibling','elementTiming',
    ],
    Layout: [
      'scrollTop','scrollLeft','scrollWidth','scrollHeight','clientTop','clientLeft','clientWidth','clientHeight','currentCSSZoom',
      'offsetParent','offsetTop','offsetLeft','offsetWidth','offsetHeight'
    ],
    Aria: [
      'role','ariaAtomic','ariaAutoComplete','ariaBusy','ariaBrailleLabel','ariaBrailleRoleDescription','ariaChecked','ariaColCount',
      'ariaColIndex','ariaColSpan','ariaCurrent','ariaDescription','ariaDisabled','ariaExpanded','ariaHasPopup','ariaHidden',
      'ariaInvalid','ariaKeyShortcuts','ariaLabel','ariaLevel','ariaLive','ariaModal','ariaMultiLine','ariaMultiSelectable',
      'ariaOrientation','ariaPlaceholder','ariaPosInSet','ariaPressed','ariaReadOnly','ariaRelevant','ariaRequired',
      'ariaRoleDescription','ariaRowCount','ariaRowIndex','ariaRowSpan','ariaSelected','ariaSetSize','ariaSort','ariaValueMax',
      'ariaValueMin','ariaValueNow','ariaValueText','ariaColIndexText','ariaRowIndexText','ariaActiveDescendantElement',
      'ariaControlsElements','ariaDescribedByElements','ariaDetailsElements','ariaErrorMessageElements','ariaFlowToElements',
      'ariaLabelledByElements',
    ],
    Hidden: [],
  }],
  [IoNode, {
    Hidden: [
      'reactivity',
      '_changeQueue', '_reactiveProperties', '_bindings', '_eventDispatcher', '_parents',
      '_protochain', '_disposed', '_isNode', '_isIoElement',
    ],
  }],
  [IoElement, {
    Hidden: [
      'reactivity',
      '_changeQueue', '_reactiveProperties', '_bindings', '_eventDispatcher', '_parents',
      '_protochain', '_disposed', '_isNode', '_isIoElement',
    ],
  }],
])

export function getEditorGroups(object: object, propertyGroups: PropertyGroups): PropertyGroupsRecord {
  debug: if (!object || !(object instanceof Object)) {
    console.warn('`getEditorGroups` should be used with an Object instance')
    return {}
  }

  const aggregatedGroups: PropertyGroups = {
    Main: [],
  }

  function aggregateGroups(editorGroups: EditorGroups) {
    for (const [constructorKey, groups] of editorGroups) {
      if (object instanceof constructorKey) {

        // Reorder keys to match the order in the latest config.
        const configKeys = Object.keys(groups)
        const existingKeys = Object.keys(aggregatedGroups)

        // TODO: Test thoroughly.
        if (configKeys.length > 0 && existingKeys.length > 0) {
          const reorderedGroups: PropertyGroups = {}

          for (const key of configKeys) {
            reorderedGroups[key] = aggregatedGroups[key] || []
          }

          for (const key of existingKeys) {
            if (!(key in reorderedGroups)) {
              reorderedGroups[key] = aggregatedGroups[key]
            }
          }

          for (const key of existingKeys) {
            if (configKeys.includes(key)) {
              delete aggregatedGroups[key]
            }
          }
          Object.assign(aggregatedGroups, reorderedGroups)
        }

        for (const g in groups) {
          aggregatedGroups[g] = aggregatedGroups[g] || []
          aggregatedGroups[g].push(...groups[g])
          // Remove duplicate identifiers that exist in other groups.
          for (const ag in aggregatedGroups) {
            if (ag !== g) {
              for (const identifier of groups[g]) {
                if (aggregatedGroups[ag].includes(identifier)) {
                  aggregatedGroups[ag].splice(aggregatedGroups[ag].indexOf(identifier), 1)
                }
              }
            }
          }
        }

        const advanced = aggregatedGroups['Advanced'] || []
        delete aggregatedGroups['Advanced']
        aggregatedGroups['Advanced'] = advanced
      }
    }
  }

  aggregateGroups(editorGroupsSingleton)
  aggregateGroups(new Map([[Object, propertyGroups]]))

  const allGroupedNonRegexPropertyNames: string[] = []
  for (const g of Object.keys(aggregatedGroups)) {
    for (const identifier of aggregatedGroups[g]) {
      if (!(identifier instanceof RegExp)) {
        allGroupedNonRegexPropertyNames.push(identifier)
      }
    }
  }

  const groupsRecord: PropertyGroupsRecord = {
    Main: [],
  }

  for (const key of getAllPropertyNames(object)) {
    let included = false
    const isFunction = typeof object[key as keyof typeof object] === 'function'
    for (const g of Object.keys(aggregatedGroups)) {
      groupsRecord[g] = groupsRecord[g] || []
      for (const identifier of aggregatedGroups[g]) {
        if (identifier === key) {
          groupsRecord[g].push(key)
          included = true
          continue
        } else if (identifier instanceof RegExp && !allGroupedNonRegexPropertyNames.includes(key) && identifier.test(key) && !isFunction) {
          groupsRecord[g].push(key)
          included = true
        }
      }
    }
    // Functions are not included in groups unless they are explicitly added to a non-Advanced group.
    // TODO: Test thoroughly.
    if (!included && !isFunction && !groupsRecord['Advanced']?.includes(key)) {
      groupsRecord.Main.push(key)
    }
  }

  for (const g of Object.keys(groupsRecord)) {
    groupsRecord[g] = [...new Set(groupsRecord[g])]
  }

  // Debug if properties belong to multiple groups.
  // TODO: Test thoroughly.
  debug: {
    for (const g of Object.keys(groupsRecord)) {
      for (const g2 of Object.keys(groupsRecord)) {
        if (g !== g2) {
          for (const key of groupsRecord[g]) {
            if (groupsRecord[g2].includes(key)) {
              console.warn(`Property "${key}" belongs to multiple groups: "${g}" and "${g2}". Removing from "${g}".`)
            }
          }
        }
      }
    }
  }

  return groupsRecord
}

export function registerEditorGroups(constructor: AnyConstructor, groups: PropertyGroups) {
  const existingGroups = editorGroupsSingleton.get(constructor) || {}
  for (const group in groups) {
    existingGroups[group] = existingGroups[group] || []
    existingGroups[group].push(...groups[group])
  }
  editorGroupsSingleton.set(constructor, existingGroups)
}
