import { Node, Register } from 'io-gui';

export const IconsetDB: Record<string, Record<string, string>> = {};

/**
 * Global database for SVG assets to be used with `IoIcon`. Icons are registered using `namespace:id` attribute.
 **/
@Register
class Iconset extends Node {
  registerIcons(name: string, svg: string) {
    const stagingElement = document.createElement('div');
    stagingElement.innerHTML = svg;
    stagingElement.querySelectorAll('[id]').forEach(icon => {
      IconsetDB[name] = IconsetDB[name] || {};
      IconsetDB[name][icon.id] = icon.outerHTML;
    });
  }
  getIcon(icon: string) {
    const iconset = IconsetDB[icon.split(':')[0]];
    if (iconset) {
      const id = icon.split(':')[1];
      if (iconset[id]) {
        const group = iconset[id].replace(' id="', ' class="icon-id-');
        return `<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">${group}</svg>`;
      }
    }
    return '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"></g>';
  }
}

export const IconsetSingleton = new Iconset();

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

  <g id="numeric-0">
    <path d="M11,7A2,2 0 0,0 9,9V15A2,2 0 0,0 11,17H13A2,2 0 0,0 15,15V9A2,2 0 0,0 13,7H11M11,9H13V15H11V9Z" />
  </g>
  <g id="numeric-1">
    <path d="M10,7V9H12V17H14V7H10Z" />
  </g>
  <g id="numeric-2">
    <path d="M9,7V9H13V11H11A2,2 0 0,0 9,13V17H11L15,17V15H11V13H13A2,2 0 0,0 15,11V9A2,2 0 0,0 13,7H9Z" />
  </g>
  <g id="numeric-3">
    <path d="M15,15V13.5A1.5,1.5 0 0,0 13.5,12A1.5,1.5 0 0,0 15,10.5V9C15,7.89 14.1,7 13,7H9V9H13V11H11V13H13V15H9V17H13A2,2 0 0,0 15,15" />
  </g>
  <g id="numeric-4">
    <path d="M9,7V13H13V17H15V7H13V11H11V7H9Z" />
  </g>
  <g id="numeric-5">
    <path d="M9,7V13H13V15H9V17H13A2,2 0 0,0 15,15V13A2,2 0 0,0 13,11H11V9H15V7H9Z" />
  </g>
  <g id="numeric-6">
    <path d="M11,7A2,2 0 0,0 9,9V15A2,2 0 0,0 11,17H13A2,2 0 0,0 15,15V13A2,2 0 0,0 13,11H11V9H15V7H11M11,13H13V15H11V13Z" />
  </g>
  <g id="numeric-7">
    <path d="M11,17L15,9V7H9V9H13L9,17" />
  </g>
  <g id="numeric-8">
    <path d="M11,13H13V15H11M11,9H13V11H11M11,17H13A2,2 0 0,0 15,15V13.5A1.5,1.5 0 0,0 13.5,12A1.5,1.5 0 0,0 15,10.5V9C15,7.89 14.1,7 13,7H11A2,2 0 0,0 9,9V10.5A1.5,1.5 0 0,0 10.5,12A1.5,1.5 0 0,0 9,13.5V15C9,16.11 9.9,17 11,17" />
  </g> 
  <g id="numeric-9">
    <path d="M13,17A2,2 0 0,0 15,15V9A2,2 0 0,0 13,7H11A2,2 0 0,0 9,9V11A2,2 0 0,0 11,13H13V15H9V17H13M13,11H11V9H13V11Z" />
  </g>
  <g id="numeric-0-box">
    <path d="M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19M11,7A2,2 0 0,0 9,9V15A2,2 0 0,0 11,17H13A2,2 0 0,0 15,15V9A2,2 0 0,0 13,7H11M11,9H13V15H11V9Z" />
  </g>
  <g id="numeric-1-box">
    <path d="M14,17H12V9H10V7H14M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z" />
  </g>
  <g id="numeric-2-box">
    <path d="M15,11C15,12.11 14.1,13 13,13H11V15H15V17H9V13C9,11.89 9.9,11 11,11H13V9H9V7H13A2,2 0 0,1 15,9M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z" />
  </g>
  <g id="numeric-3-box">
    <path d="M15,10.5A1.5,1.5 0 0,1 13.5,12C14.34,12 15,12.67 15,13.5V15C15,16.11 14.11,17 13,17H9V15H13V13H11V11H13V9H9V7H13C14.11,7 15,7.89 15,9M19,3H5C3.91,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19C20.11,21 21,20.1 21,19V5A2,2 0 0,0 19,3Z" />
  </g>
  <g id="numeric-4-box">
    <path d="M15,17H13V13H9V7H11V11H13V7H15M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z" />
  </g>
  <g id="numeric-5-box">
    <path d="M15,9H11V11H13A2,2 0 0,1 15,13V15C15,16.11 14.1,17 13,17H9V15H13V13H9V7H15M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z" />
  </g>
  <g id="numeric-6-box">
    <path d="M15,9H11V11H13A2,2 0 0,1 15,13V15C15,16.11 14.1,17 13,17H11A2,2 0 0,1 9,15V9C9,7.89 9.9,7 11,7H15M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M11,15H13V13H11V15Z" />
  </g>
  <g id="numeric-7-box">
    <path d="M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19M11,17L15,9V7H9V9H13L9,17H11Z" />
  </g>
  <g id="numeric-8-box">
    <path d="M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19M11,17H13A2,2 0 0,0 15,15V13.5A1.5,1.5 0 0,0 13.5,12A1.5,1.5 0 0,0 15,10.5V9C15,7.89 14.1,7 13,7H11A2,2 0 0,0 9,9V10.5A1.5,1.5 0 0,0 10.5,12A1.5,1.5 0 0,0 9,13.5V15C9,16.11 9.9,17 11,17M11,13H13V15H11V13M11,9H13V11H11V9Z" />
  </g>
  <g id="numeric-9-box">
    <path d="M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19M13,11H11V9H13V11M13,7H11A2,2 0 0,0 9,9V11C9,12.11 9.9,13 11,13H13V15H9V17H13A2,2 0 0,0 15,15V9C15,7.89 14.1,7 13,7Z" />
  </g>
  
  <g id="unlink">
    <path d="M3.9,12c0-1.7,1.4-3.2,3.2-3.2h4V7H7c-2.7,0-5,2.2-5,5s2.2,5,5,5h4v-1.9H7C5.2,15.1,3.9,13.7,3.9,12z M17,7h-4.1v1.9H17
    c1.7,0,3.2,1.4,3.2,3.2s-1.4,3.2-3.2,3.2h-4.1v1.9H17c2.7,0,5-2.2,5-5S19.8,7,17,7z"/>
  </g>
  <g id="link">
    <path d="M3.9,12c0-1.7,1.4-3.2,3.2-3.2h4V7H7c-2.7,0-5,2.2-5,5s2.2,5,5,5h4v-1.9H7C5.2,15.1,3.9,13.7,3.9,12z M8,13h8.1v-2H8V13z
      M17,7h-4.1v1.9H17c1.7,0,3.2,1.4,3.2,3.2s-1.4,3.2-3.2,3.2h-4.1v1.9H17c2.7,0,5-2.2,5-5S19.8,7,17,7z"/>
  </g>
  <g id="gear">
    <path d="M21.3,14.6L19.2,13c0-0.3,0.1-0.6,0.1-1c0-0.3,0-0.6-0.1-1l2.1-1.7c0.2-0.2,0.2-0.4,0.1-0.6l-1.9-3.4
      c-0.1-0.2-0.3-0.2-0.6-0.2l-2.4,1c-0.5-0.3-1.1-0.7-1.7-1l-0.3-2.7c0-0.2-0.2-0.4-0.4-0.4h-4C9.8,2.3,9.5,2.4,9.5,2.7L9.1,5.3
      C8.5,5.5,8,5.8,7.5,6.3l-2.4-1c-0.2-0.1-0.5,0-0.7,0.2L2.5,8.8C2.4,9.1,2.4,9.3,2.6,9.5l2.1,1.7c0,0.3-0.1,0.6-0.1,1s0,0.6,0.1,1
      l-2.1,1.7c-0.2,0.2-0.2,0.4-0.1,0.6l1.9,3.4C4.5,19,4.7,19,5,19l2.4-1c0.5,0.4,1.1,0.7,1.7,1l0.4,2.7c0,0.2,0.3,0.4,0.6,0.4H14
      c0.2,0,0.4-0.2,0.5-0.4l0.3-2.7c0.6-0.2,1.2-0.5,1.7-1l2.4,1c0.2,0.1,0.4,0,0.6-0.2l1.9-3.4C21.6,15.1,21.5,14.8,21.3,14.6z
      M11.9,15.6c-2,0-3.7-1.7-3.7-3.7s1.7-3.6,3.7-3.6s3.7,1.7,3.7,3.7S13.9,15.6,11.9,15.6z"/>
  </g>
  <g id="less">
    <path d="M6.6,20.3L8.3,22l3.7-4l3.7,4l1.7-1.7l-5.3-5.7L6.6,20.3z M17.3,3.8l-1.7-1.7l-3.7,4l-3.7-4L6.6,3.8l5.3,5.7L17.3,3.8z"/>
  </g>
  <g id="more">
    <path d="M11.9,5.3l3.7,3.5l1.7-1.6L12,2.1L6.6,7.2l1.7,1.6L11.9,5.3z M11.9,18.9l-3.7-3.5L6.6,17l5.3,5.1l5.3-5.1l-1.7-1.6
      L11.9,18.9z"/>
  </g>
  <g id="code">
    <path d="M9.4,16.6L4.8,12l4.6-4.6L8,6.1l-6,6l6,6L9.4,16.6z M14.5,16.6l4.6-4.6l-4.6-4.6L15.9,6l6,6l-6,6L14.5,16.6z"/>
  </g>
  <g id="tune">
    <path d="M2,17.6v2.2h6.6v-2.2H2z M2,4.3v2.2h11V4.3H2z M13,22v-2.2h8.9v-2.2H13v-2.2h-2.2V22H13z M6.4,8.7V11H2v2.2h4.4v2.2h2.2
      V8.7H6.4z M21.9,13.1v-2.2h-11v2.2H21.9z M15.3,8.7h2.2V6.5h4.4V4.3h-4.4V2.1h-2.2V8.7z"/>
  </g>
  <g id="unlock">
    <path d="M11.9,17.3c1,0,1.9-0.8,1.9-1.9s-0.8-1.9-1.9-1.9S10,14.3,10,15.4S11,17.3,11.9,17.3z M17.6,8.7h-0.9V6.8
      c-0.1-2.6-2.2-4.7-4.7-4.7S7.3,4.3,7.3,6.8H9c0-1.7,1.3-2.9,2.9-2.9s2.9,1.3,2.9,2.9v1.9H6.4c-1.1,0-1.9,0.8-1.9,1.9v9.5
      c0,1.1,0.8,1.9,1.9,1.9h11.2c1,0,1.9-0.8,1.9-1.9v-9.5C19.4,9.6,18.6,8.7,17.6,8.7z M17.6,20.1H6.4v-9.5h11.2V20.1z"/>
  </g>
  <g id="lock">
    <path d="M11.9,17.3c1,0,1.9-0.8,1.9-1.9s-0.8-1.9-1.9-1.9S10,14.3,10,15.4S11,17.3,11.9,17.3z M17.6,8.7h-0.9V6.8
      c-0.1-2.6-2.2-4.7-4.7-4.7S7.3,4.3,7.3,6.8v1.9H6.4c-1.1,0-1.9,0.8-1.9,1.9v9.5c0,1.1,0.8,1.9,1.9,1.9h11.2c1,0,1.9-0.8,1.9-1.9
      v-9.5C19.4,9.6,18.6,8.7,17.6,8.7z M9,6.8c0-1.7,1.3-2.9,2.9-2.9s2.9,1.3,2.9,2.9v1.9H9V6.8z M17.6,20.1H6.4v-9.5h11.2V20.1z"/>
  </g>
  <g id="more_horizontal">
    <path d="M4.5,9.6C3.1,9.6,2,10.7,2,12.1s1.1,2.5,2.5,2.5S7,13.5,7,12.1S5.9,9.6,4.5,9.6z M19.4,9.6c-1.4,0-2.5,1.1-2.5,2.5
      s1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5S20.8,9.6,19.4,9.6z M11.9,9.6c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5
      S13.4,9.6,11.9,9.6z"/>
  </g>
  <g id="more_vertical">
    <path d="M11.9,7.1c1.4,0,2.5-1.1,2.5-2.5s-1.1-2.5-2.5-2.5S9.5,3.2,9.5,4.6S10.5,7.1,11.9,7.1z M11.9,9.6c-1.4,0-2.5,1.1-2.5,2.5
      s1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5S13.4,9.6,11.9,9.6z M11.9,17.1c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5
      S13.4,17.1,11.9,17.1z"/>
  </g>
  <g id="chevron_left">
    <path d="M18.1,4.4l-2.3-2.3l-10,10l10,10l2.3-2.3l-7.6-7.6L18.1,4.4z"/>
  </g>
  <g id="chevron_up">
    <path d="M11.9,5.9l-10,10l2.3,2.3l7.6-7.6l7.6,7.6l2.3-2.3L11.9,5.9z"/>
  </g>
  <g id="chevron_down">
    <path d="M4.3,5.9l7.6,7.6l7.6-7.6l2.3,2.3l-10,10L2,8.2L4.3,5.9z"/>
  </g>
  <g id="chevron_right">
    <path d="M5.8,19.7l7.6-7.6L5.8,4.4l2.3-2.3l10,10l-10,10L5.8,19.7z"/>
  </g>
  <g id="arrow_left">
    <path d="M21.9,10.8H6.7l7-7L12,2.1l-10,10l10,10l1.7-1.7l-7-7h15.2V10.8z"/>
  </g>
  <g id="arrow_down">
    <path d="M21.9,12.1l-1.7-1.7l-7,7V2.1h-2.5v15.2l-7-7L2,12.1l10,10L21.9,12.1z"/>
  </g>
  <g id="arrow_up">
    <path d="M2,12.1l1.7,1.7l7-7V22h2.5V6.8l7,7l1.7-1.7l-10-10L2,12.1z"/>
  </g>
  <g id="arrow_right">
    <path d="M2,13.3h15.2l-7,7l1.7,1.7l10-10l-10-10l-1.7,1.7l7,7H2V13.3z"/>
  </g>
  <g id="arrow_end">
    <polygon points="7.6,3.8 14.6,10.8 2,10.8 2,13.3 14.6,13.3 7.6,20.3 9.4,22 19.3,12.1 9.4,2.1   "/>
    <rect x="19.4" y="2.1" width="2.5" height="19.9"/>
  </g>
  <g id="arrow_home">
    <polygon points="16.3,20.3 9.3,13.3 21.9,13.3 21.9,10.8 9.3,10.8 16.3,3.8 14.5,2.1 4.6,12.1 14.5,22   "/>
    <rect x="2" y="2.1" width="2.5" height="19.9"/>
  </g>
  <g id="chevron_end">
    <path d="M2,4.4L9.6,12L2,19.7L4.3,22l10-10L4.3,2L2,4.4z M18.6,2.1h3.3V22h-3.3V2.1z"/>
  </g>
  <g id="chevron_home">
    <path d="M21.9,19.7l-7.6-7.6l7.6-7.6l-2.3-2.3l-10,10l10,10L21.9,19.7z M5.3,22H2V2.1h3.3V22z"/>
  </g>
  <g id="check">
    <path d="M8.3,16.5l-4.7-4.7L2,13.3l6.3,6.3L21.9,6.1l-1.6-1.6L8.3,16.5z"/>
  </g>
  <g id="close">
    <path d="M21.9,4.1l-2-2l-8,8l-8-8l-2,2l8,8l-8,8l2,2l8-8l8,8l2-2l-8-8L21.9,4.1z"/>
  </g>
  <g id="circle">
    <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8
      s8,3.6,8,8S16.4,20,11.9,20z"/>
  </g>
  <g id="circle_minus">
    <path d="M7,11.1v2h10v-2C16.9,11.1,7,11.1,7,11.1z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z
      M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z"/>
  </g>
  <g id="circle_plus">
    <path d="M12.9,7.1h-2v4H7v2h4v4h2v-4h4v-2h-4v-4H12.9z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1
      z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z"/>
  </g>
  <g id="circle_close">
    <path d="M14.5,8.1l-2.6,2.6L9.4,8.1L8,9.5l2.6,2.6L8,14.6L9.4,16l2.6-2.6l2.6,2.6l1.4-1.4L13.4,12L16,9.4L14.5,8.1z M11.9,2.1
      c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8
      S16.4,20,11.9,20z"/>
  </g>
  <g id="close_small">
    <path d="M14.5,8.1l-2.6,2.6L9.4,8.1L8,9.5l2.6,2.6L8,14.6L9.4,16l2.6-2.6l2.6,2.6l1.4-1.4L13.4,12L16,9.4L14.5,8.1z"/>
  </g>
  <g id="circle_triangle_right">
    <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8
      s8,3.6,8,8S16.4,20,11.9,20z"/>
    <polygon points="10,16.6 15.9,12.1 10,7.6   "/>
  </g>
  <g id="circle_triangle_down">
    <path d="M21.9,12.1c0-5.5-4.5-10-10-10S2,6.6,2,12.1s4.5,10,10,10S21.9,17.5,21.9,12.1z M4,12.1c0-4.4,3.6-8,8-8s8,3.6,8,8
      s-3.6,8-8,8S4,16.5,4,12.1z"/>
    <polygon points="7.5,10.1 11.9,16.1 16.4,10.1   "/>
  </g>
  <g id="circle_triangle_left">
    <path d="M11.9,22c5.5,0,10-4.5,10-10s-4.5-10-10-10S2,6.6,2,12.1S6.5,22,11.9,22z M11.9,4.1c4.4,0,8,3.6,8,8s-3.6,8-8,8s-8-3.6-8-8
      S7.5,4.1,11.9,4.1z"/>
    <polygon points="13.9,7.6 8,12.1 13.9,16.6   "/>
  </g>
  <g id="circle_triangle_up">
    <path d="M2,12.1c0,5.5,4.5,10,10,10s10-4.5,10-10s-4.5-10-10-10S2,6.6,2,12.1z M19.9,12.1c0,4.4-3.6,8-8,8s-8-3.6-8-8s3.6-8,8-8
      S19.9,7.7,19.9,12.1z"/>
    <polygon points="16.4,14.1 11.9,8.1 7.5,14.1   "/>
  </g>
  <g id="triangle_right">
    <polygon points="9.1,16.5 14.9,12 9.1,7.5   "/>
  </g>
  <g id="triangle_down">
    <polygon points="7.6,9 11.9,15 16.5,9   "/>
  </g>
  <g id="triangle_left">
    <polygon points="14.9,7.5 9.1,12 14.9,16.5   "/>
  </g>
  <g id="triangle_up">
    <polygon points="16.5,15 11.9,9 7.6,15   "/>
  </g>
  <g id="circle_pause">
    <path d="M9,16.1h2v-8H9V16.1z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20
      c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z M12.9,16.1h2v-8h-2V16.1z"/>
  </g>
  <g id="circle_info">
    <path d="M11,17.1h2v-6h-2V17.1z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20
      c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z M11,9.1h2v-2h-2C11,7.1,11,9.1,11,9.1z"/>
  </g>
  <g id="circle_warning">
    <path d="M11,15.1h2v2h-2V15.1z M11,7.1h2v6h-2V7.1z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z
      M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z"/>
  </g>
  <g id="circle_help">
    <path d="M11,18h2v-2h-2C11,16.1,11,18,11,18z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z
      M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z M11.9,6.1c-2.2,0-4,1.8-4,4h2c0-1.1,0.9-2,2-2s2,0.9,2,2
      c0,2-3,1.8-3,5h2c0-2.3,3-2.5,3-5C15.9,7.9,14.1,6.1,11.9,6.1z"/>
  </g>
  <g id="circle_checked">
    <path d="M11.9,7.1c-2.8,0-5,2.2-5,5s2.2,5,5,5s5-2.2,5-5S14.8,7.1,11.9,7.1z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10
      s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z"/>
  </g>
  <g id="circle_location">
    <path d="M20,11.2c-0.4-3.8-3.4-6.8-7.1-7.1v-2H11V4c-3.8,0.3-6.8,3.3-7.1,7.1H2V13h1.9c0.4,3.8,3.4,6.8,7.1,7.1V22h1.8v-1.9
      c3.8-0.4,6.8-3.4,7.1-7.1h1.9v-1.8C21.9,11.2,20,11.2,20,11.2z M11.9,18.4c-3.6,0-6.3-2.8-6.3-6.3s2.7-6.3,6.3-6.3s6.3,2.8,6.3,6.3
      S15.5,18.4,11.9,18.4z"/>
  </g>
  <g id="circle_location_checked">
    <path d="M11.9,8.4c-2,0-3.7,1.7-3.7,3.7s1.7,3.7,3.7,3.7s3.7-1.7,3.7-3.7S13.9,8.4,11.9,8.4z M20,11.2c-0.4-3.8-3.4-6.8-7.1-7.1v-2
      H11V4c-3.8,0.3-6.8,3.3-7.1,7.1H2V13h1.9c0.4,3.8,3.4,6.8,7.1,7.1V22h1.8v-1.9c3.8-0.4,6.8-3.4,7.1-7.1h1.9v-1.8
      C21.9,11.2,20,11.2,20,11.2z M11.9,18.4c-3.6,0-6.3-2.8-6.3-6.3s2.7-6.3,6.3-6.3s6.3,2.8,6.3,6.3S15.5,18.4,11.9,18.4z"/>
  </g>
  <g id="circle_fill">
    <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z"/>
  </g>
  <g id="circle_fill_checked">
    <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M10,17.1l-5-5l1.4-1.4l3.6,3.6l7.6-7.6
      L19,8.1L10,17.1z"/>
  </g>
  <g id="circle_fill_minus">
    <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M16.9,13.1H7v-2h10v2H16.9z"/>
  </g>
  <g id="circle_fill_plus">
    <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M16.9,13.1h-4v4h-2v-4H7v-2h4v-4h2v4h4v2
      H16.9z"/>
  </g>
  <g id="circle_fill_arrow_down">
    <path d="M21.9,12.1c0-5.5-4.5-10-10-10S2,6.6,2,12.1s4.5,10,10,10S21.9,17.5,21.9,12.1z M7.5,10.1h9l-4.5,6L7.5,10.1z"/>
  </g>
  <g id="circle_fill_arrow_left">
    <path d="M11.9,22c5.5,0,10-4.5,10-10s-4.5-10-10-10S2,6.6,2,12.1S6.5,22,11.9,22z M13.9,7.6v9l-6-4.5L13.9,7.6z"/>
  </g>
  <g id="circle_fill_arrow_up">
    <path d="M2,12.1c0,5.5,4.5,10,10,10s10-4.5,10-10s-4.5-10-10-10S2,6.6,2,12.1z M16.4,14.1h-9l4.5-6L16.4,14.1z"/>
  </g>
  <g id="circle_fill_arrow_right">
    <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M10,16.6v-9l6,4.5L10,16.6z"/>
  </g>
  <g id="circle_fill_pause">
    <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11,16.1H9v-8h2V16.1z M14.9,16.1h-2v-8h2
      V16.1z"/>
  </g>
  <g id="circle_fill_info">
    <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M12.9,17.1h-2v-6h2V17.1z M12.9,9.1h-2v-2h2
      C12.9,7.1,12.9,9.1,12.9,9.1z"/>
  </g>
  <g id="circle_fill_warning">
    <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M12.9,17.1h-2v-2h2V17.1z M12.9,13.1h-2v-6h2
      C12.9,7.1,12.9,13.1,12.9,13.1z"/>
  </g>
  <g id="circle_fill_help">
    <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M12.9,19h-2v-2h2C12.9,17.1,12.9,19,12.9,19z
      M15,11.4l-0.9,0.9c-0.8,0.7-1.2,1.3-1.2,2.8h-2v-0.6c0-1.1,0.4-2.1,1.2-2.8l1.2-1.3c0.4-0.3,0.6-0.8,0.6-1.4C14,8,13.1,7.1,12,7.1
      s-2,0.9-2,2H8c0-2.2,1.8-4,4-4s4,1.8,4,4C15.9,10,15.5,10.7,15,11.4z"/>
  </g>
  <g id="circle_fill_group">
    <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M8,17.5c-1.4,0-2.5-1.1-2.5-2.5
      s1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5S9.4,17.5,8,17.5z M9.5,8.1c0-1.4,1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5s-1.1,2.5-2.5,2.5
      S9.5,9.5,9.5,8.1z M15.9,17.5c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5S17.3,17.5,15.9,17.5z"/>
  </g>
  <g id="box">
    <path d="M19.7,4.3v15.5H4.2V4.3H19.7 M19.7,2.1H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5c1.2,0,2.2-1,2.2-2.2V4.3
      C21.9,3.1,20.9,2.1,19.7,2.1z"/>
  </g>
  <g id="box_fill">
    <path d="M19.7,2.1H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5c1.2,0,2.2-1,2.2-2.2V4.3C21.9,3.1,20.9,2.1,19.7,2.1z"/>
  </g>
  <g id="box_fill_checked">
    <path d="M19.7,2.1H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5c1.2,0,2.2-1,2.2-2.2V4.3C21.9,3.1,20.9,2.1,19.7,2.1z
      M9.8,17.6l-5.5-5.5l1.6-1.6l4,4l8.3-8.4l1.6,1.5L9.8,17.6z"/>
  </g>
  <g id="box_fill_minus">
    <path d="M19.7,2.1H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5c1.2,0,2.2-1,2.2-2.2V4.3C21.9,3.1,20.9,2.1,19.7,2.1z
      M17.5,13.1H6.4v-2.2h11L17.5,13.1L17.5,13.1z"/>
  </g>
  <path id="box_fill_plus" d="M19.7,2.1H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5c1.2,0,2.2-1,2.2-2.2V4.3
    C21.9,3.1,20.9,2.1,19.7,2.1z M17.5,13.1h-4.4v4.4h-2.2v-4.4H6.4v-2.2h4.4V6.5H13v4.4h4.4L17.5,13.1L17.5,13.1z"/>
  <g id="box_fill_gear">
    <path d="M11.9,9.8c-1.2,0-2.2,1-2.2,2.2s1,2.2,2.2,2.2s2.2-1,2.2-2.2S13.2,9.8,11.9,9.8z M19.7,2.1H4.2C3,2.1,2,3.1,2,4.3v15.5
      C2,21,3,22,4.2,22h15.5c1.2,0,2.2-1,2.2-2.2V4.3C21.9,3.1,20.9,2.1,19.7,2.1z M17.8,12.1c0,0.2,0,0.5-0.1,0.7l1.7,1.2
      c0.2,0.1,0.2,0.3,0.1,0.5l-1.6,2.7c-0.1,0.2-0.3,0.2-0.5,0.2l-1.9-0.7c-0.4,0.3-0.8,0.6-1.3,0.7L14,19.5c0,0.2-0.2,0.3-0.4,0.3
      h-3.1c-0.2,0-0.3-0.2-0.4-0.3l-0.2-2.1C9.4,17.2,9,17,8.6,16.7l-1.9,0.7c-0.2,0.1-0.4,0-0.5-0.2l-1.5-2.7c-0.1-0.2-0.1-0.4,0.1-0.5
      l1.7-1.2c-0.1-0.2-0.1-0.5-0.1-0.7s0-0.5,0.1-0.7l-1.7-1.2C4.4,9.9,4.4,9.7,4.5,9.6l1.6-2.7c0.1-0.2,0.2-0.3,0.4-0.2l1.9,0.7
      c0.4-0.3,0.8-0.6,1.3-0.7L10,4.6c0-0.2,0.2-0.3,0.4-0.3h3.1c0.2,0,0.3,0.2,0.4,0.3l0.2,2.1c0.5,0.2,0.9,0.4,1.3,0.7l1.9-0.7
      c0.2-0.1,0.4,0,0.5,0.2l1.6,2.7c0.1,0.2,0.1,0.4-0.1,0.5l-1.7,1.2C17.8,11.6,17.8,11.8,17.8,12.1z"/>
  </g>
  <g id="box_focus">
    <path d="M4.2,15.4H2v4.4C2,21,3,22,4.2,22h4.4v-2.2H4.2V15.4z M4.2,4.3h4.4V2.1H4.2C3,2.1,2,3.1,2,4.3v4.4h2.2V4.3z M19.7,2.1h-4.4
      v2.2h4.4v4.4h2.2V4.3C21.9,3.1,20.9,2.1,19.7,2.1z M19.7,19.8h-4.4V22h4.4c1.2,0,2.2-1,2.2-2.2v-4.4h-2.2V19.8z M11.9,7.7
      c-2.4,0-4.4,2-4.4,4.4s2,4.4,4.4,4.4s4.4-2,4.4-4.4S14.4,7.7,11.9,7.7z M11.9,14.3c-1.2,0-2.2-1-2.2-2.2s1-2.2,2.2-2.2
      s2.2,1,2.2,2.2S13.2,14.3,11.9,14.3z"/>
  </g>
  <g id="rows">
    <path d="M20.8,13.1H3.1c-0.6,0-1.1,0.5-1.1,1.1v6.6C2,21.5,2.5,22,3.1,22H21c0.6,0,1.1-0.5,1.1-1.1v-6.6
      C21.9,13.6,21.4,13.1,20.8,13.1z M20.8,2.1H3.1C2.5,2.1,2,2.6,2,3.2v6.6c0,0.6,0.5,1.1,1.1,1.1H21c0.6,0,1.1-0.5,1.1-1.1V3.2
      C21.9,2.6,21.4,2.1,20.8,2.1z"/>
  </g>
  <g id="columns">
    <path d="M6.2,2.1H3.1C2.5,2.1,2,2.8,2,3.5v17.1C2,21.4,2.5,22,3.1,22h3.2c0.6,0,1.1-0.7,1.1-1.4V3.5C7.2,2.8,6.7,2.1,6.2,2.1z
      M20.8,2.1h-3.2c-0.6,0-1.1,0.7-1.1,1.4v17.1c0,0.7,0.5,1.4,1.1,1.4h3.2c0.6,0,1.1-0.7,1.1-1.4V3.5C21.9,2.8,21.4,2.1,20.8,2.1z
      M13.5,2.1h-3.2c-0.6,0-1.1,0.7-1.1,1.4v17.1c0,0.7,0.5,1.4,1.1,1.4h3.2c0.6,0,1.1-0.7,1.1-1.4V3.5C14.6,2.8,14.1,2.1,13.5,2.1z"/>
  </g>
  <g id="dashboard">
    <path d="M2,13.1h8.9v-11H2V13.1z M2,22h8.9v-6.6H2V22z M13,22h8.9V11H13V22z M13,2.1v6.6h8.9V2.1H13z"/>
  </g>
  <g id="layer_add">
    <path d="M4,6.1H2v14c0,1.1,0.9,2,2,2h14v-2H4V6.1z M19.9,2.1H8c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-12
      C21.9,3,21,2.1,19.9,2.1z M18.9,11.1h-4v4h-2v-4H9v-2h4v-4h2v4h4C18.9,9.1,18.9,11.1,18.9,11.1z"/>
  </g>
  <g id="layer_remove">
    <path d="M4,6.1H2v14c0,1.1,0.9,2,2,2h14v-2H4V6.1z"/>
    <path d="M19.9,2.1H8c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-12C21.9,3,21,2.1,19.9,2.1z M18.9,11.1H9v-2h10v2
      H18.9z"/>
  </g>
  <g id="layer_to_back">
    <path d="M8.6,6.5H6.4v2.2h2.2V6.5L8.6,6.5z M8.6,11H6.4v2.2h2.2V11C8.5,11,8.6,11,8.6,11z M8.6,2.1c-1.2,0-2.2,1-2.2,2.2h2.2V2.1
      L8.6,2.1z M13,15.4h-2.2v2.2H13C13,17.5,13,15.4,13,15.4z M19.8,2.1v2.2H22C21.9,3.1,20.9,2.1,19.8,2.1z M13,2.1h-2.2v2.2H13V2.1z
      M8.6,17.6v-2.2H6.4C6.4,16.6,7.4,17.6,8.6,17.6z M19.8,13.1H22V11h-2.2V13.1z M19.8,8.7H22V6.5h-2.2V8.7z M19.8,17.6
      c1.2,0,2.2-1,2.2-2.2h-2.2V17.6z M4.1,6.5H2v13.3C2,21,3,22,4.1,22h13.3v-2.2H4.1C4.1,19.9,4.1,6.5,4.1,6.5z M15.3,4.3h2.2V2.1
      h-2.2V4.3z M15.3,17.6h2.2v-2.2h-2.2V17.6z"/>
  </g>
  <g id="layer_to_front">
    <path d="M2,13.1h2.2V11H2V13.1z M2,17.6h2.2v-2.2H2V17.6z M4.1,22v-2.2H2C2,21,3,22,4.1,22z M2,8.7h2.2V6.5H2V8.7z M15.3,22h2.2
      v-2.2h-2.2V22z M19.8,2.1H8.6c-1.2,0-2.2,1-2.2,2.2v11.1c0,1.2,1,2.2,2.2,2.2h11c1.2,0,2.2-1,2.2-2.2V4.3
      C21.9,3.1,20.9,2.1,19.8,2.1z M19.8,15.4H8.6V4.3h11L19.8,15.4L19.8,15.4z M10.9,22H13v-2.2h-2.2C10.9,19.9,10.9,22,10.9,22z
      M6.4,22h2.2v-2.2H6.4V22z"/>
  </g>
  <g id="layer_image">
    <path d="M21.9,16.1v-12c0-1.1-0.9-2-2-2H8c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2h12C21,18,21.9,17.1,21.9,16.1z M11,12.1l2,2.7
      l3-3.7l4,5H8L11,12.1z M2,6.1v14c0,1.1,0.9,2,2,2h14v-2H4v-14C4,6.1,2,6.1,2,6.1z"/>
  </g>
  <g id="image">
    <path d="M21.9,19.8V4.3c0-1.2-1-2.2-2.2-2.2H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5C20.9,22,21.9,21,21.9,19.8z M8,13.7
      l2.7,3.3l3.9-5l5,6.6H4.2L8,13.7z"/>
  </g>
  <g id="label_fill">
    <path d="M17.3,5.6c-0.4-0.5-1-0.9-1.7-0.9H4.1C2.9,4.8,2,5.7,2,6.8v10.5c0,1.2,0.9,2.1,2.1,2.1h11.5c0.7,0,1.3-0.3,1.7-0.9l4.6-6.4
      L17.3,5.6z"/>
  </g>
  <g id="label">
    <path d="M17.3,5.6c-0.4-0.5-1-0.9-1.7-0.9H4.1C2.9,4.7,2,5.6,2,6.8v10.5c0,1.2,0.9,2.1,2.1,2.1h11.5c0.7,0,1.3-0.3,1.7-0.9l4.6-6.3
      L17.3,5.6z M15.6,17.3H4.1V6.8h11.5l3.7,5.2L15.6,17.3z"/>
  </g>
  <g id="backspace">
    <path d="M20.3,4.8H7.8c-0.6,0-1,0.2-1.3,0.7L2,12.1l4.5,6.6c0.3,0.4,0.7,0.7,1.3,0.7h12.5c0.9,0,1.7-0.7,1.7-1.7V6.3
      C21.9,5.4,21.2,4.8,20.3,4.8z M17.8,15l-1.2,1.2l-3-2.9l-3,2.9L9.5,15l3-2.9l-3-2.9L10.6,8l3,2.9l3-2.9l1.2,1.2l-3,2.9L17.8,15z"/>
  </g>
  <g id="redo">
    <path d="M18.3,11.2c-1.8-1.6-4.2-2.6-6.7-2.6c-4.6,0-8.3,3-9.7,7.1l2.2,0.7c1-3.1,4-5.3,7.4-5.3c1.9,0,3.7,0.7,5,1.8l-3.6,3.6h9
      V7.7L18.3,11.2z"/>
  </g>
  <g id="undo">
    <path d="M12.2,8.6c-2.6,0-4.9,1-6.7,2.6L2,7.7v8.8h8.8L7.2,13c1.3-1.2,3.1-1.8,5-1.8c3.4,0,6.3,2.2,7.4,5.3l2.2-0.8
      C20.6,11.6,16.8,8.6,12.2,8.6z"/>
  </g>
  <g id="reload">
    <path d="M19,5c-1.8-1.7-4.3-2.9-7.1-2.9c-5.5,0-10,4.5-10,10s4.5,10,10,10c4.7,0,8.6-3.2,9.6-7.5H19c-1,2.9-3.8,5-7.1,5
      c-4.2,0-7.5-3.3-7.5-7.5s3.3-7.5,7.5-7.5c2.1,0,3.9,0.8,5.2,2.2l-4,4h8.7V2.1L19,5z"/>
  </g>
  <g id="grid_fill">
    <path d="M4,8.1h4v-4H4V8.1z M10,20h4v-4h-4V20z M4,20h4v-4H4V20z M4,14.1h4v-4H4V14.1z M10,14.1h4v-4h-4V14.1z M15.9,4.1v4h4v-4
      C19.9,4.1,15.9,4.1,15.9,4.1z M10,8.1h4v-4h-4V8.1z M15.9,14.1h4v-4h-4V14.1z M15.9,20h4v-4h-4V20z"/>
  </g>
  <g id="grid">
    <path d="M19.9,2.1H4c-1.1,0-2,0.9-2,2V20c0,1.1,0.9,2,2,2h15.9c1.1,0,2-0.9,2-2V4.1C21.9,3,21,2.1,19.9,2.1z M8,20H4v-4h4
      C8,16.1,8,20,8,20z M8,14.1H4v-4h4V14.1z M8,8.1H4v-4h4C8,4.1,8,8.1,8,8.1z M13.9,20h-4v-4h4C13.9,16.1,13.9,20,13.9,20z
      M13.9,14.1h-4v-4h4V14.1z M13.9,8.1h-4v-4h4C13.9,4.1,13.9,8.1,13.9,8.1z M19.9,20h-4v-4h4C19.9,16.1,19.9,20,19.9,20z M19.9,14.1
      h-4v-4h4V14.1z M19.9,8.1h-4v-4h4C19.9,4.1,19.9,8.1,19.9,8.1z"/>
  </g>
  <g id="search">
    <path d="M16.2,14.6h-0.9L15,14.3c1.1-1.2,1.7-2.9,1.7-4.7c0-4.1-3.2-7.3-7.3-7.3S2.1,5.5,2.1,9.6s3.2,7.3,7.3,7.3
      c1.8,0,3.5-0.7,4.7-1.7l0.3,0.3v0.9L20,22l1.7-1.7L16.2,14.6z M9.5,14.6c-2.8,0-5.1-2.2-5.1-5.1s2.2-5.1,5.1-5.1s5.1,2.2,5.1,5.1
      S12.2,14.6,9.5,14.6z"/>
  </g>
  <g id="zoom_in">
    <path d="M16.2,14.6h-0.9L15,14.3c1.1-1.2,1.7-3,1.7-4.7c0-4.1-3.2-7.3-7.3-7.3S2.1,5.5,2.1,9.6s3.2,7.3,7.3,7.3
      c1.8,0,3.5-0.7,4.7-1.7l0.3,0.3v0.9L20,22l1.7-1.7L16.2,14.6z M9.5,14.6c-2.8,0-5.1-2.2-5.1-5.1s2.2-5.1,5.1-5.1s5.1,2.2,5.1,5.1
      S12.2,14.6,9.5,14.6z M12.2,10.1H10v2.2H8.9v-2.2H6.6V9h2.2V6.8H10V9h2.2V10.1L12.2,10.1z"/>
  </g>
  <g id="zoom_out">
    <path d="M16.2,14.6h-0.9L15,14.3c1.1-1.2,1.7-3,1.7-4.7c0-4.1-3.2-7.3-7.3-7.3S2.1,5.5,2.1,9.6s3.2,7.3,7.3,7.3
      c1.8,0,3.5-0.7,4.7-1.7l0.3,0.3v0.9L20,22l1.7-1.7L16.2,14.6z M9.5,14.6c-2.8,0-5.1-2.2-5.1-5.1s2.2-5.1,5.1-5.1s5.1,2.2,5.1,5.1
      S12.2,14.6,9.5,14.6z M6.6,9h5.6v1.2H6.6V9z"/>
  </g>
  <g id="fullscreen">
    <path d="M4.8,14.9H2V22h7.1v-2.8H4.8V14.9z M2,9.2h2.8V4.9H9V2.1H2V9.2z M19.1,19.2h-4.2V22H22v-7.1h-2.8v4.3H19.1z M14.8,2.1v2.8
      H19v4.2h2.9v-7H14.8z"/>
  </g>
  <g id="fullscreen_off">
    <path d="M2,17.8h4.2V22H9v-7.1H2V17.8z M6.2,6.3H2v2.8h7.1v-7H6.2V6.3z M14.8,22h2.8v-4.2h4.3V15h-7.1C14.8,15,14.8,22,14.8,22z
      M17.7,6.3V2.1h-2.8v7.1H22V6.3H17.7z"/>
  </g>
  <g id="color_palette">
    <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10c0.9,0,1.7-0.7,1.7-1.7c0-0.4-0.2-0.8-0.4-1.1c-0.2-0.3-0.4-0.7-0.4-1.1
      c0-0.9,0.7-1.7,1.7-1.7h2c3.1,0,5.6-2.5,5.6-5.6C21.9,6.1,17.4,2.1,11.9,2.1z M5.9,12.1c-0.9,0-1.7-0.7-1.7-1.7S5,8.7,5.9,8.7
      s1.7,0.7,1.7,1.7S6.8,12.1,5.9,12.1z M9.2,7.7C8.3,7.7,7.5,6.9,7.5,6s0.7-1.7,1.7-1.7S10.9,5,10.9,6S10.1,7.7,9.2,7.7z M14.7,7.7
      C13.8,7.7,13,6.9,13,6s0.7-1.7,1.7-1.7c0.9,0,1.7,0.7,1.7,1.7S15.6,7.7,14.7,7.7z M18,12.1c-0.9,0-1.7-0.7-1.7-1.7S17,8.7,18,8.7
      s1.7,0.7,1.7,1.7S18.9,12.1,18,12.1z"/>
  </g>
  <g id="color_picker">
    <path d="M21.6,5L19,2.4c-0.4-0.4-1.2-0.4-1.6,0l-3.5,3.5l-2.1-2.2l-1.6,1.6l1.6,1.6L2,16.8V22h5.2l9.9-9.9l1.6,1.6l1.6-1.6L18.1,10
      l3.5-3.5C22,6.2,22,5.4,21.6,5z M6.3,19.8l-2.2-2.2l9-8.9l2.2,2.2L6.3,19.8z"/>
  </g>
  <g id="trash">
    <path d="M5.3,19.8c0,1.2,1,2.2,2.2,2.2h8.9c1.2,0,2.2-1,2.2-2.2V6.5H5.3V19.8z M19.7,3.2h-3.9l-1.1-1.1H9.2L8,3.2H4.2v2.2h15.5V3.2
      L19.7,3.2z"/>
  </g>
  <g id="trash_empty">
    <path d="M5.3,19.8c0,1.2,1,2.2,2.2,2.2h8.9c1.2,0,2.2-1,2.2-2.2V6.5H5.3V19.8z M8,11.9l1.6-1.5l2.3,2.3l2.3-2.3l1.6,1.6l-2.3,2.3
      l2.3,2.3l-1.6,1.6l-2.3-2.4l-2.3,2.3L8,16.6l2.3-2.3L8,11.9z M15.9,3.2l-1.2-1.1H9.2L8,3.2H4.2v2.2h15.5V3.2H15.9z"/>
  </g>
  <g id="developer">
    <path d="M21.9,9V6.9h-2v-2c0-1.2-0.9-2.1-2-2.1H4c-1.1,0-2,0.9-2,2.1v14.4c0,1.2,0.9,2.1,2,2.1h13.9c1.1,0,2-0.9,2-2.1v-2.1H22
      v-2.1h-2V13h2v-2h-2V9H21.9z M17.9,19.2H4V4.9h13.9V19.2L17.9,19.2z M6,13.1h5v4.1H6V13.1z M11.9,6.9h4V10h-4V6.9z M6,6.9h5V12H6
      V6.9z M11.9,11.1h4v6.1h-4V11.1z"/>
  </g>
  <g id="hub">
    <path d="M17.5,16.5L13,12.1V8.6c1.3-0.5,2.2-1.7,2.2-3.2c0-1.8-1.5-3.3-3.3-3.3S8.6,3.6,8.6,5.4c0,1.4,0.9,2.7,2.2,3.2v3.5
      l-4.4,4.4H2V22h5.6v-3.4l4.4-4.7l4.4,4.7V22H22v-5.6h-4.5V16.5z"/>
  </g>
  <g id="camera">
    <path d="M9.4,10.6l4.7-8.2c-0.7-0.2-1.4-0.2-2.2-0.2C9.5,2.2,7.3,3,5.6,4.4L9.4,10.6L9.4,10.6z M21.4,9.1c-0.9-2.9-3.2-5.2-6-6.3
      l-3.7,6.3H21.4z M21.8,10.1h-7.5l0.2,0.5l4.7,8.2c1.7-1.7,2.7-4.2,2.7-6.7C21.9,11.4,21.8,10.7,21.8,10.1z M8.5,12.1L4.6,5.3
      C3,7.1,2,9.5,2,12.1c0,0.7,0.1,1.3,0.2,2h7.5L8.5,12.1z M2.5,15.1c0.9,2.9,3.2,5.2,6,6.3l3.7-6.3C12.2,15.1,2.5,15.1,2.5,15.1z
      M13.7,15.1l-3.9,6.7C10.5,22,11.2,22,12,22c2.4,0,4.6-0.8,6.3-2.2l-3.7-6.3C14.6,13.5,13.7,15.1,13.7,15.1z"/>
  </g>
  <g id="camera_alt">
    <circle cx="11.9" cy="13.1" r="3.2"/>
    <path d="M9,3.1l-1.8,2H4c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2h15.9c1.1,0,2-0.9,2-2v-12c0-1.1-0.9-2-2-2h-3.2l-1.8-2
      C14.9,3.1,9,3.1,9,3.1z M11.9,18c-2.7,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S14.7,18,11.9,18z"/>
  </g>
  <g id="film">
    <path d="M13.9,5.9c0-1.1-0.9-1.9-2-1.9H11V3c0-0.5-0.4-0.9-0.9-0.9H6.2C5.7,2.1,5.3,2.5,5.3,3v0.9H4.4c-1.1,0-1.9,0.8-1.9,1.9V20
      c0,1.1,0.8,1.9,1.9,1.9H12c1.1,0,1.9-0.8,1.9-1.9h7.6V5.9H13.9z M11.9,18.2H10v-1.9h1.9V18.2z M11.9,9.7H10V7.8h1.9V9.7z
      M15.8,18.2h-1.9v-1.9h1.9V18.2z M15.8,9.7h-1.9V7.8h1.9V9.7z M19.5,18.2h-1.9v-1.9h1.9V18.2z M19.5,9.7h-1.9V7.8h1.9V9.7z"/>
  </g>
  <g id="visibility">
    <path d="M12,5.3c-4.5,0-8.3,2.8-9.9,6.7c1.5,3.9,5.4,6.7,9.9,6.7s8.3-2.8,9.9-6.7C20.3,8,16.5,5.3,12,5.3z M12,16.5
      c-2.5,0-4.5-2-4.5-4.5s2-4.5,4.5-4.5s4.5,2,4.5,4.5S14.5,16.5,12,16.5z M12,9.2c-1.5,0-2.7,1.2-2.7,2.7s1.2,2.7,2.7,2.7
      s2.7-1.2,2.7-2.7S13.5,9.2,12,9.2z"/>
  </g>
  <g id="visibility_off">
    <path d="M12,7.4c2.5,0,4.5,2,4.5,4.5c0,0.6-0.1,1.2-0.3,1.7l2.7,2.7c1.3-1.2,2.4-2.6,3.1-4.2c-1.6-4.1-5.4-6.8-9.9-6.8
      c-1.2,0-2.5,0.2-3.6,0.7l1.9,1.9C10.9,7.5,11.5,7.4,12,7.4z M3.1,4.9l2,2.1l0.4,0.4C4,8.6,2.8,10.2,2.1,11.9c1.6,4,5.4,6.7,9.9,6.7
      c1.4,0,2.7-0.2,3.9-0.7l0.4,0.4L19,21l1.2-1.2L4.1,3.8L3.1,4.9z M8,9.9l1.4,1.4c-0.1,0.2-0.1,0.4-0.1,0.6c0,1.5,1.2,2.7,2.7,2.7
      c0.2,0,0.4,0,0.6-0.1L14,16c-0.6,0.3-1.2,0.5-2,0.5c-2.5,0-4.5-2-4.5-4.5C7.5,11.2,7.7,10.5,8,9.9z M11.9,9.2l2.8,2.8v-0.2
      C14.7,10.4,13.4,9.2,11.9,9.2L11.9,9.2z"/>
  </g>
  <g id="layers">
    <path d="M11.9,19.5l-7.3-5.7L3,15l8.9,7l9-7l-1.6-1.2L11.9,19.5z M11.9,17l7.3-5.7l1.7-1.2l-9-6.9l-9,7l1.6,1.2L11.9,17z"/>
  </g>
  <g id="layers_off">
    <path d="M19.7,16l1.2-0.9l-1.4-1.4l-1.2,0.9L19.7,16z M19.3,11.3l1.7-1.2l-9-7L9,5.3l7.8,7.8C16.9,13.1,19.3,11.3,19.3,11.3z
      M3.3,2.1L2,3.3l4.2,4.2L2.9,10l1.6,1.2l7.3,5.7l2.1-1.6l1.4,1.4L12,19.4l-7.3-5.7l-1.6,1.2l8.9,7l4.9-3.8l3.7,3.7l1.2-1.2L3.3,2.1
      z"/>
  </g>
  <g id="hamburger">
    <path d="M20.9,9.1H3.2c-0.6,0-1.1,0.3-1.1,0.7V14c0,0.4,0.5,0.8,1.1,0.8h17.9c0.6,0,1.1-0.3,1.1-0.7V9.9C22,9.4,21.5,9.1,20.9,9.1z
      M20.9,2.1H3.2c-0.6,0-1.1,0.3-1.1,0.7V7c0,0.4,0.5,0.7,1.1,0.7h17.9c0.6,0,1.1-0.3,1.1-0.7V2.8C22,2.4,21.5,2.1,20.9,2.1z
      M20.9,16.5H3.2c-0.6,0-1.1,0.3-1.1,0.7v4.2c0,0.4,0.5,0.7,1.1,0.7h17.9c0.6,0,1.1-0.3,1.1-0.7v-4.2C22,16.8,21.5,16.5,20.9,16.5z"
      />
  </g>
  <g id="sliders" transform="translate(0 14)">
    <path d="M5 1.5q-1.25 0-2.125-0.875T2 -1.5q0-1.25 0.875-2.125T5 -4.5h14q1.25 0 2.125 0.875T22 -1.5q0 1.25-0.875 2.125T19 1.5H5Zm9-2h5q0.425 0 0.713-0.288T20 -1.5q0-0.425-0.288-0.713T19 -2.5h-5v2Z"/>
  </g>
  <g id="toggle_on">
    <path d="M0 0h24v24H0z" fill="none"/><path d="M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
  </g>
</svg>`;

IconsetSingleton.registerIcons('io', icons);
