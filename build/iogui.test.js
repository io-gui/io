import { IoElement, RegisterIoElement } from './iogui.js';
import ProtoChain from './core/internals/protoChain.test.js';
import Property from './core/internals/property.test.js';
// import Binding from './core/internals/binding.test.js';
import EventDispatcher from './core/internals/eventDispatcher.test.js';
import ChangeQueue from './core/internals/changeQueue.test.js';
// import Node from './core/io-node.test.js';
// import Element from './core/io-element.test.js';
// import Item from './elements/core/item.test.js';
// import Content from './elements/core/content.test.js'; // TODO
// import Gl from './elements/core/gl.test.js';
// import Button from './elements/core/button.test.js';
// import Boolean from './elements/core/boolean.test.js';
// import Boolicon from './elements/core/boolicon.test.js';
// import Switch from './elements/core/switch.test.js';
// import Sting from './elements/core/string.test.js';
// import Number from './elements/core/number.test.js';
// import Slider from './elements/core/slider.test.js';
// import SliderRange from './elements/core/slider-range.test.js'; // TODO
// import NumberSlider from './elements/core/number-slider.test.js';
// import NumberSliderRange from './elements/core/number-slider-range.test.js'; // TODO
// import Icon from './elements/core/icon.test.js';
// import IconSet from './elements/core/iconset.test.js';
// import Layer from './elements/core/layer.test.js';
// import Ladder from './elements/core/ladder.test.js';
// import Theme from './elements/core/theme.test.js';
// import Collapsable from "./elements/layout/collapsable.test.js";
// import Property from "./elements/object/properties.test.js";
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
        new ProtoChain().run();
        new Property().run();
        // new Binding().run();
        new EventDispatcher().run();
        new ChangeQueue().run();
        // new Node().run();
        // new Element().run();
        // new Item().run();
        // new Content().run();
        // new Gl().run();
        // new Button().run();
        // new Boolean().run();
        // new Boolean().run();
        // new Boolicon().run();
        // new Switch().run();
        // new Sting().run();
        // new Number().run();
        // new Slider().run();
        // new SliderRange().run();
        // new NumberSlider().run();
        // new NumberSliderRange().run();
        // new Icon().run();
        // new IconSet().run();
        // new Layer().run();
        // new Ladder().run();
        // new Theme().run();
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
export class IoTest extends IoElement {
    static get Style() {
        return /* css */ `
      :host #mocha {
        margin: 0;
        position: relative;
      }
      :host #mocha-report {
        margin: 2em 1em;
      }
      :host #mocha-stats {
        position: absolute;
        top: -2em;
        right: 2em;
        font-size: 12px;
        margin: 0;
      }
      :host #mocha-stats em {
        color: var(--io-color);
      }
      :host #mocha-stats li {
        padding: 0;
      }
      :host #mocha-stats .progress {
        display: none;
      }
      :host #mocha-stats .passes {
        color: #0c0;
      }
      :host #mocha-stats .failures {
        color: #f00;
        font-weight: bold;
      }
      :host h2 {
        padding-right: 2em;
      }
      :host .replay {
        display: none !important;
      }
    `;
    }
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
RegisterIoElement(IoTest);
//# sourceMappingURL=iogui.test.js.map