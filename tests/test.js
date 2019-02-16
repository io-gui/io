import {html, IoElement} from "../build/io.js";

import "../lib/mocha.js";
import "../lib/chai.js";

import Core from "../tests/core/core.js"
import Element from "../tests/core/element.js"
import Lite from "../tests/core/lite.js"

import Array from "../tests/elements/array.js"
import Boolean from "../tests/elements/boolean.js"
import Button from "../tests/elements/button.js"
import Canvas from "../tests/elements/canvas.js"
import Collapsable from "../tests/elements/collapsable.js"
import Inspector from "../tests/elements/inspector.js"
import Menu from "../tests/elements/menu.js"
import Number from "../tests/elements/number.js"
import Object from "../tests/elements/object.js"
import Option from "../tests/elements/option.js"
import Properties from "../tests/elements/properties.js"
import Selector from "../tests/elements/selector.js"
import Slider from "../tests/elements/slider.js"
import Sting from "../tests/elements/string.js"

import Storage from "../tests/objects/storage.js"

mocha.setup('bdd');

// const mochaDiv = document.createElement('div');
// mochaDiv.setAttribute('id', 'mocha');
// document.body.appendChild(mochaDiv);
// mochaDiv.style.display = 'none';
//
// let testCompleted = false;
//
// function runTests() {
//   if (!testCompleted) {
//     new Core().run();
//     new Element().run();
//     new Lite().run();
//     new Array().run();
//     new Boolean().run();
//     new Button().run();
//     new Canvas().run();
//     new Collapsable().run();
//     new Inspector().run();
//     new Menu().run();
//     new Number().run();
//     new Object().run();
//     new Option().run();
//     new Properties().run();
//     new Slider().run();
//     new Storage().run();
//     new Sting().run();
//     mocha.checkLeaks();
//     mocha.run();
//     testCompleted = true;
//   }
// }
//
// export class IoTest extends IoElement {
//   static get style() {
//     return html`
//     <style>
//       :host {
//         display: block;
//         padding: 0.5em 1em;
//         background: #fff;
//         box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3),
//                     0 15px 30px 0 rgba(0, 0, 0, 0.15);
//       }
//     </style>
//     `;
//   }
//   connectedCallback() {
//     super.connectedCallback();
//     runTests();
//     this.appendChild(mochaDiv);
//     mochaDiv.style.display = 'block';
//   }
//   disconnectedCallback() {
//     super.disconnectedCallback();
//     document.body.appendChild(mochaDiv);
//     mochaDiv.style.display = 'none';
//   }
// }
//
// IoTest.Register();
