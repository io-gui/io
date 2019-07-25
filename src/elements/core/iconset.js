import {IoNode, html} from "../../io.js";

export const IoIconsetDB = {}

export class IoIconset extends IoNode {
  registerIcons(name, svg) {
    const stagingElement = document.createElement('div');
    stagingElement.innerHTML = svg.string;
    stagingElement.querySelectorAll('[id]').forEach(icon => {
      IoIconsetDB[name] = IoIconsetDB[name] || {};
      IoIconsetDB[name][icon.id] = icon.outerHTML;
    });
  }
  getIcon(icon) {
    const iconset = IoIconsetDB[icon.split(':')[0]];
    if (iconset) {
      const group = iconset[icon.split(':')[1]];
      if (group) {
        return `<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">${group}</svg>`;
      }
    }
    return `<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"></svg>`;
  }
}

IoIconset.Register();

export const IoIconsetSingleton = new IoIconset();

const icons = html`
<svg>
  <defs>
    <g id="link"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"></path></g>
    <g id="unlink"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"></path></g>
  </defs>
</svg>
`;

IoIconsetSingleton.registerIcons('icons', icons);
