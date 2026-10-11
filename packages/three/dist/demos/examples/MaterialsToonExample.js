var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AmbientLight, Color, DataTexture, Group, Mesh, MeshBasicNodeMaterial, MeshToonNodeMaterial, PointLight, RedFormat, SphereGeometry, Vector3 } from 'three/webgpu';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { Register } from '@io-gui/core';
import { Document, Timeline } from '@io-gui/three';
/** Seconds in which the light's path repeats (its frequencies are whole multiples of 0.25 rad/s): the timeline length. */
const PERIOD = 8 * Math.PI;
/**
 * A cube of toon spheres: gradient map steps along x, diffuse brightness along z, energy along y, lit by an orbiting
 * point light. The source's toon outline post-processing is dropped (cosmetic; needs `document-pipeline`). Plays
 * when opened.
 */
let MaterialsToonExample = class MaterialsToonExample extends Document {
    particleLight;
    constructor(args) {
        super({ timeline: new Timeline({ autoplay: true, duration: PERIOD }), ...args });
        this.scene.background = new Color(0x444488);
        // Materials
        const cubeWidth = 400;
        const numberOfSpheresPerSide = 5;
        const sphereRadius = (cubeWidth / numberOfSpheresPerSide) * 0.8 * 0.5;
        const stepSize = 1.0 / numberOfSpheresPerSide;
        const geometry = new SphereGeometry(sphereRadius, 32, 16);
        const spheres = new Group();
        spheres.name = 'Spheres';
        this.scene.add(spheres);
        for (let alpha = 0, alphaIndex = 0; alpha <= 1.0; alpha += stepSize, alphaIndex++) {
            const colors = new Uint8Array(alphaIndex + 2);
            for (let c = 0; c <= colors.length; c++) {
                colors[c] = (c / colors.length) * 256;
            }
            const gradientMap = new DataTexture(colors, colors.length, 1, RedFormat);
            gradientMap.needsUpdate = true;
            for (let beta = 0, betaIndex = 0; beta <= 1.0; beta += stepSize, betaIndex++) {
                for (let gamma = 0, gammaIndex = 0; gamma <= 1.0; gamma += stepSize, gammaIndex++) {
                    // basic monochromatic energy preservation
                    const diffuseColor = new Color().setHSL(alpha, 0.5, gamma * 0.5 + 0.1).multiplyScalar(1 - beta * 0.2);
                    const material = new MeshToonNodeMaterial({
                        color: diffuseColor,
                        gradientMap: gradientMap
                    });
                    const mesh = new Mesh(geometry, material);
                    mesh.name = `Sphere ${alphaIndex}-${betaIndex}-${gammaIndex}`;
                    mesh.position.x = alpha * 400 - 200;
                    mesh.position.y = beta * 400 - 200;
                    mesh.position.z = gamma * 400 - 200;
                    spheres.add(mesh);
                }
            }
        }
        this.particleLight = new Mesh(new SphereGeometry(4, 8, 8), new MeshBasicNodeMaterial({ color: 0xffffff }));
        this.particleLight.name = 'ParticleLight';
        this.scene.add(this.particleLight);
        // Lights
        const ambientLight = new AmbientLight(0xc1c1c1, 3);
        ambientLight.name = 'Ambient';
        this.scene.add(ambientLight);
        const pointLight = new PointLight(0xffffff, 2, 800, 0);
        pointLight.name = 'Point';
        this.particleLight.add(pointLight);
        this.pose(0);
        void this.loadLabels();
    }
    onAnimate(delta, time) {
        this.pose(time);
    }
    pose(time) {
        const timer = time * 0.25;
        this.particleLight.position.x = Math.sin(timer * 7) * 300;
        this.particleLight.position.y = Math.cos(timer * 5) * 400;
        this.particleLight.position.z = Math.cos(timer * 3) * 300;
    }
    async loadLabels() {
        const font = await new FontLoader().loadAsync('https://threejs.org/examples/fonts/gentilis_regular.typeface.json');
        const labels = new Group();
        labels.name = 'Labels';
        const addLabel = (name, location, font) => {
            const textGeo = new TextGeometry(name, {
                font: font,
                size: 20,
                depth: 1,
                curveSegments: 1
            });
            const textMaterial = new MeshBasicNodeMaterial();
            const textMesh = new Mesh(textGeo, textMaterial);
            textMesh.name = name;
            textMesh.position.copy(location);
            labels.add(textMesh);
        };
        addLabel('-gradientMap', new Vector3(-350, 0, 0), font);
        addLabel('+gradientMap', new Vector3(350, 0, 0), font);
        addLabel('-diffuse', new Vector3(0, 0, -300), font);
        addLabel('+diffuse', new Vector3(0, 0, 300), font);
        this.scene.add(labels);
        this.notify({ kind: 'structure' });
    }
};
MaterialsToonExample = __decorate([
    Register
], MaterialsToonExample);
export { MaterialsToonExample };
