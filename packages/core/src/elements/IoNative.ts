import { VDOMElement, NativeElementProps, OtherHTMLElementProps } from '../vdom/VDOM.js'

/* eslint-disable @stylistic/max-len */

// export const HTML_CORE_PROPERTIES: Record<string, string[]> = {
//   Node: ['ownerDocument','parentNode','parentElement','childNodes','firstChild','lastChild','previousSibling','nextSibling','textContent'],
//   Element: ['id','innerHTML','outerHTML','scrollTop','scrollLeft','scrollWidth','scrollHeight','clientTop','clientLeft','clientWidth','clientHeight','role','ariaAtomic','ariaAutoComplete','ariaBusy','ariaBrailleLabel','ariaBrailleRoleDescription','ariaChecked','ariaColCount','ariaColIndex','ariaColSpan','ariaCurrent','ariaDescription','ariaDisabled','ariaExpanded','ariaHasPopup','ariaHidden','ariaInvalid','ariaKeyShortcuts','ariaLabel','ariaLevel','ariaLive','ariaModal','ariaMultiLine','ariaMultiSelectable','ariaOrientation','ariaPlaceholder','ariaPosInSet','ariaPressed','ariaReadOnly','ariaRelevant','ariaRequired','ariaRoleDescription','ariaRowCount','ariaRowIndex','ariaRowSpan','ariaSelected','ariaSetSize','ariaSort','ariaValueMax','ariaValueMin','ariaValueNow','ariaValueText','children','firstElementChild','lastElementChild','childElementCount','previousElementSibling','nextElementSibling','currentCSSZoom','ariaColIndexText','ariaRowIndexText','ariaActiveDescendantElement','ariaControlsElements','ariaDescribedByElements','ariaDetailsElements','ariaErrorMessageElements','ariaFlowToElements','ariaLabelledByElements'],
//   HTMLElement: ['title','lang','translate','dir','hidden','inert','accessKey','draggable','spellcheck','autocapitalize','contentEditable','enterKeyHint','inputMode','virtualKeyboardPolicy','offsetParent','offsetTop','offsetLeft','offsetWidth','offsetHeight','innerText','outerText','writingSuggestions','autofocus','tabIndex','style'],
// };

// export const HTML_ELEMENT_PROPERTIES: Record<string, string[]> = {
//   a: ['target','download','ping','rel','relList','hreflang','type','referrerPolicy','text','coords','charset','name','rev','shape','protocol','username','password','host','hostname','port','pathname','search','hash','href','attributionSrc'],
//   area: ['alt','coords','download','shape','target','ping','rel','relList','referrerPolicy','noHref','protocol','username','password','host','hostname','port','pathname','search','hash','href','attributionSrc'],
//   base: ['href','target'],
//   blockquote: ['cite'],
//   br: ['clear'],
//   button: ['disabled','formAction','formEnctype','formMethod','formNoValidate','formTarget','name','type','value','commandForElement','command'],
//   canvas: ['width','height'],
//   col: ['span','ch','chOff','vAlign','width'],
//   colgroup: ['span','ch','chOff','vAlign','width'],
//   data: ['value'],
//   del: ['cite','dateTime'],
//   details: ['open','name'],
//   dialog: ['open','returnValue','closedBy'],
//   dir: ['compact'],
//   dl: ['compact'],
//   embed: ['src','type','width','height','name'],
//   fieldset: ['disabled','name'],
//   font: ['color','face','size'],
//   form: ['acceptCharset','action','autocomplete','enctype','encoding','method','name','noValidate','target','rel','relList'],
//   frame: ['name','scrolling','src','frameBorder','longDesc','noResize','marginHeight','marginWidth'],
//   frameset: ['cols','rows'],
//   hr: ['color','noShade','size','width'],
//   html: ['version'],
//   iframe: ['src','srcdoc','name','sandbox','allowFullscreen','width','height','referrerPolicy','csp','allow','loading','scrolling','frameBorder','longDesc','marginHeight','marginWidth','credentialless','allowPaymentRequest','privateToken','browsingTopics','adAuctionHeaders','sharedStorageWritable'],
//   img: ['alt','src','srcset','sizes','crossOrigin','useMap','isMap','width','height','referrerPolicy','decoding','fetchPriority','loading','name','lowsrc','hspace','vspace','longDesc','border','browsingTopics','attributionSrc','sharedStorageWritable'],
//   input: ['accept','alt','autocomplete','defaultChecked','checked','dirName','disabled','files','formAction','formEnctype','formMethod','formNoValidate','formTarget','height','indeterminate','max','maxLength','min','minLength','multiple','name','pattern','placeholder','readOnly','required','size','src','step','type','defaultValue','value','valueAsDate','valueAsNumber','width','selectionStart','selectionEnd','selectionDirection','useMap','webkitdirectory','incremental'],
//   ins: ['cite','dateTime'],
//   label: ['htmlFor'],
//   li: ['value','type'],
//   link: ['disabled','href','crossOrigin','rel','relList','media','hreflang','type','as','referrerPolicy','sizes','fetchPriority','imageSrcset','imageSizes','charset','rev','target','integrity','blocking'],
//   map: ['name'],
//   menu: ['compact'],
//   meta: ['name','httpEquiv','content','media','scheme'],
//   meter: ['value','min','max','low','high','optimum'],
//   object: ['data','type','name','useMap','width','height','archive','code','declare','hspace','standby','vspace','codeBase','codeType','border'],
//   ol: ['reversed','start','type','compact'],
//   optgroup: ['disabled','label'],
//   option: ['disabled','label','defaultSelected','selected','value','text'],
//   output: ['htmlFor','name','defaultValue','value'],
//   param: ['name','value','type','valueType'],
//   pre: ['width'],
//   progress: ['value','max'],
//   q: ['cite'],
//   script: ['src','type','noModule','charset','async','defer','crossOrigin','text','referrerPolicy','fetchPriority','event','htmlFor','integrity','blocking','attributionSrc'],
//   select: ['autocomplete','disabled','multiple','name','required','size','length','selectedIndex','value'],
//   source: ['src','type','srcset','sizes','media','width','height'],
//   style: ['disabled','media','type','blocking'],
//   table: ['caption','tHead','tFoot','border','frame','rules','summary','width','cellPadding','cellSpacing'],
//   tbody: ['ch','chOff','vAlign'],
//   td: ['colSpan','rowSpan','headers','axis','height','width','ch','chOff','noWrap','vAlign','abbr','scope'],
//   template: ['shadowRootMode','shadowRootDelegatesFocus','shadowRootClonable','shadowRootSerializable'],
//   textarea: ['autocomplete','cols','dirName','disabled','maxLength','minLength','name','placeholder','readOnly','required','rows','wrap','defaultValue','value','selectionStart','selectionEnd','selectionDirection'],
//   tfoot: ['ch','chOff','vAlign'],
//   th: ['colSpan','rowSpan','headers','axis','height','width','ch','chOff','noWrap','vAlign','abbr','scope'],
//   thead: ['ch','chOff','vAlign'],
//   time: ['dateTime'],
//   title: ['text'],
//   tr: ['ch','chOff','vAlign'],
//   track: ['kind','src','srclang','label','default'],
//   ul: ['compact','type'],
//   video: ['width','height','poster','playsInline','disablePictureInPicture']
// };

