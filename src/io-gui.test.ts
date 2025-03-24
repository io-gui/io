
import BindingTest from './core/internals/binding.test';
import ChangeQueueTest from './core/internals/changeQueue.test';
import EventDispatcherTest from './core/internals/eventDispatcher.test';
import PropertyTest from './core/internals/property.test';
import ProtoChainTest from './core/internals/protoChain.test';

import ElementTest from './core/element.test';
import GLTest from './core/gl.test';
import OverlayTest from './core/overlay.test';
import NodeTest from './core/node.test';
import StorageTest from './core/storage.test';
import ThemeTest from './core/theme.test';

import BooleanElementTest from './elements/basic/io-boolean.test';
import ButtonElementTest from './elements/basic/io-button.test';
import FieldElementTest from './elements/basic/io-field.test';
import IconElementTest from './elements/basic/io-icon.test';
import IconsetElementTest from './elements/basic/io-iconset.test';
import LabelElementTest from './elements/basic/io-label.test';
import SwitchElementTest from './elements/basic/io-switch.test';
import StringElementTest from './elements/basic/io-string.test';
import NumberElementTest from './elements/basic/io-number.test';

import ColorElementTest from './elements/color/index.test';
// import ExtrasElementTest from './elements/extras/index.test';
// import LayoutElementTest from './elements/layout/index.test';
// import VectorElementTest from './elements/vectors/index.test';
import MenuElementTest from './elements/menus/index.test';
// import NotifyElementTest from './elements/notify/index.test';
// import ObjectElementTest from './elements/object/index.test';
import SlidersElementTest from './elements/sliders/index.test';

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

  new BooleanElementTest().run();
  new ButtonElementTest().run();
  new FieldElementTest().run();
  new IconElementTest().run();
  new IconsetElementTest().run();
  new LabelElementTest().run();
  new NumberElementTest().run();
  new StringElementTest().run();
  new SwitchElementTest().run();

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