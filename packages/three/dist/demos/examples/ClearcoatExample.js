var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ACESFilmicToneMapping, CanvasTexture, Group, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, PointLight, RepeatWrapping, SphereGeometry, SRGBColorSpace, TextureLoader, Vector2 } from 'three/webgpu';
import { HDRCubeTextureLoader } from 'three/addons/loaders/HDRCubeTextureLoader.js';
import { FlakesTexture } from 'three/addons/textures/FlakesTexture.js';
import { Register } from '@io-gui/core';
import { Document, Timeline } from '@io-gui/three';
/**
 * Seconds in which the motion repeats: the timeline length, so looping is seamless. The light's frequencies are whole
 * multiples of 0.25 rad/s; the spheres turn once per period (0.25 rad/s; the source's 0.005 rad per frame is 0.3).
 */
const PERIOD = 8 * Math.PI;
/**
 * Four clearcoat spheres (car paint, carbon fibers, golf ball, scratched red metal) in the Pisa HDR environment, lit
 * by an orbiting point light. Plays when opened.
 */
let ClearcoatExample = class ClearcoatExample extends Document {
    group;
    particleLight;
    constructor(args) {
        super({ toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.25, timeline: new Timeline({ autoplay: true, duration: PERIOD }), ...args });
        this.group = new Group();
        this.group.name = 'Spheres';
        this.scene.add(this.group);
        new HDRCubeTextureLoader()
            .setPath('https://threejs.org/examples/textures/cube/pisaHDR/')
            .load(['px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr'], (texture) => {
            this.scene.background = texture;
            this.scene.environment = texture;
            this.notify({ kind: 'settings' });
        });
        const geometry = new SphereGeometry(.8, 64, 32);
        // Views draw on document changes only, so report each texture when it arrives.
        const onLoad = () => this.notify({ kind: 'material' });
        const textureLoader = new TextureLoader().setPath('https://threejs.org/examples/textures/');
        const diffuse = textureLoader.load('carbon/Carbon.png', onLoad);
        diffuse.colorSpace = SRGBColorSpace;
        diffuse.wrapS = RepeatWrapping;
        diffuse.wrapT = RepeatWrapping;
        diffuse.repeat.x = 10;
        diffuse.repeat.y = 10;
        const normalMap = textureLoader.load('carbon/Carbon_Normal.png', onLoad);
        normalMap.wrapS = RepeatWrapping;
        normalMap.wrapT = RepeatWrapping;
        normalMap.repeat.x = 10;
        normalMap.repeat.y = 10;
        const normalMap2 = textureLoader.load('water/Water_1_M_Normal.jpg', onLoad);
        const normalMap3 = new CanvasTexture(new FlakesTexture());
        normalMap3.wrapS = RepeatWrapping;
        normalMap3.wrapT = RepeatWrapping;
        normalMap3.repeat.x = 10;
        normalMap3.repeat.y = 6;
        normalMap3.anisotropy = 16;
        const normalMap4 = textureLoader.load('golfball.jpg', onLoad);
        const clearcoatNormalMap = textureLoader.load('pbr/Scratched_gold/Scratched_gold_01_1K_Normal.png', onLoad);
        // car paint
        let material = new MeshPhysicalMaterial({
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            metalness: 0.9,
            roughness: 0.5,
            color: 0x0000ff,
            normalMap: normalMap3,
            normalScale: new Vector2(0.15, 0.15)
        });
        let mesh = new Mesh(geometry, material);
        mesh.name = 'CarPaint';
        mesh.position.x = -1;
        mesh.position.y = 1;
        this.group.add(mesh);
        // fibers
        material = new MeshPhysicalMaterial({
            roughness: 0.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            map: diffuse,
            normalMap: normalMap
        });
        mesh = new Mesh(geometry, material);
        mesh.name = 'Fibers';
        mesh.position.x = 1;
        mesh.position.y = 1;
        this.group.add(mesh);
        // golf
        material = new MeshPhysicalMaterial({
            metalness: 0.0,
            roughness: 0.1,
            clearcoat: 1.0,
            normalMap: normalMap4,
            clearcoatNormalMap: clearcoatNormalMap,
            // y scale is negated to compensate for normal map handedness.
            clearcoatNormalScale: new Vector2(2.0, -2.0)
        });
        mesh = new Mesh(geometry, material);
        mesh.name = 'Golf';
        mesh.position.x = -1;
        mesh.position.y = -1;
        this.group.add(mesh);
        // clearcoat + normalmap
        material = new MeshPhysicalMaterial({
            clearcoat: 1.0,
            metalness: 1.0,
            color: 0xff0000,
            normalMap: normalMap2,
            normalScale: new Vector2(0.15, 0.15),
            clearcoatNormalMap: clearcoatNormalMap,
            // y scale is negated to compensate for normal map handedness.
            clearcoatNormalScale: new Vector2(2.0, -2.0)
        });
        mesh = new Mesh(geometry, material);
        mesh.name = 'ClearcoatNormalmap';
        mesh.position.x = 1;
        mesh.position.y = -1;
        this.group.add(mesh);
        // LIGHTS
        this.particleLight = new Mesh(new SphereGeometry(.05, 8, 8), new MeshBasicMaterial({ color: 0xffffff }));
        this.particleLight.name = 'ParticleLight';
        this.scene.add(this.particleLight);
        const pointLight = new PointLight(0xffffff, 30);
        pointLight.name = 'Point';
        this.particleLight.add(pointLight);
        this.pose(0);
    }
    onAnimate(delta, time) {
        this.pose(time);
    }
    pose(time) {
        const timer = time * 0.25;
        this.particleLight.position.x = Math.sin(timer * 7) * 3;
        this.particleLight.position.y = Math.cos(timer * 5) * 4;
        this.particleLight.position.z = Math.cos(timer * 3) * 3;
        for (const child of this.group.children) {
            child.rotation.y = timer;
        }
    }
};
ClearcoatExample = __decorate([
    Register
], ClearcoatExample);
export { ClearcoatExample };
