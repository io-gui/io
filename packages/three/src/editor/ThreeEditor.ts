import { Register, ReactiveObject, ReactiveObjectProps, Property, Field, Change } from '@io-gui/core'
import { WebGPURenderer } from 'three/webgpu'
import { ChangeBus, DocumentChange } from './ChangeBus.js'
import { ThreeDocument } from './ThreeDocument.js'
import { renderScheduler, FrameInfo, ScheduledTicker } from '../render/RenderScheduler.js'
import { OperatorRegistry } from '../tools/Operator.js'
import type { ToolDefinition } from '../tools/Tool.js'
import { Registry } from '../utils/Registry.js'
import { SelectionModel } from '../selection/SelectionModel.js'
import { translateOperatorType } from '../tools/operators/TranslateOperator.js'
import { translateTool } from '../tools/TranslateTool.js'
import { editModeToggleOperatorType, selectModeOperatorType } from '../tools/operators/EditModeOperators.js'
import type { ViewKind } from '../view/ThreeView.js'

export type ThreeEditorProps = ReactiveObjectProps & {
  document?: ThreeDocument
  mode?: string
  isPlaying?: boolean
}

/**
 * The app object (ADR-0002): one active ThreeDocument (switchable at runtime), the editor mode,
 * playback, operators and tools. Viewports read `editor.document`; they never hold a document themselves.
 */
@Register
export class ThreeEditor extends ReactiveObject implements ScheduledTicker {

  @Property({type: ThreeDocument})
  declare document: ThreeDocument

  /** `'object'`, `'edit'`, ... Picks the active tool and keymap entries with `when.mode`. */
  @Property({type: String, value: 'object'})
  declare mode: string

  @Property({type: Boolean, value: false})
  declare isPlaying: boolean

  /** Active tool id per `'<viewKind>:<mode>'`. Replace the object to change it (or use `setActiveTool`). */
  @Property({type: Object, init: null})
  declare activeTools: Record<string, string>

  /** Selection of the active document. Session state; each document keeps its own (ADR-0007). */
  @Property({type: SelectionModel})
  declare selection: SelectionModel

  public _renderer: WebGPURenderer | null = null

  /** Operators of this editor; built-ins (`transform.translate`, `object.editmode_toggle`, `mesh.select_mode`) are registered. */
  readonly operators = new OperatorRegistry(this)
    .register(translateOperatorType)
    .register(editModeToggleOperatorType)
    .register(selectModeOperatorType)

  /** Tools of this editor; built-ins (`transform.translate`) are registered but not active. */
  readonly tools = new Registry<ToolDefinition>().register(translateTool)

  /** Selection per document uuid. A Field: `documentChanged` runs inside the base constructor. */
  @Field(Map)
  declare private _selections: Map<string, SelectionModel>

  constructor(args?: ThreeEditorProps) {
    super({...args, document: args?.document ?? new ThreeDocument()})
    this.isPlayingChanged()
  }

  /** The active document's change bus; the scheduler drains it each frame. */
  get changeBus(): ChangeBus {
    return this.document.changeBus
  }

  setActiveTool(viewKind: ViewKind, mode: string, toolId: string | null) {
    const activeTools = {...this.activeTools}
    if (toolId) activeTools[`${viewKind}:${mode}`] = toolId
    else delete activeTools[`${viewKind}:${mode}`]
    this.activeTools = activeTools
  }

  getActiveTool(viewKind: ViewKind, mode: string = this.mode): ToolDefinition | null {
    const id = this.activeTools[`${viewKind}:${mode}`]
    return id ? this.tools.get(id) ?? null : null
  }

  documentChanged(change: Change<ThreeDocument>) {
    if (change.oldValue) {
      this.operators.cancelRunning()
      // Views tag themselves for the new document; changes left for the old one would never be drained.
      change.oldValue.changeBus.clear()
    }
    if (change.value) this.selection = this._selectionFor(change.value)
  }

  private _selectionFor(document: ThreeDocument) {
    let selection = this._selections.get(document.uuid)
    if (!selection) {
      selection = new SelectionModel({document})
      this._selections.set(document.uuid, selection)
    }
    return selection
  }

  isPlayingChanged() {
    if (this.isPlaying) {
      renderScheduler.addTicker(this)
    } else {
      renderScheduler.removeTicker(this)
    }
  }

  tick(frame: FrameInfo) {
    if (!this.isPlaying) return
    this.onAnimate(frame.delta, frame.time)
    this.document.notify({kind: 'time'})
  }

  /** Reports a change in the active document (the source is always the document). */
  notify(change: Omit<DocumentChange, 'source'>) {
    this.document.notify(change)
  }

  /** Redraws every view showing the active document on the next frame. */
  requestRender() {
    this.document.notify({kind: 'other'})
  }

  isRendererInitialized() {
    return !!this._renderer && this._renderer.initialized === true
  }

  onRendererInitialized(renderer: WebGPURenderer) {
    this._renderer = renderer
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAnimate(delta: number, time: number) {}

  override dispose() {
    this.operators.cancelRunning()
    for (const selection of this._selections.values()) selection.dispose()
    this.isPlaying = false
    renderScheduler.removeTicker(this)
    super.dispose()
  }
}
