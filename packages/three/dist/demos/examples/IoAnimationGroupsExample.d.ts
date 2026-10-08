import { AnimationMixer } from 'three/webgpu';
import { ThreeEditor, IoThreeExample, ThreeEditorProps } from '@io-gui/three';
export declare class AnimationGroupsExample extends ThreeEditor {
    mixer: AnimationMixer;
    constructor(args: ThreeEditorProps);
    onAnimate(delta: number): void;
}
export declare class IoAnimationGroupsExample extends IoThreeExample {
    editor: AnimationGroupsExample;
}
export declare const ioAnimationGroupsExample: (arg0: any) => import("@io-gui/core").VDOMElement;
