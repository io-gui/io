var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveElement, Property, div, span } from '@io-gui/core';
import { ioPropertyEditor } from '@io-gui/editors';
import { AmbientLight, BoxGeometry, ConeGeometry, DirectionalLight, GridHelper, Mesh, MeshStandardMaterial, SphereGeometry, TorusGeometry } from 'three/webgpu';
import { SelectionModel, ThreeEditor, ThreeView, ioThreeViewport } from '@io-gui/three';
const SHAPES = [
    { name: 'Box', geometry: new BoxGeometry(1, 1, 1), color: 0xd9534f },
    { name: 'Sphere', geometry: new SphereGeometry(0.6, 32, 16), color: 0x5cb85c },
    { name: 'Cone', geometry: new ConeGeometry(0.6, 1.2, 32), color: 0x5bc0de },
    { name: 'Torus', geometry: new TorusGeometry(0.5, 0.18, 16, 48), color: 0xf0ad4e },
];
/**
 * ThreeEditor with two viewports on one document: a full perspective view and a select-only top view.
 * Click selects (Shift toggles, Ctrl removes), Alt+drag box-selects, Ctrl+A selects all, Escape clears,
 * F frames the selection. The inspector follows the active object.
 */
let IoSelectionExample = class IoSelectionExample extends ReactiveElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex: 1 1 auto;
        max-width: 100%;
        max-height: 100%;
      }
      :host > io-three-viewport {
        flex: 1 1 40%;
      }
      :host > .inspector {
        display: flex;
        flex-direction: column;
        flex: 0 0 280px;
        overflow: auto;
        padding: var(--io_spacing);
      }
    `;
    }
    ready() {
        const scene = this.editor.document.scene;
        scene.add(new AmbientLight(0xffffff, 0.6));
        const light = new DirectionalLight(0xffffff, 2);
        light.position.set(3, 5, 4);
        scene.add(light);
        const grid = new GridHelper(10, 10, 0x444444, 0x333333);
        grid.userData.selectable = false;
        scene.add(grid);
        SHAPES.forEach((shape, i) => {
            const mesh = new Mesh(shape.geometry, new MeshStandardMaterial({ color: shape.color }));
            mesh.name = shape.name;
            mesh.position.set((i - 1.5) * 2, 0.6, (i % 2) * 1.5 - 0.75);
            scene.add(mesh);
        });
        this.top.setAxisView('top');
        this.selection = this.editor.selection;
        this.changed();
    }
    selectionMutated() {
        this.changed();
    }
    changed() {
        const selection = this.selection;
        const active = selection?.getActiveObject();
        const names = selection?.getObjects().map(object => object.name || object.type).join(', ') || 'nothing';
        this.render([
            ioThreeViewport({ editor: this.editor, view: this.perspective }),
            ioThreeViewport({ editor: this.editor, view: this.top }),
            div({ class: 'inspector' }, [
                span(`Selected: ${names}`),
                active ? ioPropertyEditor({ value: active, properties: ['name', 'position', 'rotation', 'scale', 'visible'] }) : null,
            ]),
        ]);
    }
    dispose() {
        this.editor.dispose();
        this.perspective.dispose();
        this.top.dispose();
        super.dispose();
    }
};
__decorate([
    Property({ type: ThreeEditor, init: null })
], IoSelectionExample.prototype, "editor", void 0);
__decorate([
    Property({ type: SelectionModel })
], IoSelectionExample.prototype, "selection", void 0);
__decorate([
    Property({ type: ThreeView, init: null })
], IoSelectionExample.prototype, "perspective", void 0);
__decorate([
    Property({ type: ThreeView, init: { profile: 'select' } })
], IoSelectionExample.prototype, "top", void 0);
IoSelectionExample = __decorate([
    Register
], IoSelectionExample);
export { IoSelectionExample };
export const ioSelectionExample = (arg0) => IoSelectionExample.vConstructor(arg0);
