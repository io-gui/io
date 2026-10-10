var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { PerspectiveCamera, OrthographicCamera, Group, BufferGeometry, Float32BufferAttribute, MathUtils, Mesh, MeshBasicMaterial, Points, PointsMaterial, SphereGeometry } from 'three/webgpu';
import { Register } from '@io-gui/core';
import { ioNumberSlider } from '@io-gui/sliders';
import { registerEditorConfig, registerEditorGroups, ioObject } from '@io-gui/editors';
import { ThreeDocument } from '@io-gui/three';
const frustumSize = 600;
/**
 * A perspective and an orthographic scene camera on one rig, following an orbiting sphere while their
 * frustums change. Look through them in a camera view; the Document tab shows their projections. Plays when opened.
 */
let CameraExample = class CameraExample extends ThreeDocument {
    perspectiveCamera;
    orthographicCamera;
    cameraRig;
    mesh;
    constructor(args) {
        super({ autoplay: true, ...args });
        this.perspectiveCamera = new PerspectiveCamera(50, 0.5, 150, 1000);
        this.perspectiveCamera.name = 'perspective';
        this.orthographicCamera = new OrthographicCamera(-1, 1, 1, -1, 150, 1000);
        this.orthographicCamera.name = 'orthographic';
        this.orthographicCamera.rotation.y = Math.PI;
        this.perspectiveCamera.rotation.y = Math.PI;
        this.cameraRig = new Group();
        this.cameraRig.name = 'CameraRig';
        this.cameraRig.add(this.perspectiveCamera);
        this.cameraRig.add(this.orthographicCamera);
        this.scene.add(this.cameraRig);
        //
        this.mesh = new Mesh(new SphereGeometry(100, 16, 8), new MeshBasicMaterial({ color: 0xffffff, wireframe: true }));
        this.mesh.name = 'Sphere';
        this.scene.add(this.mesh);
        const mesh2 = new Mesh(new SphereGeometry(50, 16, 8), new MeshBasicMaterial({ color: 0x00ff00, wireframe: true }));
        mesh2.name = 'Moon';
        mesh2.position.y = 150;
        this.mesh.add(mesh2);
        const mesh3 = new Mesh(new SphereGeometry(5, 16, 8), new MeshBasicMaterial({ color: 0x0000ff, wireframe: true }));
        mesh3.name = 'RigMarker';
        mesh3.position.z = 150;
        this.cameraRig.add(mesh3);
        const geometry = new BufferGeometry();
        const vertices = [];
        for (let i = 0; i < 10000; i++) {
            vertices.push(MathUtils.randFloatSpread(2000));
            vertices.push(MathUtils.randFloatSpread(2000));
            vertices.push(MathUtils.randFloatSpread(2000));
        }
        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        const particles = new Points(geometry, new PointsMaterial({ color: 0xffffff }));
        particles.name = 'Stars';
        this.scene.add(particles);
    }
    onAnimate() {
        const r = Date.now() * 0.0005;
        this.mesh.position.x = 700 * Math.cos(r);
        this.mesh.position.z = 700 * Math.sin(r);
        this.mesh.position.y = 700 * Math.sin(r);
        this.mesh.children[0].position.x = 70 * Math.cos(2 * r);
        this.mesh.children[0].position.z = 70 * Math.sin(r);
        this.perspectiveCamera.fov = 35 + 30 * Math.sin(0.5 * r);
        this.perspectiveCamera.far = this.mesh.position.length();
        this.perspectiveCamera.updateProjectionMatrix();
        const aspect = this.perspectiveCamera.aspect;
        this.orthographicCamera.left = -frustumSize * aspect / 2 * (Math.sin(0.5 * r) / 2 + 0.5);
        this.orthographicCamera.right = frustumSize * aspect / 2 * (Math.sin(0.5 * r) / 2 + 0.5);
        this.orthographicCamera.top = frustumSize / 2 * (Math.sin(0.5 * r) / 2 + 0.5);
        this.orthographicCamera.bottom = -frustumSize / 2 * (Math.sin(0.5 * r) / 2 + 0.5);
        this.orthographicCamera.far = this.mesh.position.length();
        this.orthographicCamera.updateProjectionMatrix();
        this.cameraRig.lookAt(this.mesh.position);
        debug: {
            this.dispatchMutation(this.perspectiveCamera);
            this.dispatchMutation(this.perspectiveCamera.matrixWorld.elements);
            this.dispatchMutation(this.perspectiveCamera.projectionMatrix.elements);
            this.dispatchMutation(this.perspectiveCamera.projectionMatrixInverse.elements);
            this.dispatchMutation(this.orthographicCamera);
            this.dispatchMutation(this.orthographicCamera.matrixWorld.elements);
            this.dispatchMutation(this.orthographicCamera.projectionMatrix.elements);
            this.dispatchMutation(this.orthographicCamera.projectionMatrixInverse.elements);
        }
    }
};
CameraExample = __decorate([
    Register
], CameraExample);
export { CameraExample };
const cameraObject = ioObject({ expanded: true, widget: null,
    properties: ['fov', 'far', 'aspect', 'left', 'right', 'top', 'bottom', 'matrixWorld', 'projectionMatrix'],
    config: [
        ['far', ioNumberSlider({ min: 700, max: 1000, step: 1 })],
        ['left', ioNumberSlider({ min: -500, max: 0, step: 0.1 })],
        ['right', ioNumberSlider({ min: 0, max: 500, step: 0.1 })],
        ['top', ioNumberSlider({ min: 0, max: 500, step: 0.1 })],
        ['bottom', ioNumberSlider({ min: -500, max: 0, step: 0.1 })],
        ['matrixWorld', ioObject({ expanded: true, label: 'matrixWorld', labeled: false, properties: ['elements'] })],
        ['projectionMatrix', ioObject({ expanded: true, label: 'projectionMatrix', labeled: false, properties: ['elements'] })],
    ],
    groups: {
        Main: ['fov', 'far', 'aspect', 'left', 'right', 'top', 'bottom', 'matrixWorld'],
    },
});
registerEditorConfig(CameraExample, [
    ['perspectiveCamera', cameraObject],
    ['orthographicCamera', cameraObject],
]);
registerEditorGroups(CameraExample, {
    Main: ['perspectiveCamera', 'orthographicCamera'],
});
