var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Property, Register } from '@io-gui/core';
import { AnimationMixer, Color, DirectionalLight, Fog, Group, HemisphereLight, Mesh, MeshPhongMaterial, PerspectiveCamera, PlaneGeometry, SkeletonHelper, } from 'three/webgpu';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Document, Timeline } from '@io-gui/three';
import { ioObject, registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
import { ioNumberSlider } from '@io-gui/sliders';
/**
 * Default crossfade seconds from one action (outer key) to another: the source's four transitions, plus idle <-> run,
 * which the source doesn't offer.
 */
const CROSSFADE_DURATIONS = {
    idle: { walk: 0.5, run: 2.5 },
    walk: { idle: 1.0, run: 2.5 },
    run: { walk: 5.0, idle: 5.0 },
};
const loader = new GLTFLoader();
const loadGltf = (url) => new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
});
/**
 * The Soldier model crossfading between idle, walk and run. The Document tab has model and skeleton visibility,
 * the crossfade buttons and the actions' effective weights. A live demo (ADR-0009): the timeline is only its clock,
 * so it pauses and steps forward with the timeline, and ignores time going back. Plays when opened.
 */
let AnimationSkinningBlendingExample = class AnimationSkinningBlendingExample extends Document {
    camera;
    model;
    skeleton;
    mixer = new AnimationMixer(new Group());
    actions = {};
    useDefaultDuration = true;
    customDuration = 3.5;
    /** Mixer time at which the running crossfade ends; Infinity while none runs or one waits for a loop end. */
    crossfadeEnd = Infinity;
    constructor(args) {
        super({ timeline: new Timeline({ autoplay: true }), ...args });
        // Camera
        this.camera = new PerspectiveCamera(45, 1, 1, 100);
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
        model.visible = this.showModel;
        this.model = model;
        this.scene.add(model);
        model.traverse((object) => {
            if (object.isMesh) {
                object.castShadow = true;
            }
        });
        this.skeleton = new SkeletonHelper(model);
        this.skeleton.visible = this.showSkeleton;
        this.skeleton.userData.selectable = false;
        this.scene.add(this.skeleton);
        this.mixer = new AnimationMixer(model);
        this.actions = {
            idle: this.mixer.clipAction(gltf.animations[0]),
            walk: this.mixer.clipAction(gltf.animations[3]),
            run: this.mixer.clipAction(gltf.animations[1]),
        };
        this.setWeight(this.actions.idle, 0);
        this.setWeight(this.actions.walk, 1);
        this.setWeight(this.actions.run, 0);
        this.isActive = true;
        this.updateWeights();
        this.notify({ kind: 'structure' });
        this.dispatch('frame-object', { object: model }, true);
    }
    showModelChanged() {
        if (this.model)
            this.model.visible = this.showModel;
    }
    showSkeletonChanged() {
        if (this.skeleton)
            this.skeleton.visible = this.showSkeleton;
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
        this.updateWeights();
    }
    idle = () => { this.crossfadeTo('idle'); };
    walk = () => { this.crossfadeTo('walk'); };
    run = () => { this.crossfadeTo('run'); };
    /** The name of the action at full weight; none while blended or inactive. */
    getCurrentActionName() {
        for (const [name, action] of Object.entries(this.actions)) {
            if (action.getEffectiveWeight() >= 0.99) {
                return name;
            }
        }
        return null;
    }
    crossfadeTo(targetName) {
        if (this.isCrossfading)
            return;
        const targetAction = this.actions[targetName];
        if (!targetAction)
            return;
        const startName = this.getCurrentActionName();
        if (!startName || startName === targetName)
            return;
        const startAction = this.actions[startName];
        const duration = this.useDefaultDuration ? CROSSFADE_DURATIONS[startName][targetName] : this.customDuration;
        this.isCrossfading = true;
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
        this.crossfadeEnd = this.mixer.time + duration;
    }
    /** Fades are scheduled in mixer time, so a crossfade ends when the mixer reaches its end, not after wall-clock seconds. */
    advanceMixer(delta) {
        this.mixer.update(delta);
        if (this.mixer.time >= this.crossfadeEnd) {
            this.crossfadeEnd = Infinity;
            this.isCrossfading = false;
        }
        this.updateWeights();
    }
    updateWeights() {
        const weight = (action) => action?.isRunning() ? action.getEffectiveWeight() : 0;
        this.setProperties({
            idleWeight: weight(this.actions.idle),
            walkWeight: weight(this.actions.walk),
            runWeight: weight(this.actions.run),
        });
    }
    setWeight(action, weight) {
        action.enabled = weight !== 0 ? true : false;
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(weight);
    }
    /**
     * Playback and frame steps forward advance the mixer. Time going back (a loop wrap, scrubbing or stepping back) is
     * ignored: crossfade state only moves forward, like a game clock.
     */
    onAnimate(delta) {
        if (delta > 0)
            this.advanceMixer(delta);
    }
};
__decorate([
    Property({ type: Boolean, value: true })
], AnimationSkinningBlendingExample.prototype, "showModel", void 0);
__decorate([
    Property({ type: Boolean, value: false })
], AnimationSkinningBlendingExample.prototype, "showSkeleton", void 0);
__decorate([
    Property({ type: Boolean, value: false })
], AnimationSkinningBlendingExample.prototype, "isActive", void 0);
__decorate([
    Property({ type: Boolean, value: false })
], AnimationSkinningBlendingExample.prototype, "isCrossfading", void 0);
__decorate([
    Property({ type: Number, value: 0 })
], AnimationSkinningBlendingExample.prototype, "idleWeight", void 0);
__decorate([
    Property({ type: Number, value: 0 })
], AnimationSkinningBlendingExample.prototype, "walkWeight", void 0);
__decorate([
    Property({ type: Number, value: 0 })
], AnimationSkinningBlendingExample.prototype, "runWeight", void 0);
AnimationSkinningBlendingExample = __decorate([
    Register
], AnimationSkinningBlendingExample);
export { AnimationSkinningBlendingExample };
registerEditorConfig(AnimationSkinningBlendingExample, [
    [AnimationMixer, ioObject({ expanded: true, properties: ['timeScale'] })],
    ['idleWeight', ioNumberSlider({ min: 0, max: 1, step: 0.01, disabled: true })],
    ['walkWeight', ioNumberSlider({ min: 0, max: 1, step: 0.01, disabled: true })],
    ['runWeight', ioNumberSlider({ min: 0, max: 1, step: 0.01, disabled: true })],
]);
registerEditorGroups(AnimationSkinningBlendingExample, {
    Main: [
        'showModel',
        'showSkeleton',
        'isActive',
        'mixer',
        'idle',
        'walk',
        'run',
        'idleWeight',
        'walkWeight',
        'runWeight',
        'useDefaultDuration',
        'customDuration',
    ],
    Hidden: [
        'camera',
        'actions',
        'model',
        'skeleton',
        'isCrossfading',
    ],
});
