import {
  Color,
  DirectionalLight,
  Fog,
  Group,
  Light,
  Matrix4,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  WebGPURenderer
} from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { ProgressiveLightMap } from 'three/addons/misc/ProgressiveLightMapGPU.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

// ShadowMap + LightMap Res and Number of Directional Lights
const shadowMapRes = 1024, lightMapRes = 1024, lightCount = 4

/** Updates after a change, in blend windows: the light map has settled by then. */
const SETTLE_WINDOWS = 2

/**
 * A model on a ground plane lit only by a light map that accumulates soft shadows and ambient occlusion over many
 * updates (`ProgressiveLightMap`): four shadow-casting directional lights jump to random places near `Light Origin` or
 * on the upper hemisphere each update. `enable`, `blurEdges`, `blendWindow`, `lightRadius`, `ambientWeight` and
 * `debugLightmap` are in the Document tab. Move `Light Origin` or the model with the editor's tools (the source's
 * `TransformControls`). The source accumulates every frame; here the updates run before the views draw
 * (`onBeforeDraw`) until two blend windows after the last change, then stop. The lights live in the light map's own
 * scene, as in the source, so no light helpers show. Static.
 */
@Register
export class ShadowmapProgressiveExample extends Document {

  @Property({type: Boolean, value: true})
  declare enable: boolean

  @Property({type: Boolean, value: true})
  declare blurEdges: boolean

  @Property({type: Number, value: 200})
  declare blendWindow: number

  @Property({type: Number, value: 50})
  declare lightRadius: number

  @Property({type: Number, value: 0.5})
  declare ambientWeight: number

  @Property({type: Boolean, value: false})
  declare debugLightmap: boolean

