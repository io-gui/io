import { ThreeEditor, IoThreeExample, ThreeEditorProps } from '@io-gui/three';
export declare class VolumePerlinExample extends ThreeEditor {
    private thresholdUniform;
    private stepsUniform;
    threshold: number;
    steps: number;
    constructor(args: ThreeEditorProps);
    thresholdChanged(): void;
    stepsChanged(): void;
}
export declare class IoVolumePerlinExample extends IoThreeExample {
    editor: VolumePerlinExample;
    ready(): void;
}
export declare const ioVolumePerlinExample: (arg0: any) => import("@io-gui/core").VDOMElement;
