import BooleanElementTest from './elements/IoBoolean.test.js';
import ButtonElementTest from './elements/IoButton.test.js';
import FieldElementTest from './elements/IoField.test.js';
import NumberElementTest from './elements/IoNumber.test.js';
import NumberLadderElementTest from './elements/IoNumberLadder.test.js';
import NumberLadderStepElementTest from './elements/IoNumberLadderStep.test.js';
import StringElementTest from './elements/IoString.test.js';
import SwitchElementTest from './elements/IoSwitch.test.js';

export default class {
  run() {
    new BooleanElementTest().run();
    new ButtonElementTest().run();
    new FieldElementTest().run();
    new NumberElementTest().run();
    new NumberLadderElementTest().run();
    new NumberLadderStepElementTest().run();
    new StringElementTest().run();
    new SwitchElementTest().run();
  }
}