import BooleanElementTest from './io-boolean.test.js';
import ButtonElementTest from './io-button.test.js';
import FieldElementTest from './io-field.test.js';
import IconElementTest from './io-icon.test.js';
import IconsetElementTest from './io-iconset.test.js';
import LabelElementTest from './io-label.test.js';
import SwitchElementTest from './io-switch.test.js';
import StringElementTest from './io-string.test.js';
import NumberElementTest from './io-number.test.js';
export default class {
    run() {
        new BooleanElementTest().run();
        new ButtonElementTest().run();
        new FieldElementTest().run();
        new IconElementTest().run();
        new IconsetElementTest().run();
        new LabelElementTest().run();
        new NumberElementTest().run();
        new StringElementTest().run();
        new SwitchElementTest().run();
    }
}
//# sourceMappingURL=index.test.js.map