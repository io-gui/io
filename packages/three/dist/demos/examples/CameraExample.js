var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { PerspectiveCamera, OrthographicCamera, Group, BufferGeometry, CameraHelper, Float32BufferAttribute, MathUtils, Mesh, MeshBasicMaterial, Points, PointsMaterial, SphereGeometry } from 'three/webgpu';
import { Property, Register } from '@io-gui/core';
import { ioNumberSlider } from '@io-gui/sliders';
import { registerEditorConfig, registerEditorGroups, ioObject } from '@io-gui/editors';
import { Document, Timeline } from '@io-gui/three';
const frustumSize = 600;
/** Seconds in which the orbit and the frustum changes repeat: the timeline length, so looping is seamless. */
const ORBIT_PERIOD = 25;
/**
 * A perspective and an orthographic scene camera on one rig, following an orbiting sphere while their
 * frustums change, with a helper drawing each frustum. Look through them in a camera view (hide the helpers with
 * `showHelpers`); the Document tab shows their projections. Plays when opened.
 */
let CameraExample = class CameraExample extends Document {
    perspectiveCamera;
    orthographicCamera;
    cameraRig;
    mesh;
    helpers = new Group();
    perspectiveHelper;
    orthographicHelper;
    constructor(args) {
        super({ timeline: new Timeline({ autoplay: true, duration: ORBIT_PERIOD }), ...args });
        this.perspectiveCamera = new PerspectiveCamera(50, 0.5, 150, 1000);
        this.perspectiveCamera.name = 'perspective';
        this.orthographicCamera = new OrthographicCamera(-1, 1, 1, -1, 150, 1000);
        this.orthographicCamera.name = 'orthographic';
        this.perspectiveHelper = new CameraHelper(this.perspectiveCamera);
        this.perspectiveHelper.name = 'PerspectiveHelper';
        this.orthographicHelper = new CameraHelper(this.orthographicCamera);
        this.orthographicHelper.name = 'OrthographicHelper';
        this.helpers.name = 'Helpers';
        this.helpers.visible = this.showHelpers;
        this.helpers.userData.selectable = false;
        this.helpers.add(this.perspectiveHelper, this.orthographicHelper);
        this.orthographicCamera.rotation.y = Math.PI;
        this.perspectiveCamera.rotation.y = Math.PI;
        this.cameraRig = new Group();
        this.cameraRig.name = 'CameraRig';
        this.cameraRig.add(this.perspectiveCamera);
        this.cameraRig.add(this.orthographicCamera);
        this.scene.add(this.cameraRig);
        // After the rig, so the helpers follow the cameras' world matrices of the same frame.
        this.scene.add(this.helpers);
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
    showHelpersChanged() {
        this.helpers.visible = this.showHelpers;
    }
    onAnimate(delta, time) {
        const r = time / ORBIT_PERIOD * Math.PI * 4;
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
        this.perspectiveHelper.update();
        this.orthographicHelper.update();
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
__decorate([
    Property({ type: Boolean, value: true })
], CameraExample.prototype, "showHelpers", void 0);
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
    Main: ['showHelpers', 'perspectiveCamera', 'orthographicCamera'],
    Hidden: ['helpers', 'perspectiveHelper', 'orthographicHelper'],
});
