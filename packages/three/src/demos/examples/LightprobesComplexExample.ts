import {
  ACESFilmicToneMapping,
  BackSide,
  BoxGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  Mesh,
  MeshBasicNodeMaterial,
  MeshStandardMaterial,
  Node,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  SphereGeometry,
  TorusKnotGeometry,
  WebGPURenderer
} from 'three/webgpu'
import { LightProbeGrid } from 'three/addons/lighting/LightProbeGrid.js'
import { LightProbeGridHelper } from 'three/addons/helpers/LightProbeGridHelper.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * Workaround (upstream: triage-fragment-node-mrt): the helper's `fragmentNode` writes only the first color output,
 * so the TRAA views' MRT pass rejects its pipeline. The same irradiance as the color of a basic material.
 */
function useBasicMaterial( helper: LightProbeGridHelper ) {
  const previous = helper.material
  helper.material = new MeshBasicNodeMaterial( { colorNode: previous.fragmentNode as Node<'vec4'> } )
  previous.dispose()
}

/**
 * Two rooms joined by a doorway, a warm point light in one and a cool one in the other, each room with a baked
 * `LightProbeGrid` whose `falloff` blends the two at the doorway. The grids bake in `onBeforeDraw` before their first
 * draw, and again when `resolution` replaces them; neither is lit by the other while baking. `gi` toggles the grids'
 * light, `showProbes` their helpers (each probe's irradiance on a small sphere).
 */
@Register
export class LightprobesComplexExample extends Document {

  @Property({type: Boolean, value: true})
  declare gi: boolean

  @Property({type: Number, value: 6})
  declare resolution: number

  @Property({type: Boolean, value: false})
  declare showProbes: boolean

