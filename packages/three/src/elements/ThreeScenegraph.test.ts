import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Storage, nextFrame } from '@io-gui/core'
import { IoString } from '@io-gui/inputs'
import { Group, Mesh, Object3D, PointLight, Scene } from 'three/webgpu'
import { ThreeScenegraph, ThreeScenegraphItem, Document, Editor, DISCLOSURE_LIMIT } from '@io-gui/three'

/** Lets the render scheduler hand over document changes, then the debounced render run. */
async function frames(count = 3) {
  for (let i = 0; i < count; i++) await nextFrame()
}

/** Waits frames until `condition` holds, at most `count` (the render scheduler hands over changes once per frame). */
async function until(condition: () => boolean, count = 30) {
  for (let i = 0; i < count && !condition(); i++) await nextFrame()
}

describe('ThreeScenegraph', () => {
  let scene: Scene
  let group: Group
  let mesh: Mesh
  let light: PointLight
  let content: Document
  let editor: Editor
  let element: ThreeScenegraph

  const rows = () => [...element.querySelectorAll('three-scenegraph-item')] as ThreeScenegraphItem[]
  const row = (label: string) => rows().find(row => row.label === label)!
  const labels = () => rows().map(row => row.label)
  const nameField = () => element.querySelector('io-string') as IoString | null
  const key = (target: HTMLElement, name: string) => {
    target.dispatchEvent(new KeyboardEvent('keydown', {key: name, bubbles: true, cancelable: true}))
  }
  const pressExpander = (target: ThreeScenegraphItem) => {
    target.setPointerCapture = () => {}
    target.releasePointerCapture = () => {}
    target.querySelector('.expander')!.dispatchEvent(new PointerEvent('pointerdown', {bubbles: true, pointerId: 1}))
    target.dispatchEvent(new PointerEvent('pointerup', {bubbles: true, pointerId: 1}))
    target.click()
  }

  beforeEach(() => {
    scene = new Scene()
    group = new Group()
    group.name = 'Group A'
    mesh = new Mesh()
    light = new PointLight()
    light.name = 'Lamp'
    group.add(mesh)
    scene.add(group, light)
    content = new Document({scene})
    editor = new Editor({document: content})
    element = new ThreeScenegraph({editor})
    document.body.appendChild(element)
  })

  afterEach(() => {
    element.remove()
    element.dispose()
    editor.dispose()
    content.dispose()
  })

  it('shows the whole tree expanded, objects named or by class, with type icons', () => {
    expect(labels()).toEqual(['<Scene>', 'Group A', '<Mesh>', 'Lamp'])
    expect(rows().map(row => row.icon)).toEqual(['three:scene', 'three:group', 'three:mesh', 'three:point_light'])
    expect(rows().map(row => row.depth)).toEqual([0, 1, 2, 1])
    expect(rows().map(row => row.expanded)).toEqual([true, true, false, false])
    expect(rows().map(row => row.getAttribute('aria-expanded'))).toEqual(['true', 'true', null, null])
    expect(rows().map(row => row.getAttribute('aria-level'))).toEqual(['1', '2', '3', '2'])
    expect(row('Lamp').querySelector('.expander')!.localName).toBe('span')
  })

  it('collapses from the triangle, keeping collapsed objects by uuid', () => {
    pressExpander(row('Group A'))
    expect(labels()).toEqual(['<Scene>', 'Group A', 'Lamp'])
    expect(element.disclosure).toEqual({[group.uuid]: false})
    expect(editor.selection.size).toBe(0)

    element.setExpanded(scene, false)
    expect(labels()).toEqual(['<Scene>'])
    expect(element.disclosure).toEqual({[group.uuid]: false, [scene.uuid]: false})

    element.setExpanded(scene, true)
    element.setExpanded(group, true)
    expect(element.disclosure).toEqual({})
  })

  it('drops the oldest disclosure entries past the limit', () => {
    const objects = Array.from({length: DISCLOSURE_LIMIT + 1}, () => new Group())
    for (const object of objects) element.setExpanded(object, false)
    expect(Object.keys(element.disclosure).length).toBe(DISCLOSURE_LIMIT)
    expect(element.disclosure[objects[0].uuid]).toBeUndefined()
    // Collapsing an object again makes its entry the newest.
    element.setExpanded(objects[1], true)
    element.setExpanded(objects[1], false)
    element.setExpanded(new Group(), false)
    expect(element.disclosure[objects[1].uuid]).toBe(false)
    expect(element.disclosure[objects[2].uuid]).toBeUndefined()
  })

  it('persists disclosure in localStorage through a Storage binding', async () => {
    const storageKey = 'test-three-scenegraph-disclosure'
    const permitted = localStorage.getItem('Storage:user-permitted')
    localStorage.setItem('Storage:user-permitted', 'true')
    const disclosure = Storage<Record<string, boolean>>({key: storageKey, storage: 'local', value: {}})
    const persisted = new ThreeScenegraph({editor, disclosure})
    document.body.appendChild(persisted)

    persisted.setExpanded(group, false)
    expect(JSON.parse(localStorage.getItem('Storage:' + storageKey)!)).toEqual({[group.uuid]: false})
    // Another scene graph bound to the same key shows the same state.
    const other = new ThreeScenegraph({editor, disclosure: Storage<Record<string, boolean>>({key: storageKey, storage: 'local', value: {}})})
    expect(other.isExpanded(group)).toBe(false)

    persisted.remove()
    persisted.dispose()
    other.dispose()
    disclosure.dispose()
    if (permitted === null) localStorage.removeItem('Storage:user-permitted')
    else localStorage.setItem('Storage:user-permitted', permitted)
    await frames(1)
  })

  it('highlights the selection, the active object strongest', async () => {
    editor.selection.set([group.uuid, light.uuid], light.uuid)
    await frames(1)
    expect(rows().map(row => row.selected)).toEqual([false, true, false, true])
    expect(rows().map(row => row.active)).toEqual([false, false, false, true])
    expect(row('Lamp').hasAttribute('active')).toBe(true)
    editor.selection.clear()
    await frames(1)
    expect(rows().some(row => row.selected || row.active)).toBe(false)
  })

  it('selects on click like a viewport click: Shift toggles, Ctrl removes', () => {
    row('Group A').click()
    expect(editor.selection.ids()).toEqual([group.uuid])
    expect(editor.selection.active).toBe(group.uuid)
    row('Lamp').dispatchEvent(new MouseEvent('click', {bubbles: true, shiftKey: true}))
    expect(editor.selection.ids()).toEqual([group.uuid, light.uuid])
    expect(editor.selection.active).toBe(light.uuid)
    row('Group A').dispatchEvent(new MouseEvent('click', {bubbles: true, ctrlKey: true}))
    expect(editor.selection.ids()).toEqual([light.uuid])
    row('<Scene>').click()
    expect(editor.selection.ids()).toEqual([scene.uuid])
  })

  it('reveals a new active object selected elsewhere: expands its ancestors', async () => {
    element.setExpanded(group, false)
    element.setExpanded(scene, false)
    expect(labels()).toEqual(['<Scene>'])
    editor.selection.set([mesh.uuid])
    expect(labels()).toEqual(['<Scene>', 'Group A', '<Mesh>', 'Lamp'])
    expect(element.disclosure).toEqual({})
    await frames(1)
    expect(row('<Mesh>').active).toBe(true)
    // Collapsing the parent of the still active object keeps it collapsed.
    element.setExpanded(group, false)
    editor.selection.set([mesh.uuid, light.uuid], mesh.uuid)
    await frames(1)
    expect(labels()).toEqual(['<Scene>', 'Group A', 'Lamp'])
  })

  it('scrolls the row of a new active object into view', async () => {
    const meshes = Array.from({length: 30}, (_, i) => Object.assign(new Mesh(), {name: `Mesh ${i}`}))
    scene.add(...meshes)
    content.notify({kind: 'structure'})
    element.style.height = '100px'
    await until(() => labels().includes('Mesh 29'))
    expect(element.scrollTop).toBe(0)
    editor.selection.set([meshes[29].uuid])
    await frames(1)
    const rect = row('Mesh 29').getBoundingClientRect()
    const view = element.getBoundingClientRect()
    expect(element.scrollTop).toBeGreaterThan(0)
    expect(rect.top).toBeGreaterThanOrEqual(view.top)
    expect(rect.bottom).toBeLessThanOrEqual(view.bottom)
  })

  it('scrolls a deep row horizontally to show its icon and label', async () => {
    let parent: Object3D = group
    const chain = Array.from({length: 20}, (_, i) => {
      const child = new Group()
      child.name = `Level ${i}`
      parent.add(child)
      parent = child
      return child
    })
    content.notify({kind: 'structure'})
    element.style.width = '200px'
    await until(() => labels().includes('Level 19'))
    expect(element.scrollWidth).toBeGreaterThan(element.clientWidth)
    editor.selection.set([chain[19].uuid])
    await frames(1)
    const target = row('Level 19')
    const icon = target.querySelector(':scope > io-icon:not(.expander)')!.getBoundingClientRect()
    const label = target.lastElementChild!.getBoundingClientRect()
    const view = element.getBoundingClientRect()
    expect(element.scrollLeft).toBeGreaterThan(0)
    expect(icon.left).toBeGreaterThanOrEqual(view.left)
    expect(label.right).toBeLessThanOrEqual(view.left + element.clientWidth)
  })

  it('moves between rows, collapses and expands with arrow keys', async () => {
    row('<Scene>').focus()
    key(row('<Scene>'), 'ArrowDown')
    expect(document.activeElement).toBe(row('Group A'))
    key(row('Group A'), 'ArrowLeft')
    expect(labels()).toEqual(['<Scene>', 'Group A', 'Lamp'])
    key(row('Group A'), 'ArrowLeft')
    expect(document.activeElement).toBe(row('<Scene>'))
    key(row('<Scene>'), 'ArrowDown')
    key(row('Group A'), 'ArrowRight')
    expect(labels()).toEqual(['<Scene>', 'Group A', '<Mesh>', 'Lamp'])
    key(row('Group A'), 'ArrowRight')
    expect(document.activeElement).toBe(row('<Mesh>'))
    key(row('<Mesh>'), 'End')
    expect(document.activeElement).toBe(row('Lamp'))
    key(row('Lamp'), 'Enter')
    expect(editor.selection.ids()).toEqual([light.uuid])
    await frames(1)
  })

  it('renames on double-click: Enter commits through object.rename and focuses the row', () => {
    row('Lamp').dispatchEvent(new MouseEvent('dblclick', {bubbles: true}))
    expect(element.renamingId).toBe(light.uuid)
    const field = nameField()!
    expect(field.textNode).toBe('Lamp')
    expect(document.activeElement).toBe(field)
    field.textNode = 'Key light'
    key(field, 'Enter')
    expect(light.name).toBe('Key light')
    expect(editor.operators.lastCommand).toEqual({name: 'object.rename', args: {id: light.uuid, name: 'Key light'}})
    expect(element.renamingId).toBe('')
    expect(nameField()).toBe(null)
    expect(labels()).toEqual(['<Scene>', 'Group A', '<Mesh>', 'Key light'])
    expect(document.activeElement).toBe(row('Key light'))
  })

  it('cancels a rename with Escape and commits one when the name field loses focus', () => {
    row('<Mesh>').focus()
    key(row('<Mesh>'), 'F2')
    const field = nameField()!
    expect(field.textNode).toBe('')
    expect(field.placeholder).toBe('Mesh')
    field.textNode = 'Crate'
    key(field, 'Escape')
    expect(mesh.name).toBe('')
    expect(editor.operators.lastCommand).toBe(null)
    expect(content.history.length).toBe(0)

    row('<Mesh>').dispatchEvent(new MouseEvent('dblclick', {bubbles: true}))
    nameField()!.textNode = 'Crate'
    nameField()!.blur()
    expect(mesh.name).toBe('Crate')
    expect(nameField()).toBe(null)
    expect(content.history.length).toBe(1)
  })

  it('does not rename on a double-click of the triangle', () => {
    pressExpander(row('Group A'))
    pressExpander(row('Group A'))
    row('Group A').dispatchEvent(new MouseEvent('dblclick', {bubbles: true}))
    expect(element.renamingId).toBe('')
    expect(labels()).toEqual(['<Scene>', 'Group A', '<Mesh>', 'Lamp'])
  })

  it('refreshes on structure changes reported outside transactions', async () => {
    const loaded = new Mesh()
    loaded.name = 'Loaded'
    scene.add(loaded)
    content.notify({kind: 'structure'})
    await until(() => labels().includes('Loaded'))
    expect(labels()).toEqual(['<Scene>', 'Group A', '<Mesh>', 'Lamp', 'Loaded'])
    expect(row('Loaded').icon).toBe('three:mesh')
  })

  it('refreshes on edits made in transactions: renames, inserts and removals', async () => {
    content.transact(transaction => {
      transaction.set(light, 'name', 'Key light')
      transaction.remove(group)
      transaction.insert(scene, new Group(), 0)
    })
    await until(() => labels().includes('Key light'))
    expect(labels()).toEqual(['<Scene>', '<Group>', 'Key light'])
  })

  it('follows the editor to another document and its selection', async () => {
    const otherScene = new Scene()
    otherScene.name = 'Other'
    const box = new Mesh()
    otherScene.add(box)
    const other = new Document({scene: otherScene})
    editor.document = other
    editor.selection.set([box.uuid])
    await until(() => rows().some(row => row.active))
    expect(labels()).toEqual(['Other', '<Mesh>'])
    expect(rows().map(row => row.active)).toEqual([false, true])
    editor.document = content
    other.dispose()
  })
})
