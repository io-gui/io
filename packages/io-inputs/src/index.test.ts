import BooleanElementTest from './elements/IoBoolean.test';
import ButtonElementTest from './elements/IoButton.test';
import InputBaseElementTest from './elements/IoInputBase.test';
import NumberElementTest from './elements/IoNumber.test';
import NumberLadderElementTest from './elements/IoNumberLadder.test';
import NumberLadderStepElementTest from './elements/IoNumberLadderStep.test';
import StringElementTest from './elements/IoString.test';
import SwitchElementTest from './elements/IoSwitch.test';
import FieldElementTest from './elements/IoField.test';

export default class {
  run() {
    new BooleanElementTest().run();
    new ButtonElementTest().run();
    new InputBaseElementTest().run();
    new NumberElementTest().run();
    new NumberLadderElementTest().run();
    new NumberLadderStepElementTest().run();
    new StringElementTest().run();
    new SwitchElementTest().run();
    new FieldElementTest().run();
  }
}