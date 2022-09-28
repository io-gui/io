import {IoField} from '../../iogui.js';

const element = new IoField();
element.style.display = 'none';
document.body.appendChild(element as unknown as HTMLElement);

export default class {
  run() {
    describe('IoField', () => {
      describe('Initialization', () => {
        it('Should have core API functions defined', () => {
          chai.expect(typeof element.getCaretPosition).to.equal('function');
          chai.expect(typeof element.setCaretPosition).to.equal('function');
        });
        it('Should initialize property definitions correctly', () => {
          chai.expect(element.tabindex).to.equal('0');
          chai.expect(element.contenteditable).to.equal(false);
          chai.expect(element.class).to.equal('');
          chai.expect(element.role).to.equal('');
          chai.expect(element.label).to.equal('');
          chai.expect(element.name).to.equal('');
          chai.expect(element.title).to.equal('');
          chai.expect(element.id).to.equal('');
          chai.expect(element.hidden).to.equal(false);
          chai.expect(element.disabled).to.equal(false);
          chai.expect(element.value).to.equal(undefined);
          chai.expect(element.selected).to.equal(false);

          chai.expect(element._properties.value).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'none',
            type: undefined,
            value: undefined,
          });
          chai.expect(element._properties.selected).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'prop',
            type: Boolean,
            value: false,
          });
          chai.expect(element._properties.tabindex).to.eql({
            binding: undefined,
            notify: true,
            observe: false,
            reflect: 'prop',
            type: String,
            value: '0',
          });
        });
        it('has correct default attributes', () => {
          chai.expect(element.getAttribute('tabindex')).to.equal('0');
          chai.expect(element.getAttribute('contenteditable')).to.equal(null);
          chai.expect(element.getAttribute('class')).to.equal(null);
          chai.expect(element.getAttribute('role')).to.equal(null);
          chai.expect(element.getAttribute('label')).to.equal(null);
          chai.expect(element.getAttribute('name')).to.equal(null);
          chai.expect(element.getAttribute('title')).to.equal(null);
          chai.expect(element.getAttribute('id')).to.equal(null);
          chai.expect(element.getAttribute('hidden')).to.equal(null);
          chai.expect(element.getAttribute('disabled')).to.equal(null);
          chai.expect(element.getAttribute('value')).to.equal(null);
          chai.expect(element.getAttribute('selected')).to.equal(null);
        });
      });
      describe('Reactivity', () => {
        it('should set innerText to match value and/or label property', () => {
          chai.expect(element.innerText).to.equal('');
          element.value = false;
          chai.expect(element.innerText).to.equal('false');
          element.value = {};
          chai.expect(element.innerText).to.equal('Object');
          element.value = [0, 1, 2, 3];
          chai.expect(element.innerText).to.equal('Array(4)');
          element.label = 'label';
          chai.expect(element.innerText).to.equal('label');
          element.value = undefined;
          chai.expect(element.innerText).to.equal('label');
          element.label = '';
          chai.expect(element.innerText).to.equal('undefined');
        });
        it('has reactive attributes', () => {
          element.tabindex = '1';
          chai.expect(element.getAttribute('tabindex')).to.equal('1');
          element.tabindex = '0';
          element.contenteditable = true;
          chai.expect(element.getAttribute('contenteditable')).to.equal('');
          element.contenteditable = false;
          element.class = 'foo';
          chai.expect(element.getAttribute('class')).to.equal('foo');
          element.class = '';
          element.role = 'button';
          chai.expect(element.getAttribute('role')).to.equal('button');
          element.role = '';
          element.label = 'text';
          chai.expect(element.getAttribute('label')).to.equal('text');
          element.label = '';
          element.name = 'name';
          chai.expect(element.getAttribute('name')).to.equal('name');
          element.name = '';
          element.title = 'title';
          chai.expect(element.getAttribute('title')).to.equal('title');
          element.title = '';
          element.id = 'one';
          chai.expect(element.getAttribute('id')).to.equal('one');
          element.id = ''
          element.hidden = true;
          chai.expect(element.getAttribute('hidden')).to.equal('');
          element.hidden = false;
          element.disabled = true;
          chai.expect(element.getAttribute('disabled')).to.equal('');
          element.disabled = false;
          element.value = 'test'
          chai.expect(element.getAttribute('value')).to.equal(null);
          element.value = undefined;
          element.selected = true;
          chai.expect(element.getAttribute('selected')).to.equal('');
          element.selected = false;
        });
      });
      describe('Accessibility', () => {
        it('has a11y attributes', () => {
          chai.expect(element.getAttribute('aria-label')).to.equal(null);
          element.label = 'label';
          chai.expect(element.getAttribute('aria-label')).to.equal('label');
          element.label = '';
          chai.expect(element.getAttribute('aria-label')).to.equal(null);
          element.disabled = true;
          chai.expect(element.getAttribute('aria-disabled')).to.equal('');
          element.disabled = false;
        });
      });
    });
  }
}
