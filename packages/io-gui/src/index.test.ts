import BindingTest from './core/internals/binding.test';
import ChangeQueueTest from './core/internals/changeQueue.test';
import EventDispatcherTest from './core/internals/eventDispatcher.test';
import PropertyTest from './core/internals/property.test';
import ProtoChainTest from './core/internals/protoChain.test';
import ElementTest from './core/element.test';
import NodeTest from './core/node.test';
import StorageTest from './nodes/storage.test';
import ThemeTest from './nodes/theme.test';
import FieldTest from './elements/field.test';
import GLTest from './elements/gl.test';
import OverlayTest from './elements/overlay.test';
import TextTest from './elements/text.test';
export default class {
  run() {
    new BindingTest().run();
    new ChangeQueueTest().run();
    new EventDispatcherTest().run();
    new PropertyTest().run();
    new ProtoChainTest().run();
    new ElementTest().run();
    new NodeTest().run();
    new StorageTest().run();
    new ThemeTest().run();
    new FieldTest().run();
    new GLTest().run();
    new OverlayTest().run();
    new TextTest().run();
  }
}