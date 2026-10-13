import {
  BufferGeometry,
  Color,
  ColorRepresentation,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  Mesh,
  MeshPhongMaterial,
  PlaneGeometry
} from 'three/webgpu'
import { STLLoader } from 'three/addons/loaders/STLLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/** Binary STL with per-face colors: `STLLoader` sets these on the geometry. */
type ColoredGeometry = BufferGeometry & {hasColors?: boolean; alpha?: number}

/**
 * Four STL files on a floor: an ASCII slotted disk, two binary PR2 head parts and a binary file with face colors.
 * The source's orbiting camera is dropped.
 */
@Register
export class LoaderStlExample extends Document {

  public models: Group

  constructor(args?: DocumentProps) {
    super(args)

    this.scene.background = new Color( 0x72645b )
    this.scene.fog = new Fog( 0x72645b, 2, 15 )

    // Ground

    const plane = new Mesh(
      new PlaneGeometry( 40, 40 ),
      new MeshPhongMaterial( { color: 0xcbcbcb, specular: 0x474747 } )
    )
    plane.name = 'Ground'
    plane.rotation.x = - Math.PI / 2
    plane.position.y = - 0.5
    plane.receiveShadow = true
    plane.userData.selectable = false
    this.scene.add( plane )

    this.models = new Group()
    this.models.name = 'Models'
    this.scene.add( this.models )

    // Lights

    const hemiLight = new HemisphereLight( 0x8d7c7c, 0x494966, 3 )
    hemiLight.name = 'Hemisphere'
    this.scene.add( hemiLight )

    this.addShadowedLight( 'Key', 1, 1, 1, 0xffffff, 3.5 )
    this.addShadowedLight( 'Fill', 0.5, 1, - 1, 0xffd500, 3 )

    void this.loadModels()
  }

  private addShadowedLight(name: string, x: number, y: number, z: number, color: ColorRepresentation, intensity: number) {
    const directionalLight = new DirectionalLight( color, intensity )
    directionalLight.name = name
    directionalLight.position.set( x, y, z )
    this.scene.add( directionalLight )

    directionalLight.castShadow = true

    const d = 1

    directionalLight.shadow.camera.left = - d
    directionalLight.shadow.camera.right = d
    directionalLight.shadow.camera.top = d
    directionalLight.shadow.camera.bottom = - d

    directionalLight.shadow.camera.near = 1
    directionalLight.shadow.camera.far = 4

    directionalLight.shadow.bias = - 0.002
  }

  private addMesh(name: string, mesh: Mesh) {
    mesh.name = name
    mesh.castShadow = true
    mesh.receiveShadow = true
    this.models.add( mesh )
  }

  private async loadModels() {
    const loader = new STLLoader().setPath( 'https://threejs.org/examples/models/stl/' )

    try {
      const [ disk, pan, tilt, colored ] = await Promise.all( [
        loader.loadAsync( 'ascii/slotted_disk.stl' ),
        loader.loadAsync( 'binary/pr2_head_pan.stl' ),
        loader.loadAsync( 'binary/pr2_head_tilt.stl' ),
        loader.loadAsync( 'binary/colored.stl' ) as Promise<ColoredGeometry>,
      ] )

      // ASCII file

      const diskMesh = new Mesh( disk, new MeshPhongMaterial( { color: 0xff9c7c, specular: 0x494949, shininess: 200 } ) )
      diskMesh.position.set( 0, - 0.25, 0.6 )
      diskMesh.rotation.set( 0, - Math.PI / 2, 0 )
      diskMesh.scale.set( 0.5, 0.5, 0.5 )
      this.addMesh( 'SlottedDisk', diskMesh )

      // Binary files

      const material = new MeshPhongMaterial( { color: 0xd5d5d5, specular: 0x494949, shininess: 200 } )

      const panMesh = new Mesh( pan, material )
      panMesh.position.set( 0, - 0.37, - 0.6 )
      panMesh.rotation.set( - Math.PI / 2, 0, 0 )
      panMesh.scale.set( 2, 2, 2 )
      this.addMesh( 'HeadPan', panMesh )

      const tiltMesh = new Mesh( tilt, material )
      tiltMesh.position.set( 0.136, - 0.37, - 0.6 )
      tiltMesh.rotation.set( - Math.PI / 2, 0.3, 0 )
      tiltMesh.scale.set( 2, 2, 2 )
      this.addMesh( 'HeadTilt', tiltMesh )

      // Colored binary STL

      let meshMaterial = material
      if ( colored.hasColors ) {
        meshMaterial = new MeshPhongMaterial( { opacity: colored.alpha, vertexColors: true } )
      }

      const coloredMesh = new Mesh( colored, meshMaterial )
      coloredMesh.position.set( 0.5, 0.2, 0 )
      coloredMesh.rotation.set( - Math.PI / 2, Math.PI / 2, 0 )
      coloredMesh.scale.set( 0.3, 0.3, 0.3 )
      this.addMesh( 'Colored', coloredMesh )

      this.notify({kind: 'structure'})
      // The models, not the scene: the floor spans 40 units.
      this.dispatch('frame-object', {object: this.models}, true)
    } catch ( e ) {
      console.error( e )
    }
  }
}
