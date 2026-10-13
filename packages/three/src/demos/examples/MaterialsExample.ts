import { Color, Material, Mesh, MeshBasicNodeMaterial, MeshNormalMaterial, Node, RepeatWrapping, TextureLoader } from 'three/webgpu'
import type { CodeNodeInclude } from 'three/webgpu'
import {
  Fn,
  wgslFn,
  positionLocal,
  positionWorld,
  normalLocal,
  normalWorld,
  normalView,
  color,
  texture,
  uv,
  float,
  vec2,
  vec3,
  vec4,
  oscSine,
  triplanarTexture,
  screenUV,
  Loop,
  cameraProjectionMatrix
} from 'three/tsl'
import { TeapotGeometry } from 'three/addons/geometries/TeapotGeometry.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

/** Seconds in which the spin repeats: the timeline length, so looping is seamless. */
const SPIN_PERIOD = 20

/**
 * Seventeen teapots, each named after its node material: positions and normals as colors, textures, opacity and
 * alpha test, the camera projection, desaturation in a TSL `Fn` and in WGSL, triplanar and screen-space mapping, and a
 * blur in a TSL `Loop`. The source's orbiting camera and grid are dropped. Plays when opened.
 */
@Register
export class MaterialsExample extends Document {

  public objects: Mesh[] = []

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: SPIN_PERIOD}), ...args})

    this.scene.background = new Color( 0x000000 )

    // Materials

    // Views draw on document changes only, so report each texture when it arrives.
    const onLoad = () => this.notify({kind: 'material'})
    const textureLoader = new TextureLoader().setPath( 'https://threejs.org/examples/textures/' )

    const uvTexture = textureLoader.load( 'uv_grid_opengl.jpg', onLoad )
    uvTexture.wrapS = RepeatWrapping
    uvTexture.wrapT = RepeatWrapping

    const opacityTexture = textureLoader.load( 'alphaMap.jpg', onLoad )
    opacityTexture.wrapS = RepeatWrapping
    opacityTexture.wrapT = RepeatWrapping

    const materials: Record<string, Material> = {}
    let material: MeshBasicNodeMaterial

    //
    //	BASIC
    //

    material = new MeshBasicNodeMaterial()
    material.colorNode = positionLocal
    materials.PositionLocal = material

    material = new MeshBasicNodeMaterial()
    material.colorNode = positionWorld
    materials.PositionWorld = material

    material = new MeshBasicNodeMaterial()
    material.colorNode = normalLocal
    materials.NormalLocal = material

    material = new MeshBasicNodeMaterial()
    material.colorNode = normalWorld
    materials.NormalWorld = material

    material = new MeshBasicNodeMaterial()
    material.colorNode = normalView
    materials.NormalView = material

    material = new MeshBasicNodeMaterial()
    material.colorNode = texture( uvTexture )
    materials.Texture = material

    material = new MeshBasicNodeMaterial()
    material.colorNode = color( 0x0099FF )
    material.opacityNode = texture( uvTexture )
    material.transparent = true
    materials.Opacity = material

    material = new MeshBasicNodeMaterial()
    material.colorNode = texture( uvTexture )
    material.opacityNode = texture( opacityTexture )
    material.alphaTestNode = float( 0.5 )
    materials.AlphaTest = material

    // Follows the camera of each view.
    material = new MeshBasicNodeMaterial()
    material.colorNode = cameraProjectionMatrix.mul( positionLocal )
    materials.Camera = material

    const normalMaterial = new MeshNormalMaterial()
    normalMaterial.opacity = .5
    normalMaterial.transparent = true
    materials.Normal = normalMaterial

    //
    //	ADVANCED
    //

    // Custom ShaderNode ( desaturate filter )

    const desaturateShaderNode = Fn( ( input: { color: Node<'vec4'> } ) => {
      return vec3( 0.299, 0.587, 0.114 ).dot( input.color.xyz )
    } )

    material = new MeshBasicNodeMaterial()
    material.colorNode = desaturateShaderNode( { color: texture( uvTexture ) } )
    materials.Desaturate = material

    // Custom ShaderNode(no inputs) > Approach 2

    const desaturateNoInputsShaderNode = Fn( () => {
      return vec3( 0.299, 0.587, 0.114 ).dot( texture( uvTexture ).xyz )
    } )

    material = new MeshBasicNodeMaterial()
    material.colorNode = desaturateNoInputsShaderNode()
    materials.DesaturateNoInputs = material

    // Custom WGSL ( desaturate filter )

    const desaturateWGSLFn = wgslFn( `
      fn desaturate( color:vec3<f32> ) -> vec3<f32> {

        let lum = vec3<f32>( 0.299, 0.587, 0.114 );

        return vec3<f32>( dot( lum, color ) );

      }
    ` )

    // include example

    const someWGSLFn = wgslFn( `
      fn someFn( color:vec3<f32> ) -> vec3<f32> {

        return desaturate( color );

      }
    `, [ desaturateWGSLFn as unknown as CodeNodeInclude ] ) // @types/three 0.186 types includes as code nodes only

    material = new MeshBasicNodeMaterial()
    material.colorNode = someWGSLFn( { color: texture( uvTexture ) } ) as Node<'vec3'>
    materials.DesaturateWGSL = material

    // Custom WGSL

    const getWGSLTextureSample = wgslFn( `
      fn getWGSLTextureSample( tex: texture_2d<f32>, tex_sampler: sampler, uv:vec2<f32> ) -> vec4<f32> {

        return textureSample( tex, tex_sampler, uv ) * vec4<f32>( 0.0, 1.0, 0.0, 1.0 );

      }
    ` )

    const textureNode = texture( uvTexture )

    material = new MeshBasicNodeMaterial()
    material.colorNode = getWGSLTextureSample( { tex: textureNode, tex_sampler: textureNode, uv: uv() } ) as Node<'vec4'>
    materials.TextureSampleWGSL = material

    // Triplanar Texture Mapping
    material = new MeshBasicNodeMaterial()
    material.colorNode = triplanarTexture( texture( uvTexture ), null, null, float( .01 ) )
    materials.Triplanar = material

    // Screen Projection Texture
    material = new MeshBasicNodeMaterial()
    material.colorNode = texture( uvTexture, screenUV.flipY() )
    materials.ScreenProjection = material

    // Loop
    material = new MeshBasicNodeMaterial()
    materials.Loop = material

    const loopCount = 10
    // The loop's result is the value its body returns; @types/three 0.186 types a loop as void.
    material.colorNode = Loop( loopCount, ( { i } ) => {
      const output = vec4().toVar()
      const scale = oscSine( this.timeline.timeNode ).mul( .09 ) // just a value to test

      const scaleI = scale.mul( i )
      const scaleINeg = scaleI.negate()

      const leftUV = uv().add( vec2( scaleI, 0 ) )
      const rightUV = uv().add( vec2( scaleINeg, 0 ) )
      const topUV = uv().add( vec2( 0, scaleI ) )
      const bottomUV = uv().add( vec2( 0, scaleINeg ) )

      output.assign( output.add( texture( uvTexture, leftUV ) ) )
      output.assign( output.add( texture( uvTexture, rightUV ) ) )
      output.assign( output.add( texture( uvTexture, topUV ) ) )
      output.assign( output.add( texture( uvTexture, bottomUV ) ) )

      return output.div( loopCount * 4 )
    } ) as unknown as Node<'vec4'>

    //
    // Geometry
    //

    const geometry = new TeapotGeometry( 50, 18 )

    for ( const [ name, material ] of Object.entries( materials ) ) {
      this.addMesh( name, geometry, material )
    }

    this.pose( 0 )
  }

  private addMesh(name: string, geometry: TeapotGeometry, material: Material) {
    const mesh = new Mesh( geometry, material )
    mesh.name = name

    mesh.position.x = ( this.objects.length % 4 ) * 200 - 400
    mesh.position.z = Math.floor( this.objects.length / 4 ) * 200 - 200

    mesh.rotation.x = Math.random() * 200 - 100
    mesh.rotation.y = Math.random() * 200 - 100
    mesh.rotation.z = Math.random() * 200 - 100
    mesh.userData.rotation = mesh.rotation.clone()

    this.objects.push( mesh )
    this.scene.add( mesh )
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    // The source turns 0.01 and 0.005 rad per frame about x and y.
    const angle = time / SPIN_PERIOD * Math.PI * 2
    for ( const object of this.objects ) {
      object.rotation.x = object.userData.rotation.x + angle * 2
      object.rotation.y = object.userData.rotation.y + angle
    }
  }
}
