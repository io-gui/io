# @io-gui/core

A lightweight (~22KB gzipped) reactive framework for nodes and custom elements.

## Core Classes

### Node
Reactive `Object` with all Io-Gui features. Use for data models, state containers, and business logic.

### IoElement
Reactive `HTMLElement` with Node features plus virtual DOM rendering and CSS style management.

Both share identical APIs: reactive properties, bindings, event dispatch, change handlers, and lifecycle methods.

---

## Registration

**Every subclass must be registered** before instantiation using the `@Register` decorator:

```typescript
@Register
class MyNode extends Node {
  @ReactiveProperty({type: String, value: ''})
  declare label: string
}
```

Registration triggers `ProtoChain` initialization which aggregates property definitions, listeners, handlers, and styles from the entire prototype chain.

---

## Reactive Properties

Declare with `@ReactiveProperty` decorator or `static get ReactiveProperties()`:

```typescript
static get ReactiveProperties() {
  return {
    count: Number,                         // Type only → defaults to 0
    label: '',                             // Value only → infers type
    enabled: {type: Boolean, value: true}, // Full definition
    data: {type: Object, init: null},      // Object type with empty init
    size: {type: Array, init: [0, 0]},     // Array with initial values
    items: {type: NodeArray, init: 'this'} // NodeArray requires 'this' init
  }
}
```

### Property Definition Options

| Option | Description |
|--------|-------------|
| `value` | Initial value |
| `type` | Constructor (String, Number, Boolean, Array, Object, Node, etc.) |
| `binding` | Binding object for two-way sync |
| `reflect` | If `true`, syncs to HTML attribute (IoElement only) |
| `init` | Constructor arguments. Use `null` for empty init, `'this'` for NodeArray |

### Type Defaults
- `String` → `''`
- `Number` → `0`
- `Boolean` → `false`
- `Object` → `{}` (when `init: null`)
- `Array` → `[]` (when `init: null`)

---

## Non-Reactive Properties

Use `@Property` decorator or `static get Properties()` for properties that don't need change tracking:

```typescript
@Property(Object)
declare $: Record<string, HTMLElement> // Common pattern for element refs
```

---

## Change Detection & Handlers

When a reactive property changes:

1. `[propName]Changed(change)` handler is invoked (if defined)
2. `[propName]-changed` event is dispatched with `{property, value, oldValue}`
3. `changed()` handler is invoked
4. `io-object-mutation` event is dispatched for the node

```typescript
labelChanged(change: Change) {
  console.log(change.oldValue, '→', change.value)
}
changed() {
  // Called after any property change
}
```

### Reactivity Modes

Control dispatch timing via `reactivity` property:

| Mode | Behavior |
|------|----------|
| `'immediate'` | Synchronous dispatch (default) |
| `'throttled'` | Once per animation frame, first value wins |
| `'debounced'` | Once per animation frame, last value wins |

---

## Two-Way Binding

Create bindings with `this.bind('propertyName')`:

```typescript
const binding = sourceNode.bind('value')
targetNode.prop = binding  // Target syncs to source
// Changes propagate bidirectionally
```

### Binding Edge Cases

- **Multiple targets**: One binding can sync to many target properties
- **Binding collision**: If target already has a binding, the old one is removed
- **NaN handling**: `NaN === NaN` is false; bindings handle this correctly
- **Type mismatch**: Debug mode warns if bound properties have incompatible types
- **Re-assignment**: Assigning the same binding object is a no-op

---

## Object Mutation Observation

### Node-typed Properties
Automatically observed. Mutations trigger `[propName]Mutated()` handlers.

```typescript
@ReactiveProperty({type: MyNode, init: null})
declare data: MyNode

dataMutated(event: CustomEvent) {
  // Called when data or its descendants mutate
}
```

### Non-Node Objects
Observed but require manual mutation dispatch:

```typescript
this.plainObject.value = 42
this.dispatchMutation(this.plainObject)
```

### NodeArray
A Proxy-wrapped Array that auto-dispatches mutations on all mutating operations (`push`, `splice`, etc.). Items must be `Node` instances.

```typescript
@ReactiveProperty({type: NodeArray, init: 'this'})
declare items: NodeArray<MyNode>

itemsMutated() {
  // Called on any array modification
}
```

**Edge cases:**
- `fill()` and `copyWithin()` are unsupported (log warning)
- Setting `length` to extend array logs warning
- Item listeners are automatically managed on add/remove

---

## Event System

### Listener Definition

```typescript
static get Listeners() {
  return {
    'click': 'onClick',                      // Method name
    'pointermove': ['onMove', {passive: true}], // With options
  }
}
```

