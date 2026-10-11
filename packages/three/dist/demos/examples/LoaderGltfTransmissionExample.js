var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ACESFilmicToneMapping, AnimationMixer, EquirectangularReflectionMapping } from 'three/webgpu';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js';
import { DRACOLoader, DRACO_GLTF_CONFIG } from 'three/addons/loaders/DRACOLoader.js';
import { Register } from '@io-gui/core';
import { Document, Timeline } from '@io-gui/three';
/**
 * The animated iridescent dish with olives (`KHR_materials_transmission`, volume, iridescence) in the Royal Esplanade
 * environment. The source's camera auto-rotation is dropped. Plays when opened.
 */
let LoaderGltfTransmissionExample = class LoaderGltfTransmissionExample extends Document {
    mixer;
    constructor(args) {
        super({ toneMapping: ACESFilmicToneMapping, timeline: new Timeline({ autoplay: true }), ...args });
        void this.load();
    }
    async load() {
        try {
            const texture = await new UltraHDRLoader().setPath('https://threejs.org/examples/textures/equirectangular/').loadAsync('royal_esplanade_2k.hdr.jpg');
            texture.mapping = EquirectangularReflectionMapping;
            this.scene.background = texture;
            this.scene.backgroundBlurriness = 0.35;
            this.scene.environment = texture;
            // model
            const gltf = await new GLTFLoader()
                .setPath('https://threejs.org/examples/models/gltf/')
                .setDRACOLoader(new DRACOLoader().setDecoderPath(DRACO_GLTF_CONFIG))
                .loadAsync('IridescentDishWithOlives.glb');
            this.timeline.duration = gltf.animations[0].duration;
            this.mixer = new AnimationMixer(gltf.scene);
            this.mixer.clipAction(gltf.animations[0]).play();
            this.mixer.setTime(this.timeline.currentTime);
            this.scene.add(gltf.scene);
            this.notify({ kind: 'structure' });
            this.dispatch('frame-object', { object: gltf.scene }, true);
        }
        catch (e) {
            console.error(e);
        }
    }
    onAnimate(delta) {
        this.mixer?.update(delta);
    }
};
LoaderGltfTransmissionExample = __decorate([
    Register
], LoaderGltfTransmissionExample);
export { LoaderGltfTransmissionExample };
