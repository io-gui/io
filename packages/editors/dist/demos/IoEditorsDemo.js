var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
//@ts-nocheck
import { Register, IoElement, div, ReactiveProperty } from '@io-gui/core';
import { MenuOption, ioOptionSelect } from '@io-gui/menus';
import { ioSlider } from '@io-gui/sliders';
import { ioString, ioNumber, ioBoolean, ioButton } from '@io-gui/inputs';
import { ioPropertyEditor, ioVectorArray, ioMatrix, ioInspector, ioObject, IoContextEditorSingleton } from '@io-gui/editors';
export class IoEditorsDemo extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex-direction: row;
        margin: var(--io_spacing2);
      }
      :host > .column {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin: 0;
        margin-bottom: var(--io_lineHeight);
        margin-left: var(--io_lineHeight);
      }
      :host .column {
        flex-direction: column;
      }
      :host > .column > * {
        margin-bottom: var(--io_lineHeight);
      }
      :host io-property-editor.array {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding: 0;
        max-width: 20rem;
      }
      :host io-property-editor.array > .row {
        padding: 0;
        margin: 0;
        margin: var(--io_spacing) var(--io_spacing) 0 0;
      }
      :host .context-editor-area {
        height: 100px;
        background-color: var(--io_bgColorLight);
      }
    `;
    }
    ready() {
        this.render([
            ioInspector({
                value: this.object,
                // TODO: this.object.object displays broken "number" slider. Investigate!
                groups: new Map([
                    [Object, {
                            'Object Properties': ['object', 'array', 'mixedArray'],
                            'Vectors and Matrices': [/vector/i, /matrix/i],
                        }],
                ]),
                config: new Map([
                    [Object, [
                            [Number, ioSlider({ step: 0.1 })],
                            [Array, ioPropertyEditor({ labeled: false, class: 'array', config: new Map([
                                        [Array, [[Number, ioNumber()]]]
                                    ]) })],
                            ['vector2', ioVectorArray({ linkable: true })],
                            ['vector3', ioVectorArray({ linkable: true })],
                            ['vector4', ioVectorArray({ linkable: true })],
                            ['matrix2', ioMatrix()],
                            ['matrix3', ioMatrix()],
                            ['matrix4', ioMatrix()],
                        ]]
                ]),
            }),
            div({ class: 'column' }, [
                ioPropertyEditor({
                    value: this.object,
                    properties: ['number', 'string', 'boolean', 'object'],
                    config: new Map([
                        [Object, [
                                [String, ioString({ live: true })],
                                [Number, ioNumber({ live: true })],
                            ]]
                    ]),
                }),
                ioPropertyEditor({
                    value: this.object,
                    style: { width: '10rem' },
                    properties: ['number', 'string', 'boolean'],
                    config: new Map([
                        [Object, [
                                [Number, ioSlider({ step: 0.01 })],
                                [Boolean, ioBoolean()],
                            ]]
                    ]),
                }),
                ioPropertyEditor({
                    value: this.object,
                    properties: ['number', 'string'],
                    // widget: ioField({label: 'Widget Element'}),
                    config: new Map([
                        [Object, [
                                [String, ioString({ live: true, appearance: 'neutral' })],
                                // TODO: fix this. 'number' works but breaks other configs.
                                [Number, ioOptionSelect({ option: new MenuOption({
                                            id: 'number',
                                            options: [
                                                { id: 'zero', value: 0 },
                                                { id: 'half', value: 0.5 },
                                                { id: 'one', value: 1 },
                                            ],
                                        }) })],
                            ]]
                    ]),
                }),
                // TODO: land option select should not share menu options model with other editors.
                ioPropertyEditor({
                    value: document.body,
                    properties: ['lang'],
                }),
                ioPropertyEditor({
                    value: document.head,
                    properties: ['lang'],
                }),
                ioButton({ label: 'SwitchNestedObject', action: () => {
                        this.object.object = {
                            name: 'nested object 2',
                            number: 3,
                        };
                        this.dispatchMutation(this.object);
                    } })
            ]),
            div({ class: 'column' }, [
                ioObject({
                    value: this.object,
                    expanded: true,
                    // widget: ioField({label: 'Widget Element'}),
                    properties: ['number', 'string', 'boolean'],
                }),
                ioObject({
                    value: this.object,
                    expanded: true,
                    properties: ['number'],
                    config: new Map([
                        [Object, [
                                [Number, ioSlider({ step: 0.1 })],
                            ]],
                    ]),
                }),
                ioObject({
                    value: this.object,
                    label: 'Object (All Properties)',
                    config: new Map([
                        [Object, [
                                [Array, ioPropertyEditor({ labeled: false, class: 'array' })],
                                ['vector2', ioPropertyEditor({ labeled: false, class: 'array' })],
                                ['vector3', ioPropertyEditor({ labeled: false, class: 'array' })],
                                ['vector4', ioPropertyEditor({ labeled: false, class: 'array' })],
                                ['matrix2', ioPropertyEditor({ labeled: false, class: 'array' })],
                                ['matrix3', ioPropertyEditor({ labeled: false, class: 'array' })],
                                ['matrix4', ioPropertyEditor({ labeled: false, class: 'array' })],
                            ]]
                    ]),
                }),
                div({ class: 'context-editor-area', '@click': (event) => {
                        event.stopPropagation();
                        IoContextEditorSingleton.expand({
                            source: event.target,
                            value: this.object,
                            properties: ['number', 'string', 'boolean', 'object'],
                            direction: 'down',
                        });
                    } })
            ]),
        ]);
    }
}
__decorate([
    ReactiveProperty({ value: {
            number: 0.5,
            string: 'hello',
            boolean: true,
            object: {
                name: 'nested object',
                number: 1,
                string: 'world',
                object: {
                    name: 'another nested object',
                    mixedArray: [false, 2, 'three'],
                    object: {
                        name: 'the last object',
                        boolean: true,
                    },
                },
            },
            array: [...Array(32).keys()],
            vector2: [0, 1],
            vector3: [0, 1, 2],
            vector4: [0, 1, 2, 3],
            matrix2: [1, 0, 0, 1],
            matrix3: [1, 0, 0, 0, 1, 0, 0, 0, 1],
            matrix4: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        } })
], IoEditorsDemo.prototype, "object", void 0);
Register(IoEditorsDemo);
export const ioEditorsDemo = IoEditorsDemo.vConstructor;
//# sourceMappingURL=IoEditorsDemo.js.map