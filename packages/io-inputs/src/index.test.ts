import BooleanElementTest from './elements/IoBoolean.test';
import ButtonElementTest from './elements/IoButton.test';
import FieldElementTest from './elements/IoField.test';
import NumberElementTest from './elements/IoNumber.test';
import NumberLadderElementTest from './elements/IoNumberLadder.test';
import NumberLadderStepElementTest from './elements/IoNumberLadderStep.test';
import StringElementTest from './elements/IoString.test';
import SwitchElementTest from './elements/IoSwitch.test';

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