import { Color, CubeTextureLoader, Mesh, MeshBasicNodeMaterial, Node, NodeFrame, NodeUpdateType, PerspectiveCamera } from 'three/webgpu'
import { uniform, cubeTexture } from 'three/tsl'
import { TeapotGeometry } from 'three/addons/geometries/TeapotGeometry.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

/** Seconds in which the spin repeats: the timeline length, so looping is seamless. */
const SPIN_PERIOD = 20

/** A mesh with its own color, read by `InstanceUniformNode` when the mesh draws. */
class ColorMesh extends Mesh {
  color = new Color()
}

/** A uniform updated per object: it takes the color of the mesh being drawn. */
class InstanceUniformNode extends Node<'vec3'> {
  uniformNode = uniform( new Color() )

  constructor() {
    super( 'vec3' )
    this.updateType = NodeUpdateType.OBJECT
  }

  override update( frame: NodeFrame ) {
    const mesh = frame.object as ColorMesh
    this.uniformNode.value.copy( mesh.color )
    return undefined
  }

  override setup( /*builder*/ ) {
    return this.uniformNode
  }
}

/**
 * Twelve teapots sharing one material, each tinted by its own `color` (Inspector) through a per-object uniform node
 * over a castle cube map. Spins with document time; plays when opened.
 */
@Register
export class InstanceUniformExample extends Document {

  public objects: ColorMesh[] = []

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: SPIN_PERIOD}), ...args})

    const camera = new PerspectiveCamera( 45, 400 / 250, 1, 4000 )
    camera.name = 'Camera'
    camera.position.set( 0, 200, 1200 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    // CubeMap

    const path = 'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/'
    const format = '.jpg'
    const urls = [
      path + 'px' + format, path + 'nx' + format,
      path + 'py' + format, path + 'ny' + format,
      path + 'pz' + format, path + 'nz' + format
    ]

    // Views draw on document changes only, so report the texture when it arrives.
    const cTexture = new CubeTextureLoader().load( urls, () => this.notify({kind: 'material'}) )

    // Materials

    const instanceUniform = new InstanceUniformNode()
    const cubeTextureNode = cubeTexture( cTexture )

    // `NodeMaterial` applies `emissiveNode` on any material; @types/three 0.186 declares it only on lit ones.
    const material = new MeshBasicNodeMaterial() as MeshBasicNodeMaterial & {emissiveNode: Node | null}
    material.colorNode = instanceUniform.add( cubeTextureNode )
    material.emissiveNode = instanceUniform.mul( cubeTextureNode )

    // Geometry

    const geometry = new TeapotGeometry( 50, 18 )

    for ( let i = 0, l = 12; i < l; i ++ ) {
      const mesh = new ColorMesh( geometry, material )
      mesh.name = `Teapot ${i + 1}`
      mesh.color = new Color( Math.random() * 0xffffff )

      mesh.position.x = ( i % 4 ) * 200 - 300
      mesh.position.z = Math.floor( i / 4 ) * 200 - 200

      mesh.rotation.x = Math.random() * 200 - 100
      mesh.rotation.y = Math.random() * 200 - 100
      mesh.rotation.z = Math.random() * 200 - 100
      mesh.userData.rotation = mesh.rotation.clone()

      this.objects.push( mesh )
      this.scene.add( mesh )
    }
  }

  override onAnimate(delta: number, time: number) {
    // The source turns 0.01 and 0.005 rad per frame about x and y.
    const angle = time / SPIN_PERIOD * Math.PI * 2
    for ( const object of this.objects ) {
      object.rotation.x = object.userData.rotation.x + angle * 2
      object.rotation.y = object.userData.rotation.y + angle
    }
  }
}
