import { PointLight } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/**
 * Walt's head broken into pulsing tetrahedral shards that swell near two orbiting point lights (red, blue).
 * Plays when opened.
 */
export declare class LightsPointlightsExample extends Document {
    light1: PointLight;
    light2: PointLight;
    constructor(args?: DocumentProps);
    private createMaterial;
    private loadModel;
    onAnimate(delta: number, time: number): void;
    private pose;
}
