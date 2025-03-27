import BindingTest from './core/internals/binding.test';
import ChangeQueueTest from './core/internals/changeQueue.test';
import EventDispatcherTest from './core/internals/eventDispatcher.test';
import PropertyTest from './core/internals/property.test';
import ProtoChainTest from './core/internals/protoChain.test';
import ElementTest from './core/element.test';
import NodeTest from './core/node.test';
import IconsetElementTest from './nodes/iconset.test';
import StorageTest from './nodes/storage.test';
import ThemeTest from './nodes/theme.test';
import FieldElementTest from './elements/field.test';
import GLTest from './elements/gl.test';
import IconElementTest from './elements/icon.test';
import LabelElementTest from './elements/label.test';
import OverlayTest from './elements/overlay.test';

export default class {
  run() {
    new BindingTest().run();
    new ChangeQueueTest().run();
    new EventDispatcherTest().run();
    new PropertyTest().run();
    new ProtoChainTest().run();
    new ElementTest().run();
    new NodeTest().run();
    new IconsetElementTest().run();
    new StorageTest().run();
    new ThemeTest().run();
    new FieldElementTest().run();
    new GLTest().run();
    new IconElementTest().run();
    new LabelElementTest().run();
    new OverlayTest().run();
  }
}