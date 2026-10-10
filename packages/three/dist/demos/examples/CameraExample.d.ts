import { PerspectiveCamera, OrthographicCamera, Group, Mesh } from 'three/webgpu';
import { ThreeDocument, ThreeDocumentProps } from '@io-gui/three';
/**
 * A perspective and an orthographic scene camera on one rig, following an orbiting sphere while their
 * frustums change. Look through them in a camera view; the Document tab shows their projections. Plays when opened.
 */
export declare class CameraExample extends ThreeDocument {
    perspectiveCamera: PerspectiveCamera;
    orthographicCamera: OrthographicCamera;
    cameraRig: Group;
    mesh: Mesh;
    constructor(args?: ThreeDocumentProps);
    onAnimate(): void;
}
