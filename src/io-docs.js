import {IoSelectorSidebar, IoStorageFactory as $} from './io-elements.js';
import './io-extras.js';

const docPath = (new URL(import.meta.url).pathname).replace('io-docs.js', '../docs/');
const srcPath = (new URL(import.meta.url).pathname).replace('io-docs.js', '../src/');

// TODO: move to extras
export class IoDocs extends IoSelectorSidebar {
  static get Style() {
    return /* css */`
      :host > io-sidebar:not([collapsed]) {
        flex-basis: 11em !important;
      }
      :host > .io-content {
        overflow-y: auto;
      }
      :host iframe {
        border: none;
        flex: 1 1;
      }
    `;
  }
  static get Properties() {
    return {
      name: 'Io-GUI Documentation',
      collapseWidth: 640,
      selected: $({value: 'getting-started', storage: 'hash', key: 'doc'}),
      options: [
        {label: 'Getting Started', options: [
          {label: 'Usage', value: docPath + 'getting-started#usage'},
          {label: 'Simple App Example', value: docPath + 'getting-started#simple-app-example'},
          {label: 'Style', value: docPath + 'getting-started#style'},
          {label: 'Properties', value: docPath + 'getting-started#properties'},
          {label: 'Listeners', value: docPath + 'getting-started#listeners'},
          {label: 'Change Functions', value: docPath + 'getting-started#change-functions'},
          {label: 'Simple App Recap', value: docPath + 'getting-started#simple-app-recap'},
        ]},
        {label: 'Learn More', options: [
          {label: 'Creating Elements', value: docPath + 'learn-more#creating-elements'},
          {label: 'Properties', value: docPath + 'learn-more#properties'},
          {label: 'Property Configuration', value: docPath + 'learn-more#property-configuration'},
          {label: 'Functions', value: docPath + 'learn-more#functions'},
          {label: 'Events', value: docPath + 'learn-more#events'},
          {label: 'Virtual DOM Arrays', value: docPath + 'learn-more#virtual-dom-arrays'},
          {label: 'Data Binding', value: docPath + 'learn-more#data-binding'},
          {label: 'Data Flow', value: docPath + 'learn-more#data-flow'},
        ]},
        {label: 'Elements', options: [
          {label: 'Core Elements', options: [
            {label: 'IoItem', value: srcPath + 'elements/core/item'},
            {label: 'IoGl', value: srcPath + 'elements/core/gl'},
            {label: 'IoButton', value: srcPath + 'elements/core/button'},
            {label: 'IoBoolean', value: srcPath + 'elements/core/boolean'},
            {label: 'IoBoolicon', value: srcPath + 'elements/core/boolicon'},
            {label: 'IoSwitch', value: srcPath + 'elements/core/switch'},
            {label: 'IoString', value: srcPath + 'elements/core/string'},
            {label: 'IoNumber', value: srcPath + 'elements/core/number'},
            {label: 'IoSlider', value: srcPath + 'elements/core/slider'},
            {label: 'IoNumberSlider', value: srcPath + 'elements/core/number-slider'},
            {label: 'IoSliderRange', value: srcPath + 'elements/core/slider-range'},
            {label: 'IoNumberSliderRange', value: srcPath + 'elements/core/number-slider-range'},
            {label: 'IoIcon', value: srcPath + 'elements/core/icon'},
            {label: 'IoIconsetSingleton', value: srcPath + 'elements/core/iconset'}, // TODO: singleton callout
            {label: 'IoLayerSingleton', value: srcPath + 'elements/core/layer'}, // TODO: singleton callout
            {label: 'IoLadderSingleton', value: srcPath + 'elements/core/ladder'}, // TODO: singleton callout
            {label: 'IoThemeSingleton', value: srcPath + 'elements/core/theme'}, // TODO: singleton callout
          ]},
          {label: 'Menus', options: [
            {label: 'IoMenuItem', value: srcPath + 'elements/menus/menu-item'},
            {label: 'IoMenuOptions', value: srcPath + 'elements/menus/menu-options'},
            {label: 'IoOptionMenu', value: srcPath + 'elements/menus/option-menu'},
            {label: 'IoContextMenu', value: srcPath + 'elements/menus/context-menu'},
          ]},
          {label: 'Object Editors', options: [
            {label: 'IoProperties', value: srcPath + 'elements/object/properties'},
            {label: 'IoObject', value: srcPath + 'elements/object/object'},
            {label: 'IoInspector', value: srcPath + 'elements/object/inspector'},
            {label: 'IoBreadcrumbs', value: srcPath + 'elements/object/breadcrumbs'},
            {label: 'IoConfig', value: srcPath + 'elements/object/config'},
            {label: 'IoGroups', value: srcPath + 'elements/object/groups'},
            {label: 'IoWidgets', value: srcPath + 'elements/object/widgets'},
          ]},
          {label: 'Math', options: [
            {label: 'IoVector', value: srcPath + 'elements/math/vector'},
            {label: 'IoMatrix', value: srcPath + 'elements/math/matrix'},
          ]},
          {label: 'Color', options: [
            {label: 'IoColorMixin', value: srcPath + 'elements/color/color'},
            {label: 'IoColorVector', value: srcPath + 'elements/color/color-vector'},
            {label: 'IoColorPanel', value: srcPath + 'elements/color/color-panel'}, // TODO: singleton callout
            {label: 'IoColorSwatch', value: srcPath + 'elements/color/color-swatch'},
            {label: 'IoColorPicker', value: srcPath + 'elements/color/color-picker'},
            {label: 'IoColorSliderHs', value: srcPath + 'elements/color/color-slider-hs'},
            {label: 'IoColorSliderSv', value: srcPath + 'elements/color/color-slider-sv'},
            {label: 'IoColorSliderSl', value: srcPath + 'elements/color/color-slider-sl'},
            {label: 'IoColorSliderRed', value: srcPath + 'elements/color/color-slider-red'},
            {label: 'IoColorSliderGreen', value: srcPath + 'elements/color/color-slider-green'},
            {label: 'IoColorSliderBlue', value: srcPath + 'elements/color/color-slider-blue'},
            {label: 'IoColorSliderAlpha', value: srcPath + 'elements/color/color-slider-alpha'},
            {label: 'IoColorSliderHue', value: srcPath + 'elements/color/color-slider-hue'},
            {label: 'IoColorSliderSaturation', value: srcPath + 'elements/color/color-slider-saturation'},
            {label: 'IoColorSliderValue', value: srcPath + 'elements/color/color-slider-value'},
            {label: 'IoColorSliderLevel', value: srcPath + 'elements/color/color-slider-level'},
            {label: 'IoColorSliderCyan', value: srcPath + 'elements/color/color-slider-cyan'},
            {label: 'IoColorSliderMagenta', value: srcPath + 'elements/color/color-slider-magenta'},
            {label: 'IoColorSliderYellow', value: srcPath + 'elements/color/color-slider-yellow'},
            {label: 'IoColorSliderKey', value: srcPath + 'elements/color/color-slider-key'},
          ]},
          {label: 'Layout', options: [
            {label: 'IoCollapsable', value: srcPath + 'elements/layout/collapsable'},
            {label: 'IoSelector', value: srcPath + 'elements/layout/selector'},
            {label: 'IoSelectorTabs', value: srcPath + 'elements/layout/selector-tabs'},
            {label: 'IoSelectorSidebar', value: srcPath + 'elements/layout/selector-sidebar'},
            {label: 'IoSidebar', value: srcPath + 'elements/layout/sidebar'},
            {label: 'IoLayout', value: srcPath + 'elements/layout/layout'},
          ]},
          {label: 'Extras', options: [
            {label: 'io-md-view', value: srcPath + 'extras/md-view'},
            {label: 'io-service-loader', value: srcPath + 'extras/service-loader'},
          ]},
        ]},
        {label: 'Core Classes', options: [
          {label: 'IoNode', value: srcPath + 'core/io-node'},
          {label: 'IoElement', value: srcPath + 'core/io-element'},
          {label: 'Protochain', value: srcPath + 'core/protochain'},
          {label: 'Binding', value: srcPath + 'core/binding'},
          {label: 'Properties', value: srcPath + 'core/properties'},
          {label: 'Functions', value: srcPath + 'core/functions'},
          {label: 'Listeners', value: srcPath + 'core/listeners'},
          {label: 'Queue', value: srcPath + 'core/queue'},
        ]},
      ],
    };
  }
  update() {
    this.template([
      this.getSlotted(),
      ['io-md-view', {id: 'content', class: 'io-content', path: this._selectedID + '.md'}],
    ]);
  }
}
IoDocs.Register();