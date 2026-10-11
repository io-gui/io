import { PointLight } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/**
 * Three Phong teapots under four moving point lights: the left one lit only by the blue light (specular map), the
 * center one by all (normal map), the right one only by the white light (checker specular). Plays when opened.
 */
export declare class LightsPhongExample extends Document {
    light1: PointLight;
    light2: PointLight;
    light3: PointLight;
    light4: PointLight;
    constructor(args?: DocumentProps);
    onAnimate(delta: number, time: number): void;
    private pose;
}
