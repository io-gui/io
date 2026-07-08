//@ts-nocheck
import { Register, ReactiveElement, div, span } from '@io-gui/core';
import { Option, Menu, ioMenuTree, ioOption, ioMenu, ioContextMenu, ioOptionSelect } from '@io-gui/menus';
import { ioSwitch, ioField, ioBoolean } from '@io-gui/inputs';
// TODO: remove dependencies on io-navigation.
import '@io-gui/navigation';
import '@io-gui/icons';
const numberMenu = new Menu({ id: 'numbers', options: [
        { id: 'zero', value: 0, hint: 'Number(0)', icon: 'io:label' },
        { id: 'one', value: 1, hint: 'Number(1)', icon: 'io:label' },
        { id: 'two', value: 2, hint: 'Number(2)', icon: 'io:label' },
        { id: 'three', value: 3, hint: 'Number(3)', icon: 'io:label' },
        { id: 'four', value: 4, hint: 'Number(4)', icon: 'io:label' },
    ] });
const colorMenu = new Menu({ id: 'colors', options: [
        { id: 'Red', icon: 'io:circle_fill_red', options: ['Red1', 'Red2', 'Red3'].map(id => new Option({ id: id, value: id })) },
        { id: 'Green', icon: 'io:circle_fill_green', options: ['Green1', 'Green2', 'Green3'].map(id => new Option({ id: id, value: id })) },
        { id: 'Blue', icon: 'io:circle_fill_blue', options: ['Blue1', 'Blue2', 'Blue3'].map(id => new Option({ id: id, value: id })) },
    ] });
const deepMenu = new Menu({ id: 'deep', options: [
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
// TODO: consider initializing long menu only when needed.
const longMenu = new Menu({ id: 'long', options: [
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
class IoSuboptionViewDemo extends ReactiveElement {
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
    static get Properties() {
        return {
            model: {
                type: Option,
            },
        };
    }
    modelMutated() {
        this.mutated();
    }
    mutated() {
        const vChildren = [];
        for (let i = 0; i < this.model.options.length; i++) {
            vChildren.push(ioItemViewDemo({ model: this.model.options[i] }));
        }
        // Tree-scoped selection state (selectedID, path) lives on the Menu root only.
        const isMenu = this.model instanceof Menu;
        this.render([
            div([
                this.model.getSelectedIDImmediate() ? span({ class: 'selected' }, `selected: ${this.model.getSelectedIDImmediate()}`) : null,
                isMenu && this.model.path ? span({ class: 'path' }, `path: ${this.model.path}`) : null,
            ]),
            ...vChildren
        ]);
    }
}
Register(IoSuboptionViewDemo);
const ioSuboptionViewDemo = (arg0) => IoSuboptionViewDemo.vConstructor(arg0);
class IoItemViewDemo extends ReactiveElement {
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
    static get Properties() {
        return {
            model: {
                type: Option,
            },
        };
    }
    modelMutated() {
        this.mutated();
    }
    mutated() {
        let selectElement = null;
        if (this.model.mode === 'toggle') {
            selectElement = ioBoolean({ value: this.model.bind('selected'), true: 'io:box_fill_checked', false: 'io:box' });
        }
        else if (this.model.mode === 'select') {
            selectElement = ioSwitch({ value: this.model.bind('selected') });
        }
        this.render([
            div([
                selectElement,
                ioField({ value: this.model.label, inert: true, appearance: 'neutral' }),
            ]),
            this.model.options.length ? ioSuboptionViewDemo({ model: this.model }) : null
        ]);
    }
}
Register(IoItemViewDemo);
const ioItemViewDemo = (arg0) => IoItemViewDemo.vConstructor(arg0);
class IoMenusDemo extends ReactiveElement {
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
      :host > io-option {
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
                model: deepMenu,
            }),
            ioOption({ label: 'menu option', model: new Option({ id: 'item', value: 'item' }) }),
            ioOption({ model: new Option({
                    id: 'option with hint/label/icon',
                    selected: true,
                    value: 'value',
                    hint: 'hint',
                    label: 'menu option label',
                    icon: 'io:code',
                }) }),
            ioOption({ label: 'menu option', model: new Option({
                    id: 'option with label override from element',
                    selected: false,
                    value: 'value',
                    hint: 'hint',
                    label: 'menu option label',
                    icon: 'io:circle_fill_plus',
                }) }),
            ioMenu({
                horizontal: true,
                searchable: true,
                model: numberMenu,
            }),
            ioMenu({
                horizontal: true,
                model: colorMenu,
            }),
            div({ class: 'row' }, [
                ioMenu({
                    searchable: true,
                    model: numberMenu,
                }),
                ioMenu({
                    model: new Menu({
                        id: 'reversed',
                        options: [...numberMenu.options].reverse(),
                    }),
                }),
                ioMenu({
                    model: colorMenu,
                }),
                ioMenu({
                    model: deepMenu,
                }),
                ioOptionSelect({
                    label: 'Long Menu Select',
                    model: longMenu,
                }),
            ]),
            div({ class: 'contextArea' }, [
                span('Context Area'),
                ioContextMenu({
                    model: new Menu({ id: 'context', options: [...deepMenu.options, ...numberMenu.options, ...colorMenu.options] }),
                }),
                ioContextMenu({
                    model: new Menu({ id: 'context2', options: [...colorMenu.options] }),
                    button: 1,
                }),
                ioContextMenu({
                    model: longMenu,
                    button: 2,
                }),
            ]),
            ioSuboptionViewDemo({ model: new Menu({ id: 'optionsview', options: [
                        { id: 'home' },
                        { id: 'food', options: [
                                { id: 'fruits', options: [
                                        // {id: 'apples', selected: true},
                                        { id: 'apples' },
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
                    ], path: 'food,fruits,apples' }) }),
        ]);
    }
}
Register(IoMenusDemo);
const ioMenusDemo = (arg0) => IoMenusDemo.vConstructor(arg0);
export { ioMenusDemo };
