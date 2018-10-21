import {html, IoElement, IoNode} from "../build/io.js";

import ElementTest from "./tests/element.js"
import NodeTest from "./tests/node.js"
import LiteTest from "./tests/lite.js"

import "https://cdn.jsdelivr.net/npm/mocha@5.2.0/mocha.js";

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
