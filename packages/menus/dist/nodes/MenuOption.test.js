import { describe, it, expect } from 'vitest';
import { NodeArray } from '@io-gui/core';
import { MenuOption } from '@io-gui/menus';
const testItemArgs = {
    id: 'root',
    options: [
        { id: '1', label: 'one', options: [
                { id: '1.1', label: 'one.1' },
                { id: '1.2', label: 'one.2' },
            ] },
        { id: '2', label: 'two', options: [
                { id: '2.1', label: 'two.1' },
                { id: '2.2', label: 'two.2' },
            ] },
    ]
};
describe('MenuOption', () => {
    it('Should initialize with correct default values', () => {
        const option = new MenuOption({ id: 'test' });
        expect(option.value).toBe('test');
        expect(option.id).toBe('test');
        expect(option.label).toBe('test');
        expect(option.icon).toBe('');
        expect(option.hint).toBe('');
        expect(option.disabled).toBe(false);
        expect(option.action).toBe(undefined);
        expect(option.mode).toBe('select');
        expect(option.selected).toBe(false);
        expect(option.path).toBe('');
        expect(option.options).toBeInstanceOf(NodeArray);
        expect(option.options.length).toBe(0);
    });
    it('Should initialize correctly from constructor arguments', () => {
        const option = new MenuOption({
            value: 1,
            id: 'one',
            label: 'onelabel',
            icon: 'icon:close',
            hint: 'onehint',
            disabled: true,
            action: () => { },
            mode: 'select',
            options: [
                { id: 'two', value: 2, label: 'twolabel', selected: true },
                { id: 'three', value: 3, label: 'threelabel', mode: 'toggle', selected: true },
                { id: 'four', value: 4, label: 'fourlabel', selected: true },
            ]
        });
        expect(option.value).toBe(1);
        expect(option.id).toBe('one');
        expect(option.label).toBe('onelabel');
        expect(option.icon).toBe('icon:close');
        expect(option.hint).toBe('onehint');
        expect(option.disabled).toBe(true);
        expect(typeof option.action).toBe('function');
        expect(option.mode).toBe('select');
        expect(option.selected).toBe(true);
        expect(option.selectedIDImmediate).toBe('two');
        expect(option.path).toBe('two');
        expect(option.options).toBeInstanceOf(NodeArray);
        expect(option.options.length).toBe(3);
        expect(option.options[0].id).toBe('two');
        expect(option.options[0].value).toBe(2);
        expect(option.options[0].label).toBe('twolabel');
        expect(option.options[0].selected).toBe(true);
        expect(option.options[1].id).toBe('three');
        expect(option.options[1].value).toBe(3);
        expect(option.options[1].label).toBe('threelabel');
        expect(option.options[1].selected).toBe(true);
        expect(option.options[1].mode).toBe('toggle');
        expect(option.options[2].id).toBe('four');
        expect(option.options[2].value).toBe(4);
        expect(option.options[2].label).toBe('fourlabel');
        expect(option.options[2].selected).toBe(false);
        expect(option.options[2].mode).toBe('select');
    });
    it('Should initialize suboptions from constructor arguments', () => {
        const option = new MenuOption(testItemArgs);
        expect(option.options).toBeInstanceOf(NodeArray);
        expect(option.options.length).toBe(2);
        expect(option.options[0].options).toBeInstanceOf(NodeArray);
        expect(option.options[0].options.length).toBe(2);
        expect(option.options[1].options).toBeInstanceOf(NodeArray);
        expect(option.options[1].options.length).toBe(2);
    });
    it('Should select default branch when `selectDefault` is called', () => {
        const option = new MenuOption(testItemArgs);
        option.selectDefault();
        expect(option.selected).toBe(true);
        expect(option.options[0].selected).toBe(true);
        expect(option.options[1].selected).toBe(false);
        expect(option.options[0].options[0].selected).toBe(true);
        expect(option.options[0].options[1].selected).toBe(false);
        expect(option.options[1].options[0].selected).toBe(false);
        expect(option.options[1].options[1].selected).toBe(false);
    });
    it('Should update path when selected', async () => {
        const option = new MenuOption(testItemArgs);
        option.selectDefault();
        expect(option.path).toBe('1,1.1');
        expect(option.options[0].path).toBe('1.1');
        expect(option.options[1].path).toBe('');
        expect(option.options[0].options[0].path).toBe('');
        expect(option.options[0].options[1].path).toBe('');
        expect(option.options[1].options[0].path).toBe('');
        expect(option.options[1].options[1].path).toBe('');
        option.options[1].options[1].selected = true;
        expect(option.path).toBe('2,2.2');
        expect(option.options[0].path).toBe('');
        expect(option.options[1].path).toBe('2.2');
        expect(option.options[0].options[0].path).toBe('');
        expect(option.options[0].options[1].path).toBe('');
        expect(option.options[1].options[0].path).toBe('');
    });
    it('Should update selectedID andselectedIDImmediate when selected', async () => {
        const option = new MenuOption(testItemArgs);
        option.selectDefault();
        expect(option.selectedIDImmediate).toBe('1');
        expect(option.options[0].selectedIDImmediate).toBe('1.1');
        expect(option.options[1].selectedIDImmediate).toBe('');
        expect(option.selectedID).toBe('1.1');
        option.options[1].options[1].selected = true;
        expect(option.selectedIDImmediate).toBe('2');
        expect(option.selectedID).toBe('2.2');
        expect(option.options[0].selectedIDImmediate).toBe('');
        expect(option.options[1].selectedIDImmediate).toBe('2.2');
    });
    it('Should update selected when selectedID and selectedIDImmediate changes', async () => {
        const option = new MenuOption(testItemArgs);
        option.selectedIDImmediate = '1';
        expect(option.selected).toBe(true);
        expect(option.options[0].selected).toBe(true);
        option.selectedID = '2.1';
        expect(option.options[0].selected).toBe(false);
        expect(option.options[0].selectedID).toBe('');
        expect(option.options[0].selectedIDImmediate).toBe('');
        expect(option.options[1].selected).toBe(true);
        expect(option.options[1].selectedID).toBe('2.1');
        expect(option.options[1].selectedIDImmediate).toBe('2.1');
    });
    it('Should update paths in menu option tree on option selection', async () => {
        const option = new MenuOption({ id: 'optionsview', options: [
                { id: 'home' },
                { id: 'food', options: [
                        { id: 'fruits', options: [
                                { id: 'apples', selected: true },
                                { id: 'mangos' },
                                { id: 'bannanas' },
                            ] }
                    ] },
                { id: 'mixed', options: [
                        { id: 'togglables', mode: 'none', options: [
                                { id: 'toggle1', mode: 'toggle' },
                                { id: 'toggle2', mode: 'toggle' },
                                { id: 'toggle3', mode: 'toggle' },
                                { id: 'toggle4', mode: 'toggle' },
                            ] },
                        { id: 'selectables', options: [
                                { id: 'toggle', mode: 'toggle' },
                                { id: 'selectable' },
                            ] },
                    ] },
            ] });
        expect(option.selected).toBe(true);
        expect(option.options[1].selected).toBe(true);
        expect(option.options[1].options[0].selected).toBe(true);
        expect(option.options[1].options[0].options[0].selected).toBe(true);
        expect(option.selectedID).toBe('apples');
        expect(option.selectedIDImmediate).toBe('food');
        expect(option.path).toBe('food,fruits,apples');
        expect(option.options[1].selectedID).toBe('apples');
        expect(option.options[1].selectedIDImmediate).toBe('fruits');
        expect(option.options[1].path).toBe('fruits,apples');
        expect(option.options[1].options[0].selectedID).toBe('apples');
        expect(option.options[1].options[0].selectedIDImmediate).toBe('apples');
        expect(option.options[1].options[0].path).toBe('apples');
        option.options[1].options[0].options[0].selected = false;
        expect(option.options[1].options[0].selectedID).toBe('');
        expect(option.options[1].options[0].selectedIDImmediate).toBe('');
        expect(option.options[1].options[0].path).toBe('');
        expect(option.selectedID).toBe('fruits');
        expect(option.selectedIDImmediate).toBe('food');
        expect(option.path).toBe('food,fruits');
        expect(option.options[1].selectedID).toBe('fruits');
        expect(option.options[1].selectedIDImmediate).toBe('fruits');
        expect(option.options[1].path).toBe('fruits');
        option.options[0].selected = true;
        expect(option.selected).toBe(true);
        expect(option.options[1].selected).toBe(false);
        expect(option.options[1].options[0].selected).toBe(false);
        expect(option.options[1].options[0].options[0].selected).toBe(false);
        expect(option.selectedID).toBe('home');
        expect(option.selectedIDImmediate).toBe('home');
        expect(option.path).toBe('home');
        expect(option.selectedID).toBe('home');
        expect(option.selectedIDImmediate).toBe('home');
        expect(option.path).toBe('home');
        expect(option.options[1].selectedID).toBe('');
        expect(option.options[1].selectedIDImmediate).toBe('');
        expect(option.options[1].path).toBe('');
        expect(option.options[1].options[0].selectedID).toBe('');
        expect(option.options[1].options[0].selectedIDImmediate).toBe('');
        expect(option.options[1].options[0].path).toBe('');
    });
});
//# sourceMappingURL=MenuOption.test.js.map