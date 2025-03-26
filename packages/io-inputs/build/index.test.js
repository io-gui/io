import BooleanElementTest from './io-boolean.test';
import ButtonElementTest from './io-button.test';
import SwitchElementTest from './io-switch.test';
import StringElementTest from './io-string.test';
import NumberElementTest from './io-number.test';
export default class {
    run() {
        new BooleanElementTest().run();
        new ButtonElementTest().run();
        new NumberElementTest().run();
        new StringElementTest().run();
        new SwitchElementTest().run();
    }
}
//# sourceMappingURL=index.test.js.map