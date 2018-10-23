import {html, IoElement, IoNode} from "../src/io.js";

import ElementTest from "./tests/element.js"
import NodeTest from "./tests/node.js"
import LiteTest from "./tests/lite.js"
import BooleanTest from "./tests/boolean.js"
import ButtonTest from "./tests/button.js"
import NumberTest from "./tests/number.js"
// import ObjectTest from "./tests/object.js"
// import SliderTest from "./tests/slider.js"
import StingTest from "./tests/string.js"

import "./lib/mocha.js";

mocha.setup('bdd');

export class IoTest extends IoElement {
  constructor() {
    super();
    this.elementTest = new ElementTest();
    this.nodeTest = new NodeTest();
    this.liteTest = new LiteTest();
    this.booleanTest = new BooleanTest();
    this.buttonTest = new ButtonTest();
    this.numberTest = new NumberTest();
    // this.objectTest = new ObjectTest();
    // this.sliderTest = new SliderTest();
    this.stringTest = new StingTest();
  }
  connectedCallback() {
    this.elementTest.run();
    this.nodeTest.run();
    this.liteTest.run();
    this.booleanTest.run();
    this.buttonTest.run();
    this.numberTest.run();
    // this.objectTest.run();
    // this.sliderTest.run();
    this.stringTest.run();
    mocha.checkLeaks();
    mocha.run();
  }
}

IoTest.Register();
