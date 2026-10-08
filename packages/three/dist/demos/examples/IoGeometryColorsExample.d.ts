import { ThreeEditor, IoThreeViewport, ThreeEditorProps } from '@io-gui/three';
export declare class GeometryColorsExample extends ThreeEditor {
    constructor(args: ThreeEditorProps);
}
export declare class IoGeometryColorsExample extends IoThreeViewport {
    editor: GeometryColorsExample;
}
export declare const ioGeometryColorsExample: (arg0: any) => import("@io-gui/core").VDOMElement;
