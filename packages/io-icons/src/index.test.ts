import IconsetElementTest from './nodes/Iconset.test';
import IconElementTest from './elements/IoIcon.test';

export default class {
  run() {
    new IconsetElementTest().run();
    new IconElementTest().run();
  }
}