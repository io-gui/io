import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
// import { ioNumber } from '@io-gui/inputs'
import { ioNumberSlider } from '@io-gui/sliders';
import { ioOptionSelect, MenuOption } from '@io-gui/menus';
import { WebGPURenderer, SRGBColorSpace, LinearSRGBColorSpace, NoToneMapping, LinearToneMapping, ReinhardToneMapping, CineonToneMapping, ACESFilmicToneMapping, AgXToneMapping, NeutralToneMapping, CustomToneMapping,
// BasicShadowMap,
// PCFShadowMap,
// PCFSoftShadowMap,
// VSMShadowMap,
 } from 'three/webgpu';
registerEditorConfig(WebGPURenderer, [
    ['toneMappingExposure', ioNumberSlider({ min: 0, max: 10, step: 0.01, exponent: 2 })],
    ['outputColorSpace', ioOptionSelect({ selectBy: 'value', option: new MenuOption({ options: [
                    { value: SRGBColorSpace, id: 'sRGB' },
                    { value: LinearSRGBColorSpace, id: 'Linear sRGB' },
                ] }) })],
    ['toneMapping', ioOptionSelect({ selectBy: 'value', option: new MenuOption({ options: [
                    { value: NoToneMapping, id: 'None' },
                    { value: LinearToneMapping, id: 'Linear' },
                    { value: ReinhardToneMapping, id: 'Reinhard' },
                    { value: CineonToneMapping, id: 'Cineon' },
                    { value: ACESFilmicToneMapping, id: 'ACES Filmic' },
                    { value: AgXToneMapping, id: 'AgX' },
                    { value: NeutralToneMapping, id: 'Neutral' },
                    { value: CustomToneMapping, id: 'Custom' },
                ] }) })],
]);
registerEditorGroups(WebGPURenderer, {
    Main: [
        'autoClear',
        'autoClearColor',
        'autoClearDepth',
        'autoClearStencil',
        'sortObjects',
        'transparent',
        'opaque',
    ],
    Output: [
        'outputColorSpace',
        'toneMapping',
        'toneMappingExposure',
    ],
    Buffers: [
        'alpha',
        'depth',
        'stencil',
        'logarithmicDepthBuffer',
    ],
    ShadowMap: [
        'shadowMap',
    ],
    Debug: [
        'debug',
        'info',
    ],
    Advanced: [
        'domElement',
        'samples',
        'xr',
        'library',
        'lighting',
        'contextNode',
        'highPrecision',
    ],
    Hidden: [
        'backend',
        'onDeviceLost',
        '_canvasTarget',
        '_inspector',
    ],
});
//# sourceMappingURL=WebGPURenderer.js.map