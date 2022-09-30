import ProtoChainTest from './protoChain.test.js';
import PropertyTest from './property.test.js';
import BindingTest from './binding.test.js';
import EventDispatcherTest from './eventDispatcher.test.js';
import ChangeQueueTest from './changeQueue.test.js';

export default class {
  run() {
    new ProtoChainTest().run();
    new PropertyTest().run();
    new BindingTest().run();
    new EventDispatcherTest().run();
    new ChangeQueueTest().run();
  }
}