import IconsetElementTest from './nodes/iconset.test';
import IconElementTest from './elements/io-icon.test';

export default class {
  run() {
    new IconsetElementTest().run();
    new IconElementTest().run();
  }
}