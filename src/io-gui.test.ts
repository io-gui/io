
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

// import InputsTests from 'io-inputs/build/index.test.js';

// import ColorElementTest from './elements/color/index.test';
// import ExtrasElementTest from './elements/extras/index.test';
// import LayoutElementTest from './elements/layout/index.test';
// import VectorElementTest from './elements/vectors/index.test';
// import MenuElementTest from './elements/menus/index.test';
// import NotifyElementTest from './elements/notify/index.test';
// import ObjectElementTest from './elements/object/index.test';
// import SlidersElementTest from './elements/sliders/index.test';

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
  new FieldElementTest().run();
  new IconElementTest().run();
  new IconsetElementTest().run();
  new LabelElementTest().run();

  // new InputsTests().run();

  // new ColorElementTest().run();
  // new ExtrasElementTest().run();
  // new LayoutElementTest().run();
  // new VectorElementTest().run();
  // new MenuElementTest().run();
  // new NotifyElementTest().run();
  // new ObjectElementTest().run();
  // new SlidersElementTest().run();

  mocha.checkLeaks();
  mocha.run(() => {
    sessionFinished();
  });
} catch (error) {
  await sessionFailed(error as any);
}