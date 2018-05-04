const styleDefs = {};

const _stagingElement = document.createElement('div');

export class Styles extends Array {
  constructor(protochain) {
    super();
    let s = Symbol.for(protochain[0].constructor);
    let localName = protochain[0].constructor.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    if (!styleDefs[s]) {
      styleDefs[s] = [];
      for (let i = protochain.length; i--;) {
        let style = protochain[i].constructor.style;
        if (style) {
          if (i < protochain.length - 1 && style == protochain[i + 1].constructor.style) continue;
          style = style.replace(new RegExp(':host', 'g'), localName);
          styleDefs[s].push(style);
          _stagingElement.innerHTML = style;
          let element = _stagingElement.querySelector('style');
          element.setAttribute('id', 'io-style-' + localName);
          document.head.appendChild(element);
        }
      }
    }
    return styleDefs[s];
  }
}
