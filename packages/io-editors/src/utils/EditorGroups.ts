import { AnyConstructor } from 'io-gui';

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
];

const allPropertyNamesCache: Map<Function, string[]> = new Map();

export function getAllPropertyNames(obj: object): string[] {
  if (allPropertyNamesCache.has(obj.constructor)) {
    return allPropertyNamesCache.get(obj.constructor) as string[];
  }
  const allProps: string[] = [];
  allPropertyNamesCache.set(obj.constructor, allProps);
  let curr = obj;
  do {
    const props = Object.getOwnPropertyNames(curr);
    props.forEach((prop) => {
      if (allProps.indexOf(prop) === -1 && typeof (obj as any)[prop] !== 'function' && !SKIPPED_PROPERTIES.includes(prop)) {
        allProps.push(prop);
      }
    });
    if (curr.constructor === Node) break;
    //@ts-ignore no-cond-assign
  } while ((curr = Object.getPrototypeOf(curr)));
  return allProps;
}

type PropertyIdentifier = string | RegExp;
export type PropertyGroups = Record<string, Array<PropertyIdentifier>>;
export type PropertyGroupsRecord = Record<string, Array<string>>;
export type EditorGroups = Map<AnyConstructor, PropertyGroups>

const editorGroupsSingleton: EditorGroups = new Map<AnyConstructor, PropertyGroups>([
  [Object, {
    Hidden: [new RegExp(/^_/)],
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
]);

export function getEditorGroups(object: object, editorGroups: EditorGroups = new Map()): PropertyGroupsRecord {
  debug: if (!object || !(object instanceof Object)) {
    console.warn('`getEditorGroups` should be used with an Object instance');
    return {};
  }

  const aggregatedGroups: PropertyGroups = {
    Main: [],
  };

  function aggregateGroups(editorGroups: EditorGroups) {
    for (const [constructorKey, groups] of editorGroups) {
      if (object instanceof constructorKey) {
        for (const g in groups) {
          aggregatedGroups[g] = aggregatedGroups[g] || [];
          aggregatedGroups[g].push(...groups[g]);
          // Remove duplicate identifiers that exist in other groups.
          for (const ag in aggregatedGroups) {
            if (ag !== g) {
              for (const identifier of groups[g]) {
                if (aggregatedGroups[ag].includes(identifier)) {
                  aggregatedGroups[ag].splice(aggregatedGroups[ag].indexOf(identifier), 1);
                }
              }
            }
          }
        }
      }
    }
  }

  aggregateGroups(editorGroupsSingleton);
  aggregateGroups(editorGroups);

  const groupsRecord: PropertyGroupsRecord = {
    Main: [],
  };


  for (const key of getAllPropertyNames(object)) {
    let included = false;
    for (const g of Object.keys(aggregatedGroups)) {
      groupsRecord[g] = groupsRecord[g] || [];
      for (const identifier of aggregatedGroups[g]) {
        if (identifier === key) {
          groupsRecord[g].push(key);
          included = true;
          continue;
        } else if (identifier instanceof RegExp && identifier.test(key)) {
          groupsRecord[g].push(key);
          included = true;
        }
      }
    }
    if (!included) {
      groupsRecord.Main.push(key);
    }
  }
  // TODO: make sure no property belongs to multiple groups.
  return groupsRecord;
}

export function registerEditorGroups(constructor: AnyConstructor, groups: PropertyGroups) {
  const existingGroups = editorGroupsSingleton.get(constructor) || {};
  for (const group in groups) {
    existingGroups[group] = existingGroups[group] || [];
    existingGroups[group].push(...groups[group]);
    // Remove duplicate identifiers that exist in other groups.
    for (const g in existingGroups) {
      if (g !== group) {
        for (const identifier of groups[group]) {
          if (existingGroups[g].includes(identifier)) {
            existingGroups[g].splice(existingGroups[g].indexOf(identifier), 1);
          }
        }
      }
    }
  }
  editorGroupsSingleton.set(constructor, existingGroups);
}
