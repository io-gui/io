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

export async function nextTick(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(()=>{
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

@RegisterIoElement
export class IoGuiTestPage extends IoElement {
  static get Style() {
    return /* css */`
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
      this.parentElement.scrollTop = this.parentElement.scrollHeight;
    }, 100);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.body.appendChild(mochaDiv);
    mochaDiv.style.display = 'none';
  }
}
