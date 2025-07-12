import IoOptionMenuTest from './elements/IoOptionSelect.test.js';
import IoMenuItemNodeTest from './nodes/MenuItem.test.js';
import IoMenuOptionsNodeTest from './nodes/MenuOptions.test.js';

export default class {
  run() {
    new IoOptionMenuTest().run();
    new IoMenuItemNodeTest().run();
    new IoMenuOptionsNodeTest().run();
  }
}