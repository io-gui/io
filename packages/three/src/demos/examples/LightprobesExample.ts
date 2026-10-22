import {
  ACESFilmicToneMapping,
  BoxGeometry,
  Color,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  SphereGeometry,
  WebGPURenderer
} from 'three/webgpu'
import { LightProbeGrid } from 'three/addons/lighting/LightProbeGrid.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * A Cornell box lit by a point light and a baked `LightProbeGrid` that adds the bounced light (red and green bleeding
 * onto the boxes and the sphere). The grid bakes in `onBeforeDraw` before its first draw, and again when `resolution`
 * replaces it. `gi` toggles the grid's light. The probe helpers overlay shows each probe's irradiance on a small sphere
 * in the editor's views.
 */
@Register
export class LightprobesExample extends Document {

  @Property({type: Boolean, value: true})
  declare gi: boolean

  @Property({type: Number, value: 6})
  declare resolution: number

  public probes: LightProbeGrid
  /** The grid each renderer baked last. */
  private baked = new WeakMap<WebGPURenderer, LightProbeGrid>()

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, ...args})

    const camera = new PerspectiveCamera( 50, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( 0, 2.5, 8 )
    camera.lookAt( 0, 2.5, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0x111111 )

    // Cornell box

    const wallMaterial = new MeshStandardMaterial( { color: 0xcccccc } )
    const redMaterial = new MeshStandardMaterial( { color: 0xff0000 } )
    const greenMaterial = new MeshStandardMaterial( { color: 0x00ff00 } )

    const addWall = ( name: string, mesh: Mesh ) => {
      mesh.name = name
      mesh.receiveShadow = true
      mesh.userData.selectable = false
      this.scene.add( mesh )
      return mesh
    }

    const floor = addWall( 'Floor', new Mesh( new PlaneGeometry( 6, 6 ), wallMaterial ) )
    floor.rotation.x = - Math.PI / 2

    const ceiling = addWall( 'Ceiling', new Mesh( new PlaneGeometry( 6, 6 ), wallMaterial ) )
    ceiling.rotation.x = Math.PI / 2
    ceiling.position.y = 5

    const backWall = addWall( 'Back Wall', new Mesh( new PlaneGeometry( 6, 5 ), wallMaterial ) )
    backWall.position.set( 0, 2.5, - 3 )

    const frontWall = addWall( 'Front Wall', new Mesh( new PlaneGeometry( 6, 5 ), wallMaterial ) )
    frontWall.rotation.y = Math.PI
    frontWall.position.set( 0, 2.5, 3 )

    const leftWall = addWall( 'Left Wall', new Mesh( new PlaneGeometry( 6, 5 ), redMaterial ) )
    leftWall.rotation.y = Math.PI / 2
    leftWall.position.set( - 3, 2.5, 0 )

    const rightWall = addWall( 'Right Wall', new Mesh( new PlaneGeometry( 6, 5 ), greenMaterial ) )
    rightWall.rotation.y = - Math.PI / 2
    rightWall.position.set( 3, 2.5, 0 )

    // Objects inside the box

    const objectMaterial = new MeshStandardMaterial( { color: 0xeeeeee } )

    const tallBox = new Mesh( new BoxGeometry( 1.2, 2.5, 1.2 ), objectMaterial )
    tallBox.name = 'Tall Box'
    tallBox.position.set( - 0.8, 1.25, - 0.8 )
    tallBox.rotation.y = Math.PI / 8
    tallBox.castShadow = true
    tallBox.receiveShadow = true
    this.scene.add( tallBox )

    const shortBox = new Mesh( new BoxGeometry( 1.2, 1.2, 1.2 ), objectMaterial )
    shortBox.name = 'Short Box'
    shortBox.position.set( 1, 0.6, 0.5 )
    shortBox.rotation.y = - Math.PI / 6
    shortBox.castShadow = true
    shortBox.receiveShadow = true
    this.scene.add( shortBox )

    // Sphere (to show smooth GI variation)
    const sphere = new Mesh( new SphereGeometry( 0.5, 32, 32 ), objectMaterial.clone() )
    sphere.name = 'Sphere'
    sphere.position.set( 1, 1.9, 0.5 )
    sphere.castShadow = true
    sphere.receiveShadow = true
    this.scene.add( sphere )

    const light = new PointLight( 0xffffff, 40 )
    light.name = 'Light'
    light.position.set( 0, 4.5, 0 )
    light.castShadow = true
    light.shadow.mapSize.setScalar( 256 )
    light.shadow.radius = 10
    light.shadow.normalBias = - 0.02
    this.scene.add( light )

    // Light probe volume, baked before the first draw (onBeforeDraw)

    this.probes = this.createProbes()
  }

  private createProbes() {
    const probes = new LightProbeGrid( 5.6, 4.7, 5.6, this.resolution, this.resolution, this.resolution )
    probes.name = 'Probes'
    probes.position.set( 0, 2.45, 0 )
    probes.visible = this.gi
    this.scene.add( probes )
    return probes
  }

  giChanged() {
    if ( this.probes ) this.probes.visible = this.gi
  }

  /** A new grid, baked by `onBeforeDraw`. */
  resolutionChanged() {
    if ( ! this.probes ) return

    this.probes.removeFromParent()
    this.probes.dispose()

    this.probes = this.createProbes()

    this.notify({kind: 'structure'})
  }

  /** Bakes the grid once per renderer, and a new grid when `resolution` replaced it. */
  override onBeforeDraw(renderer: WebGPURenderer) {
    if ( this.baked.get( renderer ) === this.probes ) return

    this.probes.bake( renderer, this.scene, { cubemapSize: 32, near: 0.05, far: 20 } )
    this.baked.set( renderer, this.probes )
  }
}

registerEditorConfig(LightprobesExample, [
  ['resolution', ioNumberSlider({min: 2, max: 12, step: 1})],
])

registerEditorGroups(LightprobesExample, {
  Main: ['gi', 'resolution'],
  Hidden: ['probes', 'baked'],
})
