import { IoSwitch } from './switch.js';
export default class {
    element = new IoSwitch();
    constructor() {
        this.element.style.display = 'none';
        document.body.appendChild(this.element);
    }
    run() {
        describe('IoSwitch', () => {
            describe('default values', () => {
                it('has default values', () => {
                    chai.expect(this.element.value).to.equal(false);
                });
            });
            describe('attributes', () => {
                it('has tabindex attribute', () => {
                    chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
                });
                it('has a11y attributes', () => {
                    chai.expect(this.element.getAttribute('role')).to.equal('switch');
                    chai.expect(this.element.getAttribute('aria-label')).to.equal('Boolean');
                    this.element.label = 'click here';
                    chai.expect(this.element.getAttribute('aria-label')).to.equal('click here');
                    this.element.label = 'Boolean';
                    chai.expect(this.element.getAttribute('aria-label')).to.equal('Boolean');
                });
                it('has value attribute when value is true', () => {
                    this.element.value = false;
                    chai.expect(this.element.hasAttribute('value')).to.equal(false);
                    chai.expect(this.element.getAttribute('value')).to.equal(null);
                    chai.expect(this.element.getAttribute('aria-checked')).to.equal('false');
                    this.element.value = true;
                    chai.expect(this.element.hasAttribute('value')).to.equal(true);
                    chai.expect(this.element.getAttribute('value')).to.equal('');
                    chai.expect(this.element.getAttribute('aria-checked')).to.equal('true');
                });
                it('has title attribute', () => {
                    this.element.label = 'click here';
                    chai.expect(this.element.getAttribute('title')).to.equal('click here');
                    this.element.label = 'Button';
                });
            });
        });
    }
}
//# sourceMappingURL=switch.test.js.map