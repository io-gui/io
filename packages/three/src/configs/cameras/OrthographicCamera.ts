import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'
import { ioNumber } from '@io-gui/inputs'
import { OrthographicCamera } from 'three/webgpu'

registerEditorWidget(OrthographicCamera, ioPropertyEditor({
  properties: [
    'left',
    'right',
    'top',
    'bottom',
    // 'near',
    // 'far',
    // 'zoom',
  ],
  labelWidth: 'auto',
  orientation: 'horizontal',
}))

registerEditorConfig(OrthographicCamera, [
  ['left', ioNumber({min: -Infinity, max: Infinity, step: 0.01})],
  ['right', ioNumber({min: -Infinity, max: Infinity, step: 0.01})],
  ['top', ioNumber({min: -Infinity, max: Infinity, step: 0.01})],
  ['bottom', ioNumber({min: -Infinity, max: Infinity, step: 0.01})],
  ['zoom', ioNumberSlider({min: 0.01, max: 10, step: 0.01, exponent: 3})],
  ['near', ioNumber({min: 0.01, max: Infinity, step: 0.01})],
  ['far', ioNumber({min: 0.1, max: Infinity, step: 0.01})],
])

registerEditorGroups(OrthographicCamera, {
  Advanced: [
    'view'
  ],
  Hidden: [
    'left',
    'right',
    'top',
    'bottom',
    'near',
    'far',
    'zoom',
  ],
})

