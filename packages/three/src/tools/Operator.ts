import type { ThreeEditor } from '../editor/ThreeEditor.js'
import type { ThreeDocument } from '../editor/ThreeDocument.js'
import type { Transaction } from '../editor/Transaction.js'
import type { ThreeView } from '../view/ThreeView.js'
import type { InputRouter } from '../input/InputRouter.js'
import type { InputHost, ViewInputEvent } from '../input/ViewInputEvent.js'
import { Behavior, BehaviorPriority } from '../input/Behavior.js'

export type OperatorStatus = 'running' | 'finished' | 'cancelled'
export type OperatorProps = Record<string, unknown>

/** A viewport an operator can run in: input host plus its router (for modal operators). */
export type OperatorHost = InputHost & {readonly inputRouter: InputRouter}

export interface OperatorContext {
  readonly editor: ThreeEditor
  readonly document: ThreeDocument
  /** Open transaction for this run; committed on `finished`, rolled back on `cancelled`. */
  readonly transaction: Transaction
  readonly host: OperatorHost | null
  readonly view: ThreeView | null
}

export type OperatorPollContext = Omit<OperatorContext, 'transaction'>

/**
 * One action with one undo record (ADR-0004, ADR-0008). Edits go through `ctx.transaction` only.
 * Short operators implement `exec`. Interactive ones return `'running'` from `invoke` and then receive
 * every viewport event in `modal` until they return `'finished'` or `'cancelled'`.
 */
export interface Operator {
  poll?(ctx: OperatorPollContext): boolean
  invoke?(ctx: OperatorContext, event?: ViewInputEvent): OperatorStatus
  modal?(ctx: OperatorContext, event: ViewInputEvent): OperatorStatus
  exec(ctx: OperatorContext): Exclude<OperatorStatus, 'running'>
  cancel?(ctx: OperatorContext): void
}

export interface OperatorType {
  readonly id: string
  readonly label?: string
  create(props: OperatorProps): Operator
}

/**
 * What a finished operator run means as a Maya-style command: a name plus serializable arguments.
 * Recorded now so a command journal, repeat-last and macros can be added later (plan Phase 8).
 */
export interface Command {
  readonly name: string
  readonly args: OperatorProps
}

type RunningOperator = {
  type: OperatorType
  props: OperatorProps
  operator: Operator
  ctx: OperatorContext
  behavior: ModalOperatorBehavior | null
}

class ModalOperatorBehavior implements Behavior {
  readonly priority: number = BehaviorPriority.modal
  readonly modal = true

  constructor(private readonly registry: OperatorRegistry) {}

  wantsCapture() { return false }
  begin() {}
  end() {}
  update(event: ViewInputEvent) { this.registry._modalEvent(event) }
  cancel() { this.registry.cancelRunning() }
  key(event: ViewInputEvent) {
    if (event.type === 'keydown' && event.code === 'Escape') this.registry.cancelRunning()
    else this.registry._modalEvent(event)
    return true
  }
}

/**
 * Registered operator types of one editor, and the runner. At most one operator runs modally at a time;
 * starting another, or switching documents, cancels it.
 */
export class OperatorRegistry {

  private readonly _types = new Map<string, OperatorType>()
  private _running: RunningOperator | null = null
  private _lastCommand: Command | null = null

  constructor(private readonly editor: ThreeEditor) {}

  register(type: OperatorType) {
    debug: {
      if (this._types.has(type.id)) console.warn(`OperatorRegistry: replacing operator "${type.id}"`)
    }
    this._types.set(type.id, type)
  }

  get(id: string) {
    return this._types.get(id)
  }

  list(): OperatorType[] {
    return [...this._types.values()]
  }

  get running(): Operator | null {
    return this._running?.operator ?? null
  }

  /** The command equivalent of the last finished run. */
  get lastCommand(): Command | null {
    return this._lastCommand
  }

  /**
   * Runs an operator. With a `host`, a modal operator takes over that viewport's input
   * (`InputRouter.startModal`) until it finishes; Escape cancels it.
   */
  run(id: string, props: OperatorProps = {}, options: {host?: OperatorHost | null; event?: ViewInputEvent} = {}): OperatorStatus {
    const type = this._types.get(id)
    if (!type) {
      console.error(`OperatorRegistry: no operator "${id}"`)
      return 'cancelled'
    }
    if (this._running) this.cancelRunning()

    const host = options.host ?? null
    const document = this.editor.document
    const pollContext: OperatorPollContext = {editor: this.editor, document, host, view: host?.view ?? null}
    const operator = type.create(props)
    if (operator.poll && !operator.poll(pollContext)) return 'cancelled'

    const ctx: OperatorContext = {...pollContext, transaction: document.begin(type.label ?? type.id)}
    let status: OperatorStatus
    try {
      status = operator.invoke ? operator.invoke(ctx, options.event) : operator.exec(ctx)
    } catch (error) {
      if (ctx.transaction.state === 'open') ctx.transaction.rollback()
      throw error
    }
    if (status !== 'running') {
      this._settle({type, props, operator, ctx, behavior: null}, status)
      return status
    }
    debug: {
      if (!operator.modal) console.error(`OperatorRegistry: "${id}" returned 'running' but has no modal()`)
    }
    const behavior = host ? new ModalOperatorBehavior(this) : null
    this._running = {type, props, operator, ctx, behavior}
    if (host && behavior) host.inputRouter.startModal(behavior)
    return status
  }

  /** Cancels the running modal operator, rolling back its edits. */
  cancelRunning() {
    const running = this._running
    if (!running) return
    this._running = null
    running.operator.cancel?.(running.ctx)
    this._settle(running, 'cancelled')
  }

  /** @internal Feeds a viewport event to the running modal operator. */
  _modalEvent(event: ViewInputEvent) {
    const running = this._running
    if (!running?.operator.modal) return
    const status = running.operator.modal(running.ctx, event)
    if (status === 'running') return
    this._running = null
    this._settle(running, status)
  }

  private _settle(run: RunningOperator, status: Exclude<OperatorStatus, 'running'>) {
    if (run.behavior) run.ctx.host?.inputRouter.endModal(run.behavior)
    const transaction = run.ctx.transaction
    if (transaction.state !== 'open') return
    if (status === 'finished') {
      transaction.commit()
      this._lastCommand = {name: run.type.id, args: run.props}
    } else {
      transaction.rollback()
    }
  }
}
