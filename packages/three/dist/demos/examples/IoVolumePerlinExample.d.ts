import { ThreeApplet, IoThreeExample, ThreeAppletProps } from '@io-gui/three';
export declare class VolumePerlinExample extends ThreeApplet {
    private thresholdUniform;
    private stepsUniform;
    threshold: number;
    steps: number;
    constructor(args: ThreeAppletProps);
    thresholdChanged(): void;
    stepsChanged(): void;
}
export declare class IoVolumePerlinExample extends IoThreeExample {
    applet: VolumePerlinExample;
    ready(): void;
}
export declare const ioVolumePerlinExample: (arg0: any) => import("@io-gui/core").VDOMElement;
