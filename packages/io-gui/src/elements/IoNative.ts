import { VDOMElement } from '../core/VDOM';
import { IoElementArgs } from './IoElement';

export type NativeElementArgs = IoElementArgs & {
  src?: string;
  href?: string;
}

const nativeElements = [
  'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'big', 'blockquote',
  'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn',
  'dialog', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'head',
  'header', 'hgroup', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend',
   'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option',
  'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source',
  'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'svg', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead',
  'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr'
];
const nativeVDOMConstructors: Record<string, (arg0?: NativeElementArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement> = {};
nativeElements.forEach((element) => {
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