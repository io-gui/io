import { describe, it, expect } from 'vitest';
import { ioString } from '@io-gui/inputs';
import { ioSlider } from '@io-gui/sliders';
import { IoObject } from '@io-gui/editors';
const testValue = {
    'number': 0.5,
    'string': 'hello',
    'boolean': true,
    'null': null,
    'object': { 'prop': 'prop' },
    'array': [1, 2, 3]
};
const element = new IoObject();
element.style.display = 'none';
document.body.appendChild(element);
function reset() {
    element.label = '';
    element.labeled = true;
    element.expanded = false;
    element.value = {};
    element.config = new Map();
    element.properties = [];
}
describe('IoObject', () => {
    it('has default values', () => {
        expect(element.label).toBe('');
        expect(element.labeled).toBe(true);
        expect(element.expanded).toBe(false);
        expect(JSON.stringify(element.value)).toBe(JSON.stringify({}));
        expect(JSON.stringify(element.properties)).toBe(JSON.stringify([]));
        expect(JSON.stringify(element.config)).toBe(JSON.stringify({}));
    });
    it('matches values', () => {
        element.value = testValue;
        expect(element.children[0].localName).toBe('io-boolean');
        expect(element.children[1]).toBe(undefined);
        element.expanded = true;
        const properties = element.children[1];
        expect(properties.localName).toBe('io-property-editor');
        expect(properties.children[0].textContent).toBe('number:');
        expect(properties.children[1].localName).toBe('io-number');
        expect(properties.children[2].textContent).toBe('string:');
        expect(properties.children[3].localName).toBe('io-string');
        expect(properties.children[4].textContent).toBe('boolean:');
        expect(properties.children[5].localName).toBe('io-boolean');
        expect(properties.children[6].textContent).toBe('null:');
        expect(properties.children[7].localName).toBe('io-string');
        expect(properties.children[8].textContent).toBe('object:');
        expect(properties.children[9].localName).toBe('io-object');
        expect(properties.children[10].textContent).toBe('array:');
        expect(properties.children[11].localName).toBe('io-object');
        reset();
    });
    it('matches value with labels disabled', () => {
        element.value = testValue;
        element.labeled = false;
        element.expanded = true;
        const properties = element.children[1];
        expect(properties.children[0].localName).toBe('io-number');
        expect(properties.children[1].localName).toBe('io-string');
        expect(properties.children[2].localName).toBe('io-boolean');
        expect(properties.children[3].localName).toBe('io-string');
        expect(properties.children[4].localName).toBe('io-object');
        expect(properties.children[5].localName).toBe('io-object');
        reset();
    });
    it('matches value with labels disabled (label)', () => {
        element.value = testValue;
        expect(element.children[0].textContent).toBe('▸ Object');
        element.label = 'test';
        expect(element.children[0].textContent).toBe('▸ test');
        reset();
        expect(element.children[0].textContent).toBe('▸ Object');
    });
    it('matches value with custom properties', () => {
        element.value = testValue;
        element.properties = ['number', 'boolean'];
        element.expanded = true;
        const properties = element.children[1];
        expect(properties.children[0].textContent).toBe('number:');
        expect(properties.children[2].textContent).toBe('boolean:');
        expect(properties.children[4]).toBe(undefined);
        reset();
    });
    it('matches value with custom config', () => {
        element.value = testValue;
        element.config = new Map([
            [Object, [
                    ['number', ioSlider({ step: 1 })],
                    ['boolean', ioString()],
                ]]
        ]);
        element.expanded = true;
        const properties = element.children[1];
        expect(properties.children[1].localName).toBe('io-slider');
        expect(properties.children[1].step).toBe(1);
        expect(properties.children[5].localName).toBe('io-string');
        reset();
    });
});
//# sourceMappingURL=IoObject.test.js.map