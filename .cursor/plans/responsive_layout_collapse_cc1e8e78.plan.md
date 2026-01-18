---
name: Responsive Layout Collapse
overview: Implement a responsive collapse system where panels collapse to edge drawers when space is constrained, enabling desktop layouts to work seamlessly on mobile devices.
todos:
  - id: minsize-panel
    content: Add minSize property to Panel model with default logic
    status: pending
  - id: minsize-split
    content: Add minSize property to Split model with default logic
    status: pending
  - id: collapse-algorithm
    content: Implement collapse evaluation algorithm in IoSplit
    status: pending
  - id: io-drawer
    content: Create IoDrawer element for collapsed content
    status: pending
  - id: io-drawer-handle
    content: Create IoDrawerHandle element for edge toggle buttons
    status: pending
  - id: iosplit-integration
    content: Integrate collapse state and drawers into IoSplit rendering
    status: pending
  - id: mobile-split-menu
    content: Add Split Left/Right/Top/Bottom menu to panels
    status: pending
  - id: drawer-expand
    content: Add Expand option to drawer panels for swap behavior
    status: pending
  - id: tests-collapse
    content: Add tests for collapse algorithm and drawer behavior
    status: pending
---

# Responsive Layout Collapse System

## Summary

Add responsive collapse behavior to IoLayout where panels automatically collapse to edge drawers when the container size falls below minimum thresholds. Each split manages its own drawers, preserving the nested structure.

## Key Design Decisions

- **Per-split drawers**: Each IoSplit has left/right (horizontal) or top/bottom (vertical) drawers
- **Edge-to-middle collapse**: First and last children collapse before middle children
- **Outer-first per orientation**: Outer splits collapse before inner splits of same orientation
- **Structure preserved**: Collapsed splits render full structure inside drawer
- **No drag-and-drop initially**: Focus on button/menu-based interactions

## Data Model Changes

### [`packages/layout/src/nodes/Panel.ts`](packages/layout/src/nodes/Panel.ts)

- Add `minSize?: number` property (default: `size` if fixed, or 300 if auto)

### [`packages/layout/src/nodes/Split.ts`](packages/layout/src/nodes/Split.ts)

- Add `minSize?: number` property (minimum before this split collapses to parent's drawer)

## New Elements

### `IoDrawer`

- Slide-out container positioned at split edges
- Contains `IoDrawerTabs` for multiple collapsed children
- Renders selected collapsed child (Panel or Split) as content
- Props: `edge`, `collapsed`, `children` (collapsed items), `open`

### `IoDrawerHandle`

- Button at edge to toggle drawer open/closed
- Shows icon indicating collapsed content exists
- Positioned at left/right (H splits) or top/bottom (V splits)

## Core Algorithm

```
evaluateCollapse(split, availableSize):
  1. Calculate requiredSize = sum of children's effective minSize
  2. While availableSize < requiredSize AND collapsible children exist:
     a. Find edge child (first or last, alternating)
     b. Mark as collapsed
     c. Recalculate requiredSize
  3. Return { visibleChildren, collapsedLeft/Top, collapsedRight/Bottom }
```

## Implementation Phases

### Phase 1: minSize Property

Add minSize to data models with defaults and serialization.

### Phase 2: Collapse State Calculation  

Implement algorithm in IoSplit to determine which children should collapse based on container size.

### Phase 3: Drawer Elements

Create IoDrawer and IoDrawerHandle components with basic open/close behavior.

### Phase 4: IoSplit Integration

Modify IoSplit.changed() to render drawers and drawer handles alongside visible children.

### Phase 5: Mobile Interaction

Add "Split Left/Right/Top/Bottom" menu option to panels for creating splits without drag-and-drop.

Add "Expand" option to drawer panels for swapping with visible content.

## File Changes Summary

| File | Changes |

|------|---------|

| `nodes/Panel.ts` | Add `minSize` property |

| `nodes/Split.ts` | Add `minSize` property |

| `elements/IoSplit.ts` | Add collapse logic, render drawers |

| `elements/IoDrawer.ts` | New - drawer container |

| `elements/IoDrawerHandle.ts` | New - edge toggle button |

| `index.ts` | Export new elements |

## Testing Strategy

- Unit tests for collapse algorithm with various split configurations
- Tests for minSize calculation and defaults
- Tests for drawer open/close state management
- Visual testing on multiple viewport sizes