var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import 'mocha/mocha.js';
import 'chai/chai.js';
import { IoElement, Register } from './iogui.js';
import CoreTests from './core/index.test.js';
import ElementsTests from './elements/index.test.js';
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
export async function afterHashChange() {
    return new Promise((resolve) => {
        self.addEventListener('hashchange', () => {
            resolve();
        }, { once: true });
    });
}
function runTests() {
    if (!testCompleted) {
        new CoreTests().run();
        new ElementsTests().run();
        mocha.checkLeaks();
        mocha.run();
        testCompleted = true;
    }
}
let IoGuiTestPage = class IoGuiTestPage extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        background: var(--iotBackgroundColor);
        color: var(--iotColor);
      }
      :host #mocha {
        margin: 0 var(--iotLineHeight);
        position: relative;
      }
      :host #mocha-report {
        margin: 2em 1em;
      }
      :host #mocha-stats {
        position: absolute;
        top: -2em;
        left: var(--iotSpacing2);
        font-size: 12px;
        margin: 0;
      }
      :host #mocha-stats em {
        color: var(--iotColor);
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
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        document.body.appendChild(mochaDiv);
        mochaDiv.style.display = 'none';
    }
};
IoGuiTestPage = __decorate([
    Register
], IoGuiTestPage);
export { IoGuiTestPage };
// Element test template
// const element = new IoElement();
// export default class {
//   run() {
//     describe('IoElement', () => {
//       describe('Initialization', () => {
//         it('Should initialize property definitions correctly', () => {
//         });
//         it('has correct default attributes', () => {
//         });
//         it('has correct default innerHTML', () => {
//         });
//       });
//       describe('Reactivity', () => {
//         it('should render innerHTML', () => {
//         });
//         it('should change...', () => {
//         });
//         it('has reactive attributes', () => {
//         });
//       });
//       describe('Accessibility', () => {
//       });
//     });
//   }
// }
//# sourceMappingURL=iogui.test.js.map