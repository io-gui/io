import { describe, it, expect } from 'vitest';
import { nextQueue } from '@io-gui/core';
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
    element.config = [];
    element.properties = [];
}
describe('IoObject', () => {
    it('has default values', () => {
        expect(element.label).toBe('');
        expect(element.labeled).toBe(true);
        expect(element.expanded).toBe(false);
        expect(JSON.stringify(element.value)).toBe(undefined);
        // expect(JSON.stringify(element.properties)).toBe(JSON.stringify([]))
        // expect(JSON.stringify(element.config)).toBe(JSON.stringify({}))
    });
    it('matches values', async () => {
        element.value = testValue;
        expect(element.children[0].localName).toBe('io-boolean');
        expect(element.children[1]).toBe(undefined);
        element.expanded = true;
        await nextQueue();
        const properties = element.children[1];
        expect(properties.localName).toBe('io-property-editor');
        expect(properties.children[0].textContent).toBe('number0.5');
        const rows = properties.children;
        expect(rows[0].localName).toBe('div');
        expect(rows[0].children[0].localName).toBe('span');
        expect(rows[0].children[0].textContent).toBe('number');
        expect(rows[0].children[1].localName).toBe('io-number');
        expect(rows[0].children[1].textContent).toBe('0.5');
        expect(rows[1].localName).toBe('div');
        expect(rows[1].children[0].localName).toBe('span');
        expect(rows[1].children[0].textContent).toBe('string');
        expect(rows[1].children[1].localName).toBe('io-string');
        expect(rows[1].children[1].textContent).toBe('hello');
        expect(rows[2].localName).toBe('div');
        expect(rows[2].children[0].localName).toBe('span');
        expect(rows[2].children[0].textContent).toBe('boolean');
        expect(rows[2].children[1].localName).toBe('io-switch');
        expect(rows[2].children[1].textContent).toBe('');
        expect(rows[3].localName).toBe('div');
        expect(rows[3].children[0].localName).toBe('span');
        expect(rows[3].children[0].textContent).toBe('null');
        expect(rows[3].children[1].localName).toBe('io-field');
        expect(rows[3].children[1].textContent).toBe('null');
        expect(rows[4].localName).toBe('div');
        expect(rows[4].children[0].localName).toBe('span');
        expect(rows[4].children[0].textContent).toBe('object');
        expect(rows[4].children[1].localName).toBe('io-object');
        expect(rows[4].children[1].textContent).toBe('Object');
        expect(rows[5].localName).toBe('div');
        expect(rows[5].children[0].localName).toBe('span');
        expect(rows[5].children[0].textContent).toBe('array');
        expect(rows[5].children[1].localName).toBe('io-object');
        expect(rows[5].children[1].textContent).toBe('Array');
        reset();
    });
    it('matches value with labels disabled', async () => {
        element.value = testValue;
        element.labeled = false;
        element.expanded = true;
        await nextQueue();
        const properties = element.children[1];
        expect(properties.children[0].children[0].localName).toBe('io-number');
        expect(properties.children[1].children[0].localName).toBe('io-string');
        expect(properties.children[2].children[0].localName).toBe('io-switch');
        expect(properties.children[3].children[0].localName).toBe('io-field');
        expect(properties.children[4].children[0].localName).toBe('io-object');
        expect(properties.children[5].children[0].localName).toBe('io-object');
        reset();
    });
    it('matches value with labels disabled (label)', () => {
        element.value = testValue;
        expect(element.children[0].textContent).toBe('Object');
        element.label = 'test';
        expect(element.children[0].textContent).toBe('test');
        reset();
        expect(element.children[0].textContent).toBe('Object');
    });
    it('matches value with custom properties', async () => {
        element.value = testValue;
        element.properties = ['number', 'boolean'];
        element.expanded = true;
        await nextQueue();
        const properties = element.children[1];
        expect(properties.children[0].textContent).toBe('number0.5');
        expect(properties.children[1].textContent).toBe('boolean');
        expect(properties.children[2]).toBe(undefined);
        reset();
    });
    it('matches value with custom config', async () => {
        element.value = testValue;
        element.config = [
            ['number', ioSlider({ step: 1 })],
            ['boolean', ioString()],
        ];
        element.expanded = true;
        await nextQueue();
        const properties = element.children[1];
        expect(properties.children[0].children[1].localName).toBe('io-slider');
        expect(properties.children[1].children[1].localName).toBe('io-string');
        reset();
    });
});
//# sourceMappingURL=IoObject.test.js.map