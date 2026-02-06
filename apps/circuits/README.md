# Circuits — Game Rules & Level Format

## Overview

Circuits is a path-connection puzzle played on a rectangular grid. The player draws lines on a **top layer** to connect pairs of same-colored squares. Pre-placed infrastructure (white dots, existing top-layer lines, and bottom-layer lines) must be utilized to complete all circuits without intersecting.

## Grid

- Defined by `width` and `height`. Intersections range from `(0,0)` to `(width, height)`.
- A grid of `width: 8, height: 10` has **9 columns x 11 rows = 99 intersections**.
- Lines connect adjacent intersections: horizontally, vertically, or **diagonally** (1 step max in each axis).

## Elements

### Pads (Nodes)

Pads sit on grid intersections. Two types:

| Type | Shape | Color | Role | Connection limit |
|------|-------|-------|------|-----------------|
| **Colored pad** | Square | red, blue, green, yellow, purple, orange, pink, brown | Goal endpoint — always comes in **pairs** of the same color | **1** top-layer line |
| **White pad** | Circle | white | Junction/relay — routes a circuit through it | **2** total connections (top-layer + bottom-layer combined) |

**Pad properties:**
- `x, y` — grid position
- `c` — base color (`"white"`, `"red"`, `"blue"`, etc.)
- `c2` — propagated color (computed at runtime, starts equal to `c`)
- `readonly` — in level JSON this is always `false`; the game sets all level-defined pads to `readonly: true` on load (distinguishes level fixtures from player-placed pads in editor mode)
- `ID` — unique random integer identifier

### Lines

Lines are polylines connecting a sequence of adjacent grid intersections. Two layer types:

| Layer | Color value | Canvas layer | Opacity | Player can draw? | Visual style |
|-------|------------|--------------|---------|-------------------|-------------|
| **Top** | `"white"` | layer1 (z:102) | 100% | Yes | Thin line with black outline |
| **Bottom** | `"grey"` | layer0 (z:101) | 25% | No — pre-placed only | Thick faded line |

**Line properties:**
- `pos` — array of `[x, y]` coordinate pairs defining the polyline path
- `c` — base color (`"white"` or `"grey"`)
- `c2` — propagated color (computed at runtime)
- `ID` — unique random integer identifier

## Game Rules

### Drawing

1. Player **drags** from a pad to draw a new white line on the top layer.
2. A line must **start at a pad** and **end at a pad**. If the player releases without reaching a pad, the line is auto-undone.
3. Lines advance **one grid step at a time** (horizontal, vertical, or diagonal).
4. **No backtracking** — can't immediately reverse to the previous position.
5. Lines can pass through white pads (junctions) to continue drawing.

### Connection Constraints

- **Colored pads** accept at most **1** top-layer line endpoint.
- **White pads** accept at most **2** connections total. This can be:
  - 2 top-layer (white) lines, OR
  - 1 top-layer + 1 bottom-layer (grey) line
- **Empty intersections** (no pad) can only have lines pass through if the line color is grey, or no other white line occupies that point.

### Intersection / Crossing Rules

- **Diagonal lines cannot cross other diagonal lines** on the same layer. Crossing is detected via shared midpoints.
- **Exception**: Grey (bottom-layer) lines can cross white (top-layer) diagonals freely — the crossing check is skipped when either line is grey.

### Color Propagation

After each move, colors propagate iteratively (up to 16 passes):

1. All lines and pads reset to their base color (`c`).
2. For each line, look at the pads at its two endpoints.
3. If one endpoint pad has a non-white color, push that color through the line and to the other endpoint pad.
4. If both endpoints are colored (same color), the line takes that color.
5. Repeat until stable — colors cascade through chains of white pads and lines.

This means white pads and white lines **take on the color** of the circuit passing through them.

### Completion Check

The level is complete when **every pad in every circuit is properly connected**:

- **Readonly colored pads**: must have exactly **1** top-layer line connection.
- **White pads that received a color** (c2 !== "white"): must have exactly **2** total connections (top-layer lines counted, plus bottom-layer underlines — requiring either `nWhite == 2` or `nWhite == 1 && nGrey == 1`).
- White pads that remain uncolored (unused junctions) are ignored.

## Level JSON Schema

```jsonc
{
  "width": 8,          // grid width (x range: 0..width)
  "height": 10,        // grid height (y range: 0..height)
  "pads": {
    "<ID>": {
      "x": 5,           // grid x coordinate
      "y": 7,           // grid y coordinate
      "c": "white",     // color: "white"|"red"|"blue"|"green"|"yellow"|"purple"|"orange"|"pink"|"brown"
      "readonly": false, // always false in level files (set to true at runtime)
      "ID": 8784         // unique integer (same as key)
    }
    // ... more pads
  },
  "lines": {
    "<ID>": {
      "ID": 6174,                          // unique integer (same as key)
      "c": "grey",                         // "white" = top layer, "grey" = bottom layer
      "pos": [[4,4],[5,5]]                 // polyline path: array of [x,y] pairs
    }
    // ... more lines
  }
}
```

## Available Colors

```
white   #ffffff    — junction pads, top-layer lines
red     #e52800    — goal pair color
green   #005923    — goal pair color
blue    #06afff    — goal pair color
pink    #ef47cc    — goal pair color
yellow  #fec41a    — goal pair color
orange  #ff6910    — goal pair color
purple  #760281    — goal pair color
brown   #820419    — goal pair color
grey    #555555    — bottom-layer lines only
```

## Level Design Patterns

### Difficulty Progression

| Pack | Grid size | Colors | Grey lines | White pre-placed |
|------|-----------|--------|------------|------------------|
| 01xx | 4x5 | 1-2 | Few/none | Few |
| 02xx | ~6x8 | 2-4 | Some | Some |
| 03xx | 8x10 | 4-5 | Many | Many |

### Structural Patterns (from lvl_0314)

**Colored pad placement**: Goal pads are placed at grid edges (top/bottom rows). In lvl_0314, 5 color pairs line the top row at even x-positions `(0,2,4,6,8)` and the bottom row in shuffled order `(0,2,4,6,8)` mapped to `(green, purple, yellow, red, blue)`.

**White pad network**: White junction pads form a dense network in the interior of the grid. They serve as waypoints that constrain where lines can travel — the player must route through these junctions.

**Grey (bottom-layer) lines**: Form an infrastructure backbone. They create pre-existing connections that the player must account for. Grey lines can share grid points with white lines (they're on different layers). Common patterns:
- Long backbone paths spanning most of the grid
- Short connector segments linking key junctions
- Paths that cross white-layer diagonals (allowed since grey lines bypass crossing rules)

**White (top-layer) pre-placed lines**: Partial solutions or constraints. They reduce the solution space and guide the player. The player must incorporate these into the final circuit.

### Design Constraints for Valid Levels

1. **Every colored pad must have exactly one matching partner** of the same color.
2. **A solution must exist**: there must be a set of drawable white lines that completes all circuits.
3. **White pads on a solution path** must have exactly 2 total connections (white + grey).
4. **No two white-layer diagonals may cross** in the solution.
5. **Grid boundaries**: all pad and line coordinates must be within `0..width` and `0..height`.
6. **IDs must be unique** integers across all pads and lines.
