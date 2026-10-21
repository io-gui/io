import {
  ACESFilmicToneMapping,
  CubeRenderTarget,
  DoubleSide,
  EquirectangularReflectionMapping,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshBasicNodeMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  MultiplyBlending,
  PerspectiveCamera,
  PlaneGeometry,
  Texture,
  TextureLoader,
  WebGPURenderer
} from 'three/webgpu'
import { cubeTexture, float } from 'three/tsl'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader, DRACO_GLTF_CONFIG } from 'three/addons/loaders/DRACOLoader.js'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import { getGroundProjectedNormal } from 'three/addons/tsl/utils/GroundedSkybox.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

const params = {
  height: 15,
  radius: 100,
}

/**
 * The Ferrari 458 Italia (glTF, Draco; black clear-coated body, glass with `transmission`) on the ground of a grounded
 * skybox: the Blouberg sunrise HDR, also the environment, projected onto a sphere so the car stands on it. The
 * equirectangular image becomes a cube map before the skybox's first draw (`onBeforeDraw`), which avoids artifacts at
 * its poles. `grounded` switches between the projected skybox and the plain HDR background. Static.
 */
@Register
export class MaterialsEnvmapsGroundprojectedExample extends Document {

  @Property({type: Boolean, value: true})
  declare grounded: boolean

  public skybox: Mesh | null = null
  private envMap: Texture | null = null
  private cubeRenderTarget: CubeRenderTarget | null = null
  /** The renderers that converted the environment into the skybox's cube map. */
  private converted = new WeakSet<WebGPURenderer>()

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, ...args})

    const camera = new PerspectiveCamera( 40, 400 / 250, 1, 1000 )
    camera.name = 'Camera'
    camera.position.set( - 20, 7, 20 )
    camera.lookAt( 0, 2, 0 )
    this.activeCamera = camera

    void this.loadEnvironment()
    void this.loadCar()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadEnvironment() {
    try {
      const envMap = await new HDRLoader().loadAsync( 'https://threejs.org/examples/textures/equirectangular/blouberg_sunrise_2_1k.hdr' )
      envMap.mapping = EquirectangularReflectionMapping

      this.envMap = envMap
      this.scene.environment = envMap

      // use a cube map to avoid visual artifacts at the skybox's poles ( converted in onBeforeDraw )
      const size = envMap.image.height
      this.cubeRenderTarget = new CubeRenderTarget( size )

      // grounded skybox
      const geometry = new IcosahedronGeometry( 1, 16 )
      const material = new MeshBasicNodeMaterial( { side: DoubleSide } )
      material.colorNode = cubeTexture( this.cubeRenderTarget.texture, getGroundProjectedNormal( float( params.radius ), float( params.height ) ) )

      const skybox = new Mesh( geometry, material )
      skybox.name = 'Skybox'
      skybox.scale.setScalar( params.radius )
      skybox.userData.selectable = false
      this.scene.add( skybox )
      this.skybox = skybox

      this.groundedChanged()
      this.notify({kind: 'structure'})
    } catch ( e ) {
      console.error( e )
    }
  }

  private async loadCar() {
    try {
      const shadow = new TextureLoader().load( 'https://threejs.org/examples/models/gltf/ferrari_ao.png', () => this.notify({kind: 'material'}) )

      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath( DRACO_GLTF_CONFIG )

      const loader = new GLTFLoader()
      loader.setDRACOLoader( dracoLoader )

      const gltf = await loader.loadAsync( 'https://threejs.org/examples/models/gltf/ferrari.glb' )

      const bodyMaterial = new MeshPhysicalMaterial( {
        color: 0x000000, metalness: 1.0, roughness: 0.8,
        clearcoat: 1.0, clearcoatRoughness: 0.2
      } )

      const detailsMaterial = new MeshStandardMaterial( {
        color: 0xffffff, metalness: 1.0, roughness: 0.5
      } )

      const glassMaterial = new MeshPhysicalMaterial( {
        color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1.0
      } )

      const carModel = gltf.scene.children[ 0 ]
      carModel.scale.multiplyScalar( 4 )
      carModel.rotation.y = Math.PI

      const setMaterial = ( name: string, material: MeshStandardMaterial ) => {
        ( carModel.getObjectByName( name ) as Mesh ).material = material
      }

      setMaterial( 'body', bodyMaterial )
      setMaterial( 'rim_fl', detailsMaterial )
      setMaterial( 'rim_fr', detailsMaterial )
      setMaterial( 'rim_rr', detailsMaterial )
      setMaterial( 'rim_rl', detailsMaterial )
      setMaterial( 'trim', detailsMaterial )
      setMaterial( 'glass', glassMaterial )

      // shadow
      const mesh = new Mesh(
        new PlaneGeometry( 0.655 * 4, 1.3 * 4 ),
        new MeshBasicMaterial( {
          map: shadow, blending: MultiplyBlending, toneMapped: false, transparent: true, premultipliedAlpha: true
        } )
      )
      mesh.name = 'Shadow'
      mesh.rotation.x = - Math.PI / 2
      mesh.userData.selectable = false
      carModel.add( mesh )

      this.scene.add( carModel )

      this._frameTarget = carModel
      this.notify({kind: 'structure'})
    } catch ( e ) {
      console.error( e )
    }
  }

  groundedChanged() {
    if ( ! this.skybox ) return
    this.skybox.visible = this.grounded
    this.scene.background = this.grounded ? null : this.envMap
  }

  /** Converts the environment into the skybox's cube map, once per renderer after it has loaded. */
  override onBeforeDraw(renderer: WebGPURenderer) {
    if ( ! this.envMap || ! this.cubeRenderTarget || this.converted.has( renderer ) ) return
    this.cubeRenderTarget.fromEquirectangularTexture( renderer, this.envMap )
    this.converted.add( renderer )
  }
}

registerEditorGroups(MaterialsEnvmapsGroundprojectedExample, {
  Main: ['grounded'],
  Hidden: ['skybox', 'envMap', 'cubeRenderTarget', 'converted'],
})
