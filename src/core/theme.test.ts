import {IoThemeSingleton} from '../iogui.js';

export default class {
  element: typeof IoThemeSingleton;
  constructor() {
    this.element = IoThemeSingleton;
  }
  run() {
    describe('IoThemeSingleton', () => {
      it('TODO', () => {
        chai.expect('TODO').to.be.equal(false);
      });
    });
  }
}
