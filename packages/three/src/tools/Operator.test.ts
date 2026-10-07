import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { InputRouter, Operator, OperatorContext, OperatorHost, ThreeDocument, ThreeEditor, ThreeView, ViewInputEvent } from '@io-gui/three'
import { Mesh } from 'three/webgpu'

function createHost(): OperatorHost {
  const element = document.createElement('div') as unknown as OperatorHost
  const view = new ThreeView()
  Object.assign(element, {view, scene: null, getViewCamera: () => view.getCamera(200, 100, null)})
  Object.defineProperty(element, 'inputRouter', {value: new InputRouter(element)})
  element.style.cssText = 'position:fixed;left:0;top:0;width:200px;height:100px'
  document.body.appendChild(element)
  return element
}

/** Moves a mesh along x while the pointer moves; releases finish, right button cancels. */
class DragOperator implements Operator {
  constructor(readonly mesh: Mesh) {}
  invoke() { return 'running' as const }
  modal(ctx: OperatorContext, event: ViewInputEvent) {
    if (event.type === 'pointermove') ctx.transaction.set(this.mesh, 'position.x', this.mesh.position.x + event.dx)
    if (event.type === 'pointerdown' && event.button === 2) return 'cancelled' as const
    if (event.type === 'pointerup') return 'finished' as const
    return 'running' as const
  }
  exec() { return 'finished' as const }
}

describe('OperatorRegistry', () => {
  let editor: ThreeEditor
  let mesh: Mesh

  beforeEach(() => {
    editor = new ThreeEditor()
    mesh = new Mesh()
    editor.document.scene.add(mesh)
    editor.operators.register({id: 'object.rename', label: 'Rename', create: props => ({
      poll: ctx => !!ctx.document.getObject(props.id as string),
      exec: ctx => { ctx.transaction.set(props.id as string, 'name', props.name); return 'finished' },
    })})
    editor.operators.register({id: 'object.fail', create: () => ({
      exec: ctx => { ctx.transaction.set(mesh, 'name', 'temporary'); return 'cancelled' },
    })})
    editor.operators.register({id: 'object.drag', create: () => new DragOperator(mesh)})
  })

  afterEach(() => {
    editor.dispose()
  })

  it('commits a finished run as one transaction and records its command', () => {
    expect(editor.operators.run('object.rename', {id: mesh.uuid, name: 'renamed'})).toBe('finished')
    expect(mesh.name).toBe('renamed')
    expect(editor.document.history.length).toBe(1)
    expect(editor.document.history[0].label).toBe('Rename')
    expect(editor.operators.lastCommand).toEqual({name: 'object.rename', args: {id: mesh.uuid, name: 'renamed'}})
  })

  it('rolls back a cancelled run and skips runs whose poll fails', () => {
    expect(editor.operators.run('object.fail')).toBe('cancelled')
    expect(mesh.name).toBe('')
    expect(editor.operators.run('object.rename', {id: 'missing', name: 'x'})).toBe('cancelled')
    expect(editor.document.history.length).toBe(0)
    expect(editor.document.activeTransaction).toBe(null)
  })

  it('runs modal operators with every viewport event until they finish', () => {
    const host = createHost()
    const router = host.inputRouter
    expect(editor.operators.run('object.drag', {}, {host})).toBe('running')
    expect(router.isModal).toBe(true)
    // Plain moves, no button pressed, reach the modal operator.
    const init = {bubbles: true, cancelable: true, pointerId: 1, button: 0}
    host.dispatchEvent(new PointerEvent('pointermove', {...init, clientX: 10, clientY: 10}))
    host.dispatchEvent(new PointerEvent('pointermove', {...init, clientX: 15, clientY: 10}))
    host.dispatchEvent(new PointerEvent('pointermove', {...init, clientX: 22, clientY: 10}))
    expect(mesh.position.x).toBe(12)
    host.dispatchEvent(new PointerEvent('pointerup', {...init, clientX: 22, clientY: 10}))
    expect(router.isModal).toBe(false)
    expect(editor.operators.running).toBe(null)
    expect(editor.document.history.at(-1)!.patches).toEqual([{op: 'set', id: mesh.uuid, path: 'position.x', value: 12, oldValue: 0}])
    router.dispose()
    host.view.dispose()
    host.remove()
  })

  it('cancels a modal operator on Escape and rolls its edits back', () => {
    const host = createHost()
    editor.operators.run('object.drag', {}, {host})
    host.dispatchEvent(new PointerEvent('pointermove', {bubbles: true, pointerId: 1, clientX: 10, clientY: 10}))
    host.dispatchEvent(new PointerEvent('pointermove', {bubbles: true, pointerId: 1, clientX: 30, clientY: 10}))
    expect(mesh.position.x).toBe(20)
    host.dispatchEvent(new PointerEvent('pointerenter'))
    document.body.dispatchEvent(new KeyboardEvent('keydown', {code: 'Escape', bubbles: true}))
    expect(mesh.position.x).toBe(0)
    expect(host.inputRouter.isModal).toBe(false)
    expect(editor.document.history.length).toBe(0)
    host.dispatchEvent(new PointerEvent('pointerleave'))
    host.inputRouter.dispose()
    host.view.dispose()
    host.remove()
  })

  it('cancels a running operator when another starts or the document switches', () => {
    editor.operators.run('object.drag')
    expect(editor.operators.running).not.toBe(null)
    editor.operators.run('object.rename', {id: mesh.uuid, name: 'next'})
    expect(editor.operators.running).toBe(null)

    editor.operators.run('object.drag')
    const previous = editor.document
    editor.document = new ThreeDocument()
    expect(editor.operators.running).toBe(null)
    expect(previous.activeTransaction).toBe(null)
  })
})
