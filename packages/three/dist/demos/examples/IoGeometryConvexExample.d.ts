import { Group } from 'three/webgpu';
import { ThreeEditor, IoThreeExample, ThreeEditorProps } from '@io-gui/three';
export declare class GeometryConvexExample extends ThreeEditor {
    group: Group;
    constructor(args: ThreeEditorProps);
    onAnimate(): void;
}
export declare class IoGeometryConvexExample extends IoThreeExample {
    editor: GeometryConvexExample;
    ready(): void;
}
export declare const ioGeometryConvexExample: (arg0: any) => import("@io-gui/core").VDOMElement;
