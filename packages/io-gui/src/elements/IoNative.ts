import { VDOMElement } from '../vdom/VDOM';
import { IoElementArgs } from './IoElement';

export type NativeElementArgs = IoElementArgs & {
  src?: string;
  href?: string;
}

export const HTML_ELEMENTS = [
  'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'big', 'blockquote',
  'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn',
  'dialog', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'head',
  'header', 'hgroup', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend',
   'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option',
  'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source',
  'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'svg', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead',
  'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr'
];

export const HTML_CORE_PROPERTIES = {
  Node: ['ownerDocument','parentNode','parentElement','childNodes','firstChild','lastChild','previousSibling','nextSibling','textContent'],
  Element: ['id','innerHTML','outerHTML','scrollTop','scrollLeft','scrollWidth','scrollHeight','clientTop','clientLeft','clientWidth','clientHeight','role','ariaAtomic','ariaAutoComplete','ariaBusy','ariaBrailleLabel','ariaBrailleRoleDescription','ariaChecked','ariaColCount','ariaColIndex','ariaColSpan','ariaCurrent','ariaDescription','ariaDisabled','ariaExpanded','ariaHasPopup','ariaHidden','ariaInvalid','ariaKeyShortcuts','ariaLabel','ariaLevel','ariaLive','ariaModal','ariaMultiLine','ariaMultiSelectable','ariaOrientation','ariaPlaceholder','ariaPosInSet','ariaPressed','ariaReadOnly','ariaRelevant','ariaRequired','ariaRoleDescription','ariaRowCount','ariaRowIndex','ariaRowSpan','ariaSelected','ariaSetSize','ariaSort','ariaValueMax','ariaValueMin','ariaValueNow','ariaValueText','children','firstElementChild','lastElementChild','childElementCount','previousElementSibling','nextElementSibling','currentCSSZoom','ariaColIndexText','ariaRowIndexText','ariaActiveDescendantElement','ariaControlsElements','ariaDescribedByElements','ariaDetailsElements','ariaErrorMessageElements','ariaFlowToElements','ariaLabelledByElements'],
  HTMLElement: ['title','lang','translate','dir','hidden','inert','accessKey','draggable','spellcheck','autocapitalize','contentEditable','enterKeyHint','inputMode','virtualKeyboardPolicy','offsetParent','offsetTop','offsetLeft','offsetWidth','offsetHeight','innerText','outerText','writingSuggestions','autofocus','tabIndex','style'],
};

