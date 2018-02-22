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

const _styledElements = {};
const _stagingElement = document.createElement('div');

export function initStyle(localName, style) {
  if (style && !_styledElements[localName]) {
    _styledElements[localName] = true;
    _stagingElement.innerHTML = style.replace(new RegExp(':host', 'g'), localName);
    let element = _stagingElement.querySelector('style');
    element.setAttribute('id', 'io-style-' + localName);
    document.head.appendChild(element);
  }
}

// https://github.com/lukejacksonn/ijk
const clense = (a, b) => !b ? a : typeof b[0] === 'string' ? [...a, b] : [...a, ...b]
const build = () => node => !!node && typeof node[1] === 'object' && !Array.isArray(node[1])
    ? {
        ['name']: node[0],
        ['props']: node[1],
        ['children']: Array.isArray(node[2]) ? node[2].reduce(clense, []).map(build()) : node[2] || ''
      }
    : build()([node[0], {}, node[1] || ''])
export const h = build
