import {html, IoElement, debounce} from "../src/io.js";

import "../src/elements/demo.js";

import "./elements/app/index.js";
import "./elements/three/index.js";

export class DemoApp extends IoElement {
  static get style() {
    return html`<style>
      :host {
        position: fixed;
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;
      }
    </style>`;
  }
  static get properties() {
    return {
      selected: {
        value: document.location
      },
      layout: null,
      elements: Object
    };
  }
  static get listeners() {
    return {
      'app-split-changed': '_onLayoutChanged',
      'app-block-changed': '_onLayoutChanged'
    };
  }
  constructor() {
    super();
    this.elements = {
      'example-geometry-hierarchy2': ['three-example', {example: 'geometry-hierarchy2'}],
      'example-geometry-colors': ['three-example', {example: 'geometry-colors'}],
      'example-geometry-teapot': ['three-example', {example: 'geometry-teapot'}],
      'example-geometries': ['three-example', {example: 'geometries'}],
      'io-demo': ['io-demo'],
      'menu-demo': ['menu-demo'],
      'inspector': ['three-inspector', {value: this.bind('selected')}]
    };
    this.layout = JSON.parse(localStorage.getItem('app-split-state')) || [
      ['app-block', {'tabs': ['io-demo']}],
      ['app-split', {'orientation': 'vertical', 'splits': [
        ['app-block', {'tabs': ['inspector']}],
        ['app-block', {'tabs': ['io-demo', 'menu-demo'], 'selected': 1}, 300],
      ]}, 350]
    ];
    this.render([
      ['app-split', {
        orientation: 'horizontal',
        elements: this.elements,
        splits: this.layout
      }]
    ]);
  }
  _onLayoutChanged() {
    debounce(this._onSaveLayout, 1000);
  }
  _onSaveLayout() {
    localStorage.setItem('app-split-state', JSON.stringify(this.layout));
  }
}

DemoApp.Register();
