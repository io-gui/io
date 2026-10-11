var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AnimationMixer, Color, DirectionalLight } from 'three/webgpu';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Register } from '@io-gui/core';
import { Document, Timeline } from '@io-gui/three';
/** The morph-target galloping horse, its clip played in 1 s. The source's orbiting camera is dropped. Plays when opened. */
let MorphtargetsHorseExample = class MorphtargetsHorseExample extends Document {
    mixer;
    constructor(args) {
        super({ timeline: new Timeline({ autoplay: true, duration: 1 }), ...args });
        this.scene.background = new Color(0xf0f0f0);
        const light1 = new DirectionalLight(0xefefff, 5);
        light1.name = 'Key';
        light1.position.set(1, 1, 1).normalize();
        this.scene.add(light1);
        const light2 = new DirectionalLight(0xffefef, 5);
        light2.name = 'Fill';
        light2.position.set(-1, -1, -1).normalize();
        this.scene.add(light2);
        void this.loadModel();
    }
    async loadModel() {
        try {
            const gltf = await new GLTFLoader().loadAsync('https://threejs.org/examples/models/gltf/Horse.glb');
            const mesh = gltf.scene.children[0];
            mesh.name = 'Horse';
            mesh.scale.set(1.5, 1.5, 1.5);
            this.scene.add(mesh);
            this.mixer = new AnimationMixer(mesh);
            this.mixer.clipAction(gltf.animations[0]).setDuration(1).play();
            this.mixer.setTime(this.timeline.currentTime);
            this.notify({ kind: 'structure' });
            this.dispatch('frame-object', { object: mesh }, true);
        }
        catch (e) {
            console.error(e);
        }
    }
    onAnimate(delta) {
        this.mixer?.update(delta);
    }
};
MorphtargetsHorseExample = __decorate([
    Register
], MorphtargetsHorseExample);
export { MorphtargetsHorseExample };
