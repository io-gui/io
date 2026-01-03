var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { PerspectiveCamera, OrthographicCamera, Group, BufferGeometry, Float32BufferAttribute, MathUtils, Mesh, MeshBasicMaterial, Points, PointsMaterial, SphereGeometry } from 'three/webgpu';
import { Register } from '@io-gui/core';
import { ThreeApplet } from '@io-gui/three';
const frustumSize = 600;
let CameraExample = class CameraExample extends ThreeApplet {
    perspectiveCamera;
    orthographicCamera;
    cameraRig;
    mesh;
    constructor() {
        super();
        this.perspectiveCamera = new PerspectiveCamera(50, 0.5, 150, 1000);
        this.perspectiveCamera.name = 'perspective';
        this.orthographicCamera = new OrthographicCamera(-1, 1, 1, -1, 150, 1000);
        this.orthographicCamera.name = 'orthographic';
        // counteract different front orientation of cameras vs rig
        this.orthographicCamera.rotation.y = Math.PI;
        this.perspectiveCamera.rotation.y = Math.PI;
        this.cameraRig = new Group();
        this.cameraRig.add(this.perspectiveCamera);
        this.cameraRig.add(this.orthographicCamera);
        this.scene.add(this.cameraRig);
        //
        this.mesh = new Mesh(new SphereGeometry(100, 16, 8), new MeshBasicMaterial({ color: 0xffffff, wireframe: true }));
        this.scene.add(this.mesh);
        const mesh2 = new Mesh(new SphereGeometry(50, 16, 8), new MeshBasicMaterial({ color: 0x00ff00, wireframe: true }));
        mesh2.position.y = 150;
        this.mesh.add(mesh2);
        const mesh3 = new Mesh(new SphereGeometry(5, 16, 8), new MeshBasicMaterial({ color: 0x0000ff, wireframe: true }));
        mesh3.position.z = 150;
        this.cameraRig.add(mesh3);
        //
        const geometry = new BufferGeometry();
        const vertices = [];
        for (let i = 0; i < 10000; i++) {
            vertices.push(MathUtils.randFloatSpread(2000)); // x
            vertices.push(MathUtils.randFloatSpread(2000)); // y
            vertices.push(MathUtils.randFloatSpread(2000)); // z
        }
        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        const particles = new Points(geometry, new PointsMaterial({ color: 0xffffff }));
        this.scene.add(particles);
    }
    onResized(width, height) {
        super.onResized(width, height);
        const aspect = width / height;
        this.perspectiveCamera.aspect = aspect;
        this.perspectiveCamera.updateProjectionMatrix();
        this.orthographicCamera.left = -frustumSize * aspect / 2;
        this.orthographicCamera.right = frustumSize * aspect / 2;
        this.orthographicCamera.top = frustumSize / 2;
        this.orthographicCamera.bottom = -frustumSize / 2;
        this.orthographicCamera.updateProjectionMatrix();
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
        this.orthographicCamera.far = this.mesh.position.length();
        this.orthographicCamera.updateProjectionMatrix();
        this.cameraRig.lookAt(this.mesh.position);
    }
};
CameraExample = __decorate([
    Register
], CameraExample);
export { CameraExample };
//# sourceMappingURL=camera.js.map