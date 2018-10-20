import {html, IoElement, IoNode} from "../build/io.js";

import ElementTest from "./tests/element.js"
import NodeTest from "./tests/node.js"
import LiteTest from "./tests/lite.js"

import "../node_modules/mocha/mocha.js";

mocha.setup('bdd');

export class IoTest extends IoElement {
  constructor() {
    super();
    this.elementTest = new ElementTest();
    this.nodeTest = new NodeTest();
    this.liteTest = new LiteTest();
  }
  connectedCallback() {
    this.elementTest.run();
    this.nodeTest.run();
    this.liteTest.run();

    mocha.checkLeaks();
    mocha.run();
  }
}

IoTest.Register();
