var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { EquirectangularReflectionMapping, ReinhardToneMapping } from 'three/webgpu';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { Register } from '@io-gui/core';
import { Document } from '@io-gui/three';
/** The glTF dispersion test (`KHR_materials_dispersion`) in the pedestrian overpass HDR environment, background blurred. */
let LoaderGltfDispersionExample = class LoaderGltfDispersionExample extends Document {
    constructor(args) {
        super({ toneMapping: ReinhardToneMapping, ...args });
        void this.load();
    }
    async load() {
        try {
            const hdrTexture = await new HDRLoader().setPath('https://threejs.org/examples/textures/equirectangular/').loadAsync('pedestrian_overpass_1k.hdr');
            hdrTexture.mapping = EquirectangularReflectionMapping;
            this.scene.backgroundBlurriness = 0.5;
            this.scene.environment = hdrTexture;
            this.scene.background = hdrTexture;
            const gltf = await new GLTFLoader().loadAsync('https://threejs.org/examples/models/gltf/DispersionTest.glb');
            this.scene.add(gltf.scene);
            this.notify({ kind: 'structure' });
            this.dispatch('frame-object', { object: gltf.scene }, true);
        }
        catch (e) {
            console.error(e);
        }
    }
};
LoaderGltfDispersionExample = __decorate([
    Register
], LoaderGltfDispersionExample);
export { LoaderGltfDispersionExample };
