import { CubeTextureLoader, DirectionalLight, LightProbe, Mesh, MeshStandardMaterial, PerspectiveCamera, SphereGeometry } from 'three/webgpu'
import { LightProbeGenerator } from 'three/addons/lights/LightProbeGenerator.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * A glossy sphere lit by a light probe generated from the Pisa cube map (also the background and the sphere's
 * environment map) and a directional light. The three intensities are in the Document tab. The probe helpers overlay
 * draws the probe's lighting on a small sphere at the probe's position in the editor's views, in place of the source's
 * light probe helper. Known issue: forward views keep the probe's first `intensity` (three r186 shared refresh; TRAA
 * views follow).
 */
@Register
export class LightprobeExample extends Document {

  public lightProbe: LightProbe
  public directionalLight: DirectionalLight
  public mesh?: Mesh<SphereGeometry, MeshStandardMaterial>

  @Property({type: Number, value: 1.0})
  declare probe: number

  @Property({type: Number, value: 0.6})
  declare directional: number

  @Property({type: Number, value: 1})
  declare envMap: number

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 40, 400 / 250, 1, 1000 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 30 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    // probe

    this.lightProbe = new LightProbe()
    this.lightProbe.name = 'LightProbe'
    this.scene.add( this.lightProbe )

    // light

    this.directionalLight = new DirectionalLight( 0xffffff, this.directional )
    this.directionalLight.name = 'Key'
    this.directionalLight.position.set( 10, 10, 10 )
    this.scene.add( this.directionalLight )

    // envmap

    const genCubeUrls = function ( prefix: string, postfix: string ) {
      return [
        prefix + 'px' + postfix, prefix + 'nx' + postfix,
        prefix + 'py' + postfix, prefix + 'ny' + postfix,
        prefix + 'pz' + postfix, prefix + 'nz' + postfix
      ]
    }

    const urls = genCubeUrls( 'https://threejs.org/examples/textures/cube/pisa/', '.png' )

    new CubeTextureLoader().load( urls, cubeTexture => {
      this.scene.background = cubeTexture

      this.lightProbe.copy( LightProbeGenerator.fromCubeTexture( cubeTexture ) )
      this.lightProbe.name = 'LightProbe' // `copy` takes the generated probe's (empty) name
      this.lightProbe.intensity = this.probe
      this.lightProbe.position.set( - 10, 0, 0 ) // position not used in scene lighting calculations (helper honors the position, however)

      const geometry = new SphereGeometry( 5, 64, 32 )
      //const geometry = new TorusKnotGeometry( 4, 1.5, 256, 32, 2, 3 );

      const material = new MeshStandardMaterial( {
        color: 0xffffff,
        metalness: 0,
        roughness: 0,
        envMap: cubeTexture,
        envMapIntensity: this.envMap,
      } )

      // mesh
      this.mesh = new Mesh( geometry, material )
      this.mesh.name = 'Sphere'
      this.scene.add( this.mesh )

      this.notify({kind: 'structure'})
      this._frameTarget = this.mesh
    } )
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  probeChanged() {
    if ( this.lightProbe ) this.lightProbe.intensity = this.probe
  }

  directionalChanged() {
    if ( this.directionalLight ) this.directionalLight.intensity = this.directional
  }

  envMapChanged() {
    if ( this.mesh ) this.mesh.material.envMapIntensity = this.envMap
  }
}

registerEditorConfig(LightprobeExample, [
  ['probe', ioNumberSlider({min: 0, max: 1, step: 0.02})],
  ['directional', ioNumberSlider({min: 0, max: 1, step: 0.02})],
  ['envMap', ioNumberSlider({min: 0, max: 1, step: 0.02})],
])

registerEditorGroups(LightprobeExample, {
  Main: ['probe', 'directional', 'envMap'],
  Hidden: ['lightProbe', 'directionalLight', 'mesh'],
})
