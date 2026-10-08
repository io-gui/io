import { ReactiveObject, ReactiveObjectProps } from '@io-gui/core';
import { Object3D, OrthographicCamera, PerspectiveCamera, Scene, ToneMapping } from 'three/webgpu';
import { AxisView, ViewNavigation, ViewNavigationData } from './ViewNavigation.js';
import type { InteractionProfile } from '../tools/Tool.js';
/** `3d` shows the content scene; `uv` shows the UV layout of the edit set in a 2D view of the 0–1 square. */
export type ViewKind = '3d' | 'uv';
/** Overlay ids switched on or off for one view; ids it does not name use the overlay's default. */
export type ViewOverlays = Record<string, boolean>;
export type ThreeViewProps = ReactiveObjectProps & {
    kind?: ViewKind;
    pipeline?: string;
    overlays?: ViewOverlays;
    xray?: boolean;
    toneMapping?: ToneMapping | null;
    toneMappingExposure?: number | null;
    profile?: InteractionProfile;
    overscan?: number;
    clearColor?: number;
    clearAlpha?: number;
};
export type ThreeViewData = {
    kind?: ViewKind;
    pipeline?: string;
    overlays?: ViewOverlays;
    xray?: boolean;
    toneMapping?: ToneMapping | null;
    toneMappingExposure?: number | null;
    profile?: InteractionProfile;
    overscan?: number;
    clearColor?: number;
    clearAlpha?: number;
    navigation?: Partial<ViewNavigationData>;
};
type ViewCamera = PerspectiveCamera | OrthographicCamera;
/**
 * State of one view (ADR-0002): navigation and display settings, independent of any element.
 * An IoThreeViewport shows it; the view survives the element being unmounted or moved.
 */
export declare class ThreeView extends ReactiveObject {
    kind: ViewKind;
    /** Registered pipeline id (ADR-0006). Empty uses the view kind's default: `forward` for 3d, `uv` for uv. */
    pipeline: string;
    /** Overlays switched on or off (`grid`, `selection`, `cameraFrame`, `gizmos`, ...). Replace the object, or use `setOverlay`. */
    overlays: ViewOverlays;
    /** Component picking sees through surfaces: hidden points, edges and faces can be picked too. */
    xray: boolean;
    /** Overrides the document's tone mapping in this view; `null` uses the pipeline's or the document's. */
    toneMapping: ToneMapping | null;
    /** Overrides the document's exposure in this view; `null` uses the document's. */
    toneMappingExposure: number | null;
    /** What the viewport's router installs: `full` (tool + navigation), `select`, `navigate`, `none`. */
    profile: InteractionProfile;
    /** Extra margin drawn around the framed area (1 = none). */
    overscan: number;
    clearColor: number;
    clearAlpha: number;
    readonly navigation: ViewNavigation;
    private readonly _perspective;
    private readonly _orthographic;
    private readonly _scenePerspective;
    private readonly _sceneOrthographic;
    /** Scene camera name `setCameraView` waits for (`''` = first scene camera); null when none is pending. */
    private _cameraSourceName;
    /** Last scene camera found for `navigation.cameraSource`; reused while it is still in the scene. */
    private _sourceCamera;
    /** A `cameraSource` uuid not found in the scene; not searched again until the current task ends. */
    private _missingSource;
    /** Session state: navigation per document uuid, so switching documents back restores the camera. */
    private readonly _navigationByDocument;
    private readonly _navigationListeners;
    constructor(args?: ThreeViewProps);
    /**
     * Call after changing `navigation` directly, so viewports showing this view redraw.
     * The methods below call it themselves.
     */
    markNavigationChanged(): void;
    /**
     * Calls `listener` on every navigation change. Navigation runs per pointer move, so it skips reactive
     * mutation: viewports redraw, but inspectors and bindings of the view are not woken.
     */
    addNavigationListener(listener: () => void): void;
    removeNavigationListener(listener: () => void): void;
    /** Looks through the view's own navigation: an orthographic axis view, or the default perspective view with `free`. */
    setAxisView(axis: AxisView): this;
    /**
     * Looks through a scene camera. `'uuid:<uuid>'` picks a camera by uuid, `'name:<name>'` by name; with no id
     * (or `null`) the first camera found in the scene is used. Names and the first camera resolve to a uuid once
     * a camera is in the scene, so a camera that is still loading is picked up when it is added; until then, or
     * when the scene has no camera, the view shows its own `free` perspective view. An id without a prefix warns
     * and uses the `free` view.
     */
    setCameraView(id?: string | null): this;
    frame(object: Object3D | readonly Object3D[], padding?: number): void;
    /** Shows the 0–1 UV square, looking down -Z (2D views). */
    frameUV(padding?: number): void;
    isOverlayEnabled(id: string, enabledByDefault?: boolean): boolean;
    setOverlay(id: string, enabled: boolean): void;
    /**
     * Stores the current navigation for `fromDocument` and restores the one saved for `toDocument`,
     * or starts unframed (the viewport then frames the new scene).
     */
    switchDocument(fromDocument: string | null, toDocument: string): void;
    /** The scene camera this view looks through, if it is set and present in `scene`. */
    getSourceCamera(scene: Scene | null): ViewCamera | null;
    private _resolveCameraSourceName;
    /**
     * The camera to draw and pick with at this size. Built from state every call; owned by the view.
     * Scene cameras are copied, never mutated (ADR-0005).
     */
    getCamera(width: number, height: number, scene: Scene | null): ViewCamera;
    /** World units covered by one CSS pixel at the target distance (at the scene's centre through a scene camera). */
    getWorldPerPixel(width: number, height: number, scene: Scene | null): number;
    private _fromSceneCamera;
    toJSON(): ThreeViewData;
    applyJSON(data: ThreeViewData): this;
}
export {};
