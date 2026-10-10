var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '@io-gui/core';
import { AnimationMixer, BoxGeometry, DirectionalLight, Group, HemisphereLight, Mesh, NodeMaterial, Skeleton, SkeletonHelper, } from 'three/webgpu';
import { color, screenUV, vec2, vec4, reflector, positionWorld, } from 'three/tsl';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { ThreeDocument } from '@io-gui/three';
const gltfLoader = new GLTFLoader();
const fbxLoader = new FBXLoader();
const loadFbx = (url) => new Promise((resolve, reject) => {
    fbxLoader.load(url, resolve, undefined, reject);
});
const loadGltf = (url) => new Promise((resolve, reject) => {
    gltfLoader.load(url, resolve, undefined, reject);
});
/** A Mixamo FBX animation retargeted onto a Ready Player Me avatar, over a masked reflective floor. Plays when opened. */
let AnimationRetargetingReadyplayerExample = class AnimationRetargetingReadyplayerExample extends ThreeDocument {
    sourceMixer;
    targetMixer;
    constructor(args) {
        super({ autoplay: true, ...args });
        const horizontalEffect = screenUV.x.mix(color(0x13172b), color(0x311649));
        const lightEffect = screenUV.distance(vec2(0.5, 1.0)).oneMinus().mul(color(0x0c5d68));
        this.scene.backgroundNode = horizontalEffect.add(lightEffect);
        const light = new HemisphereLight(0x311649, 0x0c5d68, 10);
        light.name = 'Hemisphere';
        this.scene.add(light);
        const backLight = new DirectionalLight(0xffffff, 10);
        backLight.name = 'Back';
        backLight.position.set(0, 5, -5);
        this.scene.add(backLight);
        const keyLight = new DirectionalLight(0xfff9ea, 4);
        keyLight.name = 'Key';
        keyLight.position.set(3, 5, 3);
        this.scene.add(keyLight);
        const reflection = reflector();
        reflection.target.rotateX(-Math.PI / 2);
        this.scene.add(reflection.target);
        const reflectionMask = positionWorld.xz.distance(0).mul(.1).clamp().oneMinus();
        const floorMaterial = new NodeMaterial();
        floorMaterial.colorNode = vec4(reflection.rgb, reflectionMask);
        floorMaterial.opacity = .2;
        floorMaterial.transparent = true;
        const floor = new Mesh(new BoxGeometry(50, .001, 50), floorMaterial);
        floor.name = 'Floor';
        floor.receiveShadow = true;
        floor.position.set(0, 0, 0);
        floor.userData.selectable = false;
        this.scene.add(floor);
        void this.loadModels();
    }
    async loadModels() {
        const [sourceModel, targetModel] = await Promise.all([
            loadFbx('https://threejs.org/examples/models/fbx/mixamo.fbx'),
            loadGltf('https://threejs.org/examples/models/gltf/readyplayer.me.glb'),
        ]);
        const models = new Group();
        models.name = 'Models';
        models.add(sourceModel);
        models.add(targetModel.scene);
        this.scene.add(models);
        sourceModel.position.x -= .9;
        targetModel.scene.position.x += .9;
        sourceModel.scale.setScalar(.01);
        const source = this.getSource(sourceModel);
        this.sourceMixer = source.mixer;
        this.targetMixer = this.retargetModel(source, targetModel);
        this.notify({ kind: 'structure' });
        this.dispatch('frame-object', { object: models, overscan: 1.5 }, true);
    }
    getSource(sourceModel) {
        const clip = sourceModel.animations[0];
        const helper = new SkeletonHelper(sourceModel);
        const skeleton = new Skeleton(helper.bones);
        const mixer = new AnimationMixer(sourceModel);
        mixer.clipAction(sourceModel.animations[0]).play();
        return { clip, skeleton, mixer };
    }
    retargetModel(sourceModel, targetModel) {
        const targetSkin = targetModel.scene.children[0].children[1];
        const retargetOptions = {
            // specify the name of the source's hip bone
            hip: 'mixamorigHips',
            // preserve the scale of the target model
            scale: .01,
            // Map of target's bone names to source's bone names
            getBoneName: function (bone) {
                return 'mixamorig' + bone.name;
            }
        };
        const retargetedClip = SkeletonUtils.retargetClip(targetSkin, sourceModel.skeleton, sourceModel.clip, retargetOptions);
        const mixer = new AnimationMixer(targetSkin);
        mixer.clipAction(retargetedClip).play();
        return mixer;
    }
    onAnimate(delta) {
        this.sourceMixer?.update(delta);
        this.targetMixer?.update(delta);
    }
};
AnimationRetargetingReadyplayerExample = __decorate([
    Register
], AnimationRetargetingReadyplayerExample);
export { AnimationRetargetingReadyplayerExample };
