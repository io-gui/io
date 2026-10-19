import {
  AmbientLight,
  Color,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshPhongNodeMaterial,
  Node,
  NodeFrame,
  NodeUpdateType,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  SphereGeometry
} from 'three/webgpu'
import { uniform } from 'three/tsl'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/** A color uniform that shows whether `testObject` was occluded, read when the plane draws. */
class OcclusionNode extends Node<'vec3'> {

  uniformNode = uniform( new Color() )

  constructor( public testObject: Object3D, public normalColor: Color, public occludedColor: Color ) {
    super( 'vec3' )
    this.updateType = NodeUpdateType.OBJECT
  }

  override update( frame: NodeFrame ) {
    const isOccluded = frame.renderer!.isOccluded( this.testObject )
    this.uniformNode.value.copy( isOccluded ? this.occludedColor : this.normalColor )
    return undefined
  }

  override setup( /* builder */ ) {
    return this.uniformNode
  }
}

/**
 * A plane in front of a sphere that runs an occlusion query: the plane turns green while the sphere is hidden behind it,
 * blue otherwise. The node reads the result of the view's previous draw, as in the source; views draw only on changes,
 * so a view that stopped can show a result one draw old. three keeps occlusion results per render context, which it
 * shares between draws into targets of the same format and outputs, whatever the camera: views drawn alike (the
 * forward views) overwrite each other's results, so with several open the plane can flicker or show another view's
 * result (upstream issue, kit 2026-10-16). Static.
 */
@Register
export class OcclusionExample extends Document {

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 50, 400 / 250, 0.01, 100 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 7 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    // lights

    const ambientLight = new AmbientLight( 0xb0b0b0 )
    ambientLight.name = 'Ambient'

    const light = new DirectionalLight( 0xFFFFFF, 1.0 )
    light.name = 'Directional'
    light.position.set( 0.32, 0.39, 0.7 )

    this.scene.add( ambientLight )
    this.scene.add( light )

    // models

    const planeGeometry = new PlaneGeometry( 2, 2 )
    const sphereGeometry = new SphereGeometry( 0.5 )

    const plane = new Mesh( planeGeometry, new MeshPhongNodeMaterial( { color: 0x00ff00, side: DoubleSide } ) )
    plane.name = 'Plane'
    const sphere = new Mesh( sphereGeometry, new MeshPhongNodeMaterial( { color: 0xffff00 } ) )
    sphere.name = 'Sphere'

    const instanceUniform = new OcclusionNode( sphere, new Color( 0x0000ff ), new Color( 0x00ff00 ) )

    plane.material.colorNode = instanceUniform

    sphere.position.z = - 1
    sphere.occlusionTest = true

    this.scene.add( plane )
    this.scene.add( sphere )
  }
}
