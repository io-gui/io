var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Color, CubeTextureLoader, Mesh, MeshBasicNodeMaterial, Node, NodeUpdateType } from 'three/webgpu';
import { uniform, cubeTexture } from 'three/tsl';
import { TeapotGeometry } from 'three/addons/geometries/TeapotGeometry.js';
import { Register } from '@io-gui/core';
import { Document, Timeline } from '@io-gui/three';
/** Seconds in which the spin repeats: the timeline length, so looping is seamless. */
const SPIN_PERIOD = 20;
/** A mesh with its own color, read by `InstanceUniformNode` when the mesh draws. */
class ColorMesh extends Mesh {
    color = new Color();
}
/** A uniform updated per object: it takes the color of the mesh being drawn. */
class InstanceUniformNode extends Node {
    uniformNode = uniform(new Color());
    constructor() {
        super('vec3');
        this.updateType = NodeUpdateType.OBJECT;
    }
    update(frame) {
        const mesh = frame.object;
        this.uniformNode.value.copy(mesh.color);
        return undefined;
    }
    setup( /*builder*/) {
        return this.uniformNode;
    }
}
/**
 * Twelve teapots sharing one material, each tinted by its own `color` (Inspector) through a per-object uniform node
 * over a castle cube map. Spins with document time; plays when opened.
 */
let InstanceUniformExample = class InstanceUniformExample extends Document {
    objects = [];
    constructor(args) {
        super({ timeline: new Timeline({ autoplay: true, duration: SPIN_PERIOD }), ...args });
        // CubeMap
        const path = 'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/';
        const format = '.jpg';
        const urls = [
            path + 'px' + format, path + 'nx' + format,
            path + 'py' + format, path + 'ny' + format,
            path + 'pz' + format, path + 'nz' + format
        ];
        // Views draw on document changes only, so report the texture when it arrives.
        const cTexture = new CubeTextureLoader().load(urls, () => this.notify({ kind: 'material' }));
        // Materials
        const instanceUniform = new InstanceUniformNode();
        const cubeTextureNode = cubeTexture(cTexture);
        // `NodeMaterial` applies `emissiveNode` on any material; @types/three 0.186 declares it only on lit ones.
        const material = new MeshBasicNodeMaterial();
        material.colorNode = instanceUniform.add(cubeTextureNode);
        material.emissiveNode = instanceUniform.mul(cubeTextureNode);
        // Geometry
        const geometry = new TeapotGeometry(50, 18);
        for (let i = 0, l = 12; i < l; i++) {
            const mesh = new ColorMesh(geometry, material);
            mesh.name = `Teapot ${i + 1}`;
            mesh.color = new Color(Math.random() * 0xffffff);
            mesh.position.x = (i % 4) * 200 - 300;
            mesh.position.z = Math.floor(i / 4) * 200 - 200;
            mesh.rotation.x = Math.random() * 200 - 100;
            mesh.rotation.y = Math.random() * 200 - 100;
            mesh.rotation.z = Math.random() * 200 - 100;
            mesh.userData.rotation = mesh.rotation.clone();
            this.objects.push(mesh);
            this.scene.add(mesh);
        }
    }
    onAnimate(delta, time) {
        // The source turns 0.01 and 0.005 rad per frame about x and y.
        const angle = time / SPIN_PERIOD * Math.PI * 2;
        for (const object of this.objects) {
            object.rotation.x = object.userData.rotation.x + angle * 2;
            object.rotation.y = object.userData.rotation.y + angle;
        }
    }
};
InstanceUniformExample = __decorate([
    Register
], InstanceUniformExample);
export { InstanceUniformExample };
