import { ioObject, registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumber } from '@io-gui/inputs'
import { Clock } from 'three/webgpu'

registerEditorConfig(Clock, [
  ['startTime', ioNumber({min: 0, max: Infinity, step: 0.001})],
  ['oldTime', ioNumber({min: 0, max: Infinity, step: 0.001})],
  ['elapsedTime', ioNumber({min: 0, max: Infinity, step: 0.001})],
])

registerEditorGroups(Clock, {
  Main: [
    'autoStart',
    'running',
    'startTime',
    'oldTime',
    'elapsedTime',
  ],
})

registerEditorConfig(Object, [
  [Clock, ioObject()]
])

