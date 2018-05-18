import {Io} from "../io.js";

import "./demo-app-ctrl.js";
import "../elements/io/demo.js";
import "../elements/menu/demo.js";

import "../elements/three/three-example/three-example.js";

export class DemoApp extends Io {
  static get style() {
    return `
      <style>
        :host {
          position: fixed;
          display: flex;
          width: 100%;
          height: 100%;
          flex-direction: column;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      selected: {
        value: document.location
      },
      layout: null,
      elements: Object,
      listeners: {
        'app-split-changed': '_onLayoutChanged',
        'app-block-changed': '_onLayoutChanged'
      }
    };
  }
  constructor() {
    super();
    this.elements = {
      'example-geometry-hierarchy2': ['three-example', {example: 'geometry-hierarchy2', control: 'OrbitControls'}],
      'example-geometry-colors': ['three-example', {example: 'geometry-colors', control: 'OrbitControls'}],
      'example-geometry-teapot': ['three-example', {example: 'geometry-teapot', control: 'OrbitControls'}],
      'example-geometries': ['three-example', {example: 'geometries', control: 'OrbitControls'}],
      'three-viewport': ['three-viewport'],
      'three-renderer': ['three-renderer'],
      'io-demo': ['io-demo'],
      'menu-demo': ['menu-demo'],
      'inspector': ['three-inspector', {value: this.bind('selected')}],
      'app-ctrl': ['demo-app-ctrl', {value: this.bind('selected')}]
    };
    this.layout = JSON.parse(localStorage.getItem('app-split-state')) || [
      ['app-block', {'tabs': ['app-ctrl']}],
      ['app-split', {'orientation': 'vertical', 'splits': [
        ['app-block', {'tabs': ['inspector']}],
        ['app-block', {'tabs': ['io-demo', 'menu-demo'], 'selected': 1}, 300],
      ]}, 350]
    ];
    this.render([
      ['app-split', {
        orientation: 'horizontal',
        splits: [],
        elements: this.elements,
        splits: this.layout
      }]
    ]);
  }
  _onLayoutChanged() {
    this.debounce(this._onSaveLayout, 1000);
  }
  _onSaveLayout() {
    localStorage.setItem('app-split-state', JSON.stringify(this.layout));
  }
}

DemoApp.Register();
