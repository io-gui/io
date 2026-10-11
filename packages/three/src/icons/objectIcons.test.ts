import { describe, it, expect } from 'vitest'
import * as THREE from 'three/webgpu'
import { IconsetSingleton } from '@io-gui/icons'
import { getObjectIcon, registerObjectIcon } from '@io-gui/three'

const objectClasses = Object.entries(THREE).filter(([, value]) => {
  return typeof value === 'function' && (value === THREE.Object3D || value.prototype instanceof THREE.Object3D)
}) as [string, typeof THREE.Object3D][]

/** An instance of `type` without running its constructor (some need arguments). */
function instanceOf(type: typeof THREE.Object3D): THREE.Object3D {
  return Object.create(type.prototype)
}

describe('objectIcons', () => {
  it('gives every Object3D class in three.js a registered three: icon', () => {
    expect(objectClasses.length).toBeGreaterThan(40)
    for (const [name, type] of objectClasses) {
      const icon = getObjectIcon(instanceOf(type))
      expect(icon.startsWith('three:'), name).toBe(true)
      expect(IconsetSingleton.hasIcon(icon), `${name} -> ${icon}`).toBe(true)
    }
  })

  it('maps the Material Symbols viewBox onto the icon box', () => {
    for (const [name, type] of objectClasses) {
      const svg = IconsetSingleton.getIcon(getObjectIcon(instanceOf(type)))
      expect(svg, name).toContain('transform="scale(0.025) translate(0 960)"')
    }
  })

  it('shows the nearest registered class of an object', () => {
    expect(getObjectIcon(new THREE.Mesh())).toBe('three:mesh')
    expect(getObjectIcon(instanceOf(THREE.SkinnedMesh))).toBe('three:skinned_mesh')
    expect(getObjectIcon(instanceOf(THREE.IESSpotLight))).toBe('three:spot_light')
    expect(getObjectIcon(instanceOf(THREE.QuadMesh))).toBe('three:mesh')
    expect(getObjectIcon(new THREE.OrthographicCamera())).toBe('three:camera')
    expect(getObjectIcon(new THREE.GridHelper())).toBe('three:grid_helper')
    class Player extends THREE.Group {}
    expect(getObjectIcon(new Player())).toBe('three:group')
  })

  it('lets apps register icons for their own classes', () => {
    class Character extends THREE.Group {}
    class Hero extends Character {}
    registerObjectIcon(Character, 'three:skinned_mesh')
    expect(getObjectIcon(new Hero())).toBe('three:skinned_mesh')
    expect(getObjectIcon(new THREE.Group())).toBe('three:group')
  })
})
