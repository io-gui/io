//@ts-nocheck
import { Register, IoElement, div, span } from 'io-core';
import { MenuOption, ioMenuTree, ioMenuItem, ioMenuOptions, ioContextMenu, ioOptionSelect } from 'io-menus';
import { ioSwitch, ioField, ioBoolean } from 'io-inputs';
// TODO: remove dependencies on io-navigation.
import 'io-navigation';
import 'io-icons';
const numberItems = new MenuOption({ id: 'numbers', options: [
        { id: 'zero', value: 0, hint: 'Number(0)', icon: 'io:numeric-0-box' },
        { id: 'one', value: 1, hint: 'Number(1)', icon: 'io:numeric-1-box' },
        { id: 'two', value: 2, hint: 'Number(2)', icon: 'io:numeric-2-box' },
        { id: 'three', value: 3, hint: 'Number(3)', icon: 'io:numeric-3-box' },
        { id: 'four', value: 4, hint: 'Number(4)', icon: 'io:numeric-4-box' },
    ] });
const colorOptions = new MenuOption({ id: 'colors', options: [
        { id: 'Red', icon: '❤️', options: ['Red1', 'Red2', 'Red3'].map(item => new MenuOption({ id: item, value: item })) },
        { id: 'Green', icon: '💚', options: ['Green1', 'Green2', 'Green3'].map(item => new MenuOption({ id: item, value: item })) },
        { id: 'Blue', icon: '💙', options: ['Blue1', 'Blue2', 'Blue3'].map(item => new MenuOption({ id: item, value: item })) },
    ] });
const optionDeep = new MenuOption({ id: 'deep', options: [
        { id: 'Deep Menu', options: [
                { id: 'Level 1/1', hint: 'One' },
                { id: 'Level 1/2', hint: 'Two' },
                { id: 'Level 1/3', hint: 'Three', options: [
                        { id: 'Level 2/1', hint: 'One' },
                        { id: 'Level 2/2', hint: 'Two' },
                        { id: 'Level 2/3', hint: 'Three', options: [
                                { id: 'Level 3/1', hint: 'One' },
                                { id: 'Level 3/2', hint: 'Two' },
                                { id: 'Level 3/3', hint: 'Three', options: [
                                        { id: 'Level 4/1', hint: 'One' },
                                        { id: 'Level 4/2', hint: 'Two' },
                                        { id: 'Level 4/3', hint: 'Three', options: [
                                                { id: 'Level 5/1', hint: 'One' },
                                                { id: 'Level 5/2', hint: 'Two' },
                                                { id: 'Level 5/3', hint: 'Three', options: [
                                                        { id: 'Level 6/1', hint: 'One' },
                                                        { id: 'Level 6/2', hint: 'Two' },
                                                        { id: 'Level 6/3', hint: 'Three', options: [
                                                                { id: 'Level 7/1', hint: 'One' },
                                                                { id: 'Level 7/2', hint: 'Two' },
                                                                { id: 'Level 7/3', hint: 'Three' },
                                                            ] },
                                                    ] },
                                            ] },
                                    ] },
                            ] },
                    ] },
                { id: 'Level 1/4', hint: 'Four' },
            ] },
    ] });
// TODO: consider initializing long option only when needed.
const optionLong = new MenuOption({ id: 'long', options: [
        'apple', 'banana', 'cherry', 'dolphin', 'elephant', 'flamingo', 'giraffe', 'hamburger', 'igloo', 'jaguar',
        'kangaroo', 'lemon', 'mango', 'nectarine', 'octopus', 'penguin', 'quilt', 'rainbow', 'sunflower', 'tiger',
        'umbrella', 'violin', 'watermelon', 'xylophone', 'yacht', 'zebra', 'astronaut', 'butterfly', 'crocodile', 'diamond',
        'eagle', 'fireworks', 'guitar', 'helicopter', 'iceberg', 'jellyfish', 'koala', 'lighthouse', 'mountain', 'notebook',
        'ocean', 'piano', 'queen', 'rocket', 'snowflake', 'telescope', 'unicorn', 'volcano', 'whale', 'yoga', 'zucchini',
        'airplane', 'basketball', 'camera', 'dragon', 'eclipse', 'fountain', 'garden', 'hurricane', 'island', 'jungle',
        'kite', 'moon', 'northern', 'oasis', 'paradise', 'quasar', 'rainforest', 'satellite', 'thunder', 'universe',
        'vortex', 'waterfall', 'xenon', 'yellow', 'zenith', 'aurora', 'blizzard', 'cascade', 'dynamo', 'echo', 'fractal',
        'galaxy', 'horizon', 'infinity', 'jubilee', 'kaleidoscope', 'labyrinth', 'mirage', 'nebula', 'orbit', 'phoenix',
        'quantum', 'radiance', 'spectrum', 'tranquility', 'ultraviolet', 'vibrant',
    ] });
