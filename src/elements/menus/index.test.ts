import MenuItemTest from './models/menu-item.test.js';
import MenuOptionsTest from './models/menu-options.test.js';

export default class {
  run() {
    new MenuItemTest().run();
    new MenuOptionsTest().run();
  }
}