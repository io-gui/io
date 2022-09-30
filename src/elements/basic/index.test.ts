import BooleanElementTest from './boolean.test.js';
import ButtonElementTest from './button.test.js';
import FieldElementTest from './field.test.js';
import IconElementTest from './icon.test.js';
import IconsetElementTest from './iconset.test.js';
import LabelElementTest from './label.test.js';
import SwitchElementTest from './switch.test.js';
import StringElementTest from './string.test.js';
import NumberElementTest from './number.test.js';

export default class {
  run() {
    new BooleanElementTest().run();
    new ButtonElementTest().run();
    new FieldElementTest().run();
    new IconElementTest().run();
    new IconsetElementTest().run();
    new LabelElementTest().run();
    new SwitchElementTest().run();
    new StringElementTest().run();
    new NumberElementTest().run();
  }
}