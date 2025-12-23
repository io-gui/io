import IoBooleanTest from './elements/IoBoolean.test.js'
import IoButtonTest from './elements/IoButton.test.js'
import IoFieldTest from './elements/IoField.test.js'
import IoNumberTest from './elements/IoNumber.test.js'
import IoNumberLadderSingletonTest from './elements/IoNumberLadderSingleton.test.js'
import IoNumberLadderStepTest from './elements/IoNumberLadderStep.test.js'
import IoStringTest from './elements/IoString.test.js'
import IoSwitchTest from './elements/IoSwitch.test.js'

export default class {
  run() {
    new IoBooleanTest().run()
    new IoButtonTest().run()
    new IoFieldTest().run()
    new IoNumberTest().run()
    new IoNumberLadderSingletonTest().run()
    new IoNumberLadderStepTest().run()
    new IoStringTest().run()
    new IoSwitchTest().run()
  }
}