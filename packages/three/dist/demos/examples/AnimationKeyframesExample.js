var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ACESFilmicToneMapping, AnimationMixer, Object3D, PerspectiveCamera, PMREMGenerator, Scene } from 'three/webgpu';
import { SkyMesh } from 'three/addons/objects/SkyMesh.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader, DRACO_GLTF_CONFIG } from 'three/addons/loaders/DRACOLoader.js';
import { Register } from '@io-gui/core';
import { Document, Timeline } from '@io-gui/three';
/**
 * The source's sky: sun at elevation 11°, azimuth -55°. Its clouds hold still: the source never advances the sky's
 * `time`, and SkyMesh would drift them on TSL's global time, not the timeline.
 */
function createSky() {
    const sky = new SkyMesh();
    sky.name = 'Sky';
    sky.scale.setScalar(10000);
    sky.turbidity.value = 0;
    sky.rayleigh.value = 3;
    sky.mieDirectionalG.value = 0.7;
    sky.cloudElevation.value = 1;
    sky.cloudSpeed.value = 0;
    sky.sunPosition.value.set(-0.8, 0.19, 0.56);
    sky.userData.selectable = false;
    return sky;
}
/**
 * The animated Littlest Tokyo model under a Preetham sky that also lights it as a PMREM environment, with a scene
 * camera riding the train. Plays when opened.
 */
let AnimationKeyframesExample = class AnimationKeyframesExample extends Document {
    mixer = new AnimationMixer(new Object3D());
    constructor(args) {
        super({ toneMapping: ACESFilmicToneMapping, timeline: new Timeline({ autoplay: true }), ...args });
        this.scene.add(createSky());
        void this.loadModel();
    }
    onRendererInitialized(renderer) {
        super.onRendererInitialized(renderer);
        // A sky in a scene of its own, so the environment holds only the sky.
        const environment = new Scene();
        environment.add(createSky());
        this.scene.environment = new PMREMGenerator(renderer).fromScene(environment).texture;
    }
    async loadModel() {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(DRACO_GLTF_CONFIG);
        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);
        try {
            const gltf = await loader.loadAsync('https://threejs.org/examples/models/gltf/LittlestTokyo.glb');
            const model = gltf.scene;
            model.position.set(1, 1, 0);
            model.scale.set(0.01, 0.01, 0.01);
            this.scene.add(model);
            this.timeline.duration = gltf.animations[0].duration;
            this.mixer = new AnimationMixer(model);
            this.mixer.clipAction(gltf.animations[0]).play();
            this.mixer.setTime(this.timeline.currentTime);
            const train = gltf.scene.getObjectByName('Object675');
            const perspectiveCamera = new PerspectiveCamera(125, 1, 0.1, 1000);
            perspectiveCamera.name = 'TrainCamera';
            perspectiveCamera.position.set(140, 0, 30);
            perspectiveCamera.rotation.set(Math.PI / 2, -Math.PI / 2, 0);
            train.add(perspectiveCamera);
            this.notify({ kind: 'structure' });
            // The model, not the scene: the sky spans 10000 units.
            this.dispatch('frame-object', { object: model }, true);
        }
        catch (e) {
            console.error(e);
        }
    }
    onAnimate(delta) {
        this.mixer.update(delta);
    }
};
AnimationKeyframesExample = __decorate([
    Register
], AnimationKeyframesExample);
export { AnimationKeyframesExample };