  public lightOrigin: Group
  public object?: Object3D
  private dirLights: DirectionalLight[] = []
  private lightmapObjects: Array<Mesh | Light> = []
  private progressiveSurfacemap?: ProgressiveLightMap
  /** The renderer that owns the light map: its targets hold the accumulated map. */
  private renderer?: WebGPURenderer
  /** The camera `update` renders with; the light map's material ignores it. */
  private camera = new PerspectiveCamera()
  /** Updates since the last change. */
  private updates = 0
  /** World matrices of the light origin and the model at the last update. */
  private matrices: Matrix4[] = []

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 70, 400 / 250, 1, 1000 )
    camera.name = 'Camera'
    camera.position.set( 0, 100, 200 )
    camera.lookAt( 0, 100, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0x949494 )
    this.scene.fog = new Fog( 0x949494, 1000, 3000 )

    // directional lighting "origin"
    this.lightOrigin = new Group()
    this.lightOrigin.name = 'Light Origin'
    this.lightOrigin.position.set( 60, 150, 100 )
    this.scene.add( this.lightOrigin )

    // create 8 directional lights to speed up the convergence
    for ( let l = 0; l < lightCount; l ++ ) {

      const dirLight = new DirectionalLight( 0xffffff, Math.PI / lightCount )
      dirLight.name = 'Dir. Light ' + l
      dirLight.position.set( 200, 200, 200 )
      dirLight.castShadow = true
      dirLight.shadow.camera.near = 100
      dirLight.shadow.camera.far = 5000
      dirLight.shadow.camera.right = 150
      dirLight.shadow.camera.left = - 150
      dirLight.shadow.camera.top = 150
      dirLight.shadow.camera.bottom = - 150
      dirLight.shadow.mapSize.width = shadowMapRes
      dirLight.shadow.mapSize.height = shadowMapRes
      this.lightmapObjects.push( dirLight )
      this.dirLights.push( dirLight )

    }

    // ground
    const groundMesh = new Mesh(
      new PlaneGeometry( 600, 600 ),
      new MeshPhongMaterial( { color: 0xffffff, depthWrite: true } )
    )
    groundMesh.position.y = - 0.1
    groundMesh.rotation.x = - Math.PI / 2
    groundMesh.name = 'Ground Mesh'
    groundMesh.userData.selectable = false
    this.lightmapObjects.push( groundMesh )
    this.scene.add( groundMesh )

    void this.loadModel()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadModel() {
    try {
      const gltf = await new GLTFLoader().loadAsync( 'https://threejs.org/examples/models/gltf/ShadowmappableMesh.glb' )
      const object = gltf.scene.children[ 0 ]

      object.traverse( ( child ) => {

        const mesh = child as Mesh
        if ( mesh.isMesh ) {

          mesh.name = 'Loaded Mesh'
          mesh.castShadow = true
          mesh.receiveShadow = true
          mesh.material = new MeshPhongMaterial()

          // This adds the model to the lightmap
          this.lightmapObjects.push( mesh )

        } else {

          child.layers.disableAll() // Disable Rendering for this

        }

      } )
      this.scene.add( object )
      object.scale.set( 2, 2, 2 )
      object.position.set( 0, - 16, 0 )
      const lightTarget = new Group()
      lightTarget.name = 'Light Target'
      lightTarget.position.set( 0, 20, 0 )
      for ( let l = 0; l < this.dirLights.length; l ++ ) {

        this.dirLights[ l ].target = lightTarget

      }

      object.add( lightTarget )
      this.object = object

      this.addObjectsToLightMap()

      this.notify({kind: 'structure'})
      object.updateMatrixWorld( true )
      this._frameTarget = object
    } catch ( e ) {
      console.error( e )
    }
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    // The light map is bound to the first renderer: its textures are the objects' `lightMap`.
    if ( this.renderer ) return
    this.renderer = renderer
    this.progressiveSurfacemap = new ProgressiveLightMap( renderer, lightMapRes )
    this.addObjectsToLightMap()
  }

  /** Once the model has loaded and the light map exists, in either order. */
  private addObjectsToLightMap() {
    if ( ! this.object || ! this.progressiveSurfacemap ) return
    this.progressiveSurfacemap.addObjectsToLightMap( this.lightmapObjects as unknown as Object3D[] )
    this.debugLightmapChanged()
    this.restart()
  }

  enableChanged() { this.restart() }
  blurEdgesChanged() { this.restart() }
  blendWindowChanged() { this.restart() }
  lightRadiusChanged() { this.restart() }
  ambientWeightChanged() { this.restart() }

  debugLightmapChanged() {
    if ( ! this.object || ! this.progressiveSurfacemap ) return
    this.progressiveSurfacemap.showDebugLightmap( this.debugLightmap )
    this.notify({kind: 'structure'})
  }

  /** Accumulates again from the next draw. */
  private restart() {
    this.updates = 0
    this.notify({kind: 'other'})
  }

  /**
   * Whether the light origin or the model moved since the last update. Within a tolerance: each update moves the
   * light-mapped meshes into the light map's scene and back (`attach`), which recomputes their matrices.
   */
  private moved(object: Object3D) {
    let moved = false
    ;[ this.lightOrigin, object ].forEach( ( target, i ) => {
      const matrix = this.matrices[ i ] ??= new Matrix4()
      const changed = matrix.elements.some( ( value, j ) => Math.abs( value - target.matrixWorld.elements[ j ] ) > 1e-4 )
      if ( changed ) {
        matrix.copy( target.matrixWorld )
        moved = true
      }
    } )
    return moved
  }

  override onBeforeDraw(renderer: WebGPURenderer) {
    const progressiveSurfacemap = this.progressiveSurfacemap
    const object = this.object
    if ( renderer !== this.renderer || ! progressiveSurfacemap || ! object || ! this.enable ) return
    if ( this.moved( object ) ) this.updates = 0
    if ( this.updates >= this.blendWindow * SETTLE_WINDOWS ) return
    this.updates++

    // Accumulate Surface Maps
    progressiveSurfacemap.update( this.camera, this.blendWindow, this.blurEdges )

    // Manually Update the Directional Lights
    const lightOrigin = this.lightOrigin
    for ( let l = 0; l < this.dirLights.length; l ++ ) {

      // Sometimes they will be sampled from the target direction
      // Sometimes they will be uniformly sampled from the upper hemisphere
      if ( Math.random() > this.ambientWeight ) {

        this.dirLights[ l ].position.set(
          lightOrigin.position.x + ( Math.random() * this.lightRadius ),
          lightOrigin.position.y + ( Math.random() * this.lightRadius ),
          lightOrigin.position.z + ( Math.random() * this.lightRadius ) )

      } else {

        // Uniform Hemispherical Surface Distribution for Ambient Occlusion
        const lambda = Math.acos( 2 * Math.random() - 1 ) - ( 3.14159 / 2.0 )
        const phi = 2 * 3.14159 * Math.random()
        this.dirLights[ l ].position.set(
          ( ( Math.cos( lambda ) * Math.cos( phi ) ) * 300 ) + object.position.x,
          Math.abs( ( Math.cos( lambda ) * Math.sin( phi ) ) * 300 ) + object.position.y + 20,
          ( Math.sin( lambda ) * 300 ) + object.position.z
        )

      }

    }

    // Draw again next frame.
    this.notify({kind: 'other'})
  }
}

registerEditorConfig(ShadowmapProgressiveExample, [
  ['blendWindow', ioNumberSlider({min: 1, max: 500, step: 1})],
  ['lightRadius', ioNumberSlider({min: 0, max: 200, step: 10})],
  ['ambientWeight', ioNumberSlider({min: 0, max: 1, step: 0.1})],
])

registerEditorGroups(ShadowmapProgressiveExample, {
  Main: ['enable', 'blurEdges', 'blendWindow', 'lightRadius', 'ambientWeight', 'debugLightmap'],
  Hidden: ['lightOrigin', 'object', 'dirLights', 'lightmapObjects', 'progressiveSurfacemap', 'renderer', 'camera', 'updates', 'matrices'],
})
