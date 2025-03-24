import { IoIconsetSingleton } from '../basic/io-iconset.js';

const icons = /* html */`
<svg>
  <g id="hamburger">
    <path d="M20.9,9.1H3.2c-0.6,0-1.1,0.3-1.1,0.7V14c0,0.4,0.5,0.8,1.1,0.8h17.9c0.6,0,1.1-0.3,1.1-0.7V9.9C22,9.4,21.5,9.1,20.9,9.1z
      M20.9,2.1H3.2c-0.6,0-1.1,0.3-1.1,0.7V7c0,0.4,0.5,0.7,1.1,0.7h17.9c0.6,0,1.1-0.3,1.1-0.7V2.8C22,2.4,21.5,2.1,20.9,2.1z
      M20.9,16.5H3.2c-0.6,0-1.1,0.3-1.1,0.7v4.2c0,0.4,0.5,0.7,1.1,0.7h17.9c0.6,0,1.1-0.3,1.1-0.7v-4.2C22,16.8,21.5,16.5,20.9,16.5z"
      />
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
</svg>`;

IoIconsetSingleton.registerIcons('menu', icons);
