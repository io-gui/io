import {IoLayerSingleton} from '../iogui.js';

export default class {
  run() {
    describe('IoLayerSingleton', () => {
      describe('Initialization', () => {
        it('Should have core API functions defined', () => {
          chai.expect(IoLayerSingleton.nudgeDown).to.be.a('function');
          chai.expect(IoLayerSingleton.nudgeUp).to.be.a('function');
          chai.expect(IoLayerSingleton.nudgeRight).to.be.a('function');
          chai.expect(IoLayerSingleton.nudgeLeft).to.be.a('function');
          chai.expect(IoLayerSingleton.nudgePointer).to.be.a('function');
          chai.expect(IoLayerSingleton.setElementPosition).to.be.a('function');
          chai.expect(IoLayerSingleton.onChildExpanded).to.be.a('function');
          chai.expect(IoLayerSingleton.onChildExpandedDelayed).to.be.a('function');
        });
        it('Should initialize property definitions correctly', () => {
          chai.expect(IoLayerSingleton.expanded).to.be.eql(false);
          chai.expect(IoLayerSingleton.skipCollapse).to.be.eql(false);

          chai.expect(IoLayerSingleton._properties.get('expanded')).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: true,
            type: Boolean,
            value: false,
          });

          chai.expect(IoLayerSingleton._properties.get('skipCollapse')).to.eql({
            binding: undefined,
            notify: true,
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
