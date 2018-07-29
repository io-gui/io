import {IoObject} from "../elements/object.js";
import {IoTest} from "./test.js";

export class IoObjectTest extends IoTest(IoObject) {
  run() {
    describe('io-object', () => {
      it('value', () => {
        this.element.value = {a: 1, b: '2'};
        this.element.expanded = true;
        this.element.configs = {};
        let span = this.element.querySelector('span');
        chai.expect(span.innerHTML).to.equal('a:');
        let number = this.element.querySelector('io-number');
        chai.expect(number.innerHTML).to.equal('1.00');
      });
      it('label', () => {
        this.element.value = {a: 1, b: '2'};
        this.element.expanded = false;
        let span = this.element.querySelector('span');
        chai.expect(span).to.equal(null);

        this.element.label = undefined;
        let label = this.element.querySelector('io-boolean');
        chai.expect(label.innerHTML).to.equal('▸Object');
        this.element.expanded = true;
        chai.expect(label.innerHTML).to.equal('▾Object');

        this.element.label = 'OBJ';
        chai.expect(label.innerHTML).to.equal('▾OBJ');

        span = this.element.querySelector('span');
        chai.expect(span).to.not.equal(null);
      });
      it('configs', () => {
        this.element.value = {a: 1, b: '2'};
        this.element.expanded = true;
        this.element.configs = {'Object': {'key:a': {tag: 'io-slider'}, 'type:string': {tag: 'io-slider'}}};
        let sliders = this.element.querySelectorAll('io-slider');
        chai.expect(sliders[0]).to.not.equal(undefined);
        chai.expect(sliders[1]).to.not.equal(undefined);
      });
    });
  }
}

IoObjectTest.Register();
