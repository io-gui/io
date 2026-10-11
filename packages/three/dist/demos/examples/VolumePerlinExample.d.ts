import { Document, DocumentProps } from '@io-gui/three';
export declare class VolumePerlinExample extends Document {
    private thresholdUniform;
    private stepsUniform;
    threshold: number;
    steps: number;
    constructor(args?: DocumentProps);
    thresholdChanged(): void;
    stepsChanged(): void;
}
