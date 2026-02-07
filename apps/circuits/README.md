# Circuits — Game Rules & Level Format

## Overview

Circuits is a path-connection puzzle played on a rectangular grid. The player draws lines on a **top layer** to connect pairs of same-colored squares. Pre-placed infrastructure (white dots, existing top-layer lines, and bottom-layer lines) must be utilized to complete all circuits without intersecting.

## Grid

- Defined by `width` and `height`. Intersections range from `(0,0)` to `(width, height)`.
- A grid of `width: 8, height: 10` has **9 columns x 11 rows = 99 intersections**.
- Lines connect adjacent intersections: horizontally, vertically, or **diagonally** (1 step max in each axis).

## Elements

### Pads and Terminals

Connection points sit on grid intersections. Two kinds:

| Kind        | Shape  | Color                                                 | Role                                                        | Connection limit                                            |
| ----------- | ------ | ----------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| **Terminal** | Square | red, blue, green, yellow, purple, orange, pink, brown | Goal endpoint — always comes in **pairs** of the same color | **1** top-layer line                                        |
| **Pad**     | Circle | white (fixed)                                         | Junction/relay — routes a circuit through it                 | **2** total connections (top-layer + bottom-layer combined) |

**Pad** (in JSON: `pads` array): `pos`, `ID`. No color — pads are always white. Propagated color is computed at runtime and stored in memory.

**Terminal** (in JSON: `terminals` array): `pos`, `color`, `ID`. Color is fixed; terminals do not receive propagated color.

### Lines

Lines are polylines connecting a sequence of adjacent grid intersections. Two layer types:

| Layer      | `layer` value | Canvas layer   | Opacity | Player can draw?     | Visual style                 |
| ---------- | ------------- | -------------- | ------- | -------------------- | ---------------------------- |
| **Top**    | `0`           | layer1 (z:102) | 100%    | Yes                  | Thin line with black outline |
| **Bottom** | `-1`          | layer0 (z:101) | 25%     | No — pre-placed only | Thick faded line             |

**Line properties:**

- `pos` — array of `[x, y]` coordinate pairs defining the polyline path
- `layer` — 0 (top) or -1 (bottom); display color is computed from game state (propagated from terminals)
- `ID` — unique random integer identifier


## Game Rules

### Drawing

1. Player **drags** from a pad or terminal to draw a new white line on the top layer.
2. A line must **start at a pad or terminal** and **end at a pad or terminal**. If the player releases without reaching one, the line is auto-undone.
3. Lines advance **one grid step at a time** (horizontal, vertical, or diagonal).
4. **No backtracking** — can't immediately reverse to the previous position.
5. Lines can pass through pads (junctions) to continue drawing.

### Connection Constraints

- **Terminals** accept at most **1** top-layer line endpoint.
- **Pads** accept at most **2** connections total. This can be:
  - 2 top-layer (white) lines, OR
  - 1 top-layer + 1 bottom-layer (grey) line
- **Empty intersections** (no pad or terminal) can only have lines pass through if the line color is grey, or no other white line occupies that point.

### Intersection / Crossing Rules

- **Diagonal lines cannot cross other diagonal lines** on the same layer. Crossing is detected via shared midpoints.
- Lines on different layers do not intersect for this check — only lines with the same `layer` are tested.

### Color Propagation

After each move, colors propagate iteratively (up to 16 passes):

1. All lines and pads reset: line color by layer (top → white, bottom → grey); pads to white.
2. For each line, look at the pads at its two endpoints.
3. If one endpoint is a terminal or a pad with propagated color, push that color through the line and to the other endpoint (only pads get updated; terminals keep fixed color).
4. If both endpoints are colored (same color), the line takes that color.
5. Repeat until stable — colors cascade through chains of pads and lines.

This means pads and white lines **take on the color** of the circuit passing through them; terminals keep their fixed color.

### Completion Check

The level is complete when **every pad and terminal is properly connected**:

- **Terminals**: must have exactly **1** top-layer line connection.
- **Pads that received a color** (propagated): must have exactly **2** total connections (top-layer lines counted, plus bottom-layer underlines — requiring either `nWhite == 2` or `nWhite == 1 && nGrey == 1`).
- Pads that remain white (unused junctions) are ignored.

## Level JSON Schema

```jsonc
{
  "width": 8,
  "height": 10,
  "pads": [
    { "pos": [5, 7], "ID": 8784 }
  ],
  "terminals": [
    { "pos": [2, 0], "color": "blue", "ID": 12345 }
  ],
  "lines": [
    {
      "ID": 6174,
      "layer": -1,
      "pos": [[4, 4], [5, 5]]
    }
  ]
}
```

- **pads**: array of `{ pos: [x, y], ID }`. No color; pads are always white.
- **terminals**: array of `{ pos: [x, y], color, ID }`. Color is one of the goal colors.
- **lines**: array of `{ ID, layer: 0|−1, pos: [[x,y], ...] }`.

## Available Colors

```
white   #ffffff    — junction pads, top-layer (layer 0) lines
red     #e52800    — goal pair color
green   #005923    — goal pair color
blue    #06afff    — goal pair color
pink    #ef47cc    — goal pair color
yellow  #fec41a    — goal pair color
orange  #ff6910    — goal pair color
purple  #760281    — goal pair color
brown   #820419    — goal pair color
grey    #555555    — bottom-layer (layer -1) lines only
```

## Level Design Patterns

### Difficulty Progression

| Pack | Grid size | Colors | Grey lines | White pre-placed |
| ---- | --------- | ------ | ---------- | ---------------- |
| 01xx | 4x5       | 1-2    | Few/none   | Few              |
| 02xx | ~6x8      | 2-4    | Some       | Some             |
| 03xx | 8x10      | 4-5    | Many       | Many             |

### Structural Patterns (from lvl_0314)

**Terminal placement**: Goal terminals are placed at grid edges (top/bottom rows). In lvl_0314, 5 color pairs line the top row at even x-positions `(0,2,4,6,8)` and the bottom row in shuffled order mapped to `(green, purple, yellow, red, blue)`.

**Pad network**: Pads (white circles) form a dense network in the interior of the grid. They serve as waypoints that constrain where lines can travel — the player must route through these junctions.

**Bottom-layer (layer -1) lines**: Form an infrastructure backbone. They create pre-existing connections that the player must account for. Bottom-layer lines can share grid points with top-layer lines (different layers). Common patterns:

- Long backbone paths spanning most of the grid
- Short connector segments linking key junctions
- Paths that cross top-layer diagonals (allowed since crossing is only checked within the same layer)

**Top-layer (layer 0) pre-placed lines**: Partial solutions or constraints. They reduce the solution space and guide the player. The player must incorporate these into the final circuit.

### Design Constraints for Valid Levels

1. **Every terminal must have exactly one matching partner** of the same color.
2. **A solution must exist**: there must be a set of drawable white lines that completes all circuits.
3. **Pads on a solution path** must have exactly 2 total connections (white + grey).
4. **No two top-layer (layer 0) diagonals may cross** in the solution.
5. **Grid boundaries**: all pad and line coordinates must be within `0..width` and `0..height`.
6. **IDs must be unique** integers across all pads, terminals, and lines.
