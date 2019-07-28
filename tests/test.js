import {html, IoElement} from "../dist/io.js";

import "../lib/mocha.js";
import "../lib/chai.js";

import Node from "../tests/core/node.js"
import Element from "../tests/core/element.js"

import Boolean from "../tests/elements/boolean.js"
import Button from "../tests/elements/button.js"
import Number from "../tests/elements/number.js"
import Sting from "../tests/elements/string.js"
import Slider from "../tests/elements/slider.js"
import Option from "../tests/elements/option.js"
import Collapsable from "../tests/elements/collapsable.js"
import Properties from "../tests/elements/properties.js"
import Object from "../tests/elements/object.js"
import Inspector from "../tests/elements/inspector.js"
// import Quad from "../tests/elements/quad.js"
// import Menu from "../tests/elements/menu.js"
// import Selector from "../tests/elements/selector.js"
// import SelectorTabs from "../tests/elements/selector-tabs.js"
// import SelectorSidebar from "../tests/elements/selector-sidebar.js"
// import Tabs from "../tests/elements/tabs.js"
// import Sidebar from "../tests/elements/sidebar.js"

// import Storage from "../tests/objects/storage.js"

mocha.setup('bdd');

const mochaDiv = document.createElement('div');
mochaDiv.setAttribute('id', 'mocha');
document.body.appendChild(mochaDiv);
mochaDiv.style.display = 'none';

let testCompleted = false;

function runTests() {
  if (!testCompleted) {
    new Node().run();
    new Element().run();

    new Button().run();
    new Boolean().run();
    new Number().run();
    new Sting().run();
    new Slider().run();
    new Option().run();
    new Collapsable().run();
    new Properties().run();
    new Object().run();
    new Inspector().run();
    // new Quad().run();
    // new Menu().run();
    // new Selector().run();
    // new SelectorTabs().run();
    // new SelectorSidebar().run();
    // new Tabs().run();
    // new Sidebar().run();
    // new Storage().run();
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
