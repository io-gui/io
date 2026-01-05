import { registerEditorConfig, registerEditorGroups } from "@io-gui/editors"
import { ioOptionSelect, MenuOption } from "@io-gui/menus"
import {
  UniformsGroup,
  StaticDrawUsage,
  DynamicDrawUsage,
  StreamDrawUsage,
  StaticReadUsage,
  DynamicReadUsage,
  StreamReadUsage,
  StaticCopyUsage,
  DynamicCopyUsage,
  StreamCopyUsage,
} from "three/webgpu"

registerEditorConfig(UniformsGroup, [
  ['usage', ioOptionSelect({selectBy: 'value', option: new MenuOption({options: [
    {value: StaticDrawUsage, id: 'StaticDraw'},
    {value: DynamicDrawUsage, id: 'DynamicDraw'},
    {value: StreamDrawUsage, id: 'StreamDraw'},
    {value: StaticReadUsage, id: 'StaticRead'},
    {value: DynamicReadUsage, id: 'DynamicRead'},
    {value: StreamReadUsage, id: 'StreamRead'},
    {value: StaticCopyUsage, id: 'StaticCopy'},
    {value: DynamicCopyUsage, id: 'DynamicCopy'},
    {value: StreamCopyUsage, id: 'StreamCopy'},
  ]})})],
])

registerEditorGroups(UniformsGroup, {
  Main: ['uniforms'],
  Advanced: ['usage'],
})