class IoSuboptionViewDemo extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        align-self: stretch;
        display: flex;
        flex-direction: column;
        border: 1px solid gray;
        border-radius: var(--io_borderRadius);
        margin: var(--io_spacing);
        margin-left: var(--io_spacing);
      }
      :host > div {
        background-color: var(--io_bgColorLight);
        display: flex;
        height: var(--io_lineHeight);
      }
      :host io-item-demo-view {
        margin-left: var(--io_spacing);
      }
      :host span {
        background-color: transparent;
        padding: 0 var(--io_spacing);
        color: var(--io_color);
      }
      :host span.path {
        margin-left: 0.5em;
        color: var(--io_colorBlue);
      }
      :host span.selected {
        margin-left: 0.5em;
        color: var(--io_colorBlue);
      }
      :host span.scroll {
        margin-left: 0.5em;
        color: var(--io_colorBlue);
      }

    `;
    }
    static get ReactiveProperties() {
        return {
            option: {
                type: MenuOption,
            },
        };
    }
    optionMutated() {
        this.changed();
    }
    changed() {
        const vChildren = [];
        for (let i = 0; i < this.option.options.length; i++) {
            vChildren.push(ioItemViewDemo({ option: this.option.options[i] }));
        }
        this.render([
            div([
                this.option.selectedID ? span({ class: 'selected' }, `selected: ${this.option.selectedID}`) : null,
                this.option.path ? span({ class: 'path' }, `path: ${this.option.path}`) : null,
            ]),
            ...vChildren
        ]);
    }
}
Register(IoSuboptionViewDemo);
const ioSuboptionViewDemo = IoSuboptionViewDemo.vConstructor;
class IoItemViewDemo extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex-direction: column;
        margin: var(--io_spacing);
      }
      :host > div {
        display: flex;
      }
    `;
    }
    static get ReactiveProperties() {
        return {
            option: {
                type: MenuOption,
            },
        };
    }
    optionMutated() {
        this.changed();
    }
    changed() {
        let selectElement = null;
        if (this.option.mode === 'toggle') {
            selectElement = ioBoolean({ value: this.option.bind('selected'), true: 'io:box_fill_checked', false: 'io:box' });
        }
        else if (this.option.mode === 'select') {
            selectElement = ioSwitch({ value: this.option.bind('selected') });
        }
        this.render([
            div([
                selectElement,
                ioField({ value: this.option.label, inert: true, appearance: 'neutral' }),
            ]),
            this.option.options.length ? ioSuboptionViewDemo({ option: this.option }) : null
        ]);
    }
}
Register(IoItemViewDemo);
const ioItemViewDemo = IoItemViewDemo.vConstructor;
class IoMenusDemo extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex-direction: column;
      }
      :host > * {
        margin-top: var(--io_spacing);
      }
      :host .row {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        overflow: hidden;
        margin-bottom: var(--io_spacing);
      }
      :host > io-menu-item {
        align-self: flex-start;
      }
      :host .row > *:not(:last-child) {
        margin-right: var(--io_spacing);
      }
      :host .row > io-option-select {
        align-self: flex-start;
      }
      :host .contextArea {
        min-height: 200px;
      }
    `;
    }
    ready() {
        this.render([
            ioMenuTree({
                searchable: true,
                option: optionDeep,
            }),
            ioMenuItem({ label: 'menu item', option: new MenuOption({ id: 'item', value: 'item' }) }),
            ioMenuItem({ option: new MenuOption({
                    id: 'item with hint/label/icon',
                    selected: true,
                    value: 'value',
                    hint: 'hint',
                    label: 'menu item label',
                    icon: 'io:code',
                }) }),
            ioMenuItem({ label: 'menu item', option: new MenuOption({
                    id: 'item with label override from element',
                    selected: false,
                    value: 'value',
                    hint: 'hint',
                    label: 'menu item label',
                    icon: 'io:circle_fill_plus',
                }) }),
            ioMenuOptions({
                horizontal: true,
                searchable: true,
                option: numberItems,
            }),
            ioMenuOptions({
                horizontal: true,
                option: colorOptions,
            }),
            div({ class: 'row' }, [
                ioMenuOptions({
                    searchable: true,
                    option: numberItems,
                }),
                ioMenuOptions({
                    option: new MenuOption({
                        id: 'reversed',
                        options: [...numberItems.options].reverse(),
                    }),
                }),
                ioMenuOptions({
                    option: colorOptions,
                }),
                ioMenuOptions({
                    option: optionDeep,
                }),
                ioOptionSelect({
                    label: 'Long Menu Select',
                    option: optionLong,
                }),
            ]),
            div({ class: 'contextArea' }, [
                span('Context Area'),
                ioContextMenu({
                    option: new MenuOption({ id: 'context', options: [...optionDeep.options, ...numberItems.options, ...colorOptions.options] }),
                }),
                ioContextMenu({
                    option: new MenuOption({ id: 'context2', options: [...colorOptions.options] }),
                    button: 1,
                }),
                ioContextMenu({
                    option: optionLong,
                    button: 2,
                }),
            ]),
            ioSuboptionViewDemo({ option: new MenuOption({ id: 'optionsview', options: [
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
                    ] }) }),
        ]);
    }
}
Register(IoMenusDemo);
export const ioMenusDemo = IoMenusDemo.vConstructor;
//# sourceMappingURL=IoMenusDemo.js.map