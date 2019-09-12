import {IoElement} from "./io.js";

import "../lib/mocha.js";
import "../lib/chai.js";

import Node from "./core/node.test.js";
import Element from "./core/element.test.js";

import Item from "./elements/core/item.test.js";
// import Content from "./elements/core/content.test.js";
import Gl from "./elements/core/gl.test.js";
import Button from "./elements/core/button.test.js";
import Boolean from "./elements/core/boolean.test.js";
import Boolicon from "./elements/core/boolicon.test.js";
import Switch from "./elements/core/switch.test.js";
import Sting from "./elements/core/string.test.js";
import Number from "./elements/core/number.test.js";
import Slider from "./elements/core/slider.test.js";
import NumberSlider from "./elements/core/number-slider.test.js";
import Icon from "./elements/core/icon.test.js";
import IconSet from "./elements/core/iconset.test.js";
import Layer from "./elements/core/layer.test.js";
import Ladder from "./elements/core/ladder.test.js";
import Theme from "./elements/core/theme.test.js";

// import Collapsable from "./elements/layout/collapsable.test.js";
// import Properties from "./elements/object/properties.test.js";
// import Object from "./elements/object/object.test.js";
// import Inspector from "./elements/object/inspector.test.js";
// import OptionMenu from "./elements/menus/option-menu.test.js";

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
    // TODO: new Content().run();
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

    // TODO
    // new OptionMenu().run();
    // new Collapsable().run();
    // new Properties().run();
    // new Object().run();
    // new Inspector().run();

    mocha.checkLeaks();
    mocha.run();
    testCompleted = true;
  }
}

export class IoTests extends IoElement {
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

IoTests.Register();
