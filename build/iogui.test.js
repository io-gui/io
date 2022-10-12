var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import 'mocha/mocha.js';
import 'chai/chai.js';
import { IoElement, RegisterIoElement } from './iogui.js';
import CoreTests from './core/index.test.js';
// import ElementsTests from './elements/index.test.js';
mocha.setup('bdd');
const mochaDiv = document.createElement('div');
mochaDiv.setAttribute('id', 'mocha');
document.body.appendChild(mochaDiv);
mochaDiv.style.display = 'none';
let testCompleted = false;
export async function nextTick() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        });
    });
}
function runTests() {
    if (!testCompleted) {
        new CoreTests().run();
        // new ElementsTests().run();
        mocha.checkLeaks();
        mocha.run();
        testCompleted = true;
    }
}
let IoGuiTestPage = class IoGuiTestPage extends IoElement {
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
        this.appendChild(mochaDiv);
        mochaDiv.style.display = 'block';
        runTests();
        setTimeout(() => {
            const failElement = this.parentElement.querySelector('.fail');
            failElement.parentElement.parentElement.parentElement.parentElement.scrollIntoView({
                behavior: 'smooth'
            });
        }, 100);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        document.body.appendChild(mochaDiv);
        mochaDiv.style.display = 'none';
    }
};
IoGuiTestPage = __decorate([
    RegisterIoElement
], IoGuiTestPage);
export { IoGuiTestPage };
//# sourceMappingURL=iogui.test.js.map