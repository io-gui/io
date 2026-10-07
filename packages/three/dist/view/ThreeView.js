var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveObject, Property } from '@io-gui/core';
import { Box3, OrthographicCamera, PerspectiveCamera, Vector3 } from 'three/webgpu';
import { ViewNavigation } from './ViewNavigation.js';
import { copyProjection } from '../utils/copyProjection.js';
const UV_BOX = new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 0));
/**
 * State of one view (ADR-0002): navigation and display settings, independent of any element.
 * An IoThreeViewport shows it; the view survives the element being unmounted or moved.
 */
let ThreeView = class ThreeView extends ReactiveObject {
    navigation = new ViewNavigation();
    _perspective = new PerspectiveCamera();
    _orthographic = new OrthographicCamera();
    _scenePerspective = new PerspectiveCamera();
    _sceneOrthographic = new OrthographicCamera();
    /** Session state: navigation per document uuid, so switching documents back restores the camera. */
    _navigationByDocument = new Map();
    constructor(args) {
        super(args);
    }
    /**
     * Call after changing `navigation` directly, so viewports showing this view redraw.
     * The methods below call it themselves.
     */
    markNavigationChanged() {
        this.dispatchMutation();
    }
    setAxisView(axis) {
        this.navigation.setAxisView(axis);
        this.markNavigationChanged();
    }
    /** Looks through a scene camera by `uuid`, or stops with `null`. */
    setCameraSource(uuid) {
        this.navigation.cameraSource = uuid;
        this.markNavigationChanged();
    }
    frame(object, padding = 1) {
        if (this.kind === 'uv')
            return this.frameUV();
        this.navigation.frame(object, padding);
        this.markNavigationChanged();
    }
    /** Shows the 0–1 UV square, looking down -Z (2D views). */
    frameUV(padding = 1.05) {
        if (this.navigation.axisView !== 'front')
            this.navigation.setAxisView('front');
        this.navigation.frameBox(UV_BOX, padding);
        this.markNavigationChanged();
    }
    isOverlayEnabled(id, enabledByDefault = true) {
        return this.overlays[id] ?? enabledByDefault;
    }
    setOverlay(id, enabled) {
        this.overlays = { ...this.overlays, [id]: enabled };
    }
    /**
     * Stores the current navigation for `fromDocument` and restores the one saved for `toDocument`,
     * or starts unframed (the viewport then frames the new scene).
     */
    switchDocument(fromDocument, toDocument) {
        if (fromDocument === toDocument)
            return;
        if (fromDocument)
            this._navigationByDocument.set(fromDocument, this.navigation.toJSON());
        const saved = this._navigationByDocument.get(toDocument);
        if (saved)
            this.navigation.applyJSON(saved);
        else
            this.navigation.copy(new ViewNavigation()).framed = false;
        this.markNavigationChanged();
    }
    /** The scene camera this view looks through, if it is set and present in `scene`. */
    getSourceCamera(scene) {
        const uuid = this.navigation.cameraSource;
        if (!uuid || !scene)
            return null;
        const camera = scene.getObjectByProperty('uuid', uuid);
        if (camera?.isPerspectiveCamera || camera?.isOrthographicCamera) {
            return camera;
        }
        return null;
    }
    /**
     * The camera to draw and pick with at this size. Built from state every call; owned by the view.
     * Scene cameras are copied, never mutated (ADR-0005).
     */
    getCamera(width, height, scene) {
        const aspect = width > 0 && height > 0 ? width / height : 1;
        const source = this.getSourceCamera(scene);
        if (source)
            return this._fromSceneCamera(source, aspect);
        const nav = this.navigation;
        let camera;
        if (nav.projection === 'perspective') {
            const perspective = this._perspective;
            // The navigation frames a square; widen the vertical fov when the viewport is taller than wide.
            perspective.fov = 2 * Math.atan(Math.tan(nav.fov * Math.PI / 360) * Math.max(1, 1 / aspect)) * 180 / Math.PI;
            perspective.aspect = aspect;
            perspective.near = nav.near;
            perspective.far = nav.far;
            perspective.zoom = 1 / this.overscan;
            camera = perspective;
        }
        else {
            const orthographic = this._orthographic;
            const half = nav.getHalfHeight() * this.overscan;
            const halfWidth = aspect >= 1 ? half * aspect : half;
            const halfHeight = aspect >= 1 ? half : half / aspect;
            orthographic.left = -halfWidth;
            orthographic.right = halfWidth;
            orthographic.top = halfHeight;
            orthographic.bottom = -halfHeight;
            // Orthographic depth does not shrink with distance; clip symmetrically around the eye.
            orthographic.near = -nav.far;
            orthographic.far = nav.far;
            orthographic.zoom = 1;
            camera = orthographic;
        }
        nav.getPosition(camera.position);
        camera.quaternion.copy(nav.rotation);
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();
        return camera;
    }
    /** World units covered by one CSS pixel at the target distance. */
    getWorldPerPixel(width, height, scene) {
        const camera = this.getCamera(width, height, scene);
        let visibleHeight;
        if (camera instanceof PerspectiveCamera) {
            visibleHeight = 2 * this.navigation.distance * Math.tan(camera.fov * Math.PI / 360) / camera.zoom;
        }
        else {
            visibleHeight = (camera.top - camera.bottom) / camera.zoom;
        }
        return height > 0 ? visibleHeight / height : 0;
    }
    _fromSceneCamera(source, aspect) {
        source.updateWorldMatrix(true, false);
        const camera = source.isPerspectiveCamera ? this._scenePerspective : this._sceneOrthographic;
        source.matrixWorld.decompose(camera.position, camera.quaternion, camera.scale);
        copyProjection(source, camera);
        if (camera instanceof PerspectiveCamera) {
            // Fit the source frame inside the viewport.
            const sourceAspect = source.aspect;
            camera.aspect = aspect;
            camera.fov = 2 * Math.atan(Math.tan(camera.fov * Math.PI / 360) * Math.max(1, sourceAspect / aspect)) * 180 / Math.PI;
            camera.zoom = source.zoom / this.overscan;
        }
        else {
            const frustumHeight = camera.top - camera.bottom;
            const frustumWidth = camera.right - camera.left;
            const centerX = (camera.left + camera.right) / 2;
            const centerY = (camera.top + camera.bottom) / 2;
            let halfWidth;
            let halfHeight;
            if (frustumWidth / frustumHeight > aspect) {
                halfWidth = frustumWidth / 2;
                halfHeight = frustumWidth / 2 / aspect;
            }
            else {
                halfHeight = frustumHeight / 2;
                halfWidth = frustumHeight / 2 * aspect;
            }
            camera.left = centerX - halfWidth * this.overscan;
            camera.right = centerX + halfWidth * this.overscan;
            camera.top = centerY + halfHeight * this.overscan;
            camera.bottom = centerY - halfHeight * this.overscan;
        }
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();
        return camera;
    }
    toJSON() {
        return {
            kind: this.kind,
            pipeline: this.pipeline,
            overlays: { ...this.overlays },
            profile: this.profile,
            overscan: this.overscan,
            clearColor: this.clearColor,
            clearAlpha: this.clearAlpha,
            navigation: this.navigation.toJSON(),
        };
    }
    applyJSON(data) {
        if (data.navigation)
            this.navigation.applyJSON(data.navigation);
        const props = {};
        if (data.kind !== undefined)
            props.kind = data.kind;
        if (data.pipeline !== undefined)
            props.pipeline = data.pipeline;
        if (data.overlays !== undefined)
            props.overlays = { ...data.overlays };
        if (data.profile !== undefined)
            props.profile = data.profile;
        if (data.overscan !== undefined)
            props.overscan = data.overscan;
        if (data.clearColor !== undefined)
            props.clearColor = data.clearColor;
        if (data.clearAlpha !== undefined)
            props.clearAlpha = data.clearAlpha;
        this.setProperties(props);
        this.markNavigationChanged();
        return this;
    }
};
__decorate([
    Property({ type: String, value: '3d' })
], ThreeView.prototype, "kind", void 0);
__decorate([
    Property({ type: String, value: '' })
], ThreeView.prototype, "pipeline", void 0);
__decorate([
    Property({ type: Object, init: null })
], ThreeView.prototype, "overlays", void 0);
__decorate([
    Property({ value: null })
], ThreeView.prototype, "toneMapping", void 0);
__decorate([
    Property({ value: null })
], ThreeView.prototype, "toneMappingExposure", void 0);
__decorate([
    Property({ type: String, value: 'full' })
], ThreeView.prototype, "profile", void 0);
__decorate([
    Property({ type: Number, value: 1.1 })
], ThreeView.prototype, "overscan", void 0);
__decorate([
    Property({ type: Number, value: 0x000000 })
], ThreeView.prototype, "clearColor", void 0);
__decorate([
    Property({ type: Number, value: 1 })
], ThreeView.prototype, "clearAlpha", void 0);
ThreeView = __decorate([
    Register
], ThreeView);
export { ThreeView };
