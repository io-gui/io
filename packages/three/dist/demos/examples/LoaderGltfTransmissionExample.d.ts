import { AnimationMixer } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/**
 * The animated iridescent dish with olives (`KHR_materials_transmission`, volume, iridescence) in the Royal Esplanade
 * environment. The source's camera auto-rotation is dropped. Plays when opened.
 */
export declare class LoaderGltfTransmissionExample extends Document {
    mixer?: AnimationMixer;
    constructor(args?: DocumentProps);
    private load;
    onAnimate(delta: number): void;
}
