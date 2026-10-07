import type { ViewInputEvent } from './ViewInputEvent.js'

/** Default priority bands (ADR-0004). Higher captures first. */
export const BehaviorPriority = {
  modal: 1000,
  gizmo: 800,
  tool: 500,
  navigation: 300,
  fallback: 100,
  contextMenu: 50,
} as const

/**
 * Anything that wants input in a viewport. The InputRouter offers presses, wheel and key events in
 * priority order; the first behavior whose `wantsCapture` returns true owns the pointer stream until it ends.
 */
export interface Behavior {
  readonly priority: number
  /**
   * While this behavior has captured, a new pointer may be claimed by another behavior,
   * which cancels this one (for example a second touch turning a tool drag into a pan).
   */
  readonly allowsStealing?: boolean
  /** Called for `pointerdown` and `wheel` when nothing has captured (and for stealing). */
  wantsCapture(event: ViewInputEvent): boolean
  /** Capture starts. For `wheel` the router calls `end` right after. */
  begin(event: ViewInputEvent): void
  /** Moves of captured pointers, and extra `pointerdown` / `pointerup` while other captured pointers remain. */
  update(event: ViewInputEvent): void
  /** The last captured pointer was released. */
  end(event: ViewInputEvent): void
  /** Capture was lost or taken away. */
  cancel(event?: ViewInputEvent): void
  /** Pointer moves while nothing has captured. Return true to claim hover; lower behaviors are not asked. */
  hover?(event: ViewInputEvent): boolean
  /** Hover moved to another behavior, or the pointer left the viewport. */
  hoverEnd?(event?: ViewInputEvent): void
  /** Key events. Return true when handled. */
  key?(event: ViewInputEvent): boolean
}
