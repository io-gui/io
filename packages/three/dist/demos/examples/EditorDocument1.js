var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '@io-gui/core';
import { AmbientLight, BoxGeometry, ConeGeometry, DirectionalLight, Mesh, MeshStandardMaterial, SphereGeometry, TorusKnotGeometry } from 'three/webgpu';
import { ThreeDocument } from '@io-gui/three';
import { CanvasTexture, SRGBColorSpace } from 'three/webgpu';
/** 8×8 checker of `color` and light gray, so the UV view shows whose texture it lays out. */
export function checkerTexture(color) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const context = canvas.getContext('2d');
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            context.fillStyle = (x + y) % 2 ? color : '#e8e8e8';
            context.fillRect(x * 32, y * 32, 32, 32);
        }
    }
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    return texture;
}
/** Four checker-textured primitives in a row, lit by an ambient and a directional light. */
let EditorDocument1 = class EditorDocument1 extends ThreeDocument {
    constructor(args) {
        super(args);
        const ambient = new AmbientLight(0xffffff, 0.6);
        ambient.name = 'Ambient';
        const sun = new DirectionalLight(0xffffff, 2);
        sun.name = 'Sun';
        sun.position.set(3, 5, 4);
        this.scene.add(ambient, sun);
        const shapes = [
            { name: 'Box', geometry: new BoxGeometry(1, 1, 1), color: '#d9534f' },
            { name: 'Sphere', geometry: new SphereGeometry(0.6, 32, 16), color: '#5cb85c' },
            { name: 'Cone', geometry: new ConeGeometry(0.6, 1.2, 32), color: '#5bc0de' },
            { name: 'Knot', geometry: new TorusKnotGeometry(0.45, 0.15, 96, 12), color: '#f0ad4e' },
        ];
        shapes.forEach((shape, i) => {
            const mesh = new Mesh(shape.geometry, new MeshStandardMaterial({ map: checkerTexture(shape.color) }));
            mesh.name = shape.name;
            mesh.position.set((i - 1.5) * 2, 0.6, (i % 2) * 1.5 - 0.75);
            this.scene.add(mesh);
        });
    }
};
EditorDocument1 = __decorate([
    Register
], EditorDocument1);
export { EditorDocument1 };
