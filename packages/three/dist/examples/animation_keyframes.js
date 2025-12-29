var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AnimationMixer, Color, PMREMGenerator } from 'three/webgpu';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { Register } from '@io-gui/core';
import { ThreeState } from '@io-gui/three';
let AnimationKeyframesExample = class AnimationKeyframesExample extends ThreeState {
    mixer = null;
    constructor() {
        super();
        this.scene.background = new Color(0xbfe3dd);
    }
    async onRendererInitialized(renderer) {
        super.onRendererInitialized(renderer);
        const pmremGenerator = new PMREMGenerator(renderer);
        this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);
        try {
            const gltf = await loader.loadAsync('https://threejs.org/examples/models/gltf/LittlestTokyo.glb');
            const model = gltf.scene;
            model.position.set(1, 1, 0);
            model.scale.set(0.01, 0.01, 0.01);
            this.scene.add(model);
            this.mixer = new AnimationMixer(model);
            this.mixer.clipAction(gltf.animations[0]).play();
            this.dispatchMutation();
            this.dispatch('scene-ready', { scene: this.scene }, true);
        }
        catch (e) {
            console.error(e);
        }
    }
    onAnimate(delta) {
        if (this.mixer) {
            this.mixer.update(delta);
        }
    }
};
AnimationKeyframesExample = __decorate([
    Register
], AnimationKeyframesExample);
export { AnimationKeyframesExample };
//# sourceMappingURL=animation_keyframes.js.map