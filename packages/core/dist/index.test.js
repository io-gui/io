import BindingTest from './core/Binding.test.js';
import ChangeQueueTest from './core/ChangeQueue.test.js';
import EventDispatcherTest from './core/EventDispatcher.test.js';
import ReactivePropertyTest from './core/ReactiveProperty.test.js';
import ProtoChainTest from './core/ProtoChain.test.js';
import QueueTest from './core/Queue.test.js';
import VDOMTest from './vdom/VDOM.test.js';
import NodeTest from './nodes/Node.test.js';
import StorageTest from './nodes/Storage.test.js';
import ThemeTest from './nodes/Theme.test.js';
import IoElementTest from './elements/IoElement.test.js';
import IoGLTest from './elements/IoGL.test.js';
import IoOverlayTest from './elements/IoOverlay.test.js';
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
//# sourceMappingURL=index.test.js.map