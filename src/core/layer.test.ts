import {IoLayerSingleton} from '../iogui.js';

export default class {
  element: typeof IoLayerSingleton;
  constructor() {
    this.element = IoLayerSingleton;
  }
  run() {
    describe('IoLayerSingleton', () => {
      it('TODO', () => {
        chai.expect('TODO').to.be.equal(false);
      });
    });
  }
}
