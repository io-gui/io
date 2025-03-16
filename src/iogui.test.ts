
import BindingTest from './core/internals/binding.test.js';
import ChangeQueueTest from './core/internals/changeQueue.test.js';
import EventDispatcherTest from './core/internals/eventDispatcher.test.js';
import PropertyTest from './core/internals/property.test.js';
import ProtoChainTest from './core/internals/protoChain.test.js';

import ElementTest from './core/element.test.js';
import GLTest from './core/gl.test.js';
import OverlayTest from './core/overlay.test.js';
import NodeTest from './core/node.test.js';
import StorageTest from './core/storage.test.js';
import ThemeTest from './core/theme.test.js';

import BasicElementTest from './elements/basic/index.test.js';
import ColorElementTest from './elements/color/index.test.js';
// import ExtrasElementTest from './elements/extras/index.test.js';
// import LayoutElementTest from './elements/layout/index.test.js';
// import VectorElementTest from './elements/vectors/index.test.js';
import MenuElementTest from './elements/menus/index.test.js';
// import NotifyElementTest from './elements/notify/index.test.js';
// import ObjectElementTest from './elements/object/index.test.js';
import SlidersElementTest from './elements/sliders/index.test.js';

import { mocha, sessionFinished, sessionFailed } from '@web/test-runner-mocha';

const mochaDiv = document.createElement('div');
mochaDiv.setAttribute('id', 'mocha');
document.body.appendChild(mochaDiv);
mochaDiv.style.display = 'none';

try {
  mocha.setup({ ui: 'bdd' });
} catch (error) {
  console.error(error);
}

try {
  new BindingTest().run();
  new ChangeQueueTest().run();
  new EventDispatcherTest().run();
  new PropertyTest().run();
  new ProtoChainTest().run ();

  new NodeTest().run();
  new ElementTest().run();
  new GLTest().run();
  new ThemeTest().run();
  new OverlayTest().run();
  new StorageTest().run();

  new BasicElementTest().run();
  new ColorElementTest().run();
  // new ExtrasElementTest().run();
  // new LayoutElementTest().run();
  // new VectorElementTest().run();
  new MenuElementTest().run();
  // new NotifyElementTest().run();
  // new ObjectElementTest().run();
  new SlidersElementTest().run();

  mocha.checkLeaks();
  mocha.run(() => {
    sessionFinished();
  });
} catch (error) {
  await sessionFailed(error as any);
}