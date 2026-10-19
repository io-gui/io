import {
  BoxGeometry,
  BufferGeometry,
  Color,
  DataTexture,
  Line,
  LineBasicNodeMaterial,
  Mesh,
  MeshBasicNodeMaterial,
  Node,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsNodeMaterial,
  RepeatWrapping,
  RGBAFormat,
  SphereGeometry,
  TextureLoader,
  Vector3,
  WebGPURenderer
} from 'three/webgpu'
import { vec2, uv, texture, mix, checker, normalLocal, positionLocal, color, oscSine, attribute } from 'three/tsl'
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

/**
 * Seconds in which the motion repeats: the timeline length. The box turns once and twice (the source's 0.01 and 0.02
 * rad per frame, rounded so they close the loop), and the scrolling UVs wrap.
 */
const PERIOD = 10

/**
 * A sampler of node materials: a box with scrolling UVs mixed with a checker, a sphere displaced by a texture, a
 * data texture plane, a KTX2 (UASTC) plane fading in and out on `oscSine`, colored points and a colored line. TSL
 * `time` is the document's. The KTX2 plane joins once its texture loads, after `detectSupport` in
 * `onRendererInitialized`. Plays when opened.
 */
@Register
export class SandboxExample extends Document {

  public box: Mesh

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 70, 400 / 250, 0.1, 10 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 4 )
    this.activeCamera = camera

    this.scene.background = new Color( 0x222222 )

    const time = this.timeline.timeNode

    // textures

    // Views draw on document changes only, so report each texture when it arrives.
    const textureLoader = new TextureLoader()
    const onLoad = () => this.notify({kind: 'material'})

    const uvTexture = textureLoader.load( 'https://threejs.org/examples/textures/uv_grid_opengl.jpg', onLoad )
    uvTexture.wrapS = RepeatWrapping
    uvTexture.wrapT = RepeatWrapping
    uvTexture.name = 'uv_grid'

    const textureDisplace = textureLoader.load( 'https://threejs.org/examples/textures/transition/transition1.png', onLoad )
    textureDisplace.wrapS = RepeatWrapping
    textureDisplace.wrapT = RepeatWrapping

    // box mesh

    const geometryBox = new BoxGeometry()
    const materialBox = new MeshBasicNodeMaterial()

    // birection speed
    const timerScaleNode = time.mul( vec2( - 0.5, 0.1 ) )
    const animateUV = uv().add( timerScaleNode )

    const textureNode = texture( uvTexture, animateUV )

    materialBox.colorNode = mix( textureNode, checker( animateUV ), 0.5 )

    this.box = new Mesh( geometryBox, materialBox )
    this.box.name = 'Box'
    this.box.position.set( 0, 1, 0 )
    this.scene.add( this.box )

    // displace example

    const geometrySphere = new SphereGeometry( .5, 64, 64 )
    const materialSphere = new MeshBasicNodeMaterial()

    const displaceY = texture( textureDisplace ).x.mul( 0.25 )

    const displace = normalLocal.mul( displaceY )

    materialSphere.colorNode = displaceY
    materialSphere.positionNode = positionLocal.add( displace )

    const sphere = new Mesh( geometrySphere, materialSphere )
    sphere.name = 'Sphere'
    sphere.position.set( - 2, - 1, 0 )
    this.scene.add( sphere )

    // data texture

    const geometryPlane = new PlaneGeometry()
    const materialPlane = new MeshBasicNodeMaterial()
    materialPlane.colorNode = texture( createDataTexture() ).add( color( 0x0000FF ) )
    materialPlane.transparent = true

    const plane = new Mesh( geometryPlane, materialPlane )
    plane.name = 'DataTexture'
    plane.position.set( 0, - 1, 0 )
    this.scene.add( plane )

    // points

    const points = []

    for ( let i = 0; i < 1000; i ++ ) {
      const point = new Vector3().random().subScalar( 0.5 )
      points.push( point )
    }

    const geometryPoints = new BufferGeometry().setFromPoints( points )
    const materialPoints = new PointsNodeMaterial()

    materialPoints.colorNode = positionLocal.mul( 3 )

    const pointCloud = new Points( geometryPoints, materialPoints )
    pointCloud.name = 'Points'
    pointCloud.position.set( 2, - 1, 0 )
    this.scene.add( pointCloud )

    // lines

    const geometryLine = new BufferGeometry().setFromPoints( [
      new Vector3( - 0.5, - 0.5, 0 ),
      new Vector3( 0.5, - 0.5, 0 ),
      new Vector3( 0.5, 0.5, 0 ),
      new Vector3( - 0.5, 0.5, 0 ),
      new Vector3( - 0.5, - 0.5, 0 )
    ] )

    geometryLine.setAttribute( 'color', geometryLine.getAttribute( 'position' ) )

    const materialLine = new LineBasicNodeMaterial()
    materialLine.colorNode = attribute<'vec3'>( 'color' )

    const line = new Line( geometryLine, materialLine )
    line.name = 'Line'
    line.position.set( 2, 1, 0 )
    this.scene.add( line )

    this.pose( this.timeline.currentTime )
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    void this.loadCompressed( renderer )
  }

  /** The KTX2 transcoder targets the formats the renderer's device supports. */
  private async loadCompressed( renderer: WebGPURenderer ) {
    try {
      const ktxLoader = new KTX2Loader().detectSupport( renderer )
      const ktxTexture = await ktxLoader.loadAsync( 'https://threejs.org/examples/textures/ktx2/2d_uastc.ktx2' )
      ktxLoader.dispose()

      // `NodeMaterial` applies `emissiveNode` on any material; @types/three 0.186 declares it only on lit ones.
      const materialCompressed = new MeshBasicNodeMaterial() as MeshBasicNodeMaterial & {emissiveNode: Node | null}
      materialCompressed.colorNode = texture( ktxTexture )
      materialCompressed.emissiveNode = oscSine( this.timeline.timeNode ).mix( color( 0x663300 ), color( 0x0000FF ) )
      materialCompressed.alphaTestNode = oscSine( this.timeline.timeNode )
      materialCompressed.transparent = true

      const geo = flipY( new PlaneGeometry() )
      const planeCompressed = new Mesh( geo, materialCompressed )
      planeCompressed.name = 'Compressed'
      planeCompressed.position.set( - 2, 1, 0 )
      this.scene.add( planeCompressed )

      this.notify({kind: 'structure'})
    } catch ( e ) {
      console.error( e )
    }
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    this.box.rotation.x = time / PERIOD * Math.PI * 2
    this.box.rotation.y = time / PERIOD * Math.PI * 4
  }
}

function createDataTexture() {
  const color = new Color( 0xff0000 )

  const width = 512
  const height = 512

  const size = width * height
  const data = new Uint8Array( 4 * size )

  const r = Math.floor( color.r * 255 )
  const g = Math.floor( color.g * 255 )
  const b = Math.floor( color.b * 255 )

  for ( let i = 0; i < size; i ++ ) {
    const stride = i * 4

    data[ stride ] = r
    data[ stride + 1 ] = g
    data[ stride + 2 ] = b
    data[ stride + 3 ] = 255
  }

  const texture = new DataTexture( data, width, height, RGBAFormat )
  texture.needsUpdate = true
  return texture
}

/** Correct UVs to be compatible with `flipY=false` textures. */
function flipY( geometry: PlaneGeometry ) {
  const uv = geometry.attributes.uv

  for ( let i = 0; i < uv.count; i ++ ) {
    uv.setY( i, 1 - uv.getY( i ) )
  }

  return geometry
}

registerEditorGroups(SandboxExample, {
  Hidden: ['box'],
})
