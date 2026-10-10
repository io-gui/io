var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Property, Register } from '@io-gui/core';
import { ThreeDocument } from '@io-gui/three';
import { registerEditorGroups } from '@io-gui/editors';
import { AnimationMixer, Group, Mesh, MeshStandardNodeMaterial, SphereGeometry, SpotLight, MathUtils, NeutralToneMapping, } from 'three/webgpu';
import { float, vec3, color, viewportSharedTexture, hue, blendOverlay, posterize, grayscale, saturation, viewportSafeUV, screenUV, checker, uv, time, oscSine, output, } from 'three/tsl';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
/**
 * Eight spheres whose backdrop nodes filter what is behind them, circling the dancing Michelle model.
 * The mixer's time scale (Document tab) also drives the circling. Plays when opened.
 */
let BackdropExample = class BackdropExample extends ThreeDocument {
    portals;
    constructor(args) {
        super({ toneMapping: NeutralToneMapping, toneMappingExposure: 0.3, autoplay: true, ...args });
        // Background
        this.scene.backgroundNode = screenUV.y.mix(color(0x66bbff), color(0x4466ff));
        // Light
        const light = new SpotLight(0xffffff, 1);
        light.name = 'Spot';
        light.position.set(1, 2, 3);
        light.lookAt(0, 1, 0);
        light.power = 2000;
        this.scene.add(light);
        // Portals
        this.portals = new Group();
        this.portals.name = 'Portals';
        this.scene.add(this.portals);
        const geometry = new SphereGeometry(.3, 32, 16);
        const addBackdropSphere = (name, backdropNode, backdropAlphaNode = null) => {
            const distance = 1;
            const id = this.portals.children.length;
            const rotation = MathUtils.degToRad(id * 45);
            const material = new MeshStandardNodeMaterial({ color: 0x0066ff });
            material.roughnessNode = float(.2);
            material.metalnessNode = float(0);
            material.backdropNode = backdropNode;
            material.backdropAlphaNode = backdropAlphaNode;
            material.transparent = true;
            const mesh = new Mesh(geometry, material);
            mesh.name = name;
            mesh.position.set(Math.cos(rotation) * distance, 1, Math.sin(rotation) * distance);
            this.portals.add(mesh);
        };
        addBackdropSphere('Hue', hue(viewportSharedTexture().bgr, oscSine().mul(Math.PI)));
        addBackdropSphere('Invert', viewportSharedTexture().rgb.oneMinus());
        addBackdropSphere('Grayscale', grayscale(viewportSharedTexture().rgb));
        addBackdropSphere('Saturation', saturation(viewportSharedTexture().rgb, 10), oscSine());
        addBackdropSphere('Overlay', blendOverlay(viewportSharedTexture().rgb, checker(uv().mul(10))));
        addBackdropSphere('Pixelate', viewportSharedTexture(viewportSafeUV(screenUV.mul(40).floor().div(40))));
        addBackdropSphere('PixelateBlue', viewportSharedTexture(viewportSafeUV(screenUV.mul(80).floor().div(80))).add(color(0x0033ff)));
        addBackdropSphere('Blue', vec3(0, 0, viewportSharedTexture().b));
        // Load model
        this.loadModel();
    }
    loadModel() {
        const loader = new GLTFLoader();
        loader.load('https://threejs.org/examples/models/gltf/Michelle.glb', (gltf) => {
            const object = gltf.scene;
            this.mixer = new AnimationMixer(object);
            const mesh = object.children[0].children[0];
            const material = mesh.material;
            // TODO: Time is respecting the animation mixer timeScale
            material.outputNode = oscSine(time.mul(.1)).mix(output, posterize(output.add(.1), 4).mul(2));
            const action = this.mixer.clipAction(gltf.animations[0]);
            action.play();
            this.scene.add(object);
            this.notify({ kind: 'structure' });
        });
    }
    onAnimate(delta) {
        this.mixer.update(delta);
        debug: {
            this.dispatchMutation(this.mixer);
        }
        this.portals.rotation.y += delta * this.mixer.timeScale * 0.5;
    }
};
__decorate([
    Property({ type: AnimationMixer, init: new Group() })
], BackdropExample.prototype, "mixer", void 0);
BackdropExample = __decorate([
    Register
], BackdropExample);
export { BackdropExample };
registerEditorGroups(BackdropExample, {
    Main: ['mixer'],
});
