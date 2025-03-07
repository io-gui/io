import CoreTests from './core/index.test.js';
import ElementsTests from './elements/index.test.js';

import { mocha, sessionFinished, sessionFailed } from '@web/test-runner-mocha';

const mochaDiv = document.createElement('div');
mochaDiv.setAttribute('id', 'mocha');
document.body.appendChild(mochaDiv);
mochaDiv.style.display = 'none';

try {
  mocha.setup({ ui: 'bdd' });
} catch (error) {
  console.error(error);
}

try {
  new CoreTests().run();
  new ElementsTests().run();
  mocha.checkLeaks();
  mocha.run(() => {
    sessionFinished();
  });
} catch (error) {
  sessionFailed(error as any);
}