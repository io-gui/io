import { Register, ReactiveObject, ReactiveObjectProps, Property, Change } from '@io-gui/core'
import { WebGPURenderer } from 'three/webgpu'
import { ChangeBus, DocumentChange } from './ChangeBus.js'
import { ThreeDocument } from './ThreeDocument.js'
import { renderScheduler, FrameInfo, ScheduledTicker } from '../render/RenderScheduler.js'
import { OperatorRegistry } from '../tools/Operator.js'
import { ToolDefinition, ToolRegistry } from '../tools/Tool.js'
import type { ViewKind } from '../view/ThreeView.js'
import type { IoThreeViewport } from '../elements/IoThreeViewport.js'

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

  public _renderer: WebGPURenderer | null = null

  // Created lazily: change handlers can run inside the base constructor, before class fields exist.
  declare private _operators: OperatorRegistry | undefined
  declare private _tools: ToolRegistry | undefined

  constructor(args?: ThreeEditorProps) {
    super({...args, document: args?.document ?? new ThreeDocument()})
    this.isPlayingChanged()
  }

  get operators(): OperatorRegistry {
    if (!this._operators) this._operators = new OperatorRegistry(this)
    return this._operators
  }

  get tools(): ToolRegistry {
    if (!this._tools) this._tools = new ToolRegistry()
    return this._tools
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
    if (change.oldValue && change.oldValue !== change.value) this._operators?.cancelRunning()
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
  notify(change: Omit<DocumentChange, 'source'> & {source?: object}) {
    this.document.notify({kind: change.kind, ids: change.ids})
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

  /**
   * @deprecated Size belongs to each view (ADR-0002). Called when a viewport showing this editor resizes;
   * with several viewports, the last one resized wins.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onResized(width: number, height: number, viewport?: IoThreeViewport) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAnimate(delta: number, time: number) {}

  override dispose() {
    this._operators?.cancelRunning()
    this.isPlaying = false
    renderScheduler.removeTicker(this)
    super.dispose()
  }
}