### Inline Event Listeners

```typescript
const element = new MyElement({
  '@click': this.onClick,
  '@custom-event': (e) => console.log(e.detail)
})
```

### Dispatch Events

```typescript
this.dispatch('my-event', {data: 42}, true) // type, detail, bubbles
```

### Event Propagation for Nodes
Non-DOM Nodes bubble events through `_parents` array. Add/remove parents with `addParent()`/`removeParent()`.

---

## Virtual DOM (IoElement)

Render children with `this.render()`:

```typescript
changed() {
  this.render([
    div({class: 'container'}, [
      span({id: 'label'}, this.label),
      MyComponent.vConstructor({value: this.bind('value')}),
    ])
  ])
}
```

### vDOM Edge Cases

- `null` children are filtered out (useful for conditional rendering)
- Element reuse: matching tag names update props; mismatched tags replace element
- `this.$` map stores elements with `id` prop: `this.$.label`
- Native element events require `EventDispatcher` attachment (automatic)
- Text content optimized via single TextNode (no layout thrashing)

---

## Styling (IoElement)

```typescript
static get Style() {
  return /* css */`
    :host {
      display: flex;
    }
    :host[disabled] {
      opacity: 0.5;
    }
  `
}
```

**Rules:**
- All selectors must start with `:host`
- Styles are aggregated up prototype chain
- Injected to document `<head>` at registration
- Custom mixins via `--mixin-name: { ... }` and `@apply --mixin-name`

---

## ThemeSingleton

Global CSS variables manager. Properties map to `--io_propertyName` variables:

```typescript
ThemeSingleton.themeID = 'dark'
ThemeSingleton.spacing = 4
ThemeSingleton.bgColor = new Color(0.2, 0.2, 0.2, 1)
```

Themes persist to localStorage. Register custom themes with `registerTheme(id, vars)`.

---

## Storage

Persistent reactive values:

```typescript
const myValue = Storage({key: 'my-key', value: 'default', storage: 'local'})
element.prop = myValue // Binding syncs to storage

// Storage types: 'local' (localStorage), 'hash' (URL hash), 'none'
```

**Privacy:** `Storage.permit()` / `Storage.unpermit()` controls localStorage access.

---

## Lifecycle

| Method | When Called |
|--------|-------------|
| `init()` | Before property initialization |
| `ready()` | After construction, before first dispatch |
| `changed()` | After any reactive property change |
| `connectedCallback()` | IoElement attached to DOM |
| `disconnectedCallback()` | IoElement removed from DOM |
| `dispose()` | Manual cleanup (removes listeners, bindings) |

---

## Throttle/Debounce

```typescript
this.throttle(this.expensiveOperation) // Once per frame, first call wins
this.debounce(this.expensiveOperation) // Once per frame, last call wins
```

Frame-based queue with automatic cleanup on disposal.

---

## IoGl

WebGL-rendered element base class. Properties auto-map to shader uniforms:

```typescript
@Register
class MyShader extends IoGl {
  @ReactiveProperty({type: Number, value: 0.5})
  declare intensity: number // → uniform float uIntensity

  static get Frag() {
    return `void main() { gl_FragColor = vec4(uIntensity); }`
  }
}
```

Theme variables available as `io_*` uniforms. Shared WebGL context across all instances.

---

## IoOverlaySingleton

Document-level container for floating UI (menus, modals, tooltips). Manages focus restoration and pointer blocking.

```typescript
IoOverlaySingleton.appendChild(myMenu)
IoOverlaySingleton.expanded = true
```

---

## Utilities

### Focus Navigation
`io-focus-to` event system for keyboard navigation between focusable elements.

### Nudge
Viewport-aware element positioning:

```typescript
nudge(floatingElement, anchorElement, 'down') // 'up'|'down'|'left'|'right'|'over'
```

---

## Debug Mode

Runtime type checking, warning logs, and validation in development. Debug blocks stripped in production builds:

```typescript
debug: {
  if (typeof value !== 'string') {
    console.warn('Expected string')
  }
}
```

---

## Common Pitfalls

1. **Forgetting `@Register`**: Classes must be registered before use
2. **Arrow function handlers**: Won't auto-bind; use regular methods for `on*` handlers
3. **Direct object mutation**: Must call `dispatchMutation()` for non-Node objects
4. **NodeArray init**: Must use `init: 'this'` to get owner reference
5. **Disposed nodes**: Operations on disposed nodes are no-ops
6. **Binding loops**: Circular bindings are prevented; same-binding assignment exits early
7. **Property type mismatch**: Debug warnings for assigning wrong types
8. **CSS selector leakage**: Non `:host` prefixed selectors leak to global scope
