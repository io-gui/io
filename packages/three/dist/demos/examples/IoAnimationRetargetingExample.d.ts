import { AnimationMixer, PerspectiveCamera, Group } from 'three/webgpu';
import { ThreeEditor, IoThreeExample, ThreeEditorProps } from '@io-gui/three';
export declare class AnimationRetargetingExample extends ThreeEditor {
    sourceMixer?: AnimationMixer;
    targetMixer?: AnimationMixer;
    camera: PerspectiveCamera;
    group: Group;
    constructor(args: ThreeEditorProps);
    private loadModels;
    private getSource;
    private retargetModel;
    onAnimate(delta: number): void;
}
export declare class IoAnimationRetargetingExample extends IoThreeExample {
    editor: AnimationRetargetingExample;
    ready(): void;
}
export declare const ioAnimationRetargetingExample: (arg0: any) => import("@io-gui/core").VDOMElement;
