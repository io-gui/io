import { applyNativeElementProps, constructElement, div } from 'io-core';

export default class {
  run() {
    describe('VDOM', () => {
      it('Should construct an native DIV element', () => {
        const element = constructElement(div());
        expect(element).to.exist;
        expect(element.localName).to.equal('div');
      });
      it('Should apply native element properties to the native DIV element', () => {
        const element = document.createElement('div');

        applyNativeElementProps(element, {
          tabIndex: 0,
          contentEditable: true,
          spellcheck: false,
        });

        expect(element.tabIndex).to.equal(0);
        expect(element.contentEditable).to.equal('true');
        expect(element.spellcheck).to.equal(false);

        expect(element.getAttribute('tabindex')).to.equal('0');
        expect(element.getAttribute('contenteditable')).to.equal('true');
        expect(element.getAttribute('spellcheck')).to.equal('false');

        applyNativeElementProps(element, {
          tabIndex: undefined,
          contentEditable: undefined,
          spellcheck: undefined,
        });

        expect(element.tabIndex).to.equal(-1);
        expect(element.contentEditable).to.equal('inherit');
        expect(element.spellcheck).to.equal(true);

        expect(element.getAttribute('tabindex')).to.equal(null);
        expect(element.getAttribute('contenteditable')).to.equal(null);
        expect(element.getAttribute('spellcheck')).to.equal(null);
      });
      it('Should reset properties to defaults if they are not in the props when the element is updated after initial applyNativeElementProps', () => {
        const element = document.createElement('div');
        applyNativeElementProps(element, {
          tabIndex: 0,
          contentEditable: true,
          spellcheck: false,
        });

        expect(element.tabIndex).to.equal(0);
        expect(element.contentEditable).to.equal('true');
        expect(element.spellcheck).to.equal(false);

        expect(element.getAttribute('tabindex')).to.equal('0');
        expect(element.getAttribute('contenteditable')).to.equal('true');
        expect(element.getAttribute('spellcheck')).to.equal('false');

        applyNativeElementProps(element, {
          tabIndex: 1,
          contentEditable: undefined,
          spellcheck: undefined,
        });

        expect(element.tabIndex).to.equal(1);
        expect(element.contentEditable).to.equal('inherit');
        expect(element.spellcheck).to.equal(true);

        expect(element.getAttribute('tabindex')).to.equal('1');
        expect(element.getAttribute('contenteditable')).to.equal(null);
        expect(element.getAttribute('spellcheck')).to.equal(null);
      });
    });
  }
}
