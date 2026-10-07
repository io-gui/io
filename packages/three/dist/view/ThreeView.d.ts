import { ReactiveObject, ReactiveObjectProps } from '@io-gui/core';
import { Object3D, OrthographicCamera, PerspectiveCamera, Scene } from 'three/webgpu';
import { AxisView, ViewNavigation, ViewNavigationData } from './ViewNavigation.js';
export type ViewKind = '3d';
export type ThreeViewProps = ReactiveObjectProps & {
    kind?: ViewKind;
    overscan?: number;
    clearColor?: number;
    clearAlpha?: number;
};
export type ThreeViewData = {
    kind?: ViewKind;
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
    /** Extra margin drawn around the framed area (1 = none). */
    overscan: number;
    clearColor: number;
    clearAlpha: number;
    readonly navigation: ViewNavigation;
    private readonly _perspective;
    private readonly _orthographic;
    private readonly _scenePerspective;
    private readonly _sceneOrthographic;
    constructor(args?: ThreeViewProps);
    /**
     * Call after changing `navigation` directly, so viewports showing this view redraw.
     * The methods below call it themselves.
     */
    markNavigationChanged(): void;
    setAxisView(axis: AxisView | null): void;
    /** Looks through a scene camera by `uuid`, or stops with `null`. */
    setCameraSource(uuid: string | null): void;
    frame(object: Object3D, padding?: number): void;
    /** The scene camera this view looks through, if it is set and present in `scene`. */
    getSourceCamera(scene: Scene | null): ViewCamera | null;
    /**
     * The camera to draw and pick with at this size. Built from state every call; owned by the view.
     * Scene cameras are copied, never mutated (ADR-0005).
     */
    getCamera(width: number, height: number, scene: Scene | null): ViewCamera;
    /** World units covered by one CSS pixel at the target distance. */
    getWorldPerPixel(width: number, height: number, scene: Scene | null): number;
    private _fromSceneCamera;
    toJSON(): ThreeViewData;
    applyJSON(data: ThreeViewData): this;
}
export {};
