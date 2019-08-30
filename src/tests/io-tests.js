import {html, IoElement} from "../io.js";

import "../../lib/mocha.js";
import "../../lib/chai.js";

import Node from "./core/node.js"
import Element from "./core/element.js"

import Item from "./elements/core/item.js"
import Gl from "./elements/core/gl.js"
import Button from "./elements/core/button.js"
import Boolean from "./elements/core/boolean.js"
import Boolicon from "./elements/core/boolicon.js"
import Switch from "./elements/core/switch.js"
import Sting from "./elements/core/string.js"
import Number from "./elements/core/number.js"
import Slider from "./elements/core/slider.js"
import NumberSlider from "./elements/core/number-slider.js"
import Icon from "./elements/core/icon.js"
import IconSet from "./elements/core/iconset.js"
import Layer from "./elements/core/layer.js"
import Ladder from "./elements/core/ladder.js"
import Theme from "./elements/core/theme.js"

// import Option from "./elements/core/option.js"
// import Collapsable from "./elements/core/collapsable.js"
// import Properties from "./elements/core/properties.js"
// import Object from "./elements/core/object.js"
// import Inspector from "./elements/core/inspector.js"

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

    new Item().run();
    new Gl().run();
    new Button().run();
    new Boolean().run();
    new Boolean().run();
    new Boolicon().run();
    new Switch().run();
    new Sting().run();
    new Number().run();
    new Slider().run();
    new NumberSlider().run();
    new Icon().run();
    new IconSet().run();
    new Layer().run();
    new Ladder().run();
    new Theme().run();

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
