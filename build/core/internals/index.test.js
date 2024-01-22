import BindingTest from './binding.test.js';
import ChangeQueueTest from './changeQueue.test.js';
import EventDispatcherTest from './eventDispatcher.test.js';
import PropertyTest from './property.test.js';
import ProtoChainTest from './protoChain.test.js';
export default class {
    run() {
        new BindingTest().run();
        new ChangeQueueTest().run();
        new EventDispatcherTest().run();
        new PropertyTest().run();
        new ProtoChainTest().run();
    }
}
//# sourceMappingURL=index.test.js.map