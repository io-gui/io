import { registerEditorConfig } from '@io-gui/editors';
import { ioOptionSelect, Menu } from '@io-gui/menus';
import { DepthTexture, NeverCompare, LessCompare, EqualCompare, LessEqualCompare, GreaterCompare, NotEqualCompare, GreaterEqualCompare, AlwaysCompare, } from 'three/webgpu';
registerEditorConfig(DepthTexture, [
    ['compareFunction', ioOptionSelect({ model: new Menu({ options: [
                    { value: null, id: 'None' },
                    { value: NeverCompare, id: 'Never' },
                    { value: LessCompare, id: 'Less' },
                    { value: EqualCompare, id: 'Equal' },
                    { value: LessEqualCompare, id: 'Less Equal' },
                    { value: GreaterCompare, id: 'Greater' },
                    { value: NotEqualCompare, id: 'Not Equal' },
                    { value: GreaterEqualCompare, id: 'Greater Equal' },
                    { value: AlwaysCompare, id: 'Always' },
                ] }) })],
]);
