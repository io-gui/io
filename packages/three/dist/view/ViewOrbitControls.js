import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PerspectiveCamera } from 'three/webgpu';
/**
 * Temporary bridge until navigation behaviors land (plan Phase 3): OrbitControls drive the view's
 * private draw camera, and every change is written back into `view.navigation`.
 * Scene cameras are never handed to OrbitControls.
 */
export class ViewOrbitControls {
    viewport;
    _controls;
    constructor(viewport) {
        this.viewport = viewport;
        // Connect after construction: passing the element to the constructor makes connect() disconnect first,
        // which removes listeners that were never added.
        this._controls = new OrbitControls(new PerspectiveCamera());
        this._controls.connect(viewport);
        this._controls.addEventListener('start', this._onStart);
        this._controls.addEventListener('change', this._onChange);
        this.updateEnabled();
    }
    /** Call when the view changes: no orbiting while looking through a scene camera or in axis views. */
    updateEnabled() {
        const view = this.viewport.view;
        const lookingThrough = !!view?.getSourceCamera(this.viewport.scene);
        this._controls.enabled = !!view && !lookingThrough;
        this._controls.enableRotate = !!view && view.navigation.axisView === null;
    }
    _onStart = () => {
        this.updateEnabled();
        const camera = this.viewport.getViewCamera();
        this._controls.object = camera;
        this._controls.target.copy(this.viewport.view.navigation.target);
    };
    _onChange = () => {
        const view = this.viewport.view;
        const nav = view.navigation;
        const camera = this._controls.object;
        nav.target.copy(this._controls.target);
        nav.rotation.copy(camera.quaternion);
        if (camera.isOrthographicCamera) {
            // OrbitControls zooms orthographic cameras; fold the zoom into the view distance.
            nav.distance /= camera.zoom;
            camera.zoom = 1;
            camera.updateProjectionMatrix();
        }
        else {
            nav.distance = camera.position.distanceTo(this._controls.target);
        }
        view.markNavigationChanged();
    };
    dispose() {
        this._controls.removeEventListener('start', this._onStart);
        this._controls.removeEventListener('change', this._onChange);
        this._controls.dispose();
    }
}
