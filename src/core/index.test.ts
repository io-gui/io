import InternalsTest from './internals/index.test.js';
import NodeTest from './node.test.js';
import ElementTest from './element.test.js';
import GLTest from './gl.test.js';
import ThemeTest from './theme.test.js';
import LayerTest from './layer.test.js';
import StorageTest from './storage.test.js';

export default class {
  run() {
    new InternalsTest().run();
    new NodeTest().run();
    new ElementTest().run();
    new GLTest().run();
    new ThemeTest().run();
    new LayerTest().run();
    new StorageTest().run();
  }
}