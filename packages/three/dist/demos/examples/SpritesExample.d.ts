import { Group, Texture } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/**
 * 200 sprites on a sphere in a turning group, each pulsing in size and spinning at its own rate through a
 * `userData`-driven rotation node, with range fog. Plays when opened.
 */
export declare class SpritesExample extends Document {
    group: Group;
    map: Texture;
    private imageWidth;
    private imageHeight;
    constructor(args?: DocumentProps);
    onAnimate(delta: number, time: number): void;
    private pose;
}
