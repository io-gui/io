import type { IoThreeViewport } from '../elements/IoThreeViewport.js';
/**
 * Temporary bridge until navigation behaviors land (plan Phase 3): OrbitControls drive the view's
 * private draw camera, and every change is written back into `view.navigation`.
 * Scene cameras are never handed to OrbitControls.
 */
export declare class ViewOrbitControls {
    private readonly viewport;
    private readonly _controls;
    constructor(viewport: IoThreeViewport);
    /** Call when the view changes: no orbiting while looking through a scene camera or in axis views. */
    updateEnabled(): void;
    private _onStart;
    private _onChange;
    dispose(): void;
}
