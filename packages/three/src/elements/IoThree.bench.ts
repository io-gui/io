import { describe } from 'vitest'
import {
  benchFreshVsCached,
  benchInitialRender,
  warmElement,
} from '../../../core/src/testing/bench-render.js'
import { IoVector3, IoMatrix3, IoBuildGeometry } from '@io-gui/three'
import { Vector3, BoxGeometry } from 'three/webgpu'

describe('IoVector3', () => {
  const value = new Vector3(1, 2, 3)

  benchInitialRender('vector3', (mount) => {
    const el = new IoVector3({ value: new Vector3(1, 2, 3) })
    mount(el)
    el.changed()
    el.dispose()
  })

  const steadyVector = new IoVector3({ value })
  warmElement(steadyVector, () => steadyVector.changed())

  benchFreshVsCached({
    label: 'axis mutation',
    fresh: () => {
      value.x = value.x === 1 ? 1.1 : 1
      steadyVector.valueMutated()
    },
  })
})

describe('IoMatrix3', () => {
  const value = [1, 0, 0, 0, 1, 0, 0, 0, 1]

  benchInitialRender('matrix3', (mount) => {
    const el = new IoMatrix3({ value: [1, 0, 0, 0, 1, 0, 0, 0, 1] })
    mount(el)
    el.changed()
    el.dispose()
  })

  const steadyMatrix = new IoMatrix3({ value })
  warmElement(steadyMatrix, () => steadyMatrix.changed())

  benchFreshVsCached({
    label: 'cell mutation',
    fresh: () => {
      value[4] = value[4] === 1 ? 1.05 : 1
      steadyMatrix.valueMutated()
    },
  })
})

describe('IoBuildGeometry', () => {
  let geometry = new BoxGeometry(1, 1, 1)

  benchInitialRender('build geometry', (mount) => {
    const el = new IoBuildGeometry({ value: new BoxGeometry(1, 1, 1) })
    mount(el)
    el.changed()
    el.dispose()
  })

  const steadyGeometry = new IoBuildGeometry({ value: geometry })
  warmElement(steadyGeometry, () => steadyGeometry.changed())

  benchFreshVsCached({
    label: 'geometry reference change',
    fresh: () => {
      geometry = geometry.parameters.width === 1
        ? new BoxGeometry(2, 1, 1)
        : new BoxGeometry(1, 1, 1)
      steadyGeometry.value = geometry
      steadyGeometry.changed()
    },
  })
})
