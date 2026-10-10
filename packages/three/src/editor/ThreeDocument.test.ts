import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ChangeBus, ThreeDocument, ThreeEditor, Transaction } from '@io-gui/three'
import { Color, Group, Mesh, MeshBasicMaterial, Object3D, Vector3, WebGPURenderer } from 'three/webgpu'

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
      tx.copy(mesh, 'position', new Vector3(1, 2, 3))
      tx.set(mesh.uuid, 'material.color', new Color(0x00ff00))
      tx.set(mesh, 'name', 'renamed')
    })
    expect(mesh.position.toArray()).toEqual([1, 2, 3])
    expect(mesh.material.color.getHex()).toBe(0x00ff00)
    expect(mesh.name).toBe('renamed')
    expect(document.changeBus.drain().map(change => [change.kind, change.ids, change.source === document]))
      .toEqual([['transform', [mesh.uuid], true], ['material', [mesh.uuid], true], ['other', [mesh.uuid], true]])
  })

  it('copies into the held instance with copy, snapshotting the values', () => {
    const position = mesh.position
    const value = new Vector3(4, 5, 6)
    const tx = document.transact(tx => (tx.copy(mesh, 'position', value), tx))
    value.set(9, 9, 9)
    expect(mesh.position).toBe(position)
    document.revert(tx)
    expect(mesh.position.toArray()).toEqual([0, 0, 0])
    document.reapply(tx)
    expect(mesh.position.toArray()).toEqual([4, 5, 6])
  })

  it('assigns with set and restores the same instances on revert; read-only properties throw', () => {
    const material = mesh.material
    const next = new MeshBasicMaterial({color: 0x0000ff})
    const tx = document.transact(tx => (tx.set(mesh, 'material', next), tx))
    expect(mesh.material).toBe(next)
    expect(material.color.getHex()).toBe(0xff0000)
    document.revert(tx)
    expect(mesh.material).toBe(material)
    expect(() => document.transact(tx => tx.set(mesh, 'position', new Vector3(1, 1, 1)))).toThrow(TypeError)
    expect(document.history.length).toBe(1)
  })

  it('keeps set and copy on one path in order', () => {
    const color = mesh.material.color
    const assigned = new Color(0x0000ff)
    const tx = document.transact(tx => {
      tx.set(mesh, 'material.color', assigned)
      tx.copy(mesh, 'material.color', new Color(0x00ff00))
      tx.set(mesh, 'material.color', new Color(0xffffff))
      return tx
    })
    expect(tx.patches.map(patch => patch.op)).toEqual(['set', 'copy', 'set'])
    document.revert(tx)
    expect(mesh.material.color).toBe(color)
    expect(assigned.getHex()).toBe(0x0000ff)
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
    tx.copy(mesh, 'position', new Vector3(1, 1, 1))
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

  it('bounds undrained changes, and drops them when the document is switched away', () => {
    for (let i = 0; i < ChangeBus.LIMIT + 5; i++) document.notify({kind: 'transform'})
    expect(document.changeBus.drain().length).toBeLessThan(10)
    const editor = new ThreeEditor({document})
    document.notify({kind: 'transform'})
    editor.document = new ThreeDocument()
    expect(document.changeBus.pending).toBe(false)
    editor.document.dispose()
    editor.dispose()
  })

  it('dispatches commit events for committed, non-empty transactions only', () => {
    const committed: Transaction[] = []
    document.addEventListener('commit', (event: CustomEvent<Transaction>) => committed.push(event.detail))
    document.transact(tx => tx.set(mesh, 'name', 'a'))
    document.transact(() => {})
    const rolled = document.begin()
    rolled.set(mesh, 'name', 'b')
    rolled.rollback()
    expect(committed.length).toBe(1)
  })

  it('runs onRendererInitialized once per renderer', () => {
    const calls: WebGPURenderer[] = []
    document.onRendererInitialized = renderer => { calls.push(renderer) }
    const first = {} as WebGPURenderer
    const second = {} as WebGPURenderer
    document._prepareRenderer(first)
    document._prepareRenderer(first)
    document._prepareRenderer(second)
    expect(calls.length).toBe(2)
    expect(calls[0]).toBe(first)
    expect(calls[1]).toBe(second)
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

  it('ticks the document onAnimate after the editor, only while playing', () => {
    const editor = new ThreeEditor()
    const calls: string[] = []
    editor.onAnimate = (delta: number, time: number) => { calls.push(`editor ${delta} ${time}`) }
    editor.document.onAnimate = (delta: number, time: number) => { calls.push(`document ${delta} ${time}`) }
    editor.tick({frame: 1, delta: 0.016, time: 0.016})
    expect(calls).toEqual([])
    editor.isPlaying = true
    editor.tick({frame: 2, delta: 0.016, time: 0.032})
    expect(calls).toEqual(['editor 0.016 0.032', 'document 0.016 0.032'])
    editor.dispose()
  })

  it('requestRender reports an other change', () => {
    const editor = new ThreeEditor()
    editor.requestRender()
    expect(editor.changeBus.drain()).toEqual([{kind: 'other', source: editor.document}])
    editor.dispose()
  })
})
