import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { AmbientLight, Bone, CameraHelper, Color, Group, Mesh, OrthographicCamera, PerspectiveCamera, PointLight, PointLightHelper, SkeletonHelper, Skeleton, SkinnedMesh, BoxGeometry } from 'three/webgpu'
import { Editor, HelperOverlay, OUTLINE_COLORS, OverlayContext, View, cameraHelpers, lightHelpers, skeletonHelpers } from '@io-gui/three'

describe('HelperOverlay', () => {
  let editor: Editor
  let view: View

  function context(height = 100): OverlayContext {
    const camera = view.getCamera(100, height, editor.document.scene)
    camera.updateMatrixWorld()
    return {
      renderer: null!, editor, document: editor.document, scene: editor.document.scene, view, camera,
      selection: editor.selection, width: 100, height, pixelRatio: 1, reasons: new Set(), frame: {frame: 1, delta: 0, time: 0},
      pipeline: null!, output: null!,
    }
  }

  function prepare(overlay: HelperOverlay, height?: number) {
    editor.document.scene.updateMatrixWorld(true)
    overlay.prepare(context(height))
    overlay.root.updateMatrixWorld(true)
    return overlay.root.children
  }

  beforeEach(() => {
    editor = new Editor()
    view = new View()
  })

  afterEach(() => {
    view.dispose()
    editor.dispose()
  })

  it('draws a helper per shown camera, except the one the view looks through, and drops helpers of removed cameras', () => {
    const scene = editor.document.scene
    const a = new PerspectiveCamera()
    const b = new OrthographicCamera()
    const hidden = new Group()
    hidden.visible = false
    hidden.add(new PerspectiveCamera())
    scene.add(a, b, hidden)
    const overlay = new HelperOverlay('cameras', cameraHelpers)

    const helpers = prepare(overlay) as CameraHelper[]
    expect(helpers.map(helper => helper.camera)).toEqual([a, b])

    view.setCameraView(`uuid:${a.uuid}`)
    expect((prepare(overlay) as CameraHelper[]).map(helper => helper.camera)).toEqual([b])

    scene.remove(b)
    expect(prepare(overlay)).toEqual([])
    overlay.dispose()
  })

  it('draws positioned lights only, with point icons at a constant screen size', () => {
    const scene = editor.document.scene
    const point = new PointLight()
    scene.add(point, new AmbientLight())
    view.navigation.target.set(0, 0, 0)
    const overlay = new HelperOverlay('lights', lightHelpers)

    const [helper] = prepare(overlay) as PointLightHelper[]
    expect(overlay.root.children.length).toBe(1)
    expect(helper.light).toBe(point)
    const near = helper.matrixWorld.getMaxScaleOnAxis()
    // Twice as far from the view: twice as large in the world, the same size on screen.
    view.navigation.distance *= 2
    prepare(overlay)
    expect(helper.matrixWorld.getMaxScaleOnAxis()).toBeCloseTo(near * 2, 5)
    point.position.set(1, 2, 3)
    prepare(overlay)
    expect(helper.matrixWorld.elements.slice(12, 15)).toEqual([1, 2, 3])
    overlay.dispose()
  })

  it('draws a skeleton per root bone while its bones are shown, mesh or not, and rebuilds it when bones change', () => {
    const scene = editor.document.scene
    const root = new Bone()
    const child = new Bone()
    root.add(child)
    const mesh = new SkinnedMesh(new BoxGeometry())
    mesh.bind(new Skeleton([root, child]))
    mesh.visible = false
    scene.add(root, mesh)
    const overlay = new HelperOverlay('skeletons', skeletonHelpers)

    const [helper] = prepare(overlay) as SkeletonHelper[]
    expect(overlay.root.children.length).toBe(1)
    expect(helper.bones).toEqual([root, child])
    child.add(new Bone())
    const [rebuilt] = prepare(overlay) as SkeletonHelper[]
    expect(rebuilt).not.toBe(helper)
    expect(rebuilt.bones.length).toBe(3)
    root.visible = false
    expect(prepare(overlay)).toEqual([])
    overlay.dispose()
  })

  it('colors helpers of selected objects, and a skeleton when its skinned mesh is selected', () => {
    const scene = editor.document.scene
    const camera = new PerspectiveCamera()
    const root = new Bone()
    root.add(new Bone())
    const mesh = new SkinnedMesh(new BoxGeometry())
    mesh.bind(new Skeleton([root, root.children[0] as Bone]))
    const rig = new Group()
    rig.add(camera)
    scene.add(rig, root, mesh, new Mesh())
    const cameras = new HelperOverlay('cameras', cameraHelpers)
    const skeletons = new HelperOverlay('skeletons', skeletonHelpers)
    const firstColor = (helper: CameraHelper | SkeletonHelper) => helper.geometry.getAttribute('color').getX(0)

    const [cameraHelper] = prepare(cameras) as CameraHelper[]
    const [skeletonHelper] = prepare(skeletons) as SkeletonHelper[]
    const cameraColor = firstColor(cameraHelper)
    const boneColor = firstColor(skeletonHelper)

    // A selected ancestor selects the camera; the active object is drawn brighter.
    editor.selection.set([rig.uuid, mesh.uuid], mesh.uuid)
    prepare(cameras)
    prepare(skeletons)
    expect(firstColor(cameraHelper)).toBeCloseTo(new Color(OUTLINE_COLORS.selected).r, 5)
    expect(firstColor(skeletonHelper)).toBeCloseTo(new Color(OUTLINE_COLORS.active).r, 5)

    editor.selection.clear()
    prepare(cameras)
    prepare(skeletons)
    expect(firstColor(cameraHelper)).toBe(cameraColor)
    expect(firstColor(skeletonHelper)).toBe(boneColor)
    cameras.dispose()
    skeletons.dispose()
  })
})
