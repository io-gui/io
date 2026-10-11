var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BufferGeometry, Float32BufferAttribute, Line, LineBasicMaterial } from 'three/webgpu';
import { Register } from '@io-gui/core';
import { Document, Timeline } from '@io-gui/three';
/** Seconds in which the motion repeats (spin at 0.25 and 0.5 rad/s, morph at |sin(0.5 t)|): the timeline length. */
const PERIOD = 8 * Math.PI;
const segments = 10000;
const r = 800;
/** One line strip through 10,000 random, vertex-colored points, morphing toward a second random set. Spins with document time; plays when opened. */
let BuffergeometryLinesExample = class BuffergeometryLinesExample extends Document {
    line;
    constructor(args) {
        super({ timeline: new Timeline({ autoplay: true, duration: PERIOD }), ...args });
        const geometry = new BufferGeometry();
        const material = new LineBasicMaterial({ vertexColors: true });
        const positions = [];
        const colors = [];
        for (let i = 0; i < segments; i++) {
            const x = Math.random() * r - r / 2;
            const y = Math.random() * r - r / 2;
            const z = Math.random() * r - r / 2;
            // positions
            positions.push(x, y, z);
            // colors
            colors.push((x / r) + 0.5);
            colors.push((y / r) + 0.5);
            colors.push((z / r) + 0.5);
        }
        geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
        generateMorphTargets(geometry);
        geometry.computeBoundingSphere();
        this.line = new Line(geometry, material);
        this.line.name = 'Line';
        this.scene.add(this.line);
    }
    onAnimate(delta, time) {
        this.line.rotation.x = time * 0.25;
        this.line.rotation.y = time * 0.5;
        this.line.morphTargetInfluences[0] = Math.abs(Math.sin(time * 0.5));
    }
};
BuffergeometryLinesExample = __decorate([
    Register
], BuffergeometryLinesExample);
export { BuffergeometryLinesExample };
function generateMorphTargets(geometry) {
    const data = [];
    for (let i = 0; i < segments; i++) {
        const x = Math.random() * r - r / 2;
        const y = Math.random() * r - r / 2;
        const z = Math.random() * r - r / 2;
        data.push(x, y, z);
    }
    const morphTarget = new Float32BufferAttribute(data, 3);
    morphTarget.name = 'target1';
    geometry.morphAttributes.position = [morphTarget];
}
