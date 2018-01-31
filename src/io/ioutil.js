// HTML Escape helper utility thanks to Andrea Giammarchi https://developers.google.com/web/updates/2015/01/ES6-Template-Strings
var util = (function () {
  var
    reEscape = /[&<>'"]/g,
    reUnescape = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g,
    oEscape = { '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'},
    oUnescape = {'&amp;':'&','&#38;':'&','&lt;':'<','&#60;':'<','&gt;':'>','&#62;':'>','&apos;':"'",'&#39;':"'",'&quot;':'"','&#34;':'"'},
    fnEscape = function (m) { return oEscape[m]; },
    fnUnescape = function (m) { return oUnescape[m]; },
    replace = String.prototype.replace
  ;
  return (Object.freeze || Object)({
    escape: function escape(s) { return replace.call(s, reEscape, fnEscape); },
    unescape: function unescape(s) { return replace.call(s, reUnescape, fnUnescape); }
  });
}());

export function html(pieces) {
  var result = pieces[0];
  var substitutions = [].slice.call(arguments, 1);
  for (let i = 0; i < substitutions.length; ++i) {
      result += util.escape(substitutions[i]) + pieces[i + 1];
  }
  return result;
}

export function renderElement(vDOMNode) {
  let ConstructorClass = customElements.get(vDOMNode.name);
  let element;
  if (ConstructorClass) {
    element = new ConstructorClass(vDOMNode.props);
  } else {
    element = document.createElement(vDOMNode.name);
    for (let prop in vDOMNode.props) {
      element[prop] = vDOMNode.props[prop];
    }
  }
  return element;
}

// https://github.com/lukejacksonn/ijk
const clense = (a, b) =>
  !b ? a : typeof b[0] === 'string' ? [...a, b] : [...a, ...b]
const build = (x, y, z) => node =>
  !!node && typeof node[1] === 'object' && !Array.isArray(node[1])
    ? {
        [x]: node[0],
        [y]: node[1],
        [z]: Array.isArray(node[2])
          ? node[2].reduce(clense, []).map(build(x, y, z))
          : node[2] || '', // : node[2] + '',
      }
    : build(x, y, z)([node[0], {}, node[1] || ''])
export const h = build
