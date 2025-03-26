import BooleanElementTest from './io-boolean.test';
import BooliconElementTest from './io-boolicon.test';
import ButtonElementTest from './io-button.test';
import NumberElementTest from './io-number.test';
import NumberLadderElementTest from './io-number-ladder.test';
import NumberLadderStepElementTest from './io-number-ladder-step.test';
import StringElementTest from './io-string.test';
import SwitchElementTest from './io-switch.test';
export default class {
  run() {
    new BooleanElementTest().run();
    new BooliconElementTest().run();
    new ButtonElementTest().run();
    new NumberElementTest().run();
    new NumberLadderElementTest().run();
    new NumberLadderStepElementTest().run();
    new StringElementTest().run();
    new SwitchElementTest().run();
  }
}