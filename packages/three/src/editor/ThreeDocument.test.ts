import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ThreeDocument, ThreeEditor, Transaction } from '@io-gui/three'
import { Color, Group, Mesh, MeshBasicMaterial, Object3D, Vector3 } from 'three/webgpu'

function snapshot(document: ThreeDocument) {
  return JSON.stringify(document.scene.toJSON().object)
}

describe('ThreeDocument transactions', () => {
  let document: ThreeDocument
  let mesh: Mesh

  beforeEach(() => {
    document = new ThreeDocument()
    mesh = new Mesh(undefined, new MeshBasicMaterial({color: 0xff0000}))
    mesh.name = 'mesh'
    document.scene.add(mesh)
    document.changeBus.drain()
  })

  afterEach(() => {
    document.dispose()
  })

  it('applies edits immediately and reports typed changes', () => {
    document.transact(tx => {
      tx.set(mesh, 'position', new Vector3(1, 2, 3))
      tx.set(mesh.uuid, 'material.color', new Color(0x00ff00))
      tx.set(mesh, 'name', 'renamed')
    })
    expect(mesh.position.toArray()).toEqual([1, 2, 3])
    expect(mesh.material.color.getHex()).toBe(0x00ff00)
    expect(mesh.name).toBe('renamed')
    expect(document.changeBus.drain().map(change => [change.kind, change.ids, change.source === document]))
      .toEqual([['transform', [mesh.uuid], true], ['material', [mesh.uuid], true], ['other', [mesh.uuid], true]])
  })

  it('copies math values into the existing instance', () => {
    const position = mesh.position
    document.transact(tx => tx.set(mesh, 'position', new Vector3(4, 5, 6)))
    expect(mesh.position).toBe(position)
  })

  it('coalesces repeated writes to one path into one patch', () => {
    const tx = document.begin('drag')
    for (let i = 1; i <= 100; i++) tx.set(mesh, 'position.x', i)
    tx.commit()
    expect(tx.patches).toEqual([{op: 'set', id: mesh.uuid, path: 'position.x', value: 100, oldValue: 0}])
    expect(document.history.at(-1)).toBe(tx)
  })

  it('restores the document exactly when a transaction is reverted, and redoes it', () => {
    const group = new Group()
    const before = snapshot(document)
    const tx = document.begin('edit')
    tx.set(mesh, 'position', new Vector3(1, 1, 1))
    tx.set(mesh, 'name', 'moved')
    tx.insert(document.scene, group, 0)
    tx.remove(mesh)
    tx.insert(group, mesh)
    tx.commit()
    expect(mesh.parent).toBe(group)
    const after = snapshot(document)

    document.revert(tx)
    expect(snapshot(document)).toBe(before)
    expect(mesh.parent).toBe(document.scene)

    document.reapply(tx)
    expect(snapshot(document)).toBe(after)
  })

  it('rolls back an open transaction and when the edit throws', () => {
    const tx = document.begin()
    tx.set(mesh, 'position.y', 7)
    tx.rollback()
    expect(mesh.position.y).toBe(0)
    expect(tx.state).toBe('rolledBack')
    expect(() => tx.set(mesh, 'position.y', 1)).toThrow()

    expect(() => document.transact(edit => {
      edit.set(mesh, 'visible', false)
      throw new Error('nope')
    })).toThrow('nope')
    expect(mesh.visible).toBe(true)
    expect(document.activeTransaction).toBe(null)
    expect(document.history.length).toBe(0)
  })

  it('joins an open transaction instead of nesting', () => {
    const outer = document.begin('outer')
    document.transact(tx => {
      expect(tx).toBe(outer)
      tx.set(mesh, 'name', 'inner')
    })
    expect(outer.state).toBe('open')
    outer.commit()
    expect(outer.patches.length).toBe(1)
  })

  it('finds objects added outside transactions and forgets removed ones', () => {
    const late = new Object3D()
    mesh.add(late)
    expect(document.getObject(late.uuid)).toBe(late)
    mesh.remove(late)
    expect(document.getObject(late.uuid)).toBe(undefined)
    expect(document.getObject(document.scene.uuid)).toBe(document.scene)
  })

  it('walks the scene once per task for an id that keeps missing', async () => {
    const gone = new Object3D()
    mesh.add(gone)
    expect(document.getObject(gone.uuid)).toBe(gone)
    mesh.remove(gone)
    const traverse = vi.spyOn(document.scene, 'traverse')
    for (let i = 0; i < 10; i++) expect(document.getObject(gone.uuid)).toBe(undefined)
    expect(traverse).toHaveBeenCalledTimes(1)

    await Promise.resolve()
    const back = new Object3D()
    back.uuid = gone.uuid
    mesh.add(back)
    expect(document.getObject(gone.uuid)).toBe(back)
    expect(traverse).toHaveBeenCalledTimes(2)
  })

  it('tells commit listeners about committed, non-empty transactions only', () => {
    const committed: Transaction[] = []
    document.addCommitListener(tx => committed.push(tx))
    document.transact(tx => tx.set(mesh, 'name', 'a'))
    document.transact(() => {})
    const rolled = document.begin()
    rolled.set(mesh, 'name', 'b')
    rolled.rollback()
    expect(committed.length).toBe(1)
  })

  it('reports render setting changes', () => {
    document.toneMappingExposure = 2
    expect(document.changeBus.drain().map(change => change.kind)).toEqual(['settings'])
  })
})

describe('ThreeEditor', () => {
  it('reports changes with the active document as source', () => {
    const editor = new ThreeEditor()
    editor.notify({kind: 'transform', ids: ['x']})
    expect(editor.changeBus).toBe(editor.document.changeBus)
    expect(editor.changeBus.drain()).toEqual([{kind: 'transform', ids: ['x'], source: editor.document}])
    editor.dispose()
  })

  it('keeps the active tool per view kind and mode', () => {
    const editor = new ThreeEditor()
    const tool = {id: 'move', label: 'Move', viewKinds: ['3d'] as const, modes: ['object'], createBehaviors: () => []}
    editor.tools.register(tool)
    editor.setActiveTool('3d', 'object', 'move')
    expect(editor.getActiveTool('3d')).toBe(tool)
    expect(editor.getActiveTool('3d', 'edit')).toBe(null)
    editor.setActiveTool('3d', 'object', null)
    expect(editor.getActiveTool('3d')).toBe(null)
    editor.dispose()
  })

  it('ticks onAnimate and reports time only while playing', () => {
    const editor = new ThreeEditor()
    const calls: number[] = []
    editor.onAnimate = (delta: number) => { calls.push(delta) }
    editor.tick({frame: 1, delta: 0.016, time: 0.016})
    expect(calls).toEqual([])
    expect(editor.changeBus.pending).toBe(false)
    editor.isPlaying = true
    editor.tick({frame: 2, delta: 0.016, time: 0.032})
    expect(calls).toEqual([0.016])
    expect(editor.changeBus.drain()).toEqual([{kind: 'time', source: editor.document}])
    editor.dispose()
  })

  it('requestRender reports an other change', () => {
    const editor = new ThreeEditor()
    editor.requestRender()
    expect(editor.changeBus.drain()).toEqual([{kind: 'other', source: editor.document}])
    editor.dispose()
  })
})
