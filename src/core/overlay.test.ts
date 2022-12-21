import {IoOverlaySingleton} from '../iogui.js';

export default class {
  run() {
    describe('IoOverlaySingleton', () => {
      describe('Initialization', () => {
        it('Should have core API functions defined', () => {
          chai.expect(IoOverlaySingleton.nudgeDown).to.be.a('function');
          chai.expect(IoOverlaySingleton.nudgeUp).to.be.a('function');
          chai.expect(IoOverlaySingleton.nudgeRight).to.be.a('function');
          chai.expect(IoOverlaySingleton.nudgeLeft).to.be.a('function');
          chai.expect(IoOverlaySingleton.nudgePointer).to.be.a('function');
          chai.expect(IoOverlaySingleton.setElementPosition).to.be.a('function');
          chai.expect(IoOverlaySingleton.onChildExpanded).to.be.a('function');
          chai.expect(IoOverlaySingleton.onChildExpandedDelayed).to.be.a('function');
        });
        it('Should initialize property definitions correctly', () => {
          chai.expect(IoOverlaySingleton.expanded).to.be.eql(false);
          chai.expect(IoOverlaySingleton.skipCollapse).to.be.eql(false);

          chai.expect(IoOverlaySingleton._properties.get('expanded')).to.eql({
            binding: undefined,
            reactive: true,
            observe: false,
            reflect: true,
            type: Boolean,
            value: false,
          });

          chai.expect(IoOverlaySingleton._properties.get('skipCollapse')).to.eql({
            binding: undefined,
            reactive: true,
            observe: false,
            reflect: false,
            type: Boolean,
            value: false,
          });
        });
      });
    });
  }
}
