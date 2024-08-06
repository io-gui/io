import { IoElement, Register } from './iogui.js';
import CoreTests from './core/index.test.js';
import ElementsTests from './elements/index.test.js';

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

export async function afterHashChange(): Promise<void> {
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

@Register
export class IoGuiTestPage extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        background: var(--iotBgColor);
        color: var(--iotColor);
      }
      :host #mocha {
        font: 20px/1.5 "Helvetica Neue", Helvetica, Arial, sans-serif;
        margin: 0 var(--iotLineHeight);
        position: relative;
      }

      :host #mocha-stats {
        display: flex;
        flex-direction: row;
        font-size: var(--iotFontSize);
        color: var(--iotColor);
        margin: var(--iotLineHeight) 0 !important;
      }
      :host #mocha-stats .progress-contain {
        display: flex;
        margin-right: auto;
      }
      :host #mocha-stats .progress-ring {
        display: none;
      }
      :host #mocha-stats .progress-element {
        margin-top: 0.2em;
        margin-right: 1em;
      }
      :host #mocha-stats a {
        text-decoration: none;
        color: inherit;
      }

      :host #mocha-stats .passes {
        margin-right: var(--iotLineHeight);
        color: var(--iotColorGreen);
      }
      :host #mocha-stats .failures {
        margin-right: var(--iotLineHeight);
        color: var(--iotColorRed);
      }

      :host #mocha .replay {
        display: none !important;
      }

      :host #mocha ul,
      :host #mocha li {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      :host #mocha h1,
      :host #mocha h2 {
        margin: 0;
      }
      :host #mocha h1 {
        margin-top: 1em;
        font-size: 1em;
        font-weight: 200;
      }
      :host #mocha h1 a {
        text-decoration: none;
        color: inherit;
      }
      :host #mocha h1 a:hover {
        text-decoration: underline;
      }
      :host #mocha h2 {
        font-size: 0.75em;
        font-weight: 300;
        padding-left: 1em !important;
        cursor: pointer;
      }

      :host #mocha .hidden {
        display: none;
      }

      :host #mocha .test > pre {
        background: var(--iotBgColorDimmed);
        font-size: var(--iotFontSize);
        margin: var(--iotLineHeight);
        margin-top: 0.25em;
        padding: var(--iotLineHeight);
        overflow: auto;
        border: var(--iotBorder);
        border-radius: var(--iotBorderRadius2);
        max-width: calc(100% - 42px);
      }

      :host #mocha .test.fail h2::before {
        content: '✖';
        font-size: 1em;
        margin: 0 0.5em 0 0;
        color: var(--iotColorRed);
      }
      :host #mocha .test.pass h2::before {
        content: '✓';
        font-size: 1em;
        margin: 0 0.5em 0 0;
        color: var(--iotColorGreen);
      }

      :host #mocha .test.fail pre.error {
        border: var(--iotBorderFail);
      }

      :host #mocha code .comment { color: #ddd; }
      :host #mocha code .init { color: #2f6fad; }
      :host #mocha code .string { color: #5890ad; }
      :host #mocha code .keyword { color: #8a6343; }
      :host #mocha code .number { color: #2f6fad; }

      @media screen and (max-width: 550px) {
        :host #mocha-stats .progress-contain {
          display: none;
        }

        :host #mocha .test > pre {
          font-size: 0.5em;
        }
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
}