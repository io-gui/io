var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AmbientLight, DodecahedronGeometry, Group, InstancedBufferAttribute, Mesh, MeshLambertMaterial, PointLight, PointsNodeMaterial, SRGBColorSpace, Sprite, TextureLoader, Vector3, DoubleSide } from 'three/webgpu';
import { instancedBufferAttribute, texture, float, color } from 'three/tsl';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { Register, ReactiveProperty } from '@io-gui/core';
import { ThreeApplet, IoThreeExample } from '@io-gui/three';
import { ioSplit, Split } from '@io-gui/layout';
import { ioThreeViewport } from '@io-gui/three';
let GeometryConvexExample = class GeometryConvexExample extends ThreeApplet {
    group;
    constructor(args) {
        super(args);
        // ambient light
        this.scene.add(new AmbientLight(0x666666));
        // point light
        const light = new PointLight(0xffffff, 3, 0, 0);
        light.position.set(15, 20, 30);
        this.scene.add(light);
        // textures
        const loader = new TextureLoader();
        const spriteTexture = loader.load('https://threejs.org/examples/textures/sprites/disc.png');
        spriteTexture.colorSpace = SRGBColorSpace;
        this.group = new Group();
        this.scene.add(this.group);
        // points
        let dodecahedronGeometry = new DodecahedronGeometry(10);
        // if normal and uv attributes are not removed, mergeVertices() can't consolidate identical vertices with different normal/uv data
        dodecahedronGeometry.deleteAttribute('normal');
        dodecahedronGeometry.deleteAttribute('uv');
        dodecahedronGeometry = BufferGeometryUtils.mergeVertices(dodecahedronGeometry);
        const vertices = [];
        const positionAttribute = dodecahedronGeometry.getAttribute('position');
        for (let i = 0; i < positionAttribute.count; i++) {
            const vertex = new Vector3();
            vertex.fromBufferAttribute(positionAttribute, i);
            vertices.push(vertex);
        }
        // Create instanced points using PointsNodeMaterial and Sprite
        const positions = [];
        for (const vertex of vertices) {
            positions.push(vertex.x, vertex.y, vertex.z);
        }
        const positionInstancedAttribute = new InstancedBufferAttribute(new Float32Array(positions), 3);
        const pointsMaterial = new PointsNodeMaterial({
            colorNode: color(0x0080ff).mul(texture(spriteTexture)),
            opacityNode: texture(spriteTexture).a,
            positionNode: instancedBufferAttribute(positionInstancedAttribute),
            sizeNode: float(10),
            sizeAttenuation: false,
            transparent: true,
            alphaTest: 0.5
        });
        const instancedPoints = new Sprite(pointsMaterial);
        instancedPoints.count = vertices.length;
        this.group.add(instancedPoints);
        // convex hull
        const meshMaterial = new MeshLambertMaterial({
            color: 0xffffff,
            opacity: 0.5,
            side: DoubleSide,
            transparent: true
        });
        const meshGeometry = new ConvexGeometry(vertices);
        const mesh = new Mesh(meshGeometry, meshMaterial);
        this.group.add(mesh);
    }
    onAnimate() {
        this.group.rotation.y += 0.005;
    }
};
GeometryConvexExample = __decorate([
    Register
], GeometryConvexExample);
export { GeometryConvexExample };
let IoGeometryConvexExample = class IoGeometryConvexExample extends IoThreeExample {
    ready() {
        this.render([
            ioSplit({
                elements: [
                    ioThreeViewport({ id: 'Top', applet: this.applet, cameraSelect: 'top' }),
                    ioThreeViewport({ id: 'Left', applet: this.applet, cameraSelect: 'left' }),
                    ioThreeViewport({ id: 'Front', applet: this.applet, cameraSelect: 'front' }),
                    ioThreeViewport({ id: 'Perspective', applet: this.applet, cameraSelect: 'perspective' }),
                ],
                split: new Split({
                    type: 'split',
                    orientation: 'vertical',
                    children: [
                        {
                            type: 'split',
                            flex: '1 1 60px',
                            orientation: 'horizontal',
                            children: [
                                { type: 'panel', flex: '1 1 60px', tabs: [{ id: 'Top' }] },
                                { type: 'panel', flex: '1 1 60px', tabs: [{ id: 'Left' }] }
                            ]
                        },
                        {
                            type: 'split',
                            flex: '1 1 60px',
                            orientation: 'horizontal',
                            children: [
                                { type: 'panel', flex: '1 1 60px', tabs: [{ id: 'Front' }] },
                                { type: 'panel', flex: '1 1 60px', tabs: [{ id: 'Perspective' }] },
                            ]
                        }
                    ]
                })
            })
        ]);
    }
};
__decorate([
    ReactiveProperty({ type: GeometryConvexExample, init: { isPlaying: true } })
], IoGeometryConvexExample.prototype, "applet", void 0);
IoGeometryConvexExample = __decorate([
    Register
], IoGeometryConvexExample);
export { IoGeometryConvexExample };
export const ioGeometryConvexExample = IoGeometryConvexExample.vConstructor;
//# sourceMappingURL=IoGeometryConvexExample.js.map