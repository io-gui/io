var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ReactiveProperty, Register } from '@io-gui/core';
import { AnimationMixer, AnimationUtils, Color, DirectionalLight, Fog, Group, HemisphereLight, Mesh, MeshPhongMaterial, PerspectiveCamera, PlaneGeometry, SkeletonHelper, } from 'three/webgpu';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ThreeApplet } from '@io-gui/three';
import { ioBoolean } from '@io-gui/inputs';
import { ioNumberSlider } from '@io-gui/sliders';
const loader = new GLTFLoader();
let AnimationSkinningAdditiveBlendingExample = class AnimationSkinningAdditiveBlendingExample extends ThreeApplet {
    camera;
    mixer = new AnimationMixer(new Group());
    skeleton = null;
    currentBaseAction = 'idle';
    allActions = [];
    baseActions = {
        idle: { weight: 1 },
        walk: { weight: 0 },
        run: { weight: 0 },
    };
    additiveActions = {
        sneak_pose: { weight: 0 },
        sad_pose: { weight: 0 },
        agree: { weight: 0 },
        headShake: { weight: 0 },
    };
    constructor() {
        super();
        // Camera
        this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
        this.camera.position.set(-1, 2, 3);
        this.camera.lookAt(0, 1, 0);
        this.scene.add(this.camera);
        // Scene setup
        this.scene.background = new Color(0xa0a0a0);
        this.scene.fog = new Fog(0xa0a0a0, 10, 50);
        // Lights
        const hemiLight = new HemisphereLight(0xffffff, 0x8d8d8d, 3);
        hemiLight.position.set(0, 20, 0);
        this.scene.add(hemiLight);
        const dirLight = new DirectionalLight(0xffffff, 3);
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
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        this.uiConfig = [
            ['showSkeleton', ioBoolean({ label: 'Show Skeleton' })],
            ['timeScale', ioNumberSlider({ min: 0, max: 1.5, step: 0.01 })],
            ['sneakPoseWeight', ioNumberSlider({ min: 0, max: 1, step: 0.01 })],
            ['sadPoseWeight', ioNumberSlider({ min: 0, max: 1, step: 0.01 })],
            ['agreeWeight', ioNumberSlider({ min: 0, max: 1, step: 0.01 })],
            ['headShakeWeight', ioNumberSlider({ min: 0, max: 1, step: 0.01 })],
        ];
        this.uiGroups = {
            Main: [
                'isLoaded',
                'showSkeleton',
                'timeScale',
            ],
            'Base Actions': [
                'idle',
                'walk',
                'run',
            ],
            'Additive Weights': [
                'sneakPoseWeight',
                'sadPoseWeight',
                'agreeWeight',
                'headShakeWeight',
            ],
            Hidden: [
                'scene',
                'camera',
                'mixer',
                'allActions',
                'baseActions',
                'additiveActions',
                'currentBaseAction',
                'skeleton',
            ],
        };
        void this.loadModel();
    }
    async loadModel() {
        loader.load('https://threejs.org/examples/models/gltf/Xbot.glb', (gltf) => {
            const model = gltf.scene;
            this.scene.add(model);
            model.traverse((object) => {
                if (object.isMesh) {
                    object.castShadow = true;
                }
            });
            this.skeleton = new SkeletonHelper(model);
            this.skeleton.visible = this.showSkeleton;
            this.scene.add(this.skeleton);
            this.mixer = new AnimationMixer(model);
            const animations = gltf.animations;
            for (let i = 0; i < animations.length; i++) {
                let clip = animations[i];
                const name = clip.name;
                if (this.baseActions[name]) {
                    const action = this.mixer.clipAction(clip);
                    this.activateAction(action);
                    this.baseActions[name].action = action;
                    this.allActions.push(action);
                }
                else if (this.additiveActions[name]) {
                    // Make the clip additive and remove the reference frame
                    AnimationUtils.makeClipAdditive(clip);
                    if (clip.name.endsWith('_pose')) {
                        clip = AnimationUtils.subclip(clip, clip.name, 2, 3, 30);
                    }
                    const action = this.mixer.clipAction(clip);
                    this.activateAction(action);
                    this.additiveActions[name].action = action;
                    this.allActions.push(action);
                }
            }
            this.setProperties({
                isLoaded: true,
            });
            this.dispatch('frame-object', { scene: model }, true);
        });
    }
    activateAction(action) {
        const clip = action.getClip();
        const settings = this.baseActions[clip.name] || this.additiveActions[clip.name];
        this.setWeight(action, settings.weight);
        action.play();
    }
    setWeight(action, weight) {
        action.enabled = true;
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(weight);
    }
    showSkeletonChanged() {
        if (this.skeleton) {
            this.skeleton.visible = this.showSkeleton;
        }
    }
    timeScaleChanged() {
        this.mixer.timeScale = this.timeScale;
    }
    // Additive weight change handlers
    sneakPoseWeightChanged() {
        const settings = this.additiveActions['sneak_pose'];
        if (settings.action) {
            this.setWeight(settings.action, this.sneakPoseWeight);
            settings.weight = this.sneakPoseWeight;
        }
    }
    sadPoseWeightChanged() {
        const settings = this.additiveActions['sad_pose'];
        if (settings.action) {
            this.setWeight(settings.action, this.sadPoseWeight);
            settings.weight = this.sadPoseWeight;
        }
    }
    agreeWeightChanged() {
        const settings = this.additiveActions['agree'];
        if (settings.action) {
            this.setWeight(settings.action, this.agreeWeight);
            settings.weight = this.agreeWeight;
        }
    }
    headShakeWeightChanged() {
        const settings = this.additiveActions['headShake'];
        if (settings.action) {
            this.setWeight(settings.action, this.headShakeWeight);
            settings.weight = this.headShakeWeight;
        }
    }
    // Base action crossfade triggers
    idle = () => { this.prepareCrossFade('idle'); };
    walk = () => { this.prepareCrossFade('walk'); };
    run = () => { this.prepareCrossFade('run'); };
    prepareCrossFade(targetName) {
        const currentSettings = this.baseActions[this.currentBaseAction];
        const currentAction = currentSettings?.action || null;
        const targetSettings = this.baseActions[targetName];
        const targetAction = targetSettings?.action || null;
        if (currentAction === targetAction)
            return;
        const duration = 0.35;
        if (this.currentBaseAction === 'idle' || !currentAction || !targetAction) {
            this.executeCrossFade(currentAction, targetAction, duration);
        }
        else {
            this.synchronizeCrossFade(currentAction, targetAction, duration);
        }
        this.currentBaseAction = targetAction ? targetName : 'None';
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
        if (!this.isLoaded || !this.mixer)
            return;
        // Update effective weights for UI feedback
        for (const action of this.allActions) {
            const clip = action.getClip();
            const settings = this.baseActions[clip.name] || this.additiveActions[clip.name];
            if (settings) {
                settings.weight = action.getEffectiveWeight();
            }
        }
        this.mixer.update(delta);
    }
};
__decorate([
    ReactiveProperty({ type: Boolean, value: false })
], AnimationSkinningAdditiveBlendingExample.prototype, "isLoaded", void 0);
__decorate([
    ReactiveProperty({ type: Boolean, value: false })
], AnimationSkinningAdditiveBlendingExample.prototype, "showSkeleton", void 0);
__decorate([
    ReactiveProperty({ type: Number, value: 1 })
], AnimationSkinningAdditiveBlendingExample.prototype, "timeScale", void 0);
__decorate([
    ReactiveProperty({ type: Number, value: 0 })
], AnimationSkinningAdditiveBlendingExample.prototype, "sneakPoseWeight", void 0);
__decorate([
    ReactiveProperty({ type: Number, value: 0 })
], AnimationSkinningAdditiveBlendingExample.prototype, "sadPoseWeight", void 0);
__decorate([
    ReactiveProperty({ type: Number, value: 0 })
], AnimationSkinningAdditiveBlendingExample.prototype, "agreeWeight", void 0);
__decorate([
    ReactiveProperty({ type: Number, value: 0 })
], AnimationSkinningAdditiveBlendingExample.prototype, "headShakeWeight", void 0);
AnimationSkinningAdditiveBlendingExample = __decorate([
    Register
], AnimationSkinningAdditiveBlendingExample);
export { AnimationSkinningAdditiveBlendingExample };
//# sourceMappingURL=animation_skinning_additive_blending.js.map