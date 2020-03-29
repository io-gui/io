import {IoSelectorSidebar, IoStorageFactory as $} from './io-core.js';
import './io-extras.js';

const docPath = (new URL(import.meta.url).pathname).replace('io-docs.js', '../docs/');

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
        ['io-md-view', {name: 'about-io-gui', path: docPath + 'about-io-gui.md'}],
        ['io-md-view', {name: 'getting-started', path: docPath + 'getting-started.md'}],
        ['io-md-view', {name: 'core-classes', path: docPath + 'core-classes.md'}],
        ['io-md-view', {name: 'learn-more', path: docPath + 'learn-more.md'}],
        ['io-md-view', {name: 'elements-core', path: docPath + 'elements-core.md'}],
        ['io-md-view', {name: 'elements-menus', path: docPath + 'elements-menus.md'}],
        ['io-md-view', {name: 'elements-object', path: docPath + 'elements-object.md'}],
        ['io-md-view', {name: 'elements-math', path: docPath + 'elements-math.md'}],
        ['io-md-view', {name: 'elements-color', path: docPath + 'elements-color.md'}],
        ['io-md-view', {name: 'elements-layout', path: docPath + 'elements-layout.md'}],
        ['io-md-view', {name: 'elements-extras', path: docPath + 'elements-extras.md'}],
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
        {label: 'Elements', options: [
          {label: 'Core Elements', options: [
            {label: 'IoItem', value: 'elements-core#ioitem'},
            {label: 'IoGl', value: 'elements-core#iogl'},
            {label: 'IoButton', value: 'elements-core#iobutton'},
            {label: 'IoBoolean', value: 'elements-core#ioboolean'},
            {label: 'IoBoolicon', value: 'elements-core#ioboolicon'},
            {label: 'IoSwitch', value: 'elements-core#ioswitch'},
            {label: 'IoString', value: 'elements-core#iostring'},
            {label: 'IoNumber', value: 'elements-core#ionumber'},
            {label: 'IoSlider', value: 'elements-core#ioslider'},
            {label: 'IoNumberSlider', value: 'elements-core#ionumberslider'},
            {label: 'IoSliderRange', value: 'elements-core#iosliderrange'},
            {label: 'IoNumberSliderRange', value: 'elements-core#ionumbersliderrange'},
            {label: 'IoIcon', value: 'elements-core#ioicon'},
            {label: 'IoIconsetSingleton', value: 'elements-core#ioiconsetsingleton'},
            {label: 'IoLayerSingleton', value: 'elements-core#iolayersingleton'},
            {label: 'IoLadderSingleton', value: 'elements-core#ioladdersingleton'},
            {label: 'IoThemeSingleton', value: 'elements-core#iothemesingleton'},
          ]},
          {label: 'Menus', options: [
            {label: 'IoMenuItem', value: 'elements-menus#iomenuitem'},
            {label: 'IoMenuOptions', value: 'elements-menus#iomenuoptions'},
            {label: 'IoOptionMenu', value: 'elements-menus#iooptionmenu'},
            {label: 'IoContextMenu', value: 'elements-menus#iocontextmenu'},
          ]},
          {label: 'Object Editors', options: [
            {label: 'IoProperties', value: 'elements-object#ioproperties'},
            {label: 'IoObject', value: 'elements-object#ioobject'},
            {label: 'IoInspector', value: 'elements-object#ioinspector'},
            {label: 'IoBreadcrumbs', value: 'elements-object#iobreadcrumbs'},
          ]},
          {label: 'Math', options: [
            {label: 'IoVector', value: 'elements-math#iovector'},
            {label: 'IoMatrix', value: 'elements-math#iomatrix'},
          ]},
          {label: 'Color', options: [
            {label: 'IoColorMixin', value: 'elements-color#iocolormixin'},
            {label: 'IoColorVector', value: 'elements-color#iocolorvector'},
            {label: 'IoColorPanel', value: 'elements-color#iocolorpanel'},
            {label: 'IoColorPanelSingleton', value: 'elements-color#iocolorpanelsingleton'},
            {label: 'IoColorSwatch', value: 'elements-color#iocolorswatch'},
            {label: 'IoColorPicker', value: 'elements-color#iocolorpicker'},
            {label: 'IoColorSliderHs', value: 'elements-color#iocolorsliderhs'},
            {label: 'IoColorSliderSv', value: 'elements-color#iocolorslidersv'},
            {label: 'IoColorSliderSl', value: 'elements-color#iocolorslidersl'},
            {label: 'IoColorSliderRed', value: 'elements-color#iocolorsliderred'},
            {label: 'IoColorSliderGreen', value: 'elements-color#iocolorslidergreen'},
            {label: 'IoColorSliderBlue', value: 'elements-color#iocolorsliderblue'},
            {label: 'IoColorSliderAlpha', value: 'elements-color#iocolorslideralpha'},
            {label: 'IoColorSliderHue', value: 'elements-color#iocolorsliderhue'},
            {label: 'IoColorSliderSaturation', value: 'elements-color#iocolorslidersaturation'},
            {label: 'IoColorSliderValue', value: 'elements-color#iocolorslidervalue'},
            {label: 'IoColorSliderLevel', value: 'elements-color#iocolorsliderlevel'},
            {label: 'IoColorSliderCyan', value: 'elements-color#iocolorslidercyan'},
            {label: 'IoColorSliderMagenta', value: 'elements-color#iocolorslidermagenta'},
            {label: 'IoColorSliderYellow', value: 'elements-color#iocolorslideryellow'},
            {label: 'IoColorSliderKey', value: 'elements-color#iocolorsliderkey'},
          ]},
          {label: 'Layout', options: [
            {label: 'IoCollapsable', value: 'elements-layout#iocollapsable'},
            {label: 'IoSelector', value: 'elements-layout#ioselector'},
            {label: 'IoSelectorTabs', value: 'elements-layout#ioselectorTabs'},
            {label: 'IoSelectorSidebar', value: 'elements-layout#ioselectorsidebar'},
            {label: 'IoSidebar', value: 'elements-layout#iosidebar'},
            {label: 'IoLayout', value: 'elements-layout#iolayout'},
          ]},
          {label: 'Extras', options: [
            {label: 'io-md-view', value: 'elements-extras#io-md-view'},
            {label: 'io-service-loader', value: 'elements-extras#io-service-loader'},
          ]},
        ]},
        {label: 'Core Classes', options: [
          {label: 'IoNode', value: 'core-classes#ionode'},
          {label: 'IoElement', value: 'core-classes#ioElement'},
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
      ],
    };
  }
}
IoDocs.Register();