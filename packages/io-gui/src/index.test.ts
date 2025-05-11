import BindingTest from './core/Binding.test';
import ChangeQueueTest from './core/ChangeQueue.test';
import EventDispatcherTest from './core/EventDispatcher.test';
import ReactivePropertyTest from './core/ReactiveProperty.test';
import ProtoChainTest from './core/ProtoChain.test';
import QueueTest from './core/Queue.test';
import VDOMTest from './vdom/VDOM.test';
import NodeTest from './nodes/Node.test';
import StorageTest from './nodes/Storage.test';
import ThemeTest from './nodes/Theme.test';
import IoElementTest from './elements/IoElement.test';
import IoGLTest from './elements/IoGL.test';
import IoOverlayTest from './elements/IoOverlay.test';
export default class {
  run() {
    new BindingTest().run();
    new ChangeQueueTest().run();
    new EventDispatcherTest().run();
    new ReactivePropertyTest().run();
    new ProtoChainTest().run();
    new QueueTest().run();
    new VDOMTest().run();
    new NodeTest().run();
    new StorageTest().run();
    new ThemeTest().run();
    new IoElementTest().run();
    new IoGLTest().run();
    new IoOverlayTest().run();
  }
}