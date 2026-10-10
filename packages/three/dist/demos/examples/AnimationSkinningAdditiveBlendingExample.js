var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Property, Register } from '@io-gui/core';
import { AnimationAction, AnimationMixer, AnimationUtils, Color, DirectionalLight, Fog, Group, HemisphereLight, Mesh, MeshPhongMaterial, PlaneGeometry, } from 'three/webgpu';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ThreeDocument } from '@io-gui/three';
import { ioObject, ioPropertyEditor, registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
const loader = new GLTFLoader();
const loadGltf = (url) => new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
});
/**
 * The Xbot model with base actions (crossfaded with the Document tab buttons) and additive poses
 * (weighted there). Plays when opened.
 */
let AnimationSkinningAdditiveBlendingExample = class AnimationSkinningAdditiveBlendingExample extends ThreeDocument {
    mixer = new AnimationMixer(new Group());
    currentBaseAction = 'idle';
    baseActions = {
        idle: null,
        walk: null,
        run: null,
    };
    additiveActions = {
        sneak_pose: null,
        sad_pose: null,
        agree: null,
        headShake: null,
    };
    constructor(args) {
        super({ autoplay: true, ...args });
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
        dirLight.position.set(3, 10, 10);
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 2;
        dirLight.shadow.camera.bottom = -2;
        dirLight.shadow.camera.left = -2;
        dirLight.shadow.camera.right = 2;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 40;
        this.scene.add(dirLight);
        const ground = new Mesh(new PlaneGeometry(100, 100), new MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false }));
        ground.name = 'Ground';
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        ground.userData.selectable = false;
        this.scene.add(ground);
        void this.loadModel();
    }
    async loadModel() {
        const gltf = await loadGltf('https://threejs.org/examples/models/gltf/Xbot.glb');
        const model = gltf.scene;
        this.scene.add(model);
        model.traverse((object) => {
            if (object.isMesh) {
                object.castShadow = true;
            }
        });
        this.mixer = new AnimationMixer(model);
        const animations = gltf.animations;
        for (let i = 0; i < animations.length; i++) {
            let clip = animations[i];
            const name = clip.name;
            if (name in this.baseActions) {
                const action = this.mixer.clipAction(clip);
                this.setWeight(action, name === 'idle' ? 1 : 0);
                action.play();
                this.baseActions[name] = action;
            }
            else if (name in this.additiveActions) {
                // Make the clip additive and remove the reference frame
                AnimationUtils.makeClipAdditive(clip);
                if (clip.name.endsWith('_pose')) {
                    clip = AnimationUtils.subclip(clip, clip.name, 2, 3, 30);
                }
                const action = this.mixer.clipAction(clip);
                this.setWeight(action, 0);
                action.play();
                this.additiveActions[name] = action;
            }
            this.additiveActions = Object.assign({}, this.additiveActions);
            this.dispatchMutation(this.additiveActions);
        }
        this.setProperties({
            isLoaded: true,
        });
        this.notify({ kind: 'structure' });
        this.dispatch('frame-object', { object: model }, true);
    }
    setWeight(action, weight) {
        action.enabled = true;
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(weight);
    }
    // Base action crossfade triggers
    none = () => { this.prepareCrossFade(null); };
    idle = () => { this.prepareCrossFade('idle'); };
    walk = () => { this.prepareCrossFade('walk'); };
    run = () => { this.prepareCrossFade('run'); };
    prepareCrossFade(targetName) {
        const currentAction = this.baseActions[this.currentBaseAction];
        const targetAction = targetName ? this.baseActions[targetName] : null;
        if (currentAction === targetAction)
            return;
        const duration = 0.35;
        if (this.currentBaseAction === 'idle' || !currentAction || !targetAction) {
            this.executeCrossFade(currentAction, targetAction, duration);
        }
        else {
            this.synchronizeCrossFade(currentAction, targetAction, duration);
        }
        this.currentBaseAction = targetName || 'None';
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
        if (endAction) {
            this.setWeight(endAction, 1);
            endAction.time = 0;
            if (startAction) {
                startAction.crossFadeTo(endAction, duration, true);
            }
            else {
                endAction.fadeIn(duration);
            }
        }
        else if (startAction) {
            startAction.fadeOut(duration);
        }
    }
    onAnimate(delta) {
        if (!this.isLoaded)
            return;
        debug: {
            // Dispatch mutations for UI reactivity
            Object.values(this.baseActions).forEach(action => {
                if (action)
                    this.dispatchMutation(action);
            });
            Object.values(this.additiveActions).forEach(action => {
                if (action)
                    this.dispatchMutation(action);
            });
            this.dispatchMutation(this.mixer);
        }
        this.mixer.update(delta);
    }
};
__decorate([
    Property({ type: Boolean, value: false })
], AnimationSkinningAdditiveBlendingExample.prototype, "isLoaded", void 0);
AnimationSkinningAdditiveBlendingExample = __decorate([
    Register
], AnimationSkinningAdditiveBlendingExample);
export { AnimationSkinningAdditiveBlendingExample };
registerEditorConfig(AnimationSkinningAdditiveBlendingExample, [
    [AnimationMixer, ioObject({ expanded: true, properties: ['timeScale'] })],
    [AnimationAction, ioObject({ expanded: true, properties: ['weight'] })],
    ['additiveActions', ioPropertyEditor({ label: '_hidden_' })],
]);
registerEditorGroups(AnimationSkinningAdditiveBlendingExample, {
    Main: [
        'none',
        'idle',
        'walk',
        'run',
        'additiveActions',
        'mixer',
    ],
    Hidden: [
        'isLoaded',
        'baseActions',
        'currentBaseAction',
    ],
});
