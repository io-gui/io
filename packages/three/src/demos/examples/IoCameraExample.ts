import { PerspectiveCamera, OrthographicCamera, Group, BufferGeometry, Float32BufferAttribute, MathUtils, Mesh, MeshBasicMaterial, Points, PointsMaterial, SphereGeometry } from 'three/webgpu'
import { Register, ReactiveProperty } from '@io-gui/core'
import { Split, ioSplit } from '@io-gui/layout'
import { ioNumberSlider } from '@io-gui/sliders'
import { ioPropertyEditor, registerEditorConfig, ioObject } from '@io-gui/editors'
import { ThreeApplet, IoThreeExample, ioThreeViewport, ThreeAppletProps } from '@io-gui/three'

const frustumSize = 600

@Register
export class CameraExample extends ThreeApplet {

  public perspectiveCamera: PerspectiveCamera
  public orthographicCamera: OrthographicCamera
  public cameraRig: Group
  public mesh: Mesh

  constructor(args: ThreeAppletProps) {
    super(args)

    this.perspectiveCamera = new PerspectiveCamera( 50, 0.5, 150, 1000 )
    this.perspectiveCamera.name = 'perspective'

    this.orthographicCamera = new OrthographicCamera( -1, 1, 1, -1, 150, 1000 )
    this.orthographicCamera.name = 'orthographic'

    this.orthographicCamera.rotation.y = Math.PI
    this.perspectiveCamera.rotation.y = Math.PI

    this.cameraRig = new Group()

    this.cameraRig.add( this.perspectiveCamera )
    this.cameraRig.add( this.orthographicCamera )

    this.scene.add( this.cameraRig )

    //

    this.mesh = new Mesh(
      new SphereGeometry( 100, 16, 8 ),
      new MeshBasicMaterial( { color: 0xffffff, wireframe: true } )
    )
    this.scene.add( this.mesh )

    const mesh2 = new Mesh(
      new SphereGeometry( 50, 16, 8 ),
      new MeshBasicMaterial( { color: 0x00ff00, wireframe: true } )
    )
    mesh2.position.y = 150
    this.mesh.add( mesh2 )

    const mesh3 = new Mesh(
      new SphereGeometry( 5, 16, 8 ),
      new MeshBasicMaterial( { color: 0x0000ff, wireframe: true } )
    )
    mesh3.position.z = 150
    this.cameraRig.add( mesh3 )

    const geometry = new BufferGeometry()
    const vertices = []

    for ( let i = 0; i < 10000; i ++ ) {

      vertices.push( MathUtils.randFloatSpread( 2000 ) )
      vertices.push( MathUtils.randFloatSpread( 2000 ) )
      vertices.push( MathUtils.randFloatSpread( 2000 ) )

    }

    geometry.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) )

    const particles = new Points( geometry, new PointsMaterial( { color: 0xffffff } ) )
    this.scene.add( particles )
  }

  onResized(width: number, height: number) {
    super.onResized(width, height)
    this.perspectiveCamera.aspect =  width / height
  }
  onAnimate() {
    const r = Date.now() * 0.0005

    this.mesh.position.x = 700 * Math.cos( r )
    this.mesh.position.z = 700 * Math.sin( r )
    this.mesh.position.y = 700 * Math.sin( r )

    this.mesh.children[ 0 ].position.x = 70 * Math.cos( 2 * r )
    this.mesh.children[ 0 ].position.z = 70 * Math.sin( r )

    this.perspectiveCamera.fov = 35 + 30 * Math.sin( 0.5 * r )
    this.perspectiveCamera.far = this.mesh.position.length()
    this.perspectiveCamera.updateProjectionMatrix()

    const aspect = this.perspectiveCamera.aspect

    this.orthographicCamera.left = - frustumSize * aspect / 2 * (Math.sin( 0.5 * r ) / 2 + 0.5)
    this.orthographicCamera.right = frustumSize * aspect / 2 * (Math.sin( 0.5 * r ) / 2 + 0.5)
    this.orthographicCamera.top = frustumSize / 2 * (Math.sin( 0.5 * r ) / 2 + 0.5)
    this.orthographicCamera.bottom = - frustumSize / 2 * (Math.sin( 0.5 * r ) / 2 + 0.5)
    this.orthographicCamera.far = this.mesh.position.length()
    this.orthographicCamera.updateProjectionMatrix()

    this.cameraRig.lookAt(this.mesh.position)

    debug: {
      this.dispatchMutation(this.perspectiveCamera)
      this.dispatchMutation(this.perspectiveCamera.matrixWorld.elements)
      this.dispatchMutation(this.perspectiveCamera.projectionMatrix.elements)
      this.dispatchMutation(this.perspectiveCamera.projectionMatrixInverse.elements)
      this.dispatchMutation(this.orthographicCamera)
      this.dispatchMutation(this.orthographicCamera.matrixWorld.elements)
      this.dispatchMutation(this.orthographicCamera.projectionMatrix.elements)
      this.dispatchMutation(this.orthographicCamera.projectionMatrixInverse.elements)
    }
  }
}

const cameraObject = ioObject({expanded: true, widget: null,
  properties: ['fov','far','aspect','left','right','top','bottom','matrixWorld','projectionMatrix'],
  config: [
    ['far', ioNumberSlider({min: 700, max: 1000, step: 1})],
    ['left', ioNumberSlider({min: -500, max: 0, step: 0.1})],
    ['right', ioNumberSlider({min: 0, max: 500, step: 0.1})],
    ['top', ioNumberSlider({min: 0, max: 500, step: 0.1})],
    ['bottom', ioNumberSlider({min: -500, max: 0, step: 0.1})],
    ['matrixWorld', ioObject({expanded: true, label: 'matrixWorld', labeled: false, properties: ['elements']})],
    ['projectionMatrix', ioObject({expanded: true, label: 'projectionMatrix', labeled: false, properties: ['elements']})],
  ],
  groups: {
    Main: ['fov','far','aspect','left','right','top','bottom','matrixWorld'],
  },
})

registerEditorConfig(CameraExample, [
  ['perspectiveCamera', cameraObject],
  ['orthographicCamera', cameraObject],
])

@Register
export class IoCameraExample extends IoThreeExample {

  @ReactiveProperty({type: CameraExample, init: {playing: true}})
  declare applet: CameraExample

  ready() {

    this.render([
      ioSplit({
        elements: [
          ioThreeViewport({id: 'Perspective', applet: this.applet, cameraSelect: 'perspective'}),
          ioThreeViewport({id: 'ScenePerspective', applet: this.applet, cameraSelect: 'scene:perspective'}),
          ioThreeViewport({id: 'SceneOrthographic', applet: this.applet, cameraSelect: 'scene:orthographic'}),
          ioPropertyEditor({id: 'PropertyEditor', value: this.applet, properties: ['perspectiveCamera','orthographicCamera']})
        ],
        split: new Split({
          type: 'split',
          orientation: 'horizontal',
          children: [
            {
              type: 'panel',flex: '1 1 33.33%',tabs: [{id: 'Perspective'}]
            },
            {
              type: 'split',
              flex: '1 1 33.33%',
              orientation: 'vertical',
              children: [
                {type: 'panel',flex: '1 1 33.33%',tabs: [{id: 'ScenePerspective'}]},
                {type: 'panel',flex: '1 1 33.33%',tabs: [{id: 'SceneOrthographic'}]},
              ]
            },
            {
              type: 'panel',
              flex: '0 0 280px',
              tabs: [{id: 'PropertyEditor'}]
            }
          ]
        })
      })
    ])

  }

}

export const ioCameraExample = IoCameraExample.vConstructor
