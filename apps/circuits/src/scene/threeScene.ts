import {
  AmbientLight,
  BoxGeometry,
  CapsuleGeometry,
  Color,
  Group,
  InstancedMesh,
  Matrix4,
  MeshPhongMaterial,
  Object3D,
  PerspectiveCamera,
  PointLight,
  Quaternion,
  SphereGeometry,
  Vector2,
  Vector3,
} from 'three/webgpu'
import { Register } from '@io-gui/core'
import { ThreeApplet, ThreeAppletProps } from '@io-gui/three'
import { Pad } from '../game/items/pad'
import { Line } from '../game/items/line'
import { Pads } from '../game/pads'
import { Grid } from './grid'

const PAD_SPHERE_RADIUS = 0.25
const TERMINAL_BOX_SIZE = 0.5
const LINE_CAPSULE_RADIUS = 0.12
const LINE_CAPSULE_AXIS_LENGTH = 1
const LINE_DIAGONAL_INSET = 0.035
const LINE_LAYER_BEHIND_Z = -0.25
const LINE_LAYER_MINUS_ONE_WIDTH_FACTOR = 1.5
const LINE_LAYER_MINUS_ONE_COLOR_FACTOR = 0.25

const _yAxis = new Vector3(0, 1, 0)
const _targetVector = new Vector3()
const _segmentDir = new Vector3()
const _segmentQuat = new Quaternion()
const _segmentScale = new Vector3()
const _segmentPosition = new Vector3()

@Register
export class ThreeScene extends ThreeApplet {

  public camera: PerspectiveCamera = new PerspectiveCamera( 25, 1, 0.1, 1000 )
  public cameraRig: Group = new Group()
  public cameraTarget: Object3D = new Object3D()
  public grid: Grid = new Grid()
  public pads: InstancedMesh
  public terminals: InstancedMesh
  public lines: InstancedMesh

  static padGeometry: SphereGeometry = new SphereGeometry(PAD_SPHERE_RADIUS, 16, 12)
  static padMaterial: MeshPhongMaterial = new MeshPhongMaterial({ vertexColors: true })
  static terminalGeometry: BoxGeometry = new BoxGeometry(TERMINAL_BOX_SIZE, TERMINAL_BOX_SIZE, TERMINAL_BOX_SIZE * 0.6)
  static terminalMaterial: MeshPhongMaterial = new MeshPhongMaterial({ vertexColors: true })
  static lineGeometry: CapsuleGeometry = new CapsuleGeometry(LINE_CAPSULE_RADIUS, LINE_CAPSULE_AXIS_LENGTH, 4, 8)
  static lineMaterial: MeshPhongMaterial = new MeshPhongMaterial({ vertexColors: true })

  public _drag: Vector3 = new Vector3()

  constructor(args: ThreeAppletProps) {
    super(args)

    this.scene.add(this.cameraRig)
    this.cameraRig.add(this.camera)
    this.cameraRig.add(this.cameraTarget)

    this.scene.add(this.grid)

    this.pads = new InstancedMesh(ThreeScene.padGeometry, ThreeScene.padMaterial, 0)
    this.terminals = new InstancedMesh(ThreeScene.terminalGeometry, ThreeScene.terminalMaterial, 0)
    this.lines = new InstancedMesh(ThreeScene.lineGeometry, ThreeScene.lineMaterial, 0)

    const ambientLight = new AmbientLight( 0xcccccc, 1.5 )
    this.scene.add( ambientLight )

    const pointLight = new PointLight( 0xffffff, 2.5, 0, 0 )
    pointLight.position.set( 0, 0, 500 )
    this.scene.add( pointLight )
  }

  updateDrag(screen: Vector2, screenStart: Vector2) {
    this._drag.set(screen.x - screenStart.x, screen.y - screenStart.y, 0)
  }

  initGrid(width: number, height: number) {
    const segmentWidth = Math.max(width - 1, 1)
    const segmentHeight = Math.max(height - 1, 1)
    this.camera.aspect = segmentWidth / segmentHeight
    // calculate distance to contain grid in view
    const halfFovRad = this.camera.fov * Math.PI / 360
    const gridDistance = segmentHeight / (2 * Math.tan(halfFovRad))
    this.cameraRig.position.set(segmentWidth / 2, segmentHeight / 2, 0)
    this.camera.position.set(0, 0, gridDistance)
  }
  updateGrid(width: number, height: number, lines: Line[], pads: Pads) {
    this.grid.update(width, height, lines, pads)
  }

  // TODO: Fix empty instanced arrays

