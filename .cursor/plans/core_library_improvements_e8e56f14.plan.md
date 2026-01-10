---
name: Core Library Improvements
overview: Address foundational issues in @io-gui/core including memory leaks, performance optimizations, error handling, and API improvements. Issues are prioritized by urgency and impact.
todos:
  - id: typescript-improvements
    content: Improve TypeScript types (replace any, add generics)
    status: pending
  - id: nodearray-complete
    content: Implement fill() and copyWithin() in NodeArray
    status: completed
  - id: mutation-benchmark
    content: Create mutation observation benchmark to measure performance
    status: pending
  - id: mutation-unification
    content: Unify object mutation observation patterns
    status: pending
  - id: computed-properties
    content: Design and implement @Computed decorator (future)
    status: pending
  - id: serialization-utils
    content: Add toJSON/fromJSON serialization utilities (future)
    status: pending
---

# Core Library Improvements Plan

## Phase 1: Type Improvements

### 1.1 TypeScript Type Improvements

Replace `any` types with proper generics and interfaces throughout the codebase.---

## Phase 2: Mutation Observation Unification

### 2.1 Current State Analysis

The `Observer` class in `ReactiveProperty.ts` currently has **three different mutation observation patterns**:| Type | Pattern | Event Target | Listener Location |

|------|---------|--------------|-------------------|

| `io` | Direct listener | Value itself (Node/IoElement) | On the value |

| `nodearray` | Multi-observer | NodeArray dispatches to observers | Self-listener on node |

| `object` | Global event bus | `window` | Window listener |**Files involved:**

- `packages/core/src/core/ReactiveProperty.ts` - `Observer` class
- `packages/core/src/core/NodeArray.ts` - `_observers` Set, `addObserver()`, `removeObserver()`
- `packages/core/src/nodes/Node.ts` - `dispatchMutation()`, `onPropertyMutated()`

### 2.2 Problems with Current Approach

1. **Complexity**: Three different code paths to maintain
2. **Inconsistent APIs**: Each type has different registration/dispatch mechanisms
3. **Memory management**: Different cleanup strategies for each type
4. **Cognitive overhead**: Developers must understand which pattern applies when

### 2.3 Proposed Solutions

#### Option A: Unified Global Event Bus

All mutation events dispatch to a central event bus (could be `window` or a dedicated `MutationBus` singleton).**Pros:**

- Single code path for all types
- Consistent API
- Simpler `Observer` class

**Cons:**

- Every node must filter events it doesn't care about
- Potential performance impact with many nodes/mutations
- More events traversing the system

#### Option B: Unified Observer Pattern (like NodeArray)

All observable objects (Nodes, NodeArrays, plain objects) maintain an `_observers` Set.**Pros:**

- Targeted dispatch (only observers receive events)
- Consistent API across all types
- Good performance (no filtering needed)

**Cons:**

- Requires modifying `Node` base class to add observer tracking
- Plain objects would need wrapping or Proxy
- More memory per observable object

#### Option C: WeakMap-based Observer Registry

A central `WeakMap<object, Set<Node>>` tracks observers for any object.**Pros:**

- No modification to observed objects
- Automatic cleanup via WeakMap
- Works for any object type

**Cons:**

- Central registry lookup on every mutation
- Potential memory overhead for the registry
- Requires all mutations to go through a central dispatcher

### 2.4 Implementation Plan

#### Step 1: Create Mutation Observation Benchmark

Before making changes, establish baseline performance metrics:

```typescript
// benchmark/mutation-observation.bench.ts
// Scenarios to measure:
// 1. Many nodes observing few mutations
// 2. Few nodes observing many mutations  
// 3. Deep object hierarchies with mutations
// 4. NodeArray mutations with multiple observers
// 5. Cross-component mutation propagation
```

**Metrics to collect:**

- Time to dispatch mutation event
- Time for observers to receive event
- Memory usage per observer relationship
- GC pressure from event objects

#### Step 2: Prototype Each Solution

Create isolated prototypes of each approach to compare:

- Implement in separate branch/files
- Run benchmarks against each
- Document findings

#### Step 3: Choose and Implement

Based on benchmark results, select the approach that:

1. Maintains or improves current performance
2. Reduces code complexity
3. Provides consistent developer experience

### 2.5 Decision Criteria

| Criterion | Weight | Notes |

|-----------|--------|-------|

| Performance (dispatch time) | High | Must not regress |

| Memory efficiency | Medium | Reasonable overhead acceptable |

| Code simplicity | High | Reduce maintenance burden |

| API consistency | High | Same pattern for all types |

| Backward compatibility | Medium | Breaking changes acceptable if justified |

### 2.6 Current Recommendation

**Lean toward Option B (Unified Observer Pattern)** because:

- Already proven to work with NodeArray
- Targeted dispatch is efficient
- Node base class can be extended naturally
- Plain objects can use a Proxy wrapper or explicit registration