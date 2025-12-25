var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Mesh, MeshBasicNodeMaterial, PlaneGeometry, StorageTexture, NearestFilter } from 'three/build/three.webgpu.js';
import { texture, textureStore, Fn, instanceIndex, float, uvec2, vec4 } from 'three/build/three.tsl.js';
import { ThreeState } from '../../nodes/ThreeState.js';
import { Register } from 'io-core';
let WebGPUComputeTexture = class WebGPUComputeTexture extends ThreeState {
    storageTexture;
    computeNode;
    constructor() {
        super();
        const width = 32, height = 32;
        this.storageTexture = new StorageTexture(width, height);
        const computeTexture = Fn(({ storageTexture }) => {
            const posX = instanceIndex.mod(width);
            const posY = instanceIndex.div(width);
            const indexUV = uvec2(posX, posY);
            // https://www.shadertoy.com/view/Xst3zN
            const x = float(posX).div(2.0);
            const y = float(posY).div(2.0);
            const v1 = x.sin();
            const v2 = y.sin();
            const v3 = x.add(y).sin();
            const v4 = x.mul(x).add(y.mul(y)).sqrt().add(5.0).sin();
            const v = v1.add(v2, v3, v4);
            const r = v.sin();
            const g = v.add(Math.PI).sin();
            const b = v.add(Math.PI).sub(0.5).sin();
            textureStore(storageTexture, indexUV, vec4(r, g, b, 1)).toWriteOnly();
        });
        this.computeNode = computeTexture({ storageTexture: this.storageTexture }).compute(width * height);
        const material = new MeshBasicNodeMaterial({ color: 0x00ff00 });
        material.colorNode = texture(this.storageTexture);
        material.colorNode.value.minFilter = NearestFilter;
        material.colorNode.value.magFilter = NearestFilter;
        const plane = new Mesh(new PlaneGeometry(1, 1), material);
        this.scene.add(plane);
        this.camera.position.z = 1;
    }
    onRendererReady(renderer) {
        super.onRendererReady(renderer);
        renderer.compute(this.computeNode);
    }
};
WebGPUComputeTexture = __decorate([
    Register
], WebGPUComputeTexture);
export { WebGPUComputeTexture };
//# sourceMappingURL=WebGPUComputeTexture.js.map