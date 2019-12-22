import {IoBoolicon, IoIconsetSingleton} from "../../io-core.js";

export default class {
	constructor() {
		this.element = new IoBoolicon();
		this.element.style.display = 'none';
		document.body.appendChild(this.element);
	}
	run() {
		describe('IoBoolicon', () => {
			describe('default values', () => {
				it('has default values', () => {
					chai.expect(this.element.value).to.equal(false);
					chai.expect(this.element.true).to.equal('icons:box_fill_checked');
					chai.expect(this.element.false).to.equal('icons:box');
				});
			});
			describe('innerText', () => {
				it('matches value', () => {
					chai.expect(this.element.innerHTML).to.equal(IoIconsetSingleton.getIcon(this.element.false));
					this.element.value = true;
					chai.expect(this.element.innerHTML).to.equal(IoIconsetSingleton.getIcon(this.element.true));
					this.element.value = false;
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
