import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
import { ioOptionSelect } from '@io-gui/menus';
import { ioNumberSlider } from '@io-gui/sliders';
import { ioNumber } from '@io-gui/inputs';
import { MenuOption } from '@io-gui/menus';
import { AnimationAction, AdditiveAnimationBlendMode, NormalAnimationBlendMode, LoopRepeat, LoopPingPong, LoopOnce } from 'three/webgpu';
registerEditorConfig(AnimationAction, [
    ['blendMode', ioOptionSelect({ selectBy: 'value', option: new MenuOption({ options: [
                    { value: AdditiveAnimationBlendMode, id: 'Additive' },
                    { value: NormalAnimationBlendMode, id: 'Normal' },
                ] }) })],
    ['loop', ioOptionSelect({ selectBy: 'value', option: new MenuOption({ options: [
                    { value: LoopRepeat, id: 'LoopRepeat' },
                    { value: LoopPingPong, id: 'LoopPingPong' },
                    { value: LoopOnce, id: 'LoopOnce' },
                ] }) })],
    //AnimationBlendMode
    ['weight', ioNumberSlider({ min: 0, max: 1, step: 0.01 })],
    ['repetitions', ioNumber({ min: 0, max: Infinity, step: 1 })],
]);
registerEditorGroups(AnimationAction, {
    'Advanced': ['zeroSlopeAtStart', 'zeroSlopeAtEnd', 'clampWhenFinished', 'blendMode', 'loop', 'repetitions', 'timeScale']
});
//# sourceMappingURL=ThreeEditorConfig.js.map