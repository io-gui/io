import {IoOverlaySingleton} from '../iogui.js';
import { expect } from 'chai';

export default class {
  run() {
    describe('IoOverlaySingleton', () => {
      describe('Initialization', () => {
        it('Should have core API functions defined', () => {
          expect(IoOverlaySingleton.nudgeDown).to.be.a('function');
          expect(IoOverlaySingleton.nudgeUp).to.be.a('function');
          expect(IoOverlaySingleton.nudgeRight).to.be.a('function');
          expect(IoOverlaySingleton.nudgeLeft).to.be.a('function');
          expect(IoOverlaySingleton.nudgePointer).to.be.a('function');
          expect(IoOverlaySingleton.setElementPosition).to.be.a('function');
          expect(IoOverlaySingleton.onChildExpanded).to.be.a('function');
          expect(IoOverlaySingleton.onChildExpandedDelayed).to.be.a('function');
        });
        it('Should initialize property definitions correctly', () => {
          expect(IoOverlaySingleton.expanded).to.be.eql(false);

          expect(IoOverlaySingleton._properties.get('expanded')).to.eql({
            binding: undefined,
            reactive: true,
            init: undefined,
            reflect: true,
            type: Boolean,
            value: false,
          });
        });
      });
    });
  }
}
