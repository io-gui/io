import {IoSelectorSidebar, IoStorageFactory as $} from './io-elements.js';
import './io-extras.js';

const docPath = (new URL(import.meta.url).pathname).replace('io-docs.js', '../docs/');
const srcPath = (new URL(import.meta.url).pathname).replace('io-docs.js', '../src/');

export class IoDocs extends IoSelectorSidebar {
  static get Style() {
    return /* css */`
      :host io-md-view {
        padding-top: 0 !important;
        color: var(--io-color);
        background-color: var(--io-background-color);
      }
      :host io-md-view code {
        font-family: "Roboto Mono", Monaco, courier, monospace !important;
      }
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
      selected: $({value: 'about-io-gui', storage: 'hash', key: 'doc'}),
      cache: true,
      elements: [
        // Documentation pages
        ['io-md-view', {name: 'about-io-gui', path: docPath + 'about-io-gui.md'}],
        ['io-md-view', {name: 'getting-started', path: docPath + 'getting-started.md'}],
        ['io-md-view', {name: 'learn-more', path: docPath + 'learn-more.md'}],
        // Source Documentation (Core)
        ['io-md-view', {name: 'core-node', path: srcPath + 'core/node.md'}],
        ['io-md-view', {name: 'core-element', path: srcPath + 'core/element.md'}],
        // Source Documentation (Core Elements)
        ['io-md-view', {name: 'elements-core-boolean', path: srcPath + 'elements/core/boolean.md'}],
        ['io-md-view', {name: 'elements-core-boolicon', path: srcPath + 'elements/core/boolicon.md'}],
        ['io-md-view', {name: 'elements-core-button', path: srcPath + 'elements/core/button.md'}],
        ['io-md-view', {name: 'elements-core-content', path: srcPath + 'elements/core/content.md'}],
        ['io-md-view', {name: 'elements-core-gl', path: srcPath + 'elements/core/gl.md'}],
        ['io-md-view', {name: 'elements-core-icon', path: srcPath + 'elements/core/icon.md'}],
        ['io-md-view', {name: 'elements-core-iconset', path: srcPath + 'elements/core/iconset.md'}],
        ['io-md-view', {name: 'elements-core-item', path: srcPath + 'elements/core/item.md'}],
        ['io-md-view', {name: 'elements-core-ladder', path: srcPath + 'elements/core/ladder.md'}],
        ['io-md-view', {name: 'elements-core-layer', path: srcPath + 'elements/core/layer.md'}],
        ['io-md-view', {name: 'elements-core-number-slider-range', path: srcPath + 'elements/core/number-slider-range.md'}],
        ['io-md-view', {name: 'elements-core-number-slider', path: srcPath + 'elements/core/number-slider.md'}],
        ['io-md-view', {name: 'elements-core-number', path: srcPath + 'elements/core/number.md'}],
        ['io-md-view', {name: 'elements-core-slider-range', path: srcPath + 'elements/core/slider-range.md'}],
        ['io-md-view', {name: 'elements-core-slider', path: srcPath + 'elements/core/slider.md'}],
        ['io-md-view', {name: 'elements-core-storage', path: srcPath + 'elements/core/storage.md'}],
        ['io-md-view', {name: 'elements-core-string', path: srcPath + 'elements/core/string.md'}],
        ['io-md-view', {name: 'elements-core-switch', path: srcPath + 'elements/core/switch.md'}],
        ['io-md-view', {name: 'elements-core-theme', path: srcPath + 'elements/core/theme.md'}],
        // Source Documentation (Math Elements)
        ['io-md-view', {name: 'elements-menus-context-menu', path: srcPath + 'elements/menus/context-menu.md'}],
        ['io-md-view', {name: 'elements-menus-menu-item', path: srcPath + 'elements/menus/menu-item.md'}],
        ['io-md-view', {name: 'elements-menus-menu-options', path: srcPath + 'elements/menus/menu-options.md'}],
        ['io-md-view', {name: 'elements-menus-option-menu', path: srcPath + 'elements/menus/option-menu.md'}],
        // Source Documentation (Object Editor Elements)
        ['io-md-view', {name: 'elements-object-breadcrumbs', path: srcPath + 'elements/object/breadcrumbs.md'}],
        ['io-md-view', {name: 'elements-object-config', path: srcPath + 'elements/object/config.md'}],
        ['io-md-view', {name: 'elements-object-groups', path: srcPath + 'elements/object/groups.md'}],
        ['io-md-view', {name: 'elements-object-inspector', path: srcPath + 'elements/object/inspector.md'}],
        ['io-md-view', {name: 'elements-object-object', path: srcPath + 'elements/object/object.md'}],
        ['io-md-view', {name: 'elements-object-properties', path: srcPath + 'elements/object/properties.md'}],
        ['io-md-view', {name: 'elements-object-widgets', path: srcPath + 'elements/object/widgets.md'}],
        // Source Documentation (Math Elements)
        ['io-md-view', {name: 'elements-math-vector', path: srcPath + 'elements/math/vector.md'}],
        ['io-md-view', {name: 'elements-math-matrix', path: srcPath + 'elements/math/matrix.md'}],
        // Source Documentation (Color Elements)
        ['io-md-view', {name: 'elements-color-panel', path: srcPath + 'elements/color/color-panel.md'}],
        ['io-md-view', {name: 'elements-color-picker', path: srcPath + 'elements/color/color-picker.md'}],
        ['io-md-view', {name: 'elements-color-slider-alpha', path: srcPath + 'elements/color/color-slider-alpha.md'}],
        ['io-md-view', {name: 'elements-color-slider-blue', path: srcPath + 'elements/color/color-slider-blue.md'}],
        ['io-md-view', {name: 'elements-color-slider-cyan', path: srcPath + 'elements/color/color-slider-cyan.md'}],
        ['io-md-view', {name: 'elements-color-slider-green', path: srcPath + 'elements/color/color-slider-green.md'}],
        ['io-md-view', {name: 'elements-color-slider-hs', path: srcPath + 'elements/color/color-slider-hs.md'}],
        ['io-md-view', {name: 'elements-color-slider-hue', path: srcPath + 'elements/color/color-slider-hue.md'}],
        ['io-md-view', {name: 'elements-color-slider-key', path: srcPath + 'elements/color/color-slider-key.md'}],
        ['io-md-view', {name: 'elements-color-slider-level', path: srcPath + 'elements/color/color-slider-level.md'}],
        ['io-md-view', {name: 'elements-color-slider-magenta', path: srcPath + 'elements/color/color-slider-magenta.md'}],
        ['io-md-view', {name: 'elements-color-slider-red', path: srcPath + 'elements/color/color-slider-red.md'}],
        ['io-md-view', {name: 'elements-color-slider-saturation', path: srcPath + 'elements/color/color-slider-saturation.md'}],
        ['io-md-view', {name: 'elements-color-slider-sl', path: srcPath + 'elements/color/color-slider-sl.md'}],
        ['io-md-view', {name: 'elements-color-slider-sv', path: srcPath + 'elements/color/color-slider-sv.md'}],
        ['io-md-view', {name: 'elements-color-slider-value', path: srcPath + 'elements/color/color-slider-value.md'}],
        ['io-md-view', {name: 'elements-color-slider-yellow', path: srcPath + 'elements/color/color-slider-yellow.md'}],
        ['io-md-view', {name: 'elements-color-slider', path: srcPath + 'elements/color/color-slider.md'}],
        ['io-md-view', {name: 'elements-color-swatch', path: srcPath + 'elements/color/color-swatch.md'}],
        ['io-md-view', {name: 'elements-color-vector', path: srcPath + 'elements/color/color-vector.md'}],
        ['io-md-view', {name: 'elements-color-color', path: srcPath + 'elements/color/color.md'}],
        // Source Documentation (Layout Elements)
        ['io-md-view', {name: 'elements-layout-collapsable', path: srcPath + 'elements/layout/collapsable.md'}],
        ['io-md-view', {name: 'elements-layout-layout', path: srcPath + 'elements/layout/layout.md'}],
        ['io-md-view', {name: 'elements-layout-selector-sidebar', path: srcPath + 'elements/layout/selector-sidebar.md'}],
        ['io-md-view', {name: 'elements-layout-selector-tabs', path: srcPath + 'elements/layout/selector-tabs.md'}],
        ['io-md-view', {name: 'elements-layout-selector', path: srcPath + 'elements/layout/selector.md'}],
        ['io-md-view', {name: 'elements-layout-sidebar', path: srcPath + 'elements/layout/sidebar.md'}],
        
        ['io-md-view', {name: 'extras-md-view', path: srcPath + 'extras/md-view.md'}],
        ['io-md-view', {name: 'extras-service-loader', path: srcPath + 'extras/service-loader.md'}],
      ],
      options: [
        {label: 'Io-GUI', value: 'about-io-gui'},
        {label: 'Getting Started', options: [
          {label: 'Usage', value: 'getting-started#usage'},
          {label: 'Simple App Example', value: 'getting-started#simple-app-example'},
          {label: 'Style', value: 'getting-started#style'},
          {label: 'Properties', value: 'getting-started#properties'},
          {label: 'Listeners', value: 'getting-started#listeners'},
          {label: 'Change Functions', value: 'getting-started#change-functions'},
          {label: 'Simple App Recap', value: 'getting-started#simple-app-recap'},
        ]},
        {label: 'Learn More', options: [
          {label: 'Creating Elements', value: 'learn-more#creating-elements'},
          {label: 'Properties', value: 'learn-more#properties'},
          {label: 'Property Configuration', value: 'learn-more#property-configuration'},
          {label: 'Functions', value: 'learn-more#functions'},
          {label: 'Events', value: 'learn-more#events'},
          {label: 'Virtual DOM Arrays', value: 'learn-more#virtual-dom-arrays'},
          {label: 'Data Binding', value: 'learn-more#data-binding'},
          {label: 'Data Flow', value: 'learn-more#data-flow'},
        ]},
        {label: 'Elements', options: [
          {label: 'Core Elements', options: [
            {label: 'IoItem', value: 'elements-core-item'},
            {label: 'IoGl', value: 'elements-core-gl'},
            {label: 'IoButton', value: 'elements-core-button'},
            {label: 'IoBoolean', value: 'elements-core-boolean'},
            {label: 'IoBoolicon', value: 'elements-core-boolicon'},
            {label: 'IoSwitch', value: 'elements-core-switch'},
            {label: 'IoString', value: 'elements-core-string'},
            {label: 'IoNumber', value: 'elements-core-number'},
            {label: 'IoSlider', value: 'elements-core-slider'},
            {label: 'IoNumberSlider', value: 'elements-core-number-slider'},
            {label: 'IoSliderRange', value: 'elements-core-slider-range'},
            {label: 'IoNumberSliderRange', value: 'elements-core-number-slider-range'},
            {label: 'IoIcon', value: 'elements-core-icon'},
            {label: 'IoIconsetSingleton', value: 'elements-core-iconset'}, // TODO: singleton callout
            {label: 'IoLayerSingleton', value: 'elements-core-layer'}, // TODO: singleton callout
            {label: 'IoLadderSingleton', value: 'elements-core-ladder'}, // TODO: singleton callout
            {label: 'IoThemeSingleton', value: 'elements-core-theme'}, // TODO: singleton callout
          ]},
          {label: 'Menus', options: [
            {label: 'IoMenuItem', value: 'elements-menus-menu-item'},
            {label: 'IoMenuOptions', value: 'elements-menus-menu-options'},
            {label: 'IoOptionMenu', value: 'elements-menus-option-menu'},
            {label: 'IoContextMenu', value: 'elements-menus-context-menu'},
          ]},
          {label: 'Object Editors', options: [
            {label: 'IoProperties', value: 'elements-object-properties'},
            {label: 'IoObject', value: 'elements-object-object'},
            {label: 'IoInspector', value: 'elements-object-inspector'},
            {label: 'IoBreadcrumbs', value: 'elements-object-breadcrumbs'},
            {label: 'IoConfig', value: 'elements-object-config'},
            {label: 'IoGroups', value: 'elements-object-groups'},
            {label: 'IoWidgets', value: 'elements-object-widgets'},
          ]},
          {label: 'Math', options: [
            {label: 'IoVector', value: 'elements-math-vector'},
            {label: 'IoMatrix', value: 'elements-math-matrix'},
          ]},
          {label: 'Color', options: [
            {label: 'IoColorMixin', value: 'elements-color-color'},
            {label: 'IoColorVector', value: 'elements-color-vector'},
            {label: 'IoColorPanel', value: 'elements-color-panel'}, // TODO: singleton callout
            {label: 'IoColorSwatch', value: 'elements-color-swatch'},
            {label: 'IoColorPicker', value: 'elements-color-picker'},
            {label: 'IoColorSliderHs', value: 'elements-color-slider-hs'},
            {label: 'IoColorSliderSv', value: 'elements-color-slider-sv'},
            {label: 'IoColorSliderSl', value: 'elements-color-slider-sl'},
            {label: 'IoColorSliderRed', value: 'elements-color-slider-red'},
            {label: 'IoColorSliderGreen', value: 'elements-color-slider-green'},
            {label: 'IoColorSliderBlue', value: 'elements-color-slider-blue'},
            {label: 'IoColorSliderAlpha', value: 'elements-color-slider-alpha'},
            {label: 'IoColorSliderHue', value: 'elements-color-slider-hue'},
            {label: 'IoColorSliderSaturation', value: 'elements-color-slider-saturation'},
            {label: 'IoColorSliderValue', value: 'elements-color-slider-value'},
            {label: 'IoColorSliderLevel', value: 'elements-color-slider-level'},
            {label: 'IoColorSliderCyan', value: 'elements-color-slider-cyan'},
            {label: 'IoColorSliderMagenta', value: 'elements-color-slider-magenta'},
            {label: 'IoColorSliderYellow', value: 'elements-color-slider-yellow'},
            {label: 'IoColorSliderKey', value: 'elements-color-slider-key'},
          ]},
          {label: 'Layout', options: [
            {label: 'IoCollapsable', value: 'elements-layout-collapsable'},
            {label: 'IoSelector', value: 'elements-layout-selector'},
            {label: 'IoSelectorTabs', value: 'elements-layout-selector-tabs'},
            {label: 'IoSelectorSidebar', value: 'elements-layout-selector-sidebar'},
            {label: 'IoSidebar', value: 'elements-layout-sidebar'},
            {label: 'IoLayout', value: 'elements-layout-layout'},
          ]},
          {label: 'Extras', options: [
            {label: 'io-md-view', value: 'extras-md-view'},
            {label: 'io-service-loader', value: 'extras-service-loader'},
          ]},
        ]},
        {label: 'Core Classes', options: [
          {label: 'IoNode', value: 'core-node'},
          {label: 'IoElement', value: 'core-element'},
        ]},
      ],
    };
  }
}
IoDocs.Register();