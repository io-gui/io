var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AmbientLight, BufferGeometry, Color, Float32BufferAttribute, Mesh, MeshBasicMaterial, MeshPhongNodeMaterial, Plane, PointLight, SphereGeometry, Vector3 } from 'three/webgpu';
import { abs, attribute, distance, float, max, modelWorldMatrixInverse, positionLocal, sin, uniform } from 'three/tsl';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { Register } from '@io-gui/core';
import { Document, Timeline } from '@io-gui/three';
/**
 * Seconds in which the motion repeats: the timeline length, so looping is seamless. The lights' frequencies (0.25,
 * 0.375 and 0.5 rad/s) are whole multiples of 0.125 rad/s, and the shards' pulse repeats every π s.
 */
const PERIOD = 16 * Math.PI;
/** Turns each triangle into a tetrahedron, with per-shard random time offset and seed, and its face normal to push it out along. */
function createGeometry(geometry) {
    const positionAttribute = geometry.getAttribute('position');
    const v0 = new Vector3();
    const v1 = new Vector3();
    const v2 = new Vector3();
    const v3 = new Vector3();
    const n = new Vector3();
    const plane = new Plane();
    const vertices = [];
    const times = [];
    const seeds = [];
    const displaceNormal = [];
    for (let i = 0; i < positionAttribute.count; i += 3) {
        v0.fromBufferAttribute(positionAttribute, i);
        v1.fromBufferAttribute(positionAttribute, i + 1);
        v2.fromBufferAttribute(positionAttribute, i + 2);
        plane.setFromCoplanarPoints(v0, v1, v2);
        v3.copy(v0).add(v1).add(v2).divideScalar(3); // compute center
        v3.add(n.copy(plane.normal).multiplyScalar(-1)); // displace center inwards
        // generate tetrahedron for each triangle
        vertices.push(v0.x, v0.y, v0.z, v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
        vertices.push(v3.x, v3.y, v3.z, v1.x, v1.y, v1.z, v0.x, v0.y, v0.z);
        vertices.push(v3.x, v3.y, v3.z, v2.x, v2.y, v2.z, v1.x, v1.y, v1.z);
        vertices.push(v3.x, v3.y, v3.z, v0.x, v0.y, v0.z, v2.x, v2.y, v2.z);
        const t = Math.random();
        const s = Math.random();
        n.copy(plane.normal);
        times.push(t, t, t);
        times.push(t, t, t);
        times.push(t, t, t);
        times.push(t, t, t);
        seeds.push(s, s, s);
        seeds.push(s, s, s);
        seeds.push(s, s, s);
        seeds.push(s, s, s);
        displaceNormal.push(n.x, n.y, n.z, n.x, n.y, n.z, n.x, n.y, n.z);
        displaceNormal.push(n.x, n.y, n.z, n.x, n.y, n.z, n.x, n.y, n.z);
        displaceNormal.push(n.x, n.y, n.z, n.x, n.y, n.z, n.x, n.y, n.z);
        displaceNormal.push(n.x, n.y, n.z, n.x, n.y, n.z, n.x, n.y, n.z);
    }
    const newGeometry = new BufferGeometry();
    newGeometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    newGeometry.setAttribute('time', new Float32BufferAttribute(times, 1));
    newGeometry.setAttribute('seed', new Float32BufferAttribute(seeds, 1));
    newGeometry.setAttribute('displaceNormal', new Float32BufferAttribute(displaceNormal, 3));
    newGeometry.computeVertexNormals();
    return newGeometry;
}
/**
 * Walt's head broken into pulsing tetrahedral shards that swell near two orbiting point lights (red, blue).
 * Plays when opened.
 */
let LightsPointlightsExample = class LightsPointlightsExample extends Document {
    light1;
    light2;
    constructor(args) {
        super({ timeline: new Timeline({ autoplay: true, duration: PERIOD }), ...args });
        this.scene.background = new Color(0x000000);
        const sphere = new SphereGeometry(0.5, 16, 8);
        // lights
        this.light1 = new PointLight(0xff0040, 2000);
        this.light1.name = 'Red';
        this.light1.add(new Mesh(sphere, new MeshBasicMaterial({ color: 0xff0040 })));
        this.scene.add(this.light1);
        this.light2 = new PointLight(0x0040ff, 2000);
        this.light2.name = 'Blue';
        this.light2.add(new Mesh(sphere, new MeshBasicMaterial({ color: 0x0040ff })));
        this.scene.add(this.light2);
        const ambientLight = new AmbientLight(0xaaaaaa, 0.1);
        ambientLight.name = 'Ambient';
        this.scene.add(ambientLight);
        this.pose(0);
        void this.loadModel();
    }
    createMaterial() {
        const material = new MeshPhongNodeMaterial();
        const seedAttribute = attribute('seed', 'float');
        const displaceNormalAttribute = attribute('displaceNormal', 'vec3');
        const localTime = attribute('time', 'float').add(this.timeline.timeNode);
        const effector1 = uniform(this.light1.position).toVar();
        const effector2 = uniform(this.light2.position).toVar();
        const distance1 = distance(positionLocal, modelWorldMatrixInverse.mul(effector1));
        const distance2 = distance(positionLocal, modelWorldMatrixInverse.mul(effector2));
        const invDistance1 = max(0.0, float(20.0).sub(distance1)).div(2.0);
        const invDistance2 = max(0.0, float(20.0).sub(distance2)).div(2.0);
        const s = abs(sin(localTime.mul(2).add(seedAttribute)).mul(0.5)).add(invDistance1).add(invDistance2);
        material.positionNode = positionLocal.add(displaceNormalAttribute.mul(s));
        return material;
    }
    async loadModel() {
        try {
            const obj = await new OBJLoader().loadAsync('https://threejs.org/examples/models/obj/walt/WaltHead.obj');
            const mesh = obj.children[0];
            mesh.name = 'WaltHead';
            mesh.geometry = createGeometry(mesh.geometry);
            mesh.material = this.createMaterial();
            mesh.scale.multiplyScalar(0.8);
            mesh.position.y = -30;
            this.scene.add(mesh);
            this.notify({ kind: 'structure' });
            this.dispatch('frame-object', { object: mesh }, true);
        }
        catch (e) {
            console.error(e);
        }
    }
    onAnimate(delta, time) {
        this.pose(time);
    }
    pose(elapsed) {
        const time = elapsed * 0.5;
        this.light1.position.x = Math.sin(time) * 20;
        this.light1.position.y = Math.cos(time * 0.75) * -30;
        this.light1.position.z = Math.cos(time * 0.5) * 20;
        this.light2.position.x = Math.cos(time * 0.5) * 20;
        this.light2.position.y = Math.sin(time * 0.75) * -30;
        this.light2.position.z = Math.sin(time) * 20;
    }
};
LightsPointlightsExample = __decorate([
    Register
], LightsPointlightsExample);
export { LightsPointlightsExample };
