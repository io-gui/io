var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BoxGeometry, Mesh, MeshBasicMaterial, SRGBColorSpace, TextureLoader } from 'three/webgpu';
import { Register } from '@io-gui/core';
import { Document, Timeline } from '@io-gui/three';
/** Seconds in which the spin repeats: the timeline length, so looping is seamless. */
const SPIN_PERIOD = 20;
/** A crate-textured cube spinning with document time. Plays when opened. */
let GeometryCubeExample = class GeometryCubeExample extends Document {
    mesh;
    constructor(args) {
        super({ timeline: new Timeline({ autoplay: true, duration: SPIN_PERIOD }), ...args });
        // Views draw on document changes only, so report the texture when it arrives.
        const texture = new TextureLoader().load('https://threejs.org/examples/textures/crate.gif', () => this.notify({ kind: 'material' }));
        texture.colorSpace = SRGBColorSpace;
        const geometry = new BoxGeometry();
        const material = new MeshBasicMaterial({ map: texture });
        this.mesh = new Mesh(geometry, material);
        this.mesh.name = 'Cube';
        this.scene.add(this.mesh);
    }
    onAnimate(delta, time) {
        const angle = time / SPIN_PERIOD * Math.PI * 2;
        this.mesh.rotation.x = angle;
        this.mesh.rotation.y = angle * 2;
    }
};
GeometryCubeExample = __decorate([
    Register
], GeometryCubeExample);
export { GeometryCubeExample };