  public probesLeft: LightProbeGrid
  public probesRight: LightProbeGrid
  public probesHelperLeft: LightProbeGridHelper
  public probesHelperRight: LightProbeGridHelper
  /** The left grid each renderer baked last (both grids are replaced together). */
  private baked = new WeakMap<WebGPURenderer, LightProbeGrid>()

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, ...args})

    const camera = new PerspectiveCamera( 50, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( 0, 2.5, 16 )
    camera.lookAt( 0, 2.5, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0x111111 )

    // Materials

    const wallMaterial = new MeshStandardMaterial( { color: 0xcccccc, side: BackSide } )
    const whiteMat = new MeshStandardMaterial( { color: 0xeeeeee } )

    // Room shell: x=-8 to 8, z=-4 to 4, y=0 to 5

    const room = new Mesh( new BoxGeometry( 16, 5, 8 ), wallMaterial )
    room.name = 'Room'
    room.position.set( 0, 2.5, 0 )
    room.receiveShadow = true
    room.userData.selectable = false
    this.scene.add( room )

    const redWall = new Mesh(
      new PlaneGeometry( 8, 5 ),
      new MeshStandardMaterial( { color: 0xdd2200 } )
    )
    redWall.name = 'Red Wall'
    redWall.rotation.y = Math.PI / 2
    redWall.position.set( - 7.99, 2.5, 0 )
    redWall.userData.selectable = false
    this.scene.add( redWall )

    const blueWall = new Mesh(
      new PlaneGeometry( 8, 5 ),
      new MeshStandardMaterial( { color: 0x0044ff } )
    )
    blueWall.name = 'Blue Wall'
    blueWall.rotation.y = - Math.PI / 2
    blueWall.position.set( 7.99, 2.5, 0 )
    blueWall.userData.selectable = false
    this.scene.add( blueWall )

    // Dividing wall at x=0 with doorway

    const dividerMat = new MeshStandardMaterial( { color: 0xcccccc } )
    const doorwayHalfGap = 1.25

    const addDivider = ( name: string, mesh: Mesh ) => {
      mesh.name = name
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.userData.selectable = false
      this.scene.add( mesh )
      return mesh
    }

    // Left section of divider (z = -4 to -1.25)
    const dividerLeft = addDivider( 'Divider Left', new Mesh( new BoxGeometry( 0.3, 5, 4 - doorwayHalfGap ), dividerMat ) )
    dividerLeft.position.set( 0, 2.5, - ( doorwayHalfGap + ( 4 - doorwayHalfGap ) / 2 ) )

    // Right section of divider (z = 1.25 to 4)
    const dividerRight = addDivider( 'Divider Right', new Mesh( new BoxGeometry( 0.3, 5, 4 - doorwayHalfGap ), dividerMat ) )
    dividerRight.position.set( 0, 2.5, doorwayHalfGap + ( 4 - doorwayHalfGap ) / 2 )

    // Lintel above doorway
    const lintel = addDivider( 'Lintel', new Mesh( new BoxGeometry( 0.3, 1.2, doorwayHalfGap * 2 ), dividerMat ) )
    lintel.position.set( 0, 4.4, 0 )

    const addObject = ( name: string, mesh: Mesh ) => {
      mesh.name = name
      mesh.castShadow = true
      mesh.receiveShadow = true
      this.scene.add( mesh )
      return mesh
    }

    const columnGeom = new CylinderGeometry( 0.3, 0.3, 4, 16 )

    const addColumns = ( xs: number[] ) => {
      for ( const x of xs ) {
        for ( const z of [ - 2.5, 2.5 ] ) {
          const col = addObject( 'Column', new Mesh( columnGeom, whiteMat ) )
          col.position.set( x, 2, z )
        }
      }
    }

    // Left room: columns, table with golden sphere

    addColumns( [ - 6, - 2 ] )

    const tableTop = addObject( 'Table Top', new Mesh(
      new BoxGeometry( 2.4, 0.12, 1.4 ),
      new MeshStandardMaterial( { color: 0x886644 } )
    ) )
    tableTop.position.set( - 4, 1.0, 0 )

    const legGeom = new BoxGeometry( 0.1, 1, 0.1 )

    for ( const x of [ - 5.05, - 2.95 ] ) {
      for ( const z of [ - 0.55, 0.55 ] ) {
        const leg = new Mesh( legGeom, tableTop.material )
        leg.name = 'Leg'
        leg.position.set( x, 0.5, z )
        leg.castShadow = true
        this.scene.add( leg )
      }
    }

    const sphere = addObject( 'Sphere', new Mesh(
      new SphereGeometry( 0.35, 32, 32 ),
      new MeshStandardMaterial( { color: 0xffd700, metalness: 0.3, roughness: 0.4 } )
    ) )
    sphere.position.set( - 4, 1.41, 0 )

    // Stepped blocks near red wall

    const step1 = addObject( 'Step 1', new Mesh( new BoxGeometry( 1.5, 0.5, 1 ), whiteMat ) )
    step1.position.set( - 7, 0.25, 0 )

    const step2 = addObject( 'Step 2', new Mesh( new BoxGeometry( 1.0, 1.0, 1 ), whiteMat ) )
    step2.position.set( - 7, 0.5, 0 )

    const step3 = addObject( 'Step 3', new Mesh( new BoxGeometry( 0.5, 1.5, 1 ), whiteMat ) )
    step3.position.set( - 7, 0.75, 0 )

    // Right room: columns, pedestal with torus knot, tall cone sculpture

    addColumns( [ 2, 6 ] )

    const pedestal = addObject( 'Pedestal', new Mesh( new BoxGeometry( 0.8, 1.2, 0.8 ), whiteMat ) )
    pedestal.position.set( 4, 0.6, 0 )

    const torusKnot = addObject( 'Torus Knot', new Mesh(
      new TorusKnotGeometry( 0.3, 0.1, 64, 16 ),
      new MeshStandardMaterial( { color: 0xff44aa, metalness: 0.2, roughness: 0.5 } )
    ) )
    torusKnot.position.set( 4, 1.65, 0 )

    const sculpture = addObject( 'Sculpture', new Mesh( new ConeGeometry( 0.4, 2.5, 5 ), whiteMat ) )
    sculpture.position.set( 6.5, 1.25, - 1.5 )

    // Lights

    const addLight = ( name: string, color: number, x: number ) => {
      const light = new PointLight( color, 30 )
      light.name = name
      light.position.set( x, 4.5, 0 )
      light.castShadow = true
      light.shadow.mapSize.setScalar( 256 )
      light.shadow.radius = 12
      light.shadow.bias = - 0.002
      this.scene.add( light )
    }

    addLight( 'Warm Light', 0xffaa44, - 4 )
    addLight( 'Cool Light', 0x88bbff, 4 )

    // Probe volumes, baked before the first draw (onBeforeDraw)

    this.probesLeft = this.createProbes( 'Probes Left', - 3.9 )
    this.probesRight = this.createProbes( 'Probes Right', 3.9 )

    this.probesHelperLeft = this.createHelper( 'Probes Helper Left', this.probesLeft )
    this.probesHelperRight = this.createHelper( 'Probes Helper Right', this.probesRight )
  }

  /** The `falloff` fades each volume past its boundary, so the rooms blend at the doorway without bleeding into each other. */
  private createProbes( name: string, x: number ) {
    const probes = new LightProbeGrid( 7.8, 4.7, 7.6, this.resolution, this.resolution, this.resolution )
    probes.name = name
    probes.position.set( x, 2.45, 0 )
    probes.falloff = 1.0
    probes.visible = this.gi
    this.scene.add( probes )
    return probes
  }

  private createHelper( name: string, probes: LightProbeGrid ) {
    const helper = new LightProbeGridHelper( probes )
    helper.name = name
    helper.visible = this.showProbes
    helper.userData.selectable = false
    useBasicMaterial( helper )
    this.scene.add( helper )
    return helper
  }

  giChanged() {
    if ( ! this.probesLeft ) return
    this.probesLeft.visible = this.gi
    this.probesRight.visible = this.gi
  }

  /** New grids, baked by `onBeforeDraw`. */
  resolutionChanged() {
    if ( ! this.probesLeft ) return

    for ( const probes of [ this.probesLeft, this.probesRight ] ) {
      probes.removeFromParent()
      probes.dispose()
    }

    this.probesLeft = this.createProbes( 'Probes Left', - 3.9 )
    this.probesRight = this.createProbes( 'Probes Right', 3.9 )

    this.probesHelperLeft.probes = this.probesLeft
    this.probesHelperLeft.update()
    this.probesHelperRight.probes = this.probesRight
    this.probesHelperRight.update()

    this.notify({kind: 'structure'})
  }

  showProbesChanged() {
    if ( ! this.probesHelperLeft ) return
    this.probesHelperLeft.visible = this.showProbes
    this.probesHelperRight.visible = this.showProbes
  }

  /**
   * Bakes both grids once per renderer, and the new grids when `resolution` replaced them. Both grids and helpers are
   * hidden while baking (the source bakes the grids before adding them), so neither lights the other's captures.
   */
  override onBeforeDraw(renderer: WebGPURenderer) {
    if ( this.baked.get( renderer ) === this.probesLeft ) return

    const hidden = [ this.probesLeft, this.probesRight, this.probesHelperLeft, this.probesHelperRight ]
    const visible = hidden.map( object => object.visible )

    for ( const object of hidden ) object.visible = false

    try {
      this.probesLeft.bake( renderer, this.scene, { cubemapSize: 32, near: 0.05, far: 20 } )
      this.probesRight.bake( renderer, this.scene, { cubemapSize: 32, near: 0.05, far: 20 } )
    } finally {
      hidden.forEach( ( object, i ) => object.visible = visible[ i ] )
    }

    // The helpers sample the grids' atlases, which the first bakes create.
    this.probesHelperLeft.update()
    this.probesHelperRight.update()

    this.baked.set( renderer, this.probesLeft )
  }
}

registerEditorConfig(LightprobesComplexExample, [
  ['resolution', ioNumberSlider({min: 2, max: 12, step: 1})],
])

registerEditorGroups(LightprobesComplexExample, {
  Main: ['gi', 'resolution', 'showProbes'],
  Hidden: ['probesLeft', 'probesRight', 'probesHelperLeft', 'probesHelperRight', 'baked'],
})
