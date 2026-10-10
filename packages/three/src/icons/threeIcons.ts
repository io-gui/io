import { IconsetSingleton } from '@io-gui/icons'

/**
 * The `three` icon namespace: Material Symbols Outlined (https://fonts.google.com/icons), weight 400, transport
 * glyphs filled. Their `0 -960 960 960` viewBox maps onto the 24×24 icon box with `scale(0.025) translate(0 960)`.
 */
const icons = /* html */`
<svg>
  <g id="skip_start" transform="scale(0.025) translate(0 960)">
    <path d="M220-240v-480h80v480h-80Zm520 0L380-480l360-240v480Z"/>
  </g>
  <g id="frame_back" transform="scale(0.025) translate(0 960)">
    <path d="M560-280 360-480l200-200v400Z"/>
  </g>
  <g id="play" transform="scale(0.025) translate(0 960)">
    <path d="M320-200v-560l440 280-440 280Z"/>
  </g>
  <g id="pause" transform="scale(0.025) translate(0 960)">
    <path d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z"/>
  </g>
  <g id="frame_forward" transform="scale(0.025) translate(0 960)">
    <path d="M400-280v-400l200 200-200 200Z"/>
  </g>
  <g id="skip_end" transform="scale(0.025) translate(0 960)">
    <path d="M660-240v-480h80v480h-80Zm-440 0v-480l360 240-360 240Z"/>
  </g>
  <g id="loop" transform="scale(0.025) translate(0 960)">
    <path d="M280-80 120-240l160-160 56 58-62 62h406v-160h80v240H274l62 62-56 58Zm-80-440v-240h486l-62-62 56-58 160 160-160 160-56-58 62-62H280v160h-80Z"/>
  </g>
</svg>`

IconsetSingleton.registerIcons('three', icons)
