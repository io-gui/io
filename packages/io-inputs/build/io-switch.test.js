import { IoSwitch } from './index.js';
export default class {
    element = new IoSwitch();
    constructor() {
        this.element.style.display = 'none';
        document.body.appendChild(this.element);
    }
    run() {
        describe('io-switch.test', () => {
            it('has default values', () => {
                expect(this.element.value).to.equal(false);
            });
            it('has tabindex attribute', () => {
                expect(this.element.getAttribute('tabindex')).to.equal('0');
            });
            it('has a11y attributes', () => {
                expect(this.element.getAttribute('role')).to.equal('switch');
                expect(this.element.getAttribute('aria-label')).to.equal(null);
                this.element.label = 'click here';
                expect(this.element.getAttribute('aria-label')).to.equal('click here');
            });
            it('has value attribute when value is true', () => {
                this.element.value = false;
                expect(this.element.hasAttribute('value')).to.equal(false);
                expect(this.element.getAttribute('value')).to.equal(null);
                expect(this.element.getAttribute('aria-checked')).to.equal('false');
                this.element.value = true;
                expect(this.element.hasAttribute('value')).to.equal(true);
                expect(this.element.getAttribute('value')).to.equal('');
                expect(this.element.getAttribute('aria-checked')).to.equal('true');
            });
            it('has title attribute', () => {
                this.element.label = 'click here';
                expect(this.element.getAttribute('title')).to.equal('click here');
                this.element.label = 'Button';
            });
        });
    }
}
//# sourceMappingURL=io-switch.test.js.map