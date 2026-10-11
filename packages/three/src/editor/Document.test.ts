import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { Document, Editor, Timeline, Transaction } from '@io-gui/three'
import { Color, Group, Mesh, MeshBasicMaterial, Object3D, Vector3, WebGPURenderer } from 'three/webgpu'

function snapshot(document: Document) {
  return JSON.stringify(document.scene.toJSON().object)
}

describe('Document transactions', () => {
  let document: Document
  let mesh: Mesh

  beforeEach(() => {
    document = new Document()
    mesh = new Mesh(undefined, new MeshBasicMaterial({color: 0xff0000}))
    mesh.name = 'mesh'
    document.scene.add(mesh)
    document.drainChanges()
  })

  afterEach(() => {
    document.dispose()
  })

  it('queues changes until drained', () => {
    expect(document.hasPendingChanges).toBe(false)
    document.notify({kind: 'transform'})
    document.notify({kind: 'time'})
    expect(document.hasPendingChanges).toBe(true)
    expect(document.drainChanges().map(change => change.kind)).toEqual(['transform', 'time'])
    expect(document.hasPendingChanges).toBe(false)
    expect(document.drainChanges()).toEqual([])
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
    expect(document.drainChanges().map(change => [change.kind, change.ids, change.source === document]))
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
    for (let i = 0; i < Document.CHANGE_LIMIT + 5; i++) document.notify({kind: 'transform'})
    expect(document.drainChanges().length).toBeLessThan(10)
    const editor = new Editor({document})
    document.notify({kind: 'transform'})
    editor.document = new Document()
    expect(document.hasPendingChanges).toBe(false)
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
    expect(document.drainChanges().map(change => change.kind)).toEqual(['settings'])
  })
})

describe('Document timeline', () => {
  let document: Document
  let calls: Array<[number, number]>

  beforeEach(() => {
    document = new Document()
    calls = []
    document.onAnimate = (delta: number, time: number) => { calls.push([delta, time]) }
  })

  afterEach(() => {
    document.dispose()
  })

  it('animates by the change of current time and reports only time', () => {
    document.timeline.currentTime = 2
    document.timeline.currentTime = 0.5
    expect(calls).toEqual([[2, 2], [-1.5, 0.5]])
    expect(document.drainChanges().map(change => change.kind)).toEqual(['time', 'time'])
  })

  it('does not animate for timeline settings', () => {
    document.timeline.setProperties({duration: 4, frameRate: 24, loop: false, autoplay: true})
    expect(calls).toEqual([])
    expect(document.hasPendingChanges).toBe(false)
  })

  it('animates when a shorter duration moves the playhead', () => {
    document.timeline.currentTime = 8
    document.timeline.duration = 5
    expect(calls).toEqual([[8, 8], [-3, 5]])
  })

  it('animates to the current time of a replacing timeline', () => {
    document.timeline.currentTime = 1
    document.timeline = new Timeline({currentTime: 3})
    expect(calls).toEqual([[1, 1], [2, 3]])
    document.timeline.currentTime = 4
    expect(calls[2]).toEqual([1, 4])
  })
})

describe('Editor', () => {
  it('reports changes with the active document as source', () => {
    const editor = new Editor()
    editor.notify({kind: 'transform', ids: ['x']})
    expect(editor.document.drainChanges()).toEqual([{kind: 'transform', ids: ['x'], source: editor.document}])
    editor.dispose()
  })

  it('keeps the active tool per view kind and mode', () => {
    const editor = new Editor()
    const tool = {id: 'move', label: 'Move', viewKinds: ['3d'] as const, modes: ['object'], createBehaviors: () => []}
    editor.tools.register(tool)
    editor.setActiveTool('3d', 'object', 'move')
    expect(editor.getActiveTool('3d')).toBe(tool)
    expect(editor.getActiveTool('3d', 'edit')).toBe(null)
    editor.setActiveTool('3d', 'object', null)
    expect(editor.getActiveTool('3d')).toBe(null)
    editor.dispose()
  })

  it('advances the document timeline and reports time only while playing', () => {
    const editor = new Editor()
    editor.tick({frame: 1, delta: 0.25, time: 0.25})
    expect(editor.document.timeline.currentTime).toBe(0)
    expect(editor.document.hasPendingChanges).toBe(false)
    editor.isPlaying = true
    editor.tick({frame: 2, delta: 0.25, time: 0.5})
    expect(editor.document.timeline.currentTime).toBe(0.25)
    expect(editor.document.drainChanges()).toEqual([{kind: 'time', source: editor.document}])
    editor.dispose()
  })

  it('ticks its own onAnimate on the scheduler clock, then the document on its timeline', () => {
    const editor = new Editor()
    const calls: string[] = []
    editor.onAnimate = (delta: number, time: number) => { calls.push(`editor ${delta} ${time}`) }
    editor.document.onAnimate = (delta: number, time: number) => { calls.push(`document ${delta} ${time}`) }
    editor.tick({frame: 1, delta: 0.25, time: 0.25})
    expect(calls).toEqual([])
    editor.isPlaying = true
    editor.tick({frame: 2, delta: 0.25, time: 5})
    expect(calls).toEqual(['editor 0.25 5', 'document 0.25 0.25'])
    editor.dispose()
  })

  it('pauses at the end of a timeline that does not loop, and plays it again from the start', () => {
    const document = new Document({timeline: new Timeline({duration: 1, loop: false})})
    const editor = new Editor({document})
    editor.isPlaying = true
    editor.tick({frame: 1, delta: 0.75, time: 0.75})
    editor.tick({frame: 2, delta: 0.5, time: 1.25})
    expect(document.timeline.currentTime).toBe(1)
    expect(editor.isPlaying).toBe(false)
    editor.isPlaying = true
    expect(document.timeline.currentTime).toBe(0)
    editor.dispose()
    document.dispose()
  })

  it('requestRender reports an other change', () => {
    const editor = new Editor()
    editor.requestRender()
    expect(editor.document.drainChanges()).toEqual([{kind: 'other', source: editor.document}])
    editor.dispose()
  })
})
