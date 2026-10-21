import {
  Color,
  Group,
  IcosahedronGeometry,
  Material,
  Mesh,
  MeshStandardNodeMaterial,
  Node,
  NodeMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  WebGPURenderer
} from 'three/webgpu'
// @ts-expect-error ProxyNodeMaterial is r187, not in @types/three 0.186
import { ProxyNodeMaterial as ProxyNodeMaterialClass } from 'three/webgpu'
import { uniform, sin, vec3, positionLocal, materialReference } from 'three/tsl'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'

/** A material that shares the shader of a node material and stores its own values. */
type ProxyNodeMaterial = Material & { nodeMaterial: NodeMaterial; isProxyNodeMaterial: true; myColor?: Color }
const ProxyNodeMaterial = ProxyNodeMaterialClass as new ( nodeMaterial: NodeMaterial ) => ProxyNodeMaterial

/** Seconds of one loop: the waves (`sin( 2 t + phase )`) repeat every π s. */
const PERIOD = 4 * Math.PI

const amount = 40

/**
 * 1600 spheres in a grid, each with its own mesh, material, color and wave phase, swelling and glowing in rings from
 * the middle. `material` switches between one `MeshStandardNodeMaterial` shared through a `ProxyNodeMaterial` per
 * mesh (one shader; each proxy stores its color and phase, read with `materialReference()`) and a node material per
 * mesh (a shader each). `randomize` picks new colors, which both kinds of material reference. The source's shader
 * build count and compile time (a renderer debug hook and `compileAsync`) are dropped. The waves move on the timeline.
 * Plays when opened.
 */
@Register
export class MaterialsNodeProxyExample extends Document {

  @Property({type: String, value: 'Proxy Node Material'})
  declare material: string

  public spheres: Group
  private meshes: Mesh[] = []
  private colors: Color[] = []
  private phases: number[] = []

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 45, 400 / 250, 0.1, 200 )
    camera.name = 'Camera'
    camera.position.set( 0, 30, 42 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0x111111 )

    // one mesh and one material per sphere, each with its own color and wave phase

    this.spheres = new Group()
    this.spheres.name = 'Spheres'
    this.scene.add( this.spheres )

    const geometry = new IcosahedronGeometry( 0.4, 3 )
    const offset = ( amount - 1 ) / 2

    for ( let x = 0; x < amount; x ++ ) {
      for ( let z = 0; z < amount; z ++ ) {
        const mesh = new Mesh( geometry )
        mesh.name = 'Sphere'
        mesh.position.set( x - offset, 0, z - offset )
        this.spheres.add( mesh )

        this.meshes.push( mesh )
        this.colors.push( new Color() )
        this.phases.push( Math.hypot( x - offset, z - offset ) * - 0.5 )
      }
    }

    this.randomize()
    this.setMaterials()
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    this.scene.environment = new PMREMGenerator( renderer ).fromScene( new RoomEnvironment(), 0.04 ).texture
  }

  materialChanged() {
    if ( this.meshes ) this.setMaterials()
  }

  /** The materials reference these colors, so no material update is needed. */
  randomize = () => {
    const hue = Math.random()

    for ( const color of this.colors ) {
      color.setHSL( ( hue + Math.random() * 0.25 ) % 1, 0.75, 0.55 )
    }

    this.notify({kind: 'material'})
  }

  /** The same node graph is used by both approaches. */
  private createNodes( colorNode: Node<'color'>, phaseNode: Node<'float'> ) {
    const wave = sin( this.timeline.timeNode.mul( 2 ).add( phaseNode ) )

    return {
      colorNode,
      emissiveNode: colorNode.mul( wave.mul( 0.5 ).add( 0.5 ).pow( 6 ) ),
      positionNode: positionLocal.add( vec3( 0, wave.mul( 0.5 ), 0 ) ),
      roughness: 0.25,
      metalness: 0.1
    }
  }

  private setMaterials() {
    const meshes = this.meshes
    const disposed = new Set<Material>()

    for ( const mesh of meshes ) {
      const material = mesh.material as Material | ProxyNodeMaterial
      if ( 'isProxyNodeMaterial' in material ) disposed.add( material.nodeMaterial )
      disposed.add( material )
    }

    if ( this.material === 'Node Material per Mesh' ) {
      // each node material has its own uniforms, so each one builds its own shader
      for ( let i = 0; i < meshes.length; i ++ ) {
        meshes[ i ].material = new MeshStandardNodeMaterial( this.createNodes( uniform( this.colors[ i ] ), uniform( this.phases[ i ] ) ) )
      }
    } else {
      // one node material defines the shader, each proxy only stores its values
      // ( @types/three 0.186 types MaterialReferenceNode without the node methods )
      const nodeMaterial = new MeshStandardNodeMaterial( this.createNodes( materialReference( 'myColor', 'color' ) as unknown as Node<'color'>, materialReference( 'userData.phase', 'float' ) as unknown as Node<'float'> ) )

      for ( let i = 0; i < meshes.length; i ++ ) {
        // values read by materialReference(), userData is independent for each proxy
        const material = new ProxyNodeMaterial( nodeMaterial )
        material.myColor = this.colors[ i ]
        material.userData.phase = this.phases[ i ]
        meshes[ i ].material = material
      }
    }

    for ( const material of disposed ) material.dispose()

    this.notify({kind: 'material'})
  }
}

registerEditorConfig(MaterialsNodeProxyExample, [
  ['material', ioOptionSelect({model: new Menu({options: [ 'Proxy Node Material', 'Node Material per Mesh' ]})})],
])

registerEditorGroups(MaterialsNodeProxyExample, {
  Main: ['material', 'randomize'],
  Hidden: ['spheres', 'meshes', 'colors', 'phases'],
})
