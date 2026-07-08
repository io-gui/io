import { test } from 'vitest'
import { constructElement, text } from './VDOM.js'
import { div } from '../elements/IoNative.js'
import { BENCH_OPTIONS } from '../testing.js'

test('VDOM', async ({ bench }) => {
  await bench('constructElement 500 nodes', () => {
    for (let i = 0; i < 500; i++) {
      constructElement({ tag: 'div', props: { class: `n${i}` } })
    }
  }).run(BENCH_OPTIONS)

  await bench('constructElement 500 mixed text and div nodes', () => {
    for (let i = 0; i < 250; i++) {
      constructElement(text(`text-${i}`))
      constructElement(div({ class: `n${i}` }))
    }
  }).run(BENCH_OPTIONS)
})
