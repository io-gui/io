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
- **Edge collapse only**: First and last children collapse only
- **Structure preserved**: Collapsed splits render children inside drawer

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

## Implementation Phases

### Phase 1: Drawer Elements

Create IoDrawer and IoDrawerHandle components with basic open/close behavior.

### Phase 2: IoSplit Integration

Modify IoSplit.changed() to render drawers and drawer handles alongside visible children.