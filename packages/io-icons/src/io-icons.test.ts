
import { mocha, sessionFinished, sessionFailed } from '@web/test-runner-mocha';
import { expect } from 'chai';
import { IoIconsetSingleton } from 'io-gui';

const mochaDiv = document.createElement('div');
mochaDiv.setAttribute('id', 'mocha');
document.body.appendChild(mochaDiv);
mochaDiv.style.display = 'none';

class IconsTest {
  run() {
    describe('io-icons.test.ts', () => {
      it('should be defined', () => {
        expect(IoIconsetSingleton).to.exist;
      });
      it('should have icons', () => {
        expect(IoIconsetSingleton.icons).to.exist;
      });
    });
  }
}

try {
  mocha.setup({ ui: 'bdd' });
} catch (error) {
  console.error(error);
}

try {
  new IconsTest().run();

  mocha.checkLeaks();
  mocha.run(() => {
    sessionFinished();
  });
} catch (error) {
  await sessionFailed(error as any);
}