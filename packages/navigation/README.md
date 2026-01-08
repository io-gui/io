# @io-gui/navigation

Navigation and content selection components for Io-Gui.

See [live examples here](https://iogui.dev/io/#path=Demos,Navigation)

## Overview

```
IoNavigator
├── IoMenuOptions | IoMenuTree (navigation menu)
└── IoSelector (content display)
    └── selected element from elements[]

IoCollapsible
└── IoBoolean (toggle)
└── elements[] (collapsible content)
```

## Elements

### IoNavigator

Full navigation component combining menu and content selector.

```typescript
type IoNavigatorProps = {
  option: MenuOption            // Navigation options
  elements: VDOMElement[]       // Content elements matched by id
  menu?: 'top' | 'left' | 'right'  // Menu position
  depth?: number                // Menu expansion depth
  select?: 'shallow' | 'deep' | 'all' | 'none'
  caching?: 'proactive' | 'reactive' | 'none'
  anchor?: string               // Scroll anchor
  widget?: VDOMElement          // Custom menu widget
}
```

**Menu positions:**
| Position | Layout | Menu Type |
|----------|--------|-----------|
| `top` | Column | `IoMenuOptions` (horizontal) |
| `left` | Row | `IoMenuTree` |
| `right` | Row | `IoMenuTree` |

**Selection modes:**
| Mode | Behavior |
|------|----------|
| `shallow` | Shows `selectedIDImmediate` (direct child) |
| `deep` | Shows final `selectedID` in tree |
| `all` | Shows all elements (`*`) |
| `none` | Shows nothing |

**Usage:**
```typescript
new IoNavigator({
  menu: 'left',
  option: new MenuOption({
    mode: 'select',
    options: [
      { id: 'Home', selected: true },
      { id: 'About' },
      { id: 'Contact' },
    ]
  }),
  elements: [
    div({ id: 'Home' }, 'Home content'),
    div({ id: 'About' }, 'About content'),
    div({ id: 'Contact' }, 'Contact content'),
  ]
})
```

### IoSelector

Content switcher that displays elements based on selection.

```typescript
type IoSelectorProps = {
  elements: VDOMElement[]     // Available content elements
  selected: string            // Element id to display, or '*' for all
  anchor?: string             // Scroll-to anchor
  caching?: 'proactive' | 'reactive' | 'none'
  loading?: boolean           // Shows loading spinner
}
```

**Caching modes:**
| Mode | Description |
|------|-------------|
| `proactive` | Pre-renders all elements in background |
| `reactive` | Caches elements after first render |
| `none` | Re-renders element each time selected |

**Key behaviors:**
- Matches elements by `id` property
- Supports dynamic imports via `import` property on elements
- Scroll-to-anchor with debounced sync

### Dynamic Imports

Elements can specify an `import` path for lazy loading:

```typescript
ioSelector({
  selected: 'heavy-page',
  elements: [
    div({ id: 'light-page' }, 'Immediate content'),
    div({ 
      id: 'heavy-page',
      import: './pages/heavy-page.js'  // Loaded on demand
    }),
  ]
})
```

**Loading flow:**
1. Shows loading spinner
2. Dynamically imports module
3. Renders element
4. Resumes proactive caching (if enabled)

### Anchor Navigation

`IoSelector` syncs with `anchor` property for deep linking:

```typescript
// URL: #section-2
ioSelector({
  anchor: this.bind('anchor'),
  elements: [...]
})

// Scrolls to element with data-heading="section-2"
```

**Behaviors:**
- Changes to `anchor` scroll to matching `[data-heading]` element
- Scroll events update `anchor` to nearest heading
- 120ms debounce prevents scroll/anchor update loops

### IoCollapsible

Expandable content container with toggle header.

```typescript
type IoCollapsibleProps = {
  label: string
  icon?: string
  expanded?: boolean
  elements: VDOMElement[]
  direction?: 'column' | 'row'
}
```

**Key behaviors:**
- Toggle via click on header or Enter/Space
- Content only rendered when expanded
- Direction controls flex layout of content

**Usage:**
```typescript
ioCollapsible({
  label: 'Advanced Settings',
  expanded: false,
  elements: [
    ioNumber({ label: 'Option 1', value: 0 }),
    ioNumber({ label: 'Option 2', value: 0 }),
  ]
})
```

## Data Flow

```
MenuOption selection changes
    ↓
IoNavigator.optionMutated()
    ↓
Determines selected id based on 'select' mode
    ↓
IoSelector.selectedChanged()
    ↓
If caching: check cache for element
If import: load module first
    ↓
Render element to DOM
    ↓
If anchor: scroll to heading
```

## Events

| Event | Dispatched By | Payload | Purpose |
|-------|---------------|---------|---------|
| `scroll` | IoSelector | - | Scroll position changed |

## Edge Cases

### Cache Collision
If `IoSelector` is reused in different templates with colliding element IDs, cached elements may incorrectly persist. Use unique IDs across the application.

### Proactive Caching Timing
Proactive caching happens during idle frames to avoid blocking. If many elements have dynamic imports, initial caching may take several seconds.

### Scroll Suspension
When programmatically changing `anchor`, scroll events are temporarily suppressed (120ms) to prevent feedback loops. Similarly, when scrolling updates `anchor`, programmatic scroll-to is suspended.

### Element Disposal
Cached elements not in the DOM are properly disposed when `IoSelector` is disposed, preventing memory leaks.
