import {
  CubeCamera,
  CubeReflectionMapping,
  CubeRenderTarget,
  Group,
  HalfFloatType,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  MeshStandardNodeMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  RectAreaLight,
  RectAreaLightNode,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
  WebGPURenderer
} from 'three/webgpu'
import { bumpMap, float, getParallaxCorrectNormal, pmremTexture, reflectVector, texture, uniform, vec3 } from 'three/tsl'
import { RectAreaLightTexturesLib } from 'three/addons/lights/RectAreaLightTexturesLib.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

RectAreaLightNode.setLTC( RectAreaLightTexturesLib.init() )

/**
 * A metal floor in a brick room lit by two area lights, reflecting the room through a cube map captured from the
 * floor's position. With `boxProjected` the reflection is corrected for the room's box (box-projected cube environment
 * mapping, BPCEM); without, it is an infinitely distant environment. `boxProjected` and `roughness` are in the Document
 * tab. The source captures the cube map once after loading; here it is captured before the views draw a change of the
 * document (`onBeforeDraw`), so it follows the textures as they arrive and any edit. The area light helpers come from
 * the light helper overlay. Static.
 */
@Register
export class MaterialsEnvmapsBpcemExample extends Document {

  @Property({type: Boolean, value: true})
  declare boxProjected: boolean

  @Property({type: Number, value: 0.25})
  declare roughness: number

  public groundPlane: Mesh<PlaneGeometry, MeshStandardNodeMaterial>
  private defaultMat: MeshStandardNodeMaterial
  private boxProjectedMat: MeshStandardNodeMaterial
  private roughnessUniform = uniform( 0.25 )
  private cubeCamera: CubeCamera

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 45, 400 / 250, 0.1, 1000 )
    camera.name = 'Camera'
    camera.position.set( 0, 200, - 200 )
    camera.lookAt( 0, - 10, 0 )
    this.activeCamera = camera

    // cube camera for environment map

    const renderTarget = new CubeRenderTarget( 512 )
    renderTarget.texture.type = HalfFloatType
    renderTarget.texture.minFilter = LinearMipmapLinearFilter
    renderTarget.texture.magFilter = LinearFilter
    renderTarget.texture.generateMipmaps = true
    renderTarget.texture.mapping = CubeReflectionMapping

    this.cubeCamera = new CubeCamera( 1, 1000, renderTarget )
    this.cubeCamera.position.set( 0, - 100, 0 )

    // ground floor ( with box projected environment mapping )

    // Views draw on document changes only, so report each texture when it arrives.
    const loader = new TextureLoader()
    const onLoad = () => this.notify({kind: 'material'})
    const rMap = loader.load( 'https://threejs.org/examples/textures/lava/lavatile.jpg', onLoad )
    rMap.wrapS = RepeatWrapping
    rMap.wrapT = RepeatWrapping
    rMap.repeat.set( 2, 1 )

    this.defaultMat = new MeshStandardNodeMaterial()
    this.defaultMat.envNode = pmremTexture( renderTarget.texture )
    this.defaultMat.roughnessNode = texture( rMap ).mul( this.roughnessUniform )
    this.defaultMat.metalnessNode = float( 1 )

    this.boxProjectedMat = new MeshStandardNodeMaterial()
    this.boxProjectedMat.envNode = pmremTexture( renderTarget.texture, getParallaxCorrectNormal( reflectVector, vec3( 200, 200, 100 ), vec3( 0, - 50, 0 ) ) )
    this.boxProjectedMat.roughnessNode = texture( rMap ).mul( this.roughnessUniform )
    this.boxProjectedMat.metalnessNode = float( 1 )

    this.groundPlane = new Mesh( new PlaneGeometry( 200, 100, 100 ), this.boxProjectedMat )
    this.groundPlane.name = 'Floor'
    this.groundPlane.rotateX( - Math.PI / 2 )
    this.groundPlane.position.set( 0, - 49, 0 )
    this.scene.add( this.groundPlane )

    // walls

    const diffuseTex = loader.load( 'https://threejs.org/examples/textures/brick_diffuse.jpg', onLoad )
    const bumpTex = loader.load( 'https://threejs.org/examples/textures/brick_bump.jpg', onLoad )
    diffuseTex.colorSpace = SRGBColorSpace

    const wallMat = new MeshStandardNodeMaterial()

    wallMat.colorNode = texture( diffuseTex )
    wallMat.normalNode = bumpMap( texture( bumpTex ), float( 5 ) )

    const planeGeo = new PlaneGeometry( 100, 100 )

    const walls = new Group()
    walls.name = 'Walls'
    walls.userData.selectable = false
    this.scene.add( walls )

    const wall = ( name: string, x: number, z: number, rotationY: number ) => {
      const plane = new Mesh( planeGeo, wallMat )
      plane.name = name
      plane.position.set( x, 0, z )
      plane.rotateY( rotationY )
      walls.add( plane )
    }

    wall( 'Back 1', - 50, - 50, 0 )
    wall( 'Back 2', 50, - 50, 0 )
    wall( 'Front 1', - 50, 50, Math.PI )
    wall( 'Front 2', 50, 50, Math.PI )
    wall( 'Right', 100, 0, - Math.PI / 2 )
    wall( 'Left', - 100, 0, Math.PI / 2 )

    // area lights

    const width = 50
    const height = 50
    const intensity = 5

    const blueRectLight = new RectAreaLight( 0x9aaeff, intensity, width, height )
    blueRectLight.name = 'Blue'
    blueRectLight.position.set( - 99, 5, 0 )
    blueRectLight.lookAt( 0, 5, 0 )
    this.scene.add( blueRectLight )

    const redRectLight = new RectAreaLight( 0xf3aaaa, intensity, width, height )
    redRectLight.name = 'Red'
    redRectLight.position.set( 99, 5, 0 )
    redRectLight.lookAt( 0, 5, 0 )
    this.scene.add( redRectLight )
  }

  boxProjectedChanged() {
    if ( ! this.groundPlane ) return
    this.groundPlane.material = this.boxProjected ? this.boxProjectedMat : this.defaultMat
    this.notify({kind: 'material'})
  }

  roughnessChanged() {
    this.roughnessUniform.value = this.roughness
    this.notify({kind: 'material'})
  }

  /** Captures the room from the floor's position, without the floor. */
  override onBeforeDraw(renderer: WebGPURenderer) {
    const groundPlane = this.groundPlane
    const visible = groundPlane.visible

    groundPlane.visible = false

    this.cubeCamera.position.copy( groundPlane.position )

    this.cubeCamera.update( renderer, this.scene )

    groundPlane.visible = visible
  }
}

registerEditorConfig(MaterialsEnvmapsBpcemExample, [
  ['roughness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(MaterialsEnvmapsBpcemExample, {
  Main: ['boxProjected', 'roughness'],
  Hidden: ['groundPlane', 'defaultMat', 'boxProjectedMat', 'roughnessUniform', 'cubeCamera'],
})
