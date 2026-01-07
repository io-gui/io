import { registerEditorGroups, ioObject, registerEditorConfig } from '@io-gui/editors'
import { AudioAnalyser } from 'three/webgpu'

/**
 * AudioAnalyser - standalone class for analyzing audio data
 * Uses Web Audio API AnalyserNode
 */

registerEditorGroups(AudioAnalyser, {
  Main: ['analyser', 'data'],
})

registerEditorConfig(Object, [
  [AudioAnalyser, ioObject()],
])

