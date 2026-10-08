import { describe, it, expect } from 'vitest'
import { SelectionOutlineOverlay, StateCage, StateColors } from '@io-gui/three'
import { BoxGeometry, Color, InstancedMesh, Mesh, Object3D, SphereGeometry } from 'three/webgpu'

type ProxyAccess = {_proxy(object: Object3D, isActive: boolean): Mesh | null}

describe('SelectionOutlineOverlay', () => {
  it('follows swapped geometry and instance counts of selected objects', () => {
    const overlay = new SelectionOutlineOverlay() as unknown as ProxyAccess
    const mesh: Mesh = new Mesh(new BoxGeometry())
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

describe('StateCage', () => {
  it('draws the state arrays it exposes', () => {
    const colors: StateColors = {normal: new Color(), normalAlpha: 1, selected: new Color(), selectedAlpha: 1}
    const cage = new StateCage(new Float32Array(9), new Float32Array(6), new Float32Array(3), {faces: colors, edges: colors, points: colors}, 4)
    expect(cage.faces!.geometry.getAttribute('state').array).toBe(cage.faceStates)
    expect(cage.edges.geometry.getAttribute('state').array).toBe(cage.edgeStates)
    expect([cage.faceStates!.length, cage.edgeStates.length, cage.pointStates.length, cage.points.count]).toEqual([3, 2, 1, 1])
    cage.dispose()
  })
})
