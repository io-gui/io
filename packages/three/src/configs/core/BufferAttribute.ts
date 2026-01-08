import { ioObject, registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumber, ioSwitch } from '@io-gui/inputs'
import { ioOptionSelect, MenuOption } from '@io-gui/menus'
import {
  BufferAttribute,
  StaticDrawUsage,
  DynamicDrawUsage,
  StreamDrawUsage,
  StaticReadUsage,
  DynamicReadUsage,
  StreamReadUsage,
  StaticCopyUsage,
  DynamicCopyUsage,
  StreamCopyUsage,
  FloatType,
  IntType,
} from 'three/webgpu'

registerEditorConfig(Object, [
  [BufferAttribute, ioObject({labelWidth: '64px'})],
])

registerEditorConfig(BufferAttribute, [
  ['itemSize', ioNumber({min: 1, max: 16, step: 1})],
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
  ['gpuType', ioOptionSelect({selectBy: 'value', option: new MenuOption({options: [
    {value: FloatType, id: 'Float'},
    {value: IntType, id: 'Int'},
  ]})})],
  ['version', ioNumber({min: 0, max: Infinity, step: 1})],
  ['needsUpdate', ioSwitch({label: 'Needs Update', value: false})],
])

registerEditorGroups(BufferAttribute, {
  Main: [
    'name',
    'itemSize',
    'count',
    'normalized',
  ],
  Data: [
    'array',
    'updateRanges',
  ],
  GPU: [
    'usage',
    'gpuType',
    'version',
  ],
  Hidden: ['onUploadCallback'],
})

