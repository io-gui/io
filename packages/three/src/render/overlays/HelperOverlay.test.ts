import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { AmbientLight, Bone, CameraHelper, ClippingGroup, Color, Data3DTexture, Group, LightProbe, Line, LineBasicMaterial, Matrix4, Mesh, OrthographicCamera, PerspectiveCamera, Plane, PointLight, PointLightHelper, SkeletonHelper, Skeleton, SkinnedMesh, BoxGeometry, Vector3 } from 'three/webgpu'
import type { LightProbeHelper } from 'three/addons/helpers/LightProbeHelperGPU.js'
import type { LightProbeGridHelper } from 'three/addons/helpers/LightProbeGridHelper.js'
import { LightProbeGrid } from 'three/addons/lighting/LightProbeGrid.js'
import { Editor, HelperOverlay, OUTLINE_COLORS, OverlayContext, View, cameraHelpers, clippingHelpers, lightHelpers, probeHelpers, probeSphereSize, skeletonHelpers } from '@io-gui/three'

describe('HelperOverlay', () => {
  let editor: Editor
  let view: View

  function context(height = 100): OverlayContext {
    const camera = view.getCamera(100, height, editor.document)
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

  it('draws a square per plane of an enabled clipping group, centered on what it clips, and rebuilds when planes change', () => {
    const scene = editor.document.scene
    const group = new ClippingGroup()
    group.clippingPlanes = [new Plane(new Vector3(1, 0, 0), -2), new Plane(new Vector3(0, -1, 0), 0)]
    const box = new Mesh(new BoxGeometry(2, 2, 2))
    box.position.set(2, 1, 0)
    group.add(box)
    scene.add(group)
    const overlay = new HelperOverlay('clipping', clippingHelpers)

    const [helper] = prepare(overlay)
    const [x, y] = helper.children
    // The box spans (1, 0, -1)–(3, 2, 1): its center projected on each plane, its bounding sphere's diameter wide.
    expect(x.getWorldPosition(new Vector3()).toArray()).toEqual([2, 1, 0])
    expect(y.getWorldPosition(new Vector3()).toArray()).toEqual([2, 0, 0])
    expect(x.scale.x).toBeCloseTo(2 * Math.sqrt(3), 5)
    expect(new Vector3(0, 0, 1).applyQuaternion(y.quaternion).toArray().map(Math.round)).toEqual([0, -1, 0])
    const color = (plane: typeof x) => ((plane.children[0] as Line).material as LineBasicMaterial).color.getHex()
    expect(color(x)).toBe(0xff3352)
    expect(color(y)).toBe(0x8bdc00)
    // Filled only while the group is selected.
    expect(x.children[1].visible).toBe(false)
    editor.selection.set([group.uuid])
    prepare(overlay)
    expect(x.children[1].visible).toBe(true)
    expect(color(x)).toBe(new Color(OUTLINE_COLORS.active).getHex())
    editor.selection.set([])

    group.enabled = false
    prepare(overlay)
    expect(helper.visible).toBe(false)
    group.enabled = true
    group.clippingPlanes = [new Plane(new Vector3(0, 0, 1), 0)]
    const [rebuilt] = prepare(overlay)
    expect(rebuilt).not.toBe(helper)
    expect(rebuilt.visible).toBe(true)
    expect(rebuilt.children.length).toBe(1)
    overlay.dispose()
  })

  it('draws light probes at a constant screen size, and probe grids once baked, with spheres sized by their spacing', () => {
    const scene = editor.document.scene
    const probe = new LightProbe()
    probe.position.set(0, 2, 0)
    const rig = new Group()
    rig.position.set(1, 0, 0)
    rig.add(probe)
    // Probes 1, 1 and 8 apart.
    const grid = new LightProbeGrid(4, 2, 8, 5, 3, 2)
    scene.add(rig, grid, new AmbientLight())
    view.navigation.target.set(1, 2, 0)
    const overlay = new HelperOverlay('probes', probeHelpers)

    const [probeHelper, gridHelper] = prepare(overlay) as [LightProbeHelper, LightProbeGridHelper]
    expect(overlay.root.children.length).toBe(2)
    expect(probeHelper.lightProbe).toBe(probe)
    expect(probeHelper.matrixWorld.elements.slice(12, 15)).toEqual([1, 2, 0])
    const near = probeHelper.matrixWorld.getMaxScaleOnAxis()
    // Twice as far from the view: twice as large in the world, the same size on screen.
    view.navigation.distance *= 2
    prepare(overlay)
    expect(probeHelper.matrixWorld.getMaxScaleOnAxis()).toBeCloseTo(near * 2, 5)

    // An eighth of the smallest spacing (of the largest side for a single probe); hidden until a bake makes the atlas.
    expect(gridHelper.probes).toBe(grid)
    expect(gridHelper.geometry.parameters.radius).toBe(1 / 8)
    expect(probeSphereSize(new LightProbeGrid(2, 3, 4, 1, 1, 1))).toBe(0.5)
    expect(gridHelper.visible).toBe(false)
    grid.texture = new Data3DTexture()
    prepare(overlay)
    expect(gridHelper.visible).toBe(true)

    // Probes follow the grid; a new resolution rebuilds the helper with spheres for the new spacing.
    grid.position.set(0, 1, 0)
    prepare(overlay)
    const first = (helper: LightProbeGridHelper) => new Vector3().setFromMatrixPosition(helper.getMatrixAt(0, new Matrix4()))
    expect(first(gridHelper).toArray()).toEqual(grid.getProbePosition(0, 0, 0, new Vector3()).toArray())
    grid.resolution.set(9, 3, 2)
    const [, rebuilt] = prepare(overlay) as [LightProbeHelper, LightProbeGridHelper]
    expect(rebuilt).not.toBe(gridHelper)
    expect(rebuilt.count).toBe(54)
    expect(rebuilt.geometry.parameters.radius).toBe(1 / 16)
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
