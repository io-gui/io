import { IoElementArgs } from '../core/element';
import { VDOMArray } from '../core/internals/vDOM';

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
const nativeVDOMConstructors: Record<string, (arg0?: NativeElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray> = {};
nativeElements.forEach((element) => {
  const vConstructor = function(arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string): VDOMArray {
    if (arg0 !== undefined) {
      if (arg1 !== undefined) {
        return [element, arg0 as IoElementArgs, arg1 as VDOMArray[] | string];
      } else {
        return [element, arg0 as IoElementArgs | VDOMArray[] | string];
      }
    } else {
      return [element];
    }
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