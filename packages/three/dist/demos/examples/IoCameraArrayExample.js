var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AmbientLight, ArrayCamera, CylinderGeometry, DirectionalLight, Mesh, MeshPhongMaterial, PerspectiveCamera, PlaneGeometry, Vector4 } from 'three/webgpu';
import { Register, ReactiveProperty } from '@io-gui/core';
import { ThreeApplet, IoThreeViewport } from '@io-gui/three';
const AMOUNT = 6;
let CameraArrayExample = class CameraArrayExample extends ThreeApplet {
    arrayCamera;
    mesh;
    constructor(args) {
        super(args);
        const subCameras = [];
        for (let i = 0; i < AMOUNT * AMOUNT; i++) {
            const subCamera = new PerspectiveCamera(40, 1, 0.1, 10);
            subCamera.viewport = new Vector4();
            subCameras.push(subCamera);
        }
        this.arrayCamera = new ArrayCamera(subCameras);
        this.arrayCamera.name = 'arrayCamera';
        this.arrayCamera.position.z = 3;
        this.scene.add(this.arrayCamera);
        // Lighting
        this.scene.add(new AmbientLight(0x999999));
        const light = new DirectionalLight(0xffffff, 3);
        light.position.set(0.5, 0.5, 1);
        light.castShadow = true;
        light.shadow.bias = -0.001;
        light.shadow.camera.zoom = 4;
        this.scene.add(light);
        // Background plane
        const geometryBackground = new PlaneGeometry(100, 100);
        const materialBackground = new MeshPhongMaterial({ color: 0x000066 });
        const background = new Mesh(geometryBackground, materialBackground);
        background.receiveShadow = true;
        background.position.set(0, 0, -1);
        this.scene.add(background);
        // Cylinder
        const geometryCylinder = new CylinderGeometry(0.5, 0.5, 1, 32);
        const materialCylinder = new MeshPhongMaterial({ color: 0xff0000 });
        this.mesh = new Mesh(geometryCylinder, materialCylinder);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.scene.add(this.mesh);
    }
    onResized(width, height) {
        super.onResized(width, height);
        this.updateCameras(width, height);
    }
    updateCameras(width, height) {
        const aspectRatio = width / height;
        const cellWidth = width / AMOUNT;
        const cellHeight = height / AMOUNT;
        this.arrayCamera.aspect = aspectRatio;
        this.arrayCamera.updateProjectionMatrix();
        for (let y = 0; y < AMOUNT; y++) {
            for (let x = 0; x < AMOUNT; x++) {
                const subcamera = this.arrayCamera.cameras[AMOUNT * y + x];
                subcamera.copy(this.arrayCamera);
                subcamera.viewport?.set(Math.floor(x * cellWidth), Math.floor(y * cellHeight), Math.ceil(cellWidth), Math.ceil(cellHeight));
                subcamera.updateProjectionMatrix();
                subcamera.position.x = (x / AMOUNT) - 0.5;
                subcamera.position.y = 0.5 - (y / AMOUNT);
                subcamera.position.z = 1.5 + ((x + y) * 0.5);
                subcamera.position.multiplyScalar(2);
                subcamera.lookAt(0, 0, 0);
                subcamera.updateMatrixWorld();
            }
        }
    }
    onAnimate() {
        this.mesh.rotation.x += 0.005;
        this.mesh.rotation.z += 0.01;
    }
};
CameraArrayExample = __decorate([
    Register
], CameraArrayExample);
export { CameraArrayExample };
let IoCameraArrayExample = class IoCameraArrayExample extends IoThreeViewport {
};
__decorate([
    ReactiveProperty({ type: CameraArrayExample, init: { isPlaying: true } })
], IoCameraArrayExample.prototype, "applet", void 0);
IoCameraArrayExample = __decorate([
    Register
], IoCameraArrayExample);
export { IoCameraArrayExample };
export const ioCameraArrayExample = IoCameraArrayExample.vConstructor;
//# sourceMappingURL=IoCameraArrayExample.js.map