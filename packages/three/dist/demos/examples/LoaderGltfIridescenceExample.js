var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ACESFilmicToneMapping, EquirectangularReflectionMapping } from 'three/webgpu';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { Register } from '@io-gui/core';
import { Document } from '@io-gui/three';
/** The iridescent glTF lamp (`KHR_materials_iridescence`) in the Venice sunset HDR environment. The source's camera auto-rotation is dropped. */
let LoaderGltfIridescenceExample = class LoaderGltfIridescenceExample extends Document {
    constructor(args) {
        super({ toneMapping: ACESFilmicToneMapping, ...args });
        void this.load();
    }
    async load() {
        const hdrLoader = new HDRLoader().setPath('https://threejs.org/examples/textures/equirectangular/');
        const gltfLoader = new GLTFLoader().setPath('https://threejs.org/examples/models/gltf/');
        try {
            const [texture, gltf] = await Promise.all([
                hdrLoader.loadAsync('venice_sunset_1k.hdr'),
                gltfLoader.loadAsync('IridescenceLamp.glb'),
            ]);
            // environment
            texture.mapping = EquirectangularReflectionMapping;
            this.scene.background = texture;
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
LoaderGltfIridescenceExample = __decorate([
    Register
], LoaderGltfIridescenceExample);
export { LoaderGltfIridescenceExample };
