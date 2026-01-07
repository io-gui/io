---
name: Core Library Improvements
overview: Address foundational issues in @io-gui/core including memory leaks, performance optimizations, error handling, and API improvements. Issues are prioritized by urgency and impact.
todos:
  - id: fix-nodes-disposed-leak
    content: Fix memory leak in NODES.disposed Set
    status: completed
  - id: error-handling-changequeue
    content: Add try/catch error handling in ChangeQueue.dispatch()
    status: completed
  - id: fix-changequeue-on2
    content: Fix O(n²) splice loop in ChangeQueue.dispatch()
    status: completed
  - id: observation-arrays-to-sets
    content: Convert _observedObjectProperties and _observedNodeProperties to Sets
    status: completed
  - id: optimize-queue-lookups
    content: Optimize Queue.ts with Set for O(1) function lookups
    status: completed
  - id: optimize-binding-targets
    content: Change Binding.targets from Array to Set
    status: completed
  - id: add-batch-api
    content: Add batch() method for atomic multi-property updates
    status: pending
  - id: freeze-protochain
    content: Freeze ProtoChain properties after initialization
    status: pending
  - id: add-tostringtag
    content: Add Symbol.toStringTag to Node and IoElement
    status: pending
  - id: typescript-improvements
    content: Improve TypeScript types (replace any, add generics)
    status: pending
  - id: nodearray-complete
    content: Implement fill() and copyWithin() in NodeArray
    status: pending
  - id: computed-properties
    content: Design and implement @Computed decorator (future)
    status: pending
  - id: serialization-utils
    content: Add toJSON/fromJSON serialization utilities (future)
    status: pending
---

# Core Library Improvements Plan

## Phase 1: Critical Issues

### 1.1 Fix Memory Leak in NODES.disposed

**File:** [`packages/core/src/nodes/Node.ts`](packages/core/src/nodes/Node.ts)The `NODES.disposed` Set accumulates references forever. Options:

- **Option A:** Remove `NODES.disposed` entirely (simplest, unless it's used for debugging)
- **Option B:** Use `WeakSet` instead of `Set` (allows GC but loses iteration)
- **Option C:** Add periodic cleanup or manual `NODES.cleanup()` method
```typescript
// Current (leaks)
export const NODES = {
  active: new Set<Node>(),
  disposed: new Set<Node>(),  // ← Never cleaned
}

// Recommended: Remove or use WeakSet
export const NODES = {
  active: new Set<Node>(),
  disposed: new WeakSet<Node>(),
}
```




### 1.2 Add Error Handling in ChangeQueue

**File:** [`packages/core/src/core/ChangeQueue.ts`](packages/core/src/core/ChangeQueue.ts)Wrap handler invocations in try/catch to prevent queue breakage:

```typescript
// In dispatch()
if ((this.node as any)[property + 'Changed']) {
  try {
    (this.node as any)[property + 'Changed'](change)
  } catch (e) {
    console.error(`Error in ${property}Changed handler:`, e)
  }
}
```



### 1.3 Fix O(n²) in ChangeQueue

**File:** [`packages/core/src/core/ChangeQueue.ts`](packages/core/src/core/ChangeQueue.ts)Replace splice loop with index-based iteration:

```typescript
// Current O(n²)
while (this.changes.length) {
  const change = this.changes[0]
  this.changes.splice(0, 1)
  // ...
}

// Fixed O(n)
const changes = this.changes
this.changes = []
for (let i = 0; i < changes.length; i++) {
  const change = changes[i]
  // ...
}
```

---

## Phase 2: Performance Optimizations

### 2.1 Convert Observation Arrays to Sets

**File:** [`packages/core/src/nodes/Node.ts`](packages/core/src/nodes/Node.ts)Change `_observedObjectProperties` and `_observedNodeProperties` from `string[]` to `Set<string>`:

```typescript
// Declaration changes
declare readonly _observedObjectProperties: Set<string>
declare readonly _observedNodeProperties: Set<string>

// Usage changes: includes() → has(), push() → add(), splice() → delete()
```



### 2.2 Optimize Queue Lookups

**File:** [`packages/core/src/core/Queue.ts`](packages/core/src/core/Queue.ts)Replace array `indexOf` with Set membership:

```typescript
// Current
if (queue.indexOf(func) === -1) {
  queue.push(func)
}

// Optimized: Use Set for O(1) lookup
const queueSet = new Set<CallbackFunction>()
if (!queueSet.has(func)) {
  queue.push(func)
  queueSet.add(func)
}
```



### 2.3 Optimize Binding Target Lookups

**File:** [`packages/core/src/core/Binding.ts`](packages/core/src/core/Binding.ts)Change `targets: Array<Node | IoElement>` to `Set` for O(1) membership checks:

```typescript
readonly targets: Set<Node | IoElement> = new Set()
// indexOf() → has(), push() → add(), splice() → delete()
```

---

## Phase 3: API Improvements

### 3.1 Add Batch Updates API

**File:** [`packages/core/src/nodes/Node.ts`](packages/core/src/nodes/Node.ts)Add a `batch()` method for atomic multi-property updates:

```typescript
batch(fn: () => void) {
  const prevReactivity = this.reactivity
  this.reactivity = 'debounced'
  try {
    fn()
  } finally {
    this.reactivity = prevReactivity
    this.dispatchQueue()
  }
}
```



### 3.2 Freeze ProtoChain After Init

**File:** [`packages/core/src/core/ProtoChain.ts`](packages/core/src/core/ProtoChain.ts)Freeze aggregated properties at end of constructor:

```typescript
// End of ProtoChain constructor
Object.freeze(this.reactiveProperties)
Object.freeze(this.properties)
Object.freeze(this.listeners)
Object.freeze(this.handlers)
Object.freeze(this.constructors)
```



### 3.3 Add Symbol.toStringTag

**Files:** [`packages/core/src/nodes/Node.ts`](packages/core/src/nodes/Node.ts), [`packages/core/src/elements/IoElement.ts`](packages/core/src/elements/IoElement.ts)

```typescript
get [Symbol.toStringTag]() {
  return this.constructor.name
}
```

---

## Phase 4: Future Enhancements (Lower Priority)

### 4.1 TypeScript Type Improvements

- Replace `any` with proper generics in `applyProperties`, `setProperties`
- Add generic type parameter to `Node<TProps>`
- Improve event handler type definitions

### 4.2 NodeArray Complete Implementation