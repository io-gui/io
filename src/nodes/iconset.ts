import { IoNode } from '../core/node';
import { Register } from '../core/decorators/register';

export const IoIconsetDB: Record<string, Record<string, string>> = {};

/**
 * Global database for SVG assets to be used with `IoIcon`. Icons are registered using `namespace` and `id` attribute.
 *
 * ```javascript
 * import {IoIconsetSingleton} from "./path_to/io-gui.js";
 * const svgString = `<svg><g id="myicon"><path d="..."/></g></svg>`;
 *
 * // register icons under "custom" namespace
 * IoIconsetSingleton.registerIcons('custom', svgString);
 * // retrieve specific icon
 * const icon = IoIconsetSingleton.getIcon('custom:myicon');
 * ```
 **/
@Register
class IoIconset extends IoNode {
  registerIcons(name: string, svg: string) {
    const stagingElement = document.createElement('div');
    stagingElement.innerHTML = svg;
    stagingElement.querySelectorAll('[id]').forEach(icon => {
      IoIconsetDB[name] = IoIconsetDB[name] || {};
      IoIconsetDB[name][icon.id] = icon.outerHTML;
    });
  }
  getIcon(icon: string) {
    const iconset = IoIconsetDB[icon.split(':')[0]];
    if (iconset) {
      const id = icon.split(':')[1];
      if (iconset[id]) {
        const group = iconset[id].replace(' id="', ' class="icon-id-');
        return `<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">${group}</svg>`;
      }
    }
    return '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"></svg>';
  }
}

export const IoIconsetSingleton = new IoIconset();

const icons = /* html */`
<svg>
<g id="io">
  <ellipse fill="#83A61E" cx="5.4" cy="12.1" rx="3.4" ry="3.4"/>
  <path fill="#646464" d="M16.3,17.7c-3.1,0-5.6-2.6-5.6-5.6s2.6-5.6,5.6-5.6s5.6,2.6,5.6,5.6S19.3,17.7,16.3,17.7z M16.3,8.8
    c-1.8,0-3.3,1.5-3.3,3.2s1.5,3.2,3.3,3.2s3.3-1.5,3.3-3.2S18.1,8.8,16.3,8.8z"/>
</g>
<g id="io_logo">
  <path fill="#646464" d="M19.5,12.7c0.3-0.3,0.3-0.9,0-1.2l-0.7-0.7l-2.6-2.6c-0.3-0.3-0.3-0.9,0-1.2c0.3-0.3,0.9-0.3,1.2,0l3.8,3.8
    c0.7,0.7,0.7,1.8,0,2.6l-3.8,3.8c-0.3,0.3-0.9,0.3-1.2,0c-0.3-0.3-0.3-0.9,0-1.2"/>
  <path fill="#646464" d="M4.3,12.7c-0.3-0.3-0.3-0.9,0-1.2L5,10.8l2.6-2.6c0.3-0.3,0.3-0.9,0-1.2C7.3,6.7,6.7,6.7,6.4,7l-3.8,3.8
    c-0.7,0.7-0.7,1.8,0,2.6l3.8,3.8c0.3,0.3,0.9,0.3,1.2,0s0.3-0.9,0-1.2"/>
  <ellipse fill="#83A61E" cx="8.4" cy="12.1" rx="1.7" ry="1.7"/>
  <path fill="#646464" d="M13.9,14.9c-1.6,0-2.8-1.2-2.8-2.8s1.2-2.8,2.8-2.8s2.8,1.2,2.8,2.8S15.4,14.9,13.9,14.9z M13.9,10.4
    c-0.9,0-1.7,0.7-1.7,1.7c0,0.9,0.7,1.7,1.7,1.7c0.9,0,1.7-0.7,1.7-1.7C15.5,11.2,14.8,10.4,13.9,10.4z"/>
</g>
</svg>`;

IoIconsetSingleton.registerIcons('icons', icons);
