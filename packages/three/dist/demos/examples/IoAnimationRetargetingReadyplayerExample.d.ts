import { AnimationMixer } from 'three/webgpu';
import { ThreeEditor, IoThreeExample, ThreeEditorProps } from '@io-gui/three';
export declare class AnimationRetargetingReadyplayerExample extends ThreeEditor {
    sourceMixer: AnimationMixer;
    targetMixer: AnimationMixer;
    constructor(args: ThreeEditorProps);
    private loadModels;
    private getSource;
    private retargetModel;
    onAnimate(delta: number): void;
}
export declare class IoAnimationRetargetingReadyplayerExample extends IoThreeExample {
    editor: AnimationRetargetingReadyplayerExample;
}
export declare const ioAnimationRetargetingReadyplayerExample: (arg0: any) => import("@io-gui/core").VDOMElement;
