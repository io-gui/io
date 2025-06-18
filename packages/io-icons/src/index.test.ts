import IconsetElementTest from './nodes/Iconset.test.js';
import IconElementTest from './elements/IoIcon.test.js';

export default class {
  run() {
    new IconsetElementTest().run();
    new IconElementTest().run();
  }
}