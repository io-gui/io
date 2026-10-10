import { ThreeDocument, ThreeDocumentProps } from '@io-gui/three';
export declare class VolumePerlinExample extends ThreeDocument {
    private thresholdUniform;
    private stepsUniform;
    threshold: number;
    steps: number;
    constructor(args?: ThreeDocumentProps);
    thresholdChanged(): void;
    stepsChanged(): void;
}
