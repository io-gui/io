import { describe, it, expect } from 'vitest'
import { SelectionOutlineOverlay } from '@io-gui/three'
import { BoxGeometry, InstancedMesh, Mesh, Object3D, SphereGeometry } from 'three/webgpu'

type ProxyAccess = {_proxy(object: Object3D, isActive: boolean): Mesh | null}

describe('SelectionOutlineOverlay', () => {
  it('follows swapped geometry and instance counts of selected objects', () => {
    const overlay = new SelectionOutlineOverlay() as unknown as ProxyAccess
    const mesh = new Mesh(new BoxGeometry())
    const first = overlay._proxy(mesh, true)!
    expect(first.geometry).toBe(mesh.geometry)

    mesh.geometry = new SphereGeometry()
    const second = overlay._proxy(mesh, true)!
    expect(second).toBe(first)
    expect(second.geometry).toBe(mesh.geometry)

    const instanced = new InstancedMesh(new BoxGeometry(), undefined, 4)
    expect((overlay._proxy(instanced, false) as InstancedMesh).count).toBe(4)
    instanced.count = 2
    expect((overlay._proxy(instanced, false) as InstancedMesh).count).toBe(2)
    instanced.instanceMatrix = new InstancedMesh(undefined, undefined, 8).instanceMatrix
    expect((overlay._proxy(instanced, false) as InstancedMesh).instanceMatrix).toBe(instanced.instanceMatrix)
  })
})
