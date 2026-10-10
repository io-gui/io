import { Register } from '@io-gui/core'
import { ACESFilmicToneMapping, BoxGeometry, BufferGeometry, CapsuleGeometry, CylinderGeometry, DirectionalLight, Group, HemisphereLight, IcosahedronGeometry, Mesh, MeshStandardMaterial, PlaneGeometry, TorusGeometry } from 'three/webgpu'
import { ThreeDocument, ThreeDocumentProps } from '@io-gui/three'
import { CanvasTexture, SRGBColorSpace } from 'three/webgpu'

/** 8×8 checker of `color` and light gray, so the UV view shows whose texture it lays out. */
export function checkerTexture(color: string) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 256
  const context = canvas.getContext('2d')!
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      context.fillStyle = (x + y) % 2 ? color : '#e8e8e8'
      context.fillRect(x * 32, y * 32, 32, 32)
    }
  }
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return texture
}

function shape(name: string, geometry: BufferGeometry, color: string, x: number, y: number, z: number) {
  const mesh = new Mesh(geometry, new MeshStandardMaterial({map: checkerTexture(color)}))
  mesh.name = name
  mesh.position.set(x, y, z)
  return mesh
}

/**
 * Primitives on a floor that cannot be selected, and a `Stack` group of two meshes; ACES tone mapping by default.
 */
@Register
export class EditorDocument2 extends ThreeDocument {
  constructor(args?: ThreeDocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.2, ...args})
    const sky = new HemisphereLight(0xddeeff, 0x332211, 1.2)
    sky.name = 'Sky'
    const sun = new DirectionalLight(0xffffff, 2)
    sun.name = 'Sun'
    sun.position.set(-4, 6, 3)
    this.scene.add(sky, sun)
    const floor = new Mesh(new PlaneGeometry(8, 6), new MeshStandardMaterial({color: 0x404040}))
    floor.name = 'Floor'
    floor.rotation.x = -Math.PI / 2
    floor.userData.selectable = false
    this.scene.add(floor)
    this.scene.add(shape('Icosahedron', new IcosahedronGeometry(0.7, 0), '#9b59b6', -2.5, 0.7, -1))
    this.scene.add(shape('Cylinder', new CylinderGeometry(0.5, 0.5, 1.4, 32), '#1abc9c', 0, 0.7, -1.5))
    this.scene.add(shape('Capsule', new CapsuleGeometry(0.4, 0.8, 8, 16), '#e67e22', 2.5, 0.8, -1))
    const stack = new Group()
    stack.name = 'Stack'
    stack.position.set(0, 0, 1.5)
    const ring = shape('Ring', new TorusGeometry(0.45, 0.15, 16, 48), '#e74c3c', 0, 0.55, 0)
    ring.rotation.x = Math.PI / 2
    stack.add(shape('Base', new BoxGeometry(1.4, 0.4, 1.4), '#34495e', 0, 0.2, 0), ring)
    this.scene.add(stack)
  }
}
