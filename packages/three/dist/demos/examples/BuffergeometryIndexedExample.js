var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BufferGeometry, Color, DoubleSide, Float32BufferAttribute, HemisphereLight, Mesh, MeshPhongMaterial, SRGBColorSpace } from 'three/webgpu';
import { Register, Property } from '@io-gui/core';
import { Document, Timeline } from '@io-gui/three';
import { registerEditorGroups } from '@io-gui/editors';
/** Seconds in which the spin repeats (0.25 and 0.5 rad/s): the timeline length. */
const PERIOD = 8 * Math.PI;
/** A 10 × 10 indexed grid with vertex colors, built by hand. Spins with document time; plays when opened. */
let BuffergeometryIndexedExample = class BuffergeometryIndexedExample extends Document {
    mesh;
    material;
    constructor(args) {
        super({ timeline: new Timeline({ autoplay: true, duration: PERIOD }), ...args });
        this.scene.background = new Color(0x050505);
        //
        const light = new HemisphereLight();
        light.name = 'Hemisphere';
        light.intensity = 3;
        this.scene.add(light);
        //
        const geometry = new BufferGeometry();
        const indices = [];
        const vertices = [];
        const normals = [];
        const colors = [];
        const size = 20;
        const segments = 10;
        const halfSize = size / 2;
        const segmentSize = size / segments;
        const _color = new Color();
        // generate vertices, normals and color data for a simple grid geometry
        for (let i = 0; i <= segments; i++) {
            const y = (i * segmentSize) - halfSize;
            for (let j = 0; j <= segments; j++) {
                const x = (j * segmentSize) - halfSize;
                vertices.push(x, -y, 0);
                normals.push(0, 0, 1);
                const r = (x / size) + 0.5;
                const g = (y / size) + 0.5;
                _color.setRGB(r, g, 1, SRGBColorSpace);
                colors.push(_color.r, _color.g, _color.b);
            }
        }
        // generate indices (data for element array buffer)
        for (let i = 0; i < segments; i++) {
            for (let j = 0; j < segments; j++) {
                const a = i * (segments + 1) + (j + 1);
                const b = i * (segments + 1) + j;
                const c = (i + 1) * (segments + 1) + j;
                const d = (i + 1) * (segments + 1) + (j + 1);
                // generate two faces (triangles) per iteration
                indices.push(a, b, d); // face one
                indices.push(b, c, d); // face two
            }
        }
        //
        geometry.setIndex(indices);
        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));
        geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
        this.material = new MeshPhongMaterial({
            side: DoubleSide,
            vertexColors: true
        });
        this.mesh = new Mesh(geometry, this.material);
        this.mesh.name = 'Grid';
        this.scene.add(this.mesh);
        this.wireframeChanged();
    }
    wireframeChanged() {
        if (this.material)
            this.material.wireframe = this.wireframe;
    }
    onAnimate(delta, time) {
        this.mesh.rotation.x = time * 0.25;
        this.mesh.rotation.y = time * 0.5;
    }
};
__decorate([
    Property({ type: Boolean, value: false })
], BuffergeometryIndexedExample.prototype, "wireframe", void 0);
BuffergeometryIndexedExample = __decorate([
    Register
], BuffergeometryIndexedExample);
export { BuffergeometryIndexedExample };
registerEditorGroups(BuffergeometryIndexedExample, {
    Main: ['wireframe'],
});
