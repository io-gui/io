var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Property, Register } from '@io-gui/core';
import { AnimationAction, AnimationMixer, Color, DirectionalLight, Fog, Group, HemisphereLight, Mesh, MeshPhongMaterial, PerspectiveCamera, PlaneGeometry, } from 'three/webgpu';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ThreeDocument } from '@io-gui/three';
import { ioObject, ioPropertyEditor, registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
import { ioNumberSlider } from '@io-gui/sliders';
import { ioButton } from '@io-gui/inputs';
const loader = new GLTFLoader();
const loadGltf = (url) => new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
});
/**
 * The Soldier model crossfading between idle, walk and run. The Document tab has the crossfade buttons,
 * action weights, pause and single step. Plays when opened.
 */
let AnimationSkinningBlendingExample = class AnimationSkinningBlendingExample extends ThreeDocument {
    camera;
    mixer = new AnimationMixer(new Group());
    actions = {};
    stepSize = 0.05;
    useDefaultDuration = true;
    customDuration = 3.5;
    constructor(args) {
        super({ autoplay: true, ...args });
        // Camera
        this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
        this.camera.name = 'Camera';
        this.camera.position.set(1, 2, -3);
        this.camera.lookAt(0, 1, 0);
        this.scene.add(this.camera);
        // Scene setup
        this.scene.background = new Color(0xa0a0a0);
        this.scene.fog = new Fog(0xa0a0a0, 10, 50);
        // Lights
        const hemiLight = new HemisphereLight(0xffffff, 0x8d8d8d, 3);
        hemiLight.name = 'Hemisphere';
        hemiLight.position.set(0, 20, 0);
        this.scene.add(hemiLight);
        const dirLight = new DirectionalLight(0xffffff, 3);
        dirLight.name = 'Sun';
        dirLight.position.set(-3, 10, -10);
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 2;
        dirLight.shadow.camera.bottom = -2;
        dirLight.shadow.camera.left = -2;
        dirLight.shadow.camera.right = 2;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 40;
        this.scene.add(dirLight);
        const ground = new Mesh(new PlaneGeometry(10, 10), new MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false }));
        ground.name = 'Ground';
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        ground.userData.selectable = false;
        this.scene.add(ground);
        void this.loadModel();
    }
    async loadModel() {
        const gltf = await loadGltf('https://threejs.org/examples/models/gltf/Soldier.glb');
        const model = gltf.scene;
        this.scene.add(model);
        model.traverse((object) => {
            if (object.isMesh) {
                object.castShadow = true;
            }
        });
        this.mixer = new AnimationMixer(model);
        this.actions = {
            idle: this.mixer.clipAction(gltf.animations[0]),
            walk: this.mixer.clipAction(gltf.animations[3]),
            run: this.mixer.clipAction(gltf.animations[1]),
        };
        this.setWeight(this.actions.idle, 0);
        this.setWeight(this.actions.walk, 1);
        this.setWeight(this.actions.run, 0);
        this.setProperties({
            isActive: true,
            paused: false,
        });
        this.notify({ kind: 'structure' });
        this.dispatch('frame-object', { object: model }, true);
    }
    isActiveChanged() {
        if (!this.actions.idle)
            return;
        if (this.isActive) {
            Object.values(this.actions).forEach((action) => action.play());
            this.setWeight(this.actions.idle, 0);
            this.setWeight(this.actions.walk, 1);
            this.setWeight(this.actions.run, 0);
        }
        else {
            Object.values(this.actions).forEach((action) => action.stop());
        }
    }
    idle = () => { this.crossfadeTo('idle', 1.0); };
    walk = () => { this.crossfadeTo('walk', 0.5); };
    run = () => { this.crossfadeTo('run', 2.5); };
    makeSingleStep = () => {
        this.paused = true;
        this.mixer.update(this.stepSize);
        this.notify({ kind: 'other' });
    };
    getCurrentAction() {
        for (const action of Object.values(this.actions)) {
            if (action.getEffectiveWeight() >= 0.99) {
                return action;
            }
        }
        return null;
    }
    crossfadeTo(targetName, defaultDuration) {
        if (this.isCrossfading)
            return;
        const targetAction = this.actions[targetName];
        if (!targetAction)
            return;
        const startAction = this.getCurrentAction();
        if (!startAction || startAction === targetAction)
            return;
        const duration = this.useDefaultDuration ? defaultDuration : this.customDuration;
        this.isCrossfading = true;
        this.paused = false;
        if (startAction === this.actions.idle) {
            this.executeCrossFade(startAction, targetAction, duration);
        }
        else {
            this.synchronizeCrossFade(startAction, targetAction, duration);
        }
    }
    synchronizeCrossFade(startAction, endAction, duration) {
        const onLoopFinished = (event) => {
            if (event.action === startAction) {
                this.mixer.removeEventListener('loop', onLoopFinished);
                this.executeCrossFade(startAction, endAction, duration);
            }
        };
        this.mixer.addEventListener('loop', onLoopFinished);
    }
    executeCrossFade(startAction, endAction, duration) {
        endAction.enabled = true;
        endAction.time = 0;
        endAction.setEffectiveTimeScale(1);
        endAction.setEffectiveWeight(1);
        startAction.crossFadeTo(endAction, duration, true);
        setTimeout(() => {
            this.isCrossfading = false;
            startAction.setEffectiveWeight(0);
            startAction.enabled = false;
        }, duration * 1000);
    }
    setWeight(action, weight) {
        action.enabled = weight !== 0 ? true : false;
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(weight);
    }
    onAnimate(delta) {
        debug: {
            for (const action of Object.values(this.actions))
                this.dispatchMutation(action);
            this.dispatchMutation(this.mixer);
        }
        if (!this.paused) {
            this.mixer.update(delta);
        }
    }
};
__decorate([
    Property({ type: Boolean, value: false })
], AnimationSkinningBlendingExample.prototype, "isActive", void 0);
__decorate([
    Property({ type: Boolean, value: false })
], AnimationSkinningBlendingExample.prototype, "paused", void 0);
__decorate([
    Property({ type: Boolean, value: false })
], AnimationSkinningBlendingExample.prototype, "isCrossfading", void 0);
AnimationSkinningBlendingExample = __decorate([
    Register
], AnimationSkinningBlendingExample);
export { AnimationSkinningBlendingExample };
registerEditorConfig(AnimationSkinningBlendingExample, [
    [AnimationMixer, ioObject({ expanded: true, properties: ['timeScale'] })],
    [AnimationAction, ioObject({ expanded: true, properties: ['weight'] })],
    ['makeSingleStep', ioButton({ label: 'Make Single Step' })],
    ['stepSize', ioNumberSlider({ min: 0, max: 1, step: 0.01 })],
    ['actions', ioPropertyEditor({ label: '_hidden_' })],
]);
registerEditorGroups(AnimationSkinningBlendingExample, {
    Main: [
        'isActive',
        'paused',
        'mixer',
        'actions',
        'idle',
        'walk',
        'run',
        'useDefaultDuration',
        'customDuration',
        'stepSize',
        'makeSingleStep',
    ],
    Hidden: [
        'camera',
        'isCrossfading',
    ],
});
