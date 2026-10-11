var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AmbientLight, AnimationMixer, LinearToneMapping, PointLight } from 'three/webgpu';
import { color, screenUV } from 'three/tsl';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Register } from '@io-gui/core';
import { Document, Timeline } from '@io-gui/three';
/** The skinned, animated Michelle model over a blue gradient background. Plays when opened. */
let SkinningExample = class SkinningExample extends Document {
    mixer;
    constructor(args) {
        super({ toneMapping: LinearToneMapping, toneMappingExposure: 0.4, timeline: new Timeline({ autoplay: true }), ...args });
        this.scene.backgroundNode = screenUV.y.mix(color(0x66bbff), color(0x4466ff));
        //lights
        // The source attaches the light to its camera at (1, 2, 3).
        const light = new PointLight(0xffffff, 1, 100);
        light.name = 'Point';
        light.power = 2500;
        light.position.set(1, 2, 3);
        this.scene.add(light);
        const ambient = new AmbientLight(0x4466ff, 1);
        ambient.name = 'Ambient';
        this.scene.add(ambient);
        void this.loadModel();
    }
    async loadModel() {
        try {
            const gltf = await new GLTFLoader().loadAsync('https://threejs.org/examples/models/gltf/Michelle.glb');
            const object = gltf.scene;
            this.timeline.duration = gltf.animations[0].duration;
            this.mixer = new AnimationMixer(object);
            this.mixer.clipAction(gltf.animations[0]).play();
            this.mixer.setTime(this.timeline.currentTime);
            this.scene.add(object);
            this.notify({ kind: 'structure' });
            this.dispatch('frame-object', { object }, true);
        }
        catch (e) {
            console.error(e);
        }
    }
    onAnimate(delta) {
        this.mixer?.update(delta);
    }
};
SkinningExample = __decorate([
    Register
], SkinningExample);
export { SkinningExample };
