import { IoElement, Register } from './iogui.js';
import CoreTests from './core/index.test.js';
import ElementsTests from './elements/index.test.js';

import { mocha, sessionFinished, sessionFailed } from '@web/test-runner-mocha';

try {
  mocha.setup({ ui: 'bdd' });
} catch (error) {
  console.error(error);
}

let testCompleted = false;

@Register
export class IoGuiTestPage extends IoElement {
  connectedCallback() {
    super.connectedCallback();
    if (testCompleted) return;
    try {
      new CoreTests().run();
      new ElementsTests().run();
      mocha.checkLeaks();
      mocha.run(() => {
        sessionFinished();
        testCompleted = true;
      });
    } catch (error) {
      sessionFailed(error as any);
    }
  }
}