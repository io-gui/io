import { BufferGeometry, Color, Group, LightingModel, LightsNode, Mesh, Node, NodeMaterial, PointLight, Points, PointsNodeMaterial, SphereGeometry, Vector3 } from 'three/webgpu'
import { color, context, lights } from 'three/tsl'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

/**
 * Seconds in which the motion repeats: the timeline length, so looping is seamless. The light frequencies (0.3, 0.5
 * and 0.7 rad/s) and the 0.1 rad/s turn are whole multiples of 0.1 rad/s.
 */
const PERIOD = 20 * Math.PI

/** Lights only the direct diffuse term, with the light's color as is: no falloff with the surface's orientation. */
class CustomLightingModel extends LightingModel {
  override direct( { lightColor, reflectedLight }: Parameters<LightingModel['direct']>[0] ) {
    // @types/three 0.186 types the lighting terms as untyped nodes, without math methods.
    ( reflectedLight.directDiffuse as Node<'vec3'> ).addAssign( lightColor as Node<'vec3'> )
  }
}

/**
 * Half a million points lit by three moving point lights through a custom lighting model that adds the light color
 * to the diffuse term. The source turns the whole scene; here a `Pivot` group turns, with the lights and the points
 * in it. Plays when opened.
 */
@Register
export class LightsCustomExample extends Document {

  public pivot: Group
  public light1: PointLight
  public light2: PointLight
  public light3: PointLight

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    this.scene.background = new Color( 0x000000 )

    this.pivot = new Group()
    this.pivot.name = 'Pivot'
    this.scene.add( this.pivot )

    // lights

    const sphereGeometry = new SphereGeometry( 0.02, 16, 8 )

    const addLight = ( name: string, hexColor: number ) => {
      const material = new NodeMaterial()
      material.colorNode = color( hexColor )
      material.lightsNode = lights() // ignore scene lights

      const mesh = new Mesh( sphereGeometry, material )

      const light = new PointLight( hexColor, 0.1, 1 )
      light.name = name
      light.add( mesh )

      this.pivot.add( light )

      return light
    }

    this.light1 = addLight( 'Orange', 0xffaa00 )
    this.light2 = addLight( 'Blue', 0x0040ff )
    this.light3 = addLight( 'Green', 0x80ff80 )

    //light nodes ( selective lights )

    const allLightsNode = lights( [ this.light1, this.light2, this.light3 ] )

    // points

    const points = []

    for ( let i = 0; i < 500000; i ++ ) {
      const point = new Vector3().random().subScalar( 0.5 ).multiplyScalar( 3 )
      points.push( point )
    }

    const geometryPoints = new BufferGeometry().setFromPoints( points )
    const materialPoints = new PointsNodeMaterial()

    // custom lighting model

    const lightingModel = new CustomLightingModel()
    const lightingModelContext = context( allLightsNode, { lightingModel } )

    // @types/three 0.186 types `lightsNode` as a LightsNode; three accepts any node that sets up lights.
    materialPoints.lightsNode = lightingModelContext as unknown as LightsNode

    //

    const pointCloud = new Points( geometryPoints, materialPoints )
    pointCloud.name = 'Points'
    this.pivot.add( pointCloud )

    this.pose( this.timeline.currentTime )
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    const scale = .5

    this.light1.position.x = Math.sin( time * 0.7 ) * scale
    this.light1.position.y = Math.cos( time * 0.5 ) * scale
    this.light1.position.z = Math.cos( time * 0.3 ) * scale

    this.light2.position.x = Math.cos( time * 0.3 ) * scale
    this.light2.position.y = Math.sin( time * 0.5 ) * scale
    this.light2.position.z = Math.sin( time * 0.7 ) * scale

    this.light3.position.x = Math.sin( time * 0.7 ) * scale
    this.light3.position.y = Math.cos( time * 0.3 ) * scale
    this.light3.position.z = Math.sin( time * 0.5 ) * scale

    this.pivot.rotation.y = time * 0.1
  }
}
