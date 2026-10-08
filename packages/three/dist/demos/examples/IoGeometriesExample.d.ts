import { MeshPhongMaterial, BufferGeometry } from 'three/webgpu';
import { ThreeEditor, IoThreeExample, ThreeEditorProps } from '@io-gui/three';
export declare class GeometriesExample extends ThreeEditor {
    geometries: BufferGeometry[];
    material: MeshPhongMaterial;
    constructor(args: ThreeEditorProps);
    onAnimate(delta: number, time: number): void;
}
export declare class IoGeometriesExample extends IoThreeExample {
    editor: GeometriesExample;
    ready(): void;
}
export declare const ioGeometriesExample: (arg0: any) => import("@io-gui/core").VDOMElement;