export const HTML_ELEMENTS: string[] = [
  'a','abbr','acronym','address','applet','area','article','aside','audio','b','base','basefont','bdi','bdo','big',
  'blockquote','body','br','button','canvas','caption','center','cite','code','col','colgroup','data','datalist','dd',
  'del','details','dfn','dialog','dir','div','dl','dt','em','embed','fieldset','figcaption','figure','font','footer',
  'form','frame','frameset','head','header','hgroup','h1','h2','h3','h4','h5','h6','hr','html','i','iframe','img',
  'input','ins','kbd','keygen','label','legend','li','link','main','map','mark','menu','menuitem','meta','meter','nav',
  'noframes','noscript','object','ol','optgroup','option','output','p','param','picture','pre','progress','q','rp','rt',
  'ruby','s','samp','script','section','select','small','source','span','strike','strong','style','sub','summary','sup',
  'svg','table','tbody','td','template','textarea','tfoot','th','thead','time','title','tr','track','tt','u','ul','var',
  'video','wbr'
]

const nativeVDOMConstructors: Record<string, (
  arg0?: NativeElementProps & OtherHTMLElementProps | Array<VDOMElement | null> | string,
  arg1?: Array<VDOMElement | null> | string) => VDOMElement> = {}

HTML_ELEMENTS.forEach((element) => {
  // TODO: Add runtime debug type checks?
  // TODO: Test thoroughly.
  const vConstructor = function(
    arg0?: NativeElementProps & OtherHTMLElementProps | Array<VDOMElement | null> | string,
    arg1?: Array<VDOMElement | null> | string): VDOMElement {
    const vDOMElement: VDOMElement = {tag: element}
    if (arg0 !== undefined) {
      if (typeof arg0 === 'string') {
        vDOMElement.children = arg0
      } else if (arg0 instanceof Array) {
        vDOMElement.children = arg0
      } else if (typeof arg0 === 'object') {
        vDOMElement.props = arg0
      }
      if (arg1 !== undefined) {
        if (typeof arg1 === 'string') {
          vDOMElement.children = arg1
        } else if (arg1 instanceof Array) {
          vDOMElement.children = arg1
        }
      }
    }
    return vDOMElement

  }
  nativeVDOMConstructors[element] = vConstructor
})

//TODO: test element vDOM factories!

export const {
  a, abbr, acronym, address, applet, area, article, aside, audio, b, base, basefont, bdi, bdo, big, blockquote,
  body, br, button, canvas, caption, center, cite, code, col, colgroup, data, datalist, dd, del, details, dfn,
  dialog, dir, div, dl, dt, em, embed, fieldset, figcaption, figure, font, footer, form, frame, frameset, head,
  header, hgroup, h1, h2, h3, h4, h5, h6, hr, html, i, iframe, img, input, ins, kbd, keygen, label, legend, li,
  link, main, map, mark, menu, menuitem, meta, meter, nav, noframes, noscript, object, ol, optgroup, option,
  output, p, param, picture, pre, progress, q, rp, rt, ruby, s, samp, script, section, select, small, source,
  span, strike, strong, style, sub, summary, sup, svg, table, tbody, td, template, textarea, tfoot, th, thead,
  time, title, tr, track, tt, u, ul, video, wbr
} = nativeVDOMConstructors