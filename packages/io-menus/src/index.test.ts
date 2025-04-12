import OptionMenuElementTest from './elements/IoOptionMenu.test.js';
import MenuItemNodeTest from './nodes/MenuItem.test.js';
import MenuOptionsNodeTest from './nodes/MenuOptions.test.js';

export default class {
  run() {
    new OptionMenuElementTest().run();
    new MenuItemNodeTest().run();
    new MenuOptionsNodeTest().run();
  }
}