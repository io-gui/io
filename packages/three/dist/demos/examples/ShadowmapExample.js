var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ACESFilmicToneMapping, AmbientLight, CylinderGeometry, DirectionalLight, Fog, Group, Mesh, MeshPhongNodeMaterial, PerspectiveCamera, PlaneGeometry, SpotLight, TorusKnotGeometry } from 'three/webgpu';
import { mx_fractal_noise_float, mx_fractal_noise_vec3, positionLocal, positionWorld, Fn, color } from 'three/tsl';
import { Register } from '@io-gui/core';
import { Document, Timeline } from '@io-gui/three';
/**
 * Seconds in which the motion repeats: the timeline length, so looping is seamless. The knot turns at 0.25, 0.5 and
 * 1 rad/s and the light group at 0.7 rad/s, which all complete whole turns in 40π s.
 */
const PERIOD = 40 * Math.PI;
/**
 * Spot and directional light shadows: a noise-masked torus knot casting a cut-out shadow, four pillars, and a ground
 * whose received shadow position is jittered by noise. The source's camera is a scene camera: the 600-unit ground
 * dwarfs the knot in the views' first-show framing. Plays when opened.
 */
let ShadowmapExample = class ShadowmapExample extends Document {
    torusKnot;
    dirGroup;
    dirLight;
    constructor(args) {
        super({ toneMapping: ACESFilmicToneMapping, timeline: new Timeline({ autoplay: true, duration: PERIOD }), ...args });
        const camera = new PerspectiveCamera(45, 1, 1, 1000);
        camera.name = 'Camera';
        camera.position.set(0, 10, 20);
        camera.lookAt(0, 2, 0);
        this.scene.add(camera);
        this.scene.backgroundNode = color(0x222244);
        this.scene.fog = new Fog(0x222244, 50, 100);
        // lights
        const ambientLight = new AmbientLight(0x444444, 2);
        ambientLight.name = 'Ambient';
        this.scene.add(ambientLight);
        const spotLight = new SpotLight(0xff8888, 400);
        spotLight.name = 'Spot';
        spotLight.angle = Math.PI / 5;
        spotLight.penumbra = 0.3;
        spotLight.position.set(8, 10, 5);
        spotLight.castShadow = true;
        spotLight.shadow.camera.near = 8;
        spotLight.shadow.camera.far = 200;
        spotLight.shadow.mapSize.width = 2048;
        spotLight.shadow.mapSize.height = 2048;
        spotLight.shadow.radius = 4;
        this.scene.add(spotLight);
        this.dirLight = new DirectionalLight(0x8888ff, 3);
        this.dirLight.name = 'Directional';
        this.dirLight.position.set(3, 12, 17);
        this.dirLight.castShadow = true;
        this.dirLight.shadow.camera.near = 0.1;
        this.dirLight.shadow.camera.far = 500;
        this.dirLight.shadow.camera.right = 17;
        this.dirLight.shadow.camera.left = -17;
        this.dirLight.shadow.camera.top = 17;
        this.dirLight.shadow.camera.bottom = -17;
        this.dirLight.shadow.mapSize.width = 2048;
        this.dirLight.shadow.mapSize.height = 2048;
        this.dirLight.shadow.radius = 4;
        this.dirGroup = new Group();
        this.dirGroup.name = 'DirectionalGroup';
        this.dirGroup.add(this.dirLight);
        this.scene.add(this.dirGroup);
        // geometry
        const geometry = new TorusKnotGeometry(25, 8, 75, 80);
        const material = new MeshPhongNodeMaterial({
            color: 0x999999,
            shininess: 0,
            specular: 0x222222
        });
        const materialCustomShadow = material.clone();
        materialCustomShadow.transparent = true;
        const discardNode = mx_fractal_noise_float(positionLocal.mul(0.1)).x.greaterThan(0.0);
        materialCustomShadow.maskNode = discardNode;
        this.torusKnot = new Mesh(geometry, materialCustomShadow);
        this.torusKnot.name = 'TorusKnot';
        this.torusKnot.scale.multiplyScalar(1 / 18);
        this.torusKnot.position.y = 3;
        this.torusKnot.castShadow = true;
        this.torusKnot.receiveShadow = true;
        this.scene.add(this.torusKnot);
        const cylinderGeometry = new CylinderGeometry(0.75, 0.75, 7, 32);
        const pillar1 = new Mesh(cylinderGeometry, material);
        pillar1.name = 'Pillar 1';
        pillar1.position.set(8, 3.5, 8);
        pillar1.castShadow = true;
        const pillar2 = pillar1.clone();
        pillar2.name = 'Pillar 2';
        pillar2.position.set(8, 3.5, -8);
        const pillar3 = pillar1.clone();
        pillar3.name = 'Pillar 3';
        pillar3.position.set(-8, 3.5, 8);
        const pillar4 = pillar1.clone();
        pillar4.name = 'Pillar 4';
        pillar4.position.set(-8, 3.5, -8);
        this.scene.add(pillar1);
        this.scene.add(pillar2);
        this.scene.add(pillar3);
        this.scene.add(pillar4);
        const planeGeometry = new PlaneGeometry(200, 200);
        const planeMaterial = new MeshPhongNodeMaterial();
        planeMaterial.color.setHex(0x999999);
        planeMaterial.shininess = 0;
        planeMaterial.specular.setHex(0x111111);
        planeMaterial.receivedShadowPositionNode = Fn(() => {
            const pos = positionWorld.toVar();
            pos.xz.addAssign(mx_fractal_noise_vec3(positionWorld.mul(2)).saturate().xz);
            return pos;
        })();
        planeMaterial.colorNode = Fn(() => {
            const pos = positionWorld.toVar();
            pos.xz.addAssign(mx_fractal_noise_vec3(positionWorld.mul(2)).saturate().xz);
            return mx_fractal_noise_vec3(positionWorld.mul(2)).saturate().zzz.mul(0.2).add(.5);
        })();
        const ground = new Mesh(planeGeometry, planeMaterial);
        ground.name = 'Ground';
        ground.rotation.x = -Math.PI / 2;
        ground.scale.multiplyScalar(3);
        ground.castShadow = true;
        ground.receiveShadow = true;
        ground.userData.selectable = false;
        this.scene.add(ground);
        this.pose(0);
    }
    onAnimate(delta, time) {
        this.pose(time);
    }
    pose(time) {
        this.torusKnot.rotation.x = 0.25 * time;
        this.torusKnot.rotation.y = 0.5 * time;
        this.torusKnot.rotation.z = 1 * time;
        this.dirGroup.rotation.y = 0.7 * time;
        this.dirLight.position.z = 17 + Math.sin(time) * 5;
    }
};
ShadowmapExample = __decorate([
    Register
], ShadowmapExample);
export { ShadowmapExample };
