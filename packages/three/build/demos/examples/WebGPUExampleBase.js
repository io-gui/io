import { OrthographicCamera, PerspectiveCamera, Scene } from 'three/build/three.webgpu.js';
export class WebGPUExampleBase {
    scene;
    camera;
    initialized = false;
    constructor() {
        this.scene = new Scene();
        this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    }
    onResized(width, height) {
        if (this.camera instanceof PerspectiveCamera) {
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }
        else if (this.camera instanceof OrthographicCamera) {
            const aspect = width / height;
            const frustumHeight = this.camera.top - this.camera.bottom;
            this.camera.left = -frustumHeight * aspect / 2;
            this.camera.right = frustumHeight * aspect / 2;
            this.camera.updateProjectionMatrix();
        }
    }
    init(renderer) {
        this.initialized = true;
    }
}
//# sourceMappingURL=WebGPUExampleBase.js.map