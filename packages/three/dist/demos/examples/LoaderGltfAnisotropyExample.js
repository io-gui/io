var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ACESFilmicToneMapping, EquirectangularReflectionMapping } from 'three/webgpu';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js';
import { Register } from '@io-gui/core';
import { Document } from '@io-gui/three';
/** The anisotropic glTF barn lamp (`KHR_materials_anisotropy`) in the Royal Esplanade environment, background blurred. */
let LoaderGltfAnisotropyExample = class LoaderGltfAnisotropyExample extends Document {
    constructor(args) {
        super({ toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.35, ...args });
        void this.load();
    }
    async load() {
        const hdrLoader = new UltraHDRLoader().setPath('https://threejs.org/examples/textures/equirectangular/');
        const gltfLoader = new GLTFLoader().setPath('https://threejs.org/examples/models/gltf/');
        try {
            const [texture, gltf] = await Promise.all([
                hdrLoader.loadAsync('royal_esplanade_2k.hdr.jpg'),
                gltfLoader.loadAsync('AnisotropyBarnLamp.glb'),
            ]);
            // environment
            texture.mapping = EquirectangularReflectionMapping;
            this.scene.background = texture;
            this.scene.backgroundBlurriness = 0.5;
            this.scene.environment = texture;
            // model
            this.scene.add(gltf.scene);
            this.notify({ kind: 'structure' });
            this.dispatch('frame-object', { object: gltf.scene }, true);
        }
        catch (e) {
            console.error(e);
        }
    }
};
LoaderGltfAnisotropyExample = __decorate([
    Register
], LoaderGltfAnisotropyExample);
export { LoaderGltfAnisotropyExample };
