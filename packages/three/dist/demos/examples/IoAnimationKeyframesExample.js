var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AnimationMixer, Color, Object3D, PerspectiveCamera, PMREMGenerator } from 'three/webgpu';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { Register, ReactiveProperty } from '@io-gui/core';
import { ThreeApplet, IoThreeExample, ioThreeViewport } from '@io-gui/three';
import { ioSplit, Split } from '@io-gui/layout';
let AnimationKeyframesExample = class AnimationKeyframesExample extends ThreeApplet {
    mixer = new AnimationMixer(new Object3D());
    constructor(args) {
        super(args);
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
            const train = gltf.scene.getObjectByName('Object675');
            const perspectiveCamera = new PerspectiveCamera(125, 1, 0.1, 1000);
            perspectiveCamera.position.set(140, 0, 30);
            perspectiveCamera.rotation.set(Math.PI / 2, -Math.PI / 2, 0);
            train.add(perspectiveCamera);
            this.dispatchMutation();
            this.dispatch('frame-object', { object: this.scene }, true);
        }
        catch (e) {
            console.error(e);
        }
    }
    onAnimate(delta) {
        if (this.mixer) {
            this.mixer.update(delta);
            debug: {
                this.dispatchMutation(this.mixer);
            }
        }
    }
};
AnimationKeyframesExample = __decorate([
    Register
], AnimationKeyframesExample);
export { AnimationKeyframesExample };
let IoAnimationKeyframesExample = class IoAnimationKeyframesExample extends IoThreeExample {
    ready() {
        this.render([
            ioSplit({
                elements: [
                    ioThreeViewport({ id: 'Top', applet: this.applet, cameraSelect: 'top' }),
                    ioThreeViewport({ id: 'Left', applet: this.applet, cameraSelect: 'left' }),
                    ioThreeViewport({ id: 'Perspective', applet: this.applet, cameraSelect: 'perspective' }),
                    ioThreeViewport({ id: 'SceneCamera', applet: this.applet, cameraSelect: 'scene' }),
                ],
                split: new Split({
                    type: 'split',
                    flex: '2 1 auto',
                    orientation: 'vertical',
                    children: [
                        {
                            type: 'split',
                            flex: '1 1 50%',
                            orientation: 'horizontal',
                            children: [
                                { type: 'panel', flex: '1 1 50%', tabs: [{ id: 'Top' }] },
                                { type: 'panel', flex: '1 1 50%', tabs: [{ id: 'Left' }] }
                            ]
                        },
                        {
                            type: 'split',
                            flex: '1 1 50%',
                            orientation: 'horizontal',
                            children: [
                                { type: 'panel', flex: '1 1 50%', tabs: [{ id: 'Perspective' }] },
                                { type: 'panel', flex: '1 1 50%', tabs: [{ id: 'SceneCamera' }] },
                            ]
                        }
                    ]
                })
            })
        ]);
    }
};
__decorate([
    ReactiveProperty({ type: AnimationKeyframesExample, init: { isPlaying: true } })
], IoAnimationKeyframesExample.prototype, "applet", void 0);
IoAnimationKeyframesExample = __decorate([
    Register
], IoAnimationKeyframesExample);
export { IoAnimationKeyframesExample };
export const ioAnimationKeyframesExample = IoAnimationKeyframesExample.vConstructor;
//# sourceMappingURL=IoAnimationKeyframesExample.js.map