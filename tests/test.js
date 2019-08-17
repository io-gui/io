import {html, IoElement} from "../dist/io.js";

import "../lib/mocha.js";
import "../lib/chai.js";

import Node from "../tests/core/node.js"
import Element from "../tests/core/element.js"

import Item from "../tests/elements/core/item.js"
import Button from "../tests/elements/core/button.js"
import Boolean from "../tests/elements/core/boolean.js"
import Boolicon from "../tests/elements/core/boolicon.js"
import Switch from "../tests/elements/core/switch.js"
import Sting from "../tests/elements/core/string.js"
import Number from "../tests/elements/core/number.js"
// import Slider from "../tests/elements/core/slider.js"
// import Option from "../tests/elements/core/option.js"
// import Collapsable from "../tests/elements/core/collapsable.js"
// import Properties from "../tests/elements/core/properties.js"
// import Object from "../tests/elements/core/object.js"
// import Inspector from "../tests/elements/core/inspector.js"

mocha.setup('bdd');

const mochaDiv = document.createElement('div');
mochaDiv.setAttribute('id', 'mocha');
document.body.appendChild(mochaDiv);
mochaDiv.style.display = 'none';

let testCompleted = false;

function runTests() {
  if (!testCompleted) {
    // new Node().run();
    // new Element().run();

    // new Item().run();
    // new Button().run();
    // new Boolean().run();
    // new Boolean().run();
    // new Boolicon().run();
    // new Switch().run();
    new Sting().run();
    new Number().run();
    // new Slider().run();
    // new Option().run();
    // new Collapsable().run();
    // new Properties().run();
    // new Object().run();
    // new Inspector().run();
    mocha.checkLeaks();
    mocha.run();
    testCompleted = true;
  }
}

export class IoTest extends IoElement {
  connectedCallback() {
    super.connectedCallback();
    runTests();
    this.appendChild(mochaDiv);
    mochaDiv.style.display = 'block';
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.body.appendChild(mochaDiv);
    mochaDiv.style.display = 'none';
  }
}

IoTest.Register();
