import { ThreeEditor, IoThreeExample, ThreeEditorProps } from '@io-gui/three';
import { AnimationMixer, Group } from 'three/webgpu';
export declare class BackdropExample extends ThreeEditor {
    mixer: AnimationMixer;
    portals: Group;
    constructor(args: ThreeEditorProps);
    private loadModel;
    onAnimate(delta: number): void;
}
export declare class IoBackdropExample extends IoThreeExample {
    editor: BackdropExample;
}
export declare const ioBackdropExample: (arg0: any) => import("@io-gui/core").VDOMElement;