export const HTML_ELEMENT_PROPERTIES = {
  a: ['target','download','ping','rel','relList','hreflang','type','referrerPolicy','text','coords','charset','name','rev','shape','origin','protocol','username','password','host','hostname','port','pathname','search','hash','href','attributionSrc'],
  abbr: [],
  acronym: [],
  address: [],
  applet: [],
  area: ['alt','coords','download','shape','target','ping','rel','relList','referrerPolicy','noHref','origin','protocol','username','password','host','hostname','port','pathname','search','hash','href','attributionSrc'],
  article: [],
  aside: [],
  audio: [],
  b: [],
  base: ['href','target'],
  basefont: [],
  bdi: [],
  bdo: [],
  big: [],
  blockquote: ['cite'],
  br: ['clear'],
  button: ['disabled','form','formAction','formEnctype','formMethod','formNoValidate','formTarget','name','type','value','willValidate','validity','validationMessage','labels','commandForElement','command'],
  canvas: ['width','height'],
  caption: [],
  center: [],
  cite: [],
  code: [],
  col: ['span','ch','chOff','vAlign','width'],
  colgroup: ['span','ch','chOff','vAlign','width'],
  data: ['value'],
  datalist: ['options'],
  dd: [],
  del: ['cite','dateTime'],
  details: ['open','name'],
  dfn: [],
  dialog: ['open','returnValue','closedBy'],
  dir: ['compact'],
  div: [],
  dl: ['compact'],
  dt: [],
  em: [],
  embed: ['src','type','width','height','name'],
  fieldset: ['disabled','form','name','type','elements','willValidate','validity','validationMessage'],
  figcaption: [],
  figure: [],
  font: ['color','face','size'],
  footer: [],
  form: ['acceptCharset','action','autocomplete','enctype','encoding','method','name','noValidate','target','rel','relList','elements','length'],
  frame: ['name','scrolling','src','frameBorder','longDesc','noResize','contentDocument','contentWindow','marginHeight','marginWidth'],
  frameset: ['cols','rows','onafterprint','onbeforeprint','onbeforeunload','onhashchange','onlanguagechange','onmessage','onmessageerror','onoffline','ononline','onpagehide','onpageshow','onpopstate','onrejectionhandled','onstorage','onunhandledrejection','onunload'],
  head: [],
  header: [],
  hgroup: [],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
  hr: ['color','noShade','size','width'],
  html: ['version'],
  i: [],
  iframe: ['src','srcdoc','name','sandbox','allowFullscreen','width','height','contentDocument','contentWindow','referrerPolicy','csp','allow','featurePolicy','loading','scrolling','frameBorder','longDesc','marginHeight','marginWidth','credentialless','allowPaymentRequest','privateToken','browsingTopics','adAuctionHeaders','sharedStorageWritable'],
  img: ['alt','src','srcset','sizes','crossOrigin','useMap','isMap','width','height','naturalWidth','naturalHeight','complete','currentSrc','referrerPolicy','decoding','fetchPriority','loading','name','lowsrc','hspace','vspace','longDesc','border','x','y','browsingTopics','attributionSrc','sharedStorageWritable'],
  input: ['accept','alt','autocomplete','defaultChecked','checked','dirName','disabled','form','files','formAction','formEnctype','formMethod','formNoValidate','formTarget','height','indeterminate','list','max','maxLength','min','minLength','multiple','name','pattern','placeholder','readOnly','required','size','src','step','type','defaultValue','value','valueAsDate','valueAsNumber','width','willValidate','validity','validationMessage','labels','selectionStart','selectionEnd','selectionDirection','useMap','webkitdirectory','incremental','webkitEntries'],
  ins: ['cite','dateTime'],
  kbd: [],
  keygen: [],
  label: ['form','htmlFor','control'],
  legend: ['form'],
  li: ['value','type'],
  link: ['disabled','href','crossOrigin','rel','relList','media','hreflang','type','as','referrerPolicy','sizes','fetchPriority','imageSrcset','imageSizes','charset','rev','target','sheet','integrity','blocking'],
  main: [],
  map: ['name','areas'],
  mark: [],
  menu: ['compact'],
  menuitem: [],
  meta: ['name','httpEquiv','content','media','scheme'],
  meter: ['value','min','max','low','high','optimum','labels'],
  nav: [],
  noframes: [],
  noscript: [],
  object: ['data','type','name','useMap','form','width','height','contentDocument','contentWindow','willValidate','validity','validationMessage','archive','code','declare','hspace','standby','vspace','codeBase','codeType','border'],
  ol: ['reversed','start','type','compact'],
  optgroup: ['disabled','label'],
  option: ['disabled','form','label','defaultSelected','selected','value','text','index'],
  output: ['htmlFor','form','name','type','defaultValue','value','willValidate','validity','validationMessage','labels'],
  p: [],
  param: ['name','value','type','valueType'],
  picture: [],
  pre: ['width'],
  progress: ['value','max','position','labels'],
  q: ['cite'],
  rp: [],
  rt: [],
  ruby: [],
  s: [],
  samp: [],
  script: ['src','type','noModule','charset','async','defer','crossOrigin','text','referrerPolicy','fetchPriority','event','htmlFor','integrity','blocking','attributionSrc'],
  section: [],
  select: ['autocomplete','disabled','form','multiple','name','required','size','type','options','length','selectedOptions','selectedIndex','value','willValidate','validity','validationMessage','labels'],
  small: [],
  source: ['src','type','srcset','sizes','media','width','height'],
  span: [],
  strike: [],
  strong: [],
  style: ['disabled','media','type','sheet','blocking'],
  sub: [],
  summary: [],
  sup: [],
  svg: [],
  table: ['caption','tHead','tFoot','tBodies','rows','border','frame','rules','summary','width','cellPadding','cellSpacing'],
  tbody: ['rows','ch','chOff','vAlign'],
  td: ['colSpan','rowSpan','headers','cellIndex','axis','height','width','ch','chOff','noWrap','vAlign','abbr','scope'],
  template: ['content','shadowRootMode','shadowRootDelegatesFocus','shadowRootClonable','shadowRootSerializable'],
  textarea: ['autocomplete','cols','dirName','disabled','form','maxLength','minLength','name','placeholder','readOnly','required','rows','wrap','type','defaultValue','value','textLength','willValidate','validity','validationMessage','labels','selectionStart','selectionEnd','selectionDirection'],
  tfoot: ['rows','ch','chOff','vAlign'],
  th: ['colSpan','rowSpan','headers','cellIndex','axis','height','width','ch','chOff','noWrap','vAlign','abbr','scope'],
  thead: ['rows','ch','chOff','vAlign'],
  time: ['dateTime'],
  title: ['text'],
  tr: ['rowIndex','sectionRowIndex','cells','ch','chOff','vAlign'],
  track: ['kind','src','srclang','label','default','readyState','track','NONE','LOADING','LOADED','ERROR'],
  tt: [],
  u: [],
  ul: ['compact','type'],
  var: [],
  video: ['width','height','videoWidth','videoHeight','poster','webkitDecodedFrameCount','webkitDroppedFrameCount','playsInline','disablePictureInPicture'],
  wbr: [],
};

const nativeVDOMConstructors: Record<string, (arg0?: NativeElementArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement> = {};
HTML_ELEMENTS.forEach((element) => {
  // TODO: Add runtime debuf type checks.
  // TODO: Test thoroughly.
  const vConstructor = function(arg0?: IoElementArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string): VDOMElement {
    const vDOMElement: VDOMElement = {name: element};
    if (arg0 !== undefined) {
      if (typeof arg0 === 'string') {
        vDOMElement.children = arg0;
      } else if (arg0 instanceof Array) {
        vDOMElement.children = arg0;
      } else if (typeof arg0 === 'object') {
        vDOMElement.props = arg0;
      }
      if (arg1 !== undefined) {
        if (typeof arg1 === 'string') {
          vDOMElement.children = arg1;
        } else if (arg1 instanceof Array) {
          vDOMElement.children = arg1;
        }
      }
    }
    return vDOMElement;

  };
  nativeVDOMConstructors[element] = vConstructor;
});

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
} = nativeVDOMConstructors;