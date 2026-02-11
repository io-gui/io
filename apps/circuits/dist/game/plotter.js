var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ReactiveNode, Register } from '@io-gui/core';
import { Pad } from './items/pad.js';
import { Line } from './items/line.js';
/**
 * Plotter — position and geometry only.
 * Intersection checks, adding/removing pads, terminals, and lines.
 * No color, propagation, or completion.
 */
let Plotter = class Plotter extends ReactiveNode {
    width = 0;
    height = 0;
    pads = [];
    lines = [];
    connect(pads, lines, width, height) {
        this.width = width;
        this.height = height;
        this.pads = pads;
        this.lines = lines;
    }
    getPointAt([x, y]) {
        for (const pad of this.pads) {
            if (pad.pos[0] === x && pad.pos[1] === y)
                return pad;
        }
    }
    getLinesAtPoint([x, y], filter) {
        const lines = [];
        for (const line of this.lines) {
            if (line.pos.some(([px, py]) => px === x && py === y) && (filter?.(line) ?? true)) {
                lines.push(line);
            }
        }
        return lines;
    }
    getLineById(id) {
        return this.lines.find((l) => l.id === id);
    }
    checkDiagonalCrossing(line, [x, y]) {
        const last = line.pos[line.pos.length - 1];
        const mx = (x + last[0]) / 2;
        const my = (y + last[1]) / 2;
        for (const other of this.lines) {
            if (other.layer !== line.layer)
                continue;
            if (other.hasDiagonalSegmentAt([mx, my]))
                return false;
        }
        return true;
    }
    addPad(id, [x, y], color, isTerminal = false) {
        if (this.getPointAt([x, y]))
            return false;
        this.pads.push(new Pad(id, [x, y], isTerminal, color));
        this.dispatch('game-update', undefined, true);
        return true;
    }
    delete([x, y]) {
        const padIdx = this.pads.findIndex((p) => p.pos[0] === x && p.pos[1] === y);
        if (padIdx !== -1) {
            this.pads.splice(padIdx, 1);
        }
        const lineIdx = this.lines.findIndex((l) => l.pos.some(([px, py]) => px === x && py === y));
        if (lineIdx !== -1) {
            this.lines.splice(lineIdx, 1);
        }
        this.dispatch('game-update', undefined, true);
    }
    verifyLineComplete(id) {
        const line = this.getLineById(id);
        if (line) {
            const first = line.pos[0];
            const last = line.pos[line.pos.length - 1];
            const p1 = this.getPointAt(first);
            const p2 = this.getPointAt(last);
            if (!p1 || !p2 || (first[0] === last[0] && first[1] === last[1])) {
                const idx = this.lines.findIndex((l) => l.id === id);
                if (idx !== -1)
                    this.lines.splice(idx, 1);
                return false;
            }
            return true;
        }
        return false;
    }
    isInBounds([x, y]) {
        return x >= 0 && x <= this.width && y >= 0 && y <= this.height;
    }
    addLineSegment(id, [x, y], layer) {
        if (!this.isInBounds([x, y]))
            return { added: false, endDrag: false };
        // Lookup what's at target cell
        const point = this.getPointAt([x, y]);
        const linesAtPoint = this.getLinesAtPoint([x, y], (line) => (line.layer === 0));
        const underlineLinesAtPoint = this.getLinesAtPoint([x, y], (line) => line.layer === -1);
        // Terminal pads accept 1 connection, normal pads accept 2, empty cells accept 0
        const connectionLimit = point ? (point.isTerminal ? 1 : 2) : 0;
        let added = false;
        let endDrag = false;
        // Reject if point is already at connection capacity
        if (point && (linesAtPoint.length + underlineLinesAtPoint.length) >= connectionLimit) {
            return { added, endDrag };
        }
        const line = this.getLineById(id);
        if (line) {
            // --- Extending existing line ---
            // Reject if diagonal would cross another diagonal on same layer
            if (!this.checkDiagonalCrossing(line, [x, y])) {
                return { added, endDrag };
            }
            // Reject self-intersection (exclude last 2 points to preserve backtracking)
            const posCount = line.pos.length;
            if (line.pos.some(([px, py], i) => px === x && py === y && i < posCount - 2)) {
                return { added, endDrag };
            }
            const sameLineAtPoint = this.getLinesAtPoint([x, y], (line) => (line.id === id && line.layer === 0))?.[0] || null;
            // Empty cell: allow if no foreign line occupies it (or underline layer bypasses)
            if (!point && ((!linesAtPoint.length || sameLineAtPoint) || layer === -1)) {
                added = line.plotSegment([x, y]);
            }
            // Reached a pad/terminal: snap to it and end drag (color must be compatible)
            if (point) {
                if (point.renderColor !== 'white' && line.color !== 'white' && point.renderColor !== line.color) {
                    return { added: false, endDrag: false };
                }
                added = line.plotSegment([x, y]);
                endDrag = true;
            }
        }
        else {
            // --- Starting new line: must begin on a pad or terminal ---
            if (!point)
                return { added: false, endDrag: false };
            const newLine = new Line(id, [[x, y]], layer);
            newLine.color = point.renderColor;
            this.lines.push(newLine);
            added = true;
        }
        if (endDrag) {
            this.dispatch('line-end-drag', { id }, true);
        }
        this.dispatch('game-update', undefined, true);
        return { added, endDrag };
    }
};
Plotter = __decorate([
    Register
], Plotter);
export { Plotter };
//# sourceMappingURL=plotter.js.map