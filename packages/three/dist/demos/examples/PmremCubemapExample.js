var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ACESFilmicToneMapping, Group, Mesh, MeshPhysicalNodeMaterial, SphereGeometry } from 'three/webgpu';
import { normalWorldGeometry, uniform, pmremTexture } from 'three/tsl';
import { HDRCubeTextureLoader } from 'three/addons/loaders/HDRCubeTextureLoader.js';
import { Register } from '@io-gui/core';
import { Document } from '@io-gui/three';
/** A 6×5 grid of physical spheres (roughness across, metalness up) reflecting the Pisa HDR cube map, shown blurred behind them through `pmremTexture`. */
let PmremCubemapExample = class PmremCubemapExample extends Document {
    constructor(args) {
        super({ toneMapping: ACESFilmicToneMapping, ...args });
        new HDRCubeTextureLoader()
            .setPath('https://threejs.org/examples/textures/cube/pisaHDR/')
            .load(['px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr'], (map) => {
            this.scene.backgroundNode = pmremTexture(map, normalWorldGeometry, uniform(0.5));
            const geometry = new SphereGeometry(0.4, 64, 64);
            const spheres = new Group();
            spheres.name = 'Spheres';
            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 5; j++) {
                    const material = new MeshPhysicalNodeMaterial({
                        roughness: i / 5,
                        metalness: j / 4,
                        envMap: map
                    });
                    const mesh = new Mesh(geometry, material);
                    mesh.name = `Sphere ${i}-${j}`;
                    mesh.position.x = i - 2.5;
                    mesh.position.y = j - 2;
                    spheres.add(mesh);
                }
            }
            this.scene.add(spheres);
            this.notify({ kind: 'structure' });
            this.dispatch('frame-object', { object: spheres }, true);
        });
    }
};
PmremCubemapExample = __decorate([
    Register
], PmremCubemapExample);
export { PmremCubemapExample };
