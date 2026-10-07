var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveElement, Property, div, span } from '@io-gui/core';
import { AmbientLight, BoxGeometry, CanvasTexture, DirectionalLight, Mesh, MeshStandardMaterial, SRGBColorSpace, SphereGeometry, TorusKnotGeometry } from 'three/webgpu';
import { mrt, output, velocity } from 'three/tsl';
import { traa } from 'three/addons/tsl/display/TRAANode.js';
import { PostProcessingPipeline, SelectionModel, ThreeEditor, ThreeView, ioThreeViewport, registerPipeline } from '@io-gui/three';
registerPipeline({
    id: 'traa',
    label: 'Forward + TRAA',
    create: renderer => new PostProcessingPipeline(renderer, (scenePass, camera) => {
        scenePass.setMRT(mrt({ output, velocity }));
        return traa(scenePass.getTextureNode('output'), scenePass.getTextureNode('depth'), scenePass.getTextureNode('velocity'), camera);
    }, { convergeFrames: 32 }),
});
function checkerTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const context = canvas.getContext('2d');
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            context.fillStyle = (x + y) % 2 ? '#3a6ea5' : '#d8e2ef';
            context.fillRect(x * 32, y * 32, 32, 32);
        }
    }
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    return texture;
}
/**
 * Three views of one ThreeEditor, each drawn by a different pipeline (ADR-0006): a forward perspective view
 * with the grid overlay and the Move tool, a TRAA post-processed camera view, and a select-only UV view of the
 * selection. Drag a gizmo arrow to move along an axis, the center to move in the view plane; X / Y / Z switch
 * the axis while dragging, Escape or right click cancels. Tab enters edit mode on the selection; 1 / 2 / 3
 * pick points, edges or faces; the UV view then edits UVs of the faces selected in 3D.
 */
let IoEditorViewsExample = class IoEditorViewsExample extends ReactiveElement {
    static get Style() {
        return /* css */ `
      :host {
        display: grid;
        grid-template-columns: 2fr 1fr;
        grid-template-rows: 1fr 1fr auto;
        flex: 1 1 auto;
        max-width: 100%;
        max-height: 100%;
        gap: var(--io_spacing);
      }
      :host > io-three-viewport:first-child {
        grid-row: 1 / 3;
      }
      :host > .status {
        grid-column: 1 / 3;
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
        const map = checkerTexture();
        const shapes = [
            { name: 'Box', geometry: new BoxGeometry(1, 1, 1) },
            { name: 'Sphere', geometry: new SphereGeometry(0.6, 32, 16) },
            { name: 'Knot', geometry: new TorusKnotGeometry(0.45, 0.15, 96, 12) },
        ];
        shapes.forEach((shape, i) => {
            const mesh = new Mesh(shape.geometry, new MeshStandardMaterial({ map }));
            mesh.name = shape.name;
            mesh.position.set((i - 1) * 2, 0.6, 0);
            scene.add(mesh);
        });
        this.editor.setActiveTool('3d', 'object', 'transform.translate');
        this.selection = this.editor.selection;
        this.editor.document.addCommitListener(() => this.changed());
        this.selection.set([scene.getObjectByName('Knot').uuid]);
        this.changed();
    }
    selectionMutated() {
        this.changed();
    }
    editorMutated() {
        this.changed();
    }
    changed() {
        const names = this.selection?.getObjects().map(object => object.name).join(', ') || 'nothing';
        const command = this.editor.operators.lastCommand;
        const last = command ? `${command.name} ${JSON.stringify(command.args)}` : 'none';
        const selection = this.selection;
        const domain = selection?.domain ?? 'object';
        const components = this.editor.mode === 'edit' && selection
            ? selection.componentIds(domain).reduce((sum, uuid) => sum + (selection.getComponents(uuid, domain)?.count() ?? 0), 0)
            : 0;
        const mode = this.editor.mode === 'edit' ? `Edit mode (${domain}: ${components} selected). ` : '';
        this.render([
            ioThreeViewport({ editor: this.editor, view: this.perspective }),
            ioThreeViewport({ editor: this.editor, view: this.antialiased }),
            ioThreeViewport({ editor: this.editor, view: this.uv }),
            div({ class: 'status' }, [span(`${mode}Selected: ${names}. Last command: ${last}. Tab: edit mode, 1/2/3: points/edges/faces.`)]),
        ]);
    }
    dispose() {
        this.editor.dispose();
        this.perspective.dispose();
        this.antialiased.dispose();
        this.uv.dispose();
        super.dispose();
    }
};
__decorate([
    Property({ type: ThreeEditor, init: null })
], IoEditorViewsExample.prototype, "editor", void 0);
__decorate([
    Property({ type: SelectionModel })
], IoEditorViewsExample.prototype, "selection", void 0);
__decorate([
    Property({ type: ThreeView, init: { overlays: { grid: true } } })
], IoEditorViewsExample.prototype, "perspective", void 0);
__decorate([
    Property({ type: ThreeView, init: { pipeline: 'traa' } })
], IoEditorViewsExample.prototype, "antialiased", void 0);
__decorate([
    Property({ type: ThreeView, init: { kind: 'uv', profile: 'select' } })
], IoEditorViewsExample.prototype, "uv", void 0);
IoEditorViewsExample = __decorate([
    Register
], IoEditorViewsExample);
export { IoEditorViewsExample };
export const ioEditorViewsExample = (arg0) => IoEditorViewsExample.vConstructor(arg0);
