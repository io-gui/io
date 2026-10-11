var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Mesh, MeshPhongNodeMaterial, PointLight, RepeatWrapping, SphereGeometry, TextureLoader } from 'three/webgpu';
import { color, fog, rangeFogFactor, checker, uv, mix, texture, lights, normalMap } from 'three/tsl';
import { TeapotGeometry } from 'three/addons/geometries/TeapotGeometry.js';
import { Register } from '@io-gui/core';
import { Document, Timeline } from '@io-gui/three';
/**
 * Seconds in which the light paths repeat: the timeline length, so looping is seamless. The source's light
 * frequencies (0.15, 0.25 and 0.35 rad/s) are whole multiples of 0.05 rad/s.
 */
const PERIOD = 40 * Math.PI;
/**
 * Three Phong teapots under four moving point lights: the left one lit only by the blue light (specular map), the
 * center one by all (normal map), the right one only by the white light (checker specular). Plays when opened.
 */
let LightsPhongExample = class LightsPhongExample extends Document {
    light1;
    light2;
    light3;
    light4;
    constructor(args) {
        super({ timeline: new Timeline({ autoplay: true, duration: PERIOD }), ...args });
        this.scene.fogNode = fog(color(0xFF00FF), rangeFogFactor(12, 30));
        const sphereGeometry = new SphereGeometry(0.1, 16, 8);
        // textures
        // Views draw on document changes only, so report each texture when it arrives.
        const onLoad = () => this.notify({ kind: 'material' });
        const textureLoader = new TextureLoader();
        const normalMapTexture = textureLoader.load('https://threejs.org/examples/textures/water/Water_1_M_Normal.jpg', onLoad);
        normalMapTexture.wrapS = RepeatWrapping;
        normalMapTexture.wrapT = RepeatWrapping;
        const alphaTexture = textureLoader.load('https://threejs.org/examples/textures/roughness_map.jpg', onLoad);
        alphaTexture.wrapS = RepeatWrapping;
        alphaTexture.wrapT = RepeatWrapping;
        // lights
        const addLight = (name, hexColor, power = 1700, distance = 100) => {
            const material = new MeshPhongNodeMaterial();
            material.colorNode = color(hexColor);
            material.lights = false;
            const mesh = new Mesh(sphereGeometry, material);
            const light = new PointLight(hexColor, 1, distance);
            light.name = name;
            light.power = power;
            light.add(mesh);
            this.scene.add(light);
            return light;
        };
        this.light1 = addLight('Blue', 0x0040ff);
        this.light2 = addLight('White', 0xffffff);
        this.light3 = addLight('Green', 0x80ff80);
        this.light4 = addLight('Orange', 0xffaa00);
        // light nodes ( selective lights )
        const blueLightsNode = lights([this.light1]);
        const whiteLightsNode = lights([this.light2]);
        // models
        const geometryTeapot = new TeapotGeometry(.8, 18);
        const leftMaterial = new MeshPhongNodeMaterial({ color: 0x555555 });
        leftMaterial.lightsNode = blueLightsNode;
        leftMaterial.specularNode = texture(alphaTexture);
        const leftObject = new Mesh(geometryTeapot, leftMaterial);
        leftObject.name = 'Left';
        leftObject.position.x = -3;
        this.scene.add(leftObject);
        const centerMaterial = new MeshPhongNodeMaterial({ color: 0x555555 });
        centerMaterial.normalNode = normalMap(texture(normalMapTexture));
        centerMaterial.shininess = 80;
        const centerObject = new Mesh(geometryTeapot, centerMaterial);
        centerObject.name = 'Center';
        this.scene.add(centerObject);
        const rightMaterial = new MeshPhongNodeMaterial({ color: 0x555555 });
        rightMaterial.lightsNode = whiteLightsNode;
        rightMaterial.specularNode = mix(color(0x0000FF), color(0xFF0000), checker(uv().mul(5)));
        rightMaterial.shininess = 90;
        const rightObject = new Mesh(geometryTeapot, rightMaterial);
        rightObject.name = 'Right';
        rightObject.position.x = 3;
        this.scene.add(rightObject);
        leftObject.rotation.y = centerObject.rotation.y = rightObject.rotation.y = Math.PI * -0.5;
        leftObject.position.y = centerObject.position.y = rightObject.position.y = -1;
        this.pose(0);
    }
    onAnimate(delta, time) {
        this.pose(time);
    }
    pose(time) {
        const lightTime = time * 0.5;
        this.light1.position.x = Math.sin(lightTime * 0.7) * 3;
        this.light1.position.y = Math.cos(lightTime * 0.5) * 4;
        this.light1.position.z = Math.cos(lightTime * 0.3) * 3;
        this.light2.position.x = Math.cos(lightTime * 0.3) * 3;
        this.light2.position.y = Math.sin(lightTime * 0.5) * 4;
        this.light2.position.z = Math.sin(lightTime * 0.7) * 3;
        this.light3.position.x = Math.sin(lightTime * 0.7) * 3;
        this.light3.position.y = Math.cos(lightTime * 0.3) * 4;
        this.light3.position.z = Math.sin(lightTime * 0.5) * 3;
        this.light4.position.x = Math.sin(lightTime * 0.3) * 3;
        this.light4.position.y = Math.cos(lightTime * 0.7) * 4;
        this.light4.position.z = Math.sin(lightTime * 0.5) * 3;
    }
};
LightsPhongExample = __decorate([
    Register
], LightsPhongExample);
export { LightsPhongExample };
