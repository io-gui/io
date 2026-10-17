import { CubeTextureLoader, DirectionalLight, LightProbe, Material, Mesh, MeshBasicNodeMaterial, MeshStandardMaterial, Node, SphereGeometry } from 'three/webgpu'
import { getShIrradianceAt, normalWorld } from 'three/tsl'
import { LightProbeGenerator } from 'three/addons/lights/LightProbeGenerator.js'
import { LightProbeHelper } from 'three/addons/helpers/LightProbeHelperGPU.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * Gives a light probe helper a basic material that draws the same irradiance. The helper's own material sets
 * `fragmentNode`, which writes only the first color output: in the TRAA views' MRT pass (color and velocity) WebGPU
 * rejects its pipeline.
 */
function useBasicMaterial( helper: LightProbeHelper ) {
  const { _sh: sh, _intensity: intensity } = helper as unknown as { _sh: Node; _intensity: Node<'float'> }

  const material = new MeshBasicNodeMaterial()
  material.colorNode = ( getShIrradianceAt( normalWorld, sh ) as Node<'vec3'> ).mul( 1 / Math.PI ).mul( intensity )

  const previous = helper.material as Material
  helper.material = material
  previous.dispose()
}

/**
 * A glossy sphere lit by a light probe generated from the Pisa cube map (also the background and the sphere's
 * environment map) and a directional light. The three intensities are in the Document tab. The light probe helper
 * (the probe's lighting on a small sphere at the probe's position) is content: the light helpers overlay draws no
 * probes. Known issue: forward views keep the probe's first `intensity` (three r186 shared refresh; TRAA views
 * follow).
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

  constructor(args?: DocumentProps) {
    super(args)

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

      // helper
      const helper = new LightProbeHelper( this.lightProbe, 1 )
      useBasicMaterial( helper )
      helper.name = 'LightProbeHelper'
      helper.userData.selectable = false
      this.scene.add( helper )

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: this.mesh}, true)
    } )
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
