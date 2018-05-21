export const renderNode = function(vDOMNode) {
  let ConstructorClass = customElements.get(vDOMNode.name);
  let element;
  if (ConstructorClass) {
    element = new ConstructorClass(vDOMNode.props);
  } else {
    element = document.createElement(vDOMNode.name);
    updateNode(element, vDOMNode);
  }
  return element;
};

export const updateNode = function(element, vDOMNode) {
  for (let prop in vDOMNode.props) {
    element[prop] = vDOMNode.props[prop];
  }
  // TODO: handle special cases cleaner
  // TODO: use attributeStyleMap when implemented in browser
  // https://developers.google.com/web/updates/2018/03/cssom
  if (vDOMNode.props['style']) {
    for (let s in vDOMNode.props['style']) {
      element['style'][s] = vDOMNode.props['style'][s];
    }
  }
  return element;
};

// https://github.com/lukejacksonn/ijk
const clense = (a, b) => !b ? a : typeof b[0] === 'string' ? [...a, b] : [...a, ...b];
// TODO: understand!
export const buildTree = () => node => !!node && typeof node[1] === 'object' && !Array.isArray(node[1]) ? {
    ['name']: node[0],
    ['props']: node[1],
    ['children']: Array.isArray(node[2]) ? node[2].reduce(clense, []).map(buildTree()) : node[2] || ''
  } : buildTree()([node[0], {}, node[1] || '']);
