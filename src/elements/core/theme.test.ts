import {IoThemeSingleton} from './theme.js';

export default class {
  element: typeof IoThemeSingleton;
  constructor() {
    this.element = IoThemeSingleton;
  }
  run() {
    describe('IoThemeSingleton', () => {
      it('TODO', () => {
      });
    });
  }
}
