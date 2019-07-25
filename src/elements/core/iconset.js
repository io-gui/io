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
  <g id="unlink">
    <path d="M3.19,12c0-1.86,1.51-3.37,3.37-3.37h4.35V6.56H6.56c-3,0-5.44,2.44-5.44,5.44s2.44,5.44,5.44,5.44h4.35v-2.07H6.56
      C4.7,15.37,3.19,13.86,3.19,12z M17.44,6.56h-4.35v2.07h4.35c1.86,0,3.37,1.51,3.37,3.37s-1.51,3.37-3.37,3.37h-4.35v2.07h4.35
      c3,0,5.44-2.44,5.44-5.44S20.44,6.56,17.44,6.56z"/>
  </g>
  <g id="link">
    <path d="M3.19,12c0-1.86,1.51-3.37,3.37-3.37h4.35V6.56H6.56c-3,0-5.44,2.44-5.44,5.44s2.44,5.44,5.44,5.44h4.35v-2.07H6.56
      C4.7,15.37,3.19,13.86,3.19,12z M7.65,13.09h8.71v-2.18H7.65V13.09z M17.44,6.56h-4.35v2.07h4.35c1.86,0,3.37,1.51,3.37,3.37
      s-1.51,3.37-3.37,3.37h-4.35v2.07h4.35c3,0,5.44-2.44,5.44-5.44S20.44,6.56,17.44,6.56z"/>
  </g>
  <g id="gear">
    <path d="M22.68,14.95l-2.39-1.85c0.04-0.36,0.09-0.71,0.09-1.09s-0.02-0.74-0.09-1.09l2.37-1.85
      c0.2-0.18,0.27-0.47,0.13-0.71l-2.23-3.86c-0.13-0.25-0.42-0.34-0.69-0.25l-2.77,1.12c-0.58-0.45-1.21-0.83-1.9-1.09L14.77,1.3
      c-0.02-0.27-0.27-0.47-0.54-0.47H9.77c-0.27,0-0.51,0.2-0.56,0.47L8.79,4.25C8.12,4.54,7.47,4.9,6.89,5.34L4.12,4.23
      c-0.25-0.09-0.54,0-0.69,0.25L1.19,8.34C1.06,8.58,1.1,8.87,1.33,9.05l2.37,1.85C3.65,11.26,3.63,11.62,3.63,12s0.02,0.74,0.07,1.09
      l-2.37,1.85c-0.2,0.18-0.27,0.47-0.13,0.71l2.23,3.86c0.13,0.25,0.42,0.34,0.69,0.25l2.77-1.12c0.58,0.45,1.21,0.83,1.9,1.09
      l0.42,2.95c0.04,0.27,0.27,0.47,0.56,0.47h4.47c0.27,0,0.51-0.2,0.56-0.47l0.42-2.95c0.67-0.29,1.32-0.65,1.88-1.09l2.79,1.12
      c0.25,0.09,0.54,0,0.69-0.25l2.23-3.86C22.95,15.42,22.88,15.13,22.68,14.95z M12,16.13c-2.3,0-4.17-1.87-4.17-4.17
      S9.7,7.79,12,7.79c2.3,0,4.17,1.87,4.17,4.17S14.3,16.13,12,16.13z"/>
  </g>
  </defs>
</svg>
`;

IoIconsetSingleton.registerIcons('icons', icons);
