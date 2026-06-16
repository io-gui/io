import { describe } from 'vitest'
import { bench } from '../testing/bench.js'
import { constructElement, text } from './VDOM.js'
import { div } from '../elements/IoNative.js'

describe('VDOM', () => {
  bench('constructElement 500 nodes', () => {
    for (let i = 0; i < 500; i++) {
      constructElement({ tag: 'div', props: { class: `n${i}` } })
    }
  })

  bench('constructElement 500 mixed text and div nodes', () => {
    for (let i = 0; i < 250; i++) {
      constructElement(text(`text-${i}`))
      constructElement(div({ class: `n${i}` }))
    }
  })
})
