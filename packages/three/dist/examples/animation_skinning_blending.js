var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ReactiveProperty, Register } from '@io-gui/core';
import { AnimationAction, AnimationMixer, Color, DirectionalLight, Fog, Group, HemisphereLight, Mesh, MeshPhongMaterial, PerspectiveCamera, PlaneGeometry, } from 'three/webgpu';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ThreeApplet } from '@io-gui/three';
import { ioButton, ioBoolean } from '@io-gui/inputs';
import { ioPropertyEditor } from '@io-gui/editors';
const loader = new GLTFLoader();
let AnimationSkinningBlendingExample = class AnimationSkinningBlendingExample extends ThreeApplet {
    camera;
    mixer = new AnimationMixer(new Group());
    actions = {};
    // Playback
    stepSize = 0.05;
    // Crossfading
    useDefaultDuration = true;
    customDuration = 3.5;
    constructor() {
        super();
        // Camera
        this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
        this.camera.position.set(1, 2, -3);
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
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        this.uiConfig = [
            ['isPlaying', ioBoolean({ true: 'io:circle_pause', false: 'io:circle_fill_arrow_right' })],
            ['makeSingleStep', ioButton({ label: 'Make Single Step' })],
            ['actions', ioPropertyEditor()],
            [AnimationAction, ioPropertyEditor({ groups: {
                        Playback: [
                            'isActive',
                            'isPlaying',
                            'stepSize',
                            'makeSingleStep',
                        ],
                        Crossfade: [
                            'actions',
                            'walk',
                            'run',
                            'idle',
                            'useDefaultDuration',
                            'customDuration',
                        ],
                        Scene: [
                            'camera',
                        ],
                        Rendering: []
                    } })],
            [AnimationMixer, ioPropertyEditor({ groups: { Hidden: ['stats'] } })],
        ];
        this.uiGroups = {
            Playback: [
                'isActive',
                'isPlaying',
                'stepSize',
                'makeSingleStep',
            ],
            Crossfade: [
                'actions',
                'walk',
                'run',
                'idle',
                'useDefaultDuration',
                'customDuration',
            ],
            Scene: [
                'camera',
            ],
            Rendering: [],
            Hidden: [],
        };
        void this.loadModel();
    }
    async loadModel() {
        loader.load('https://threejs.org/examples/models/gltf/Soldier.glb', (gltf) => {
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
            this.setProperties({
                isActive: true,
                isPlaying: true,
            });
            this.dispatch('scene-ready', { scene: this.scene }, true);
        });
    }
    isActiveChanged() {
        if (this.isActive) {
            Object.values(this.actions).forEach((action) => action.play());
        }
        else {
            Object.values(this.actions).forEach((action) => action.stop());
        }
    }
    idle = () => { this.prepareCrossFade(this.actions.idle, this.actions.walk, 1.0); };
    walk = () => { this.prepareCrossFade(this.actions.walk, this.actions.run, 0.5); };
    run = () => { this.prepareCrossFade(this.actions.run, this.actions.idle, 2.5); };
    makeSingleStep = () => {
        if (this.mixer && !this.isPlaying) {
            this.mixer.update(this.stepSize);
        }
    };
    prepareCrossFade(startAction, endAction, defaultDuration) {
        const duration = this.setCrossFadeDuration(defaultDuration);
        this.isPlaying = true;
        if (startAction === this.actions.idle) {
            this.executeCrossFade(startAction, endAction, duration);
        }
        else {
            this.synchronizeCrossFade(startAction, endAction, duration);
        }
    }
    setCrossFadeDuration(defaultDuration) {
        if (this.useDefaultDuration) {
            return defaultDuration;
        }
        else {
            return this.customDuration;
        }
    }
    synchronizeCrossFade(startAction, endAction, duration) {
        if (!this.mixer)
            return;
        const onLoopFinished = (event) => {
            if (event.action === startAction) {
                this.mixer.removeEventListener('loop', onLoopFinished);
                this.executeCrossFade(startAction, endAction, duration);
            }
        };
        this.mixer.addEventListener('loop', onLoopFinished);
    }
    executeCrossFade(startAction, endAction, duration) {
        this.setWeight(endAction, 1);
        endAction.time = 0;
        startAction.crossFadeTo(endAction, duration, true);
    }
    setWeight(action, weight) {
        action.enabled = true;
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(weight);
    }
    onAnimate(delta) {
        if (!this.mixer)
            return;
        debug: {
            this.dispatchMutation(this.actions.idle);
            this.dispatchMutation(this.actions.walk);
            this.dispatchMutation(this.actions.run);
            this.dispatchMutation(this.mixer);
        }
        if (this.isPlaying) {
            this.mixer.update(delta);
        }
    }
};
__decorate([
    ReactiveProperty({ type: Boolean, value: false })
], AnimationSkinningBlendingExample.prototype, "isActive", void 0);
__decorate([
    ReactiveProperty({ type: Boolean, value: false })
], AnimationSkinningBlendingExample.prototype, "isPlaying", void 0);
AnimationSkinningBlendingExample = __decorate([
    Register
], AnimationSkinningBlendingExample);
export { AnimationSkinningBlendingExample };
//# sourceMappingURL=animation_skinning_blending.js.map