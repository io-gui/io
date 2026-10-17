import { Register, ReactiveObject, ReactiveObjectProps, Property } from '@io-gui/core'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

export type BloomProps = ReactiveObjectProps & {
  enabled?: boolean
  strength?: number
  radius?: number
  threshold?: number
}

/**
 * A document's bloom setting (ADR-0006): a glow around bright content, which views add to the pipeline's color after
 * anti-aliasing and before tone mapping. Views draw it when `enabled`, unless they override it (`View.bloom`).
 * The values are three's `BloomNode` inputs.
 */
@Register
export class Bloom extends ReactiveObject {

  @Property({type: Boolean, value: false})
  declare enabled: boolean

  /** How much glow is added. */
  @Property({type: Number, value: 1})
  declare strength: number

  /** How far the glow spreads, 0–1. */
  @Property({type: Number, value: 0})
  declare radius: number

  /** Luminance (linear, before tone mapping) above which content glows. */
  @Property({type: Number, value: 0})
  declare threshold: number

  constructor(args?: BloomProps) {
    super(args)
  }
}

registerEditorConfig(Bloom, [
  ['strength', ioNumberSlider({min: 0, max: 3, step: 0.01})],
  ['radius', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['threshold', ioNumberSlider({min: 0, max: 2, step: 0.01})],
])

registerEditorGroups(Bloom, {
  Main: ['enabled', 'strength', 'radius', 'threshold'],
})
