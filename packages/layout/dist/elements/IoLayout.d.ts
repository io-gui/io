import { VDOMElement, ReactiveElement, ReactiveElementProps, WithBinding, ListenerDefinitions } from '@io-gui/core';
import { Layout } from '../models/Layout.js';
import { IoMenu } from '@io-gui/menus';
import { IoTabDragGhost } from './IoTabDragGhost.js';
import { DropTarget } from './IoTabDragGhost.js';
export type IoLayoutData = ReactiveElementProps & {
    model: WithBinding<Layout>;
    elements: VDOMElement[];
};
export declare class IoLayout extends ReactiveElement {
    static get Style(): string;
    model: Layout;
    elements: VDOMElement[];
    $addMenu: IoMenu;
    $tabDragGhost: IoTabDragGhost;
    private _targetPanelModel;
    private _dropTarget;
    static get Listeners(): ListenerDefinitions;
    constructor(args: IoLayoutData);
    onAddTabRequest(event: CustomEvent): void;
    addTab(element: VDOMElement): void;
    onTabDrag(event: CustomEvent): void;
    getDropTarget(x: number, y: number): DropTarget | null;
    modelMutated(): void;
    elementsChanged(): void;
    elementsMutated(): void;
    mutated(): void;
    dispose(): void;
}
export declare const ioLayout: (arg0: IoLayoutData) => VDOMElement;