  updatePads(pads: Pads) {
    const nonTerminalPads: [Pad, number, number][] = []
    pads.forEach((pad, x, y) => {
      if (!pad.isTerminal) nonTerminalPads.push([pad, x, y])
    })
    if (this.pads.parent) {
      this.scene.remove(this.pads)
      if (nonTerminalPads.length === 0) return
    }

    this.pads = new InstancedMesh(ThreeScene.padGeometry, ThreeScene.padMaterial, nonTerminalPads.length)
    const matrix = new Matrix4()
    const padColor = new Color()
    for (let i = 0; i < nonTerminalPads.length; i++) {
      matrix.makeTranslation(nonTerminalPads[i][1], nonTerminalPads[i][2], 0)
      this.pads.setMatrixAt(i, matrix)
      padColor.copy(nonTerminalPads[i][0].renderColor)
      this.pads.setColorAt(i, padColor)
    }
    this.pads.instanceMatrix.needsUpdate = true
    if (this.pads.instanceColor) this.pads.instanceColor.needsUpdate = true
    this.scene.add(this.pads)
  }

  updateTerminals(pads: Pads) {
    const terminalPads: [Pad, number, number][] = []
    pads.forEach((pad, x, y) => {
      if (pad.isTerminal) terminalPads.push([pad, x, y])
    })
    if (this.terminals.parent) {
      this.scene.remove(this.terminals)
    }
    this.terminals = new InstancedMesh(
      ThreeScene.terminalGeometry,
      ThreeScene.terminalMaterial,
      terminalPads.length
    )
    const matrix = new Matrix4()
    const terminalColor = new Color()
    for (let i = 0; i < terminalPads.length; i++) {
      matrix.makeTranslation(terminalPads[i][1], terminalPads[i][2], 0)
      this.terminals.setMatrixAt(i, matrix)
      terminalColor.copy(terminalPads[i][0].renderColor)
      this.terminals.setColorAt(i, terminalColor)
    }
    this.terminals.instanceMatrix.needsUpdate = true
    if (this.terminals.instanceColor) this.terminals.instanceColor.needsUpdate = true
    this.scene.add(this.terminals)
  }
  updateLines(lines: Line[]) {
    if (this.lines.parent) {
      this.scene.remove(this.lines)
    }
    const segmentCount = lines.reduce((n, line) => n + Math.max(0, line.pos.length - 1), 0)
    this.lines = new InstancedMesh(
      ThreeScene.lineGeometry,
      ThreeScene.lineMaterial,
      segmentCount
    )
    const matrix = new Matrix4()
    const lineColor = new Color()
    let idx = 0
    for (const line of lines) {
      lineColor.copy(line.renderColor)
      if (line.layer === 0) {
        lineColor.multiplyScalar(LINE_LAYER_MINUS_ONE_COLOR_FACTOR)
      }
      const pos = line.pos
      const isBehind = line.layer === 0
      const widthScale = isBehind ? LINE_LAYER_MINUS_ONE_WIDTH_FACTOR : 1
      const segmentZ = isBehind ? LINE_LAYER_BEHIND_Z : 0
      for (let j = 0; j < pos.length - 1; j++) {
        const ax = pos[j].x
        const ay = pos[j].y
        const bx = pos[j + 1].x
        const by = pos[j + 1].y
        _segmentPosition.set((ax + bx) / 2, (ay + by) / 2, segmentZ)
        const dx = bx - ax
        const dy = by - ay
        const segmentLength = Math.sqrt(dx * dx + dy * dy) || 1
        const isDiagonal = segmentLength > 1.01
        const effectiveLength = isDiagonal ? segmentLength - 2 * LINE_DIAGONAL_INSET : segmentLength
        _segmentDir.set(dx / segmentLength, dy / segmentLength, 0)
        _segmentQuat.setFromUnitVectors(_yAxis, _segmentDir)
        _segmentScale.set(widthScale, effectiveLength / LINE_CAPSULE_AXIS_LENGTH, widthScale)
        matrix.compose(
          _segmentPosition,
          _segmentQuat,
          _segmentScale
        )
        this.lines.setMatrixAt(idx, matrix)
        this.lines.setColorAt(idx, lineColor)
        idx++
      }
    }
    this.lines.instanceMatrix.needsUpdate = true
    if (this.lines.instanceColor) this.lines.instanceColor.needsUpdate = true
    this.scene.add(this.lines)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAnimate(delta: number, time: number) {
    const segmentWidth = Math.max(this.grid.width - 1, 0)
    const segmentHeight = Math.max(this.grid.height - 1, 0)
    this.camera.position.x = ((this.camera.position.x * 9) - this._drag.x * 0.25 * segmentWidth) / 10
    this.camera.position.y = ((this.camera.position.y * 9) - this._drag.y * 0.25 * segmentHeight) / 10

    this.cameraTarget.position.x = ((this.cameraTarget.position.x * 9) - this._drag.x * 0.02 * segmentWidth) / 10
    this.cameraTarget.position.y = ((this.cameraTarget.position.y * 9) - this._drag.y * 0.02 * segmentHeight) / 10

    this.camera.lookAt(_targetVector.setFromMatrixPosition(this.cameraTarget.matrixWorld))
  }

}
