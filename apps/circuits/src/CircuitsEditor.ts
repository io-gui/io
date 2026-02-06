import { IoElement, Register, canvas } from '@io-gui/core'
import type { DrawMode } from './game/game.js'
import color from './game/color.js'

interface EditorItem {
  x: number;
  y: number;
  r: number;
  mode: DrawMode;
  color: string;
  type: 'pin' | 'line' | 'delete';
}


@Register
export class CircuitsEditor extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        background: rgba(0, 0, 0, 0.85);
        align-items: center;
        justify-content: center;
        flex: 1 1 auto;
      }
      :host > canvas {
        width: 200px;
        height: 200px;
        display: block;
      }
    `
  }

  private _ctx: CanvasRenderingContext2D | null = null;
  private _canvas: HTMLCanvasElement | null = null;
  private _items: EditorItem[] = [];
  private _w = 0;
  private _h = 0;

  ready() {
    this.changed()
  }

  changed() {
    this.render([
      canvas({
        id: 'editor-canvas',
        '@pointerdown': this.onCanvasClick
      }),
    ])
    requestAnimationFrame(() => this._initCanvas());
  }

  private _initCanvas(): void {
    this._canvas = this.querySelector('#editor-canvas') as HTMLCanvasElement | null;
    if (!this._canvas) return;

    const rect = this.getBoundingClientRect();
    this._w = rect.width * 0.85;
    this._h = rect.height * 0.85;

    const dpr = window.devicePixelRatio || 1;
    this._canvas.width = this._w * dpr;
    this._canvas.height = this._h * dpr;
    this._canvas.style.width = this._w + 'px';
    this._canvas.style.height = this._h + 'px';

    this._ctx = this._canvas.getContext('2d');
    if (!this._ctx) return;
    this._ctx.scale(dpr, dpr);

    this._buildItems();
    this._draw();
  }

  /** Define the palette items. */
  private _buildItems(): void {
    this._items = [];
    const r = this._w / 12;

    const pinRow = (cols: [number, string][], yPct: number, mode: DrawMode) => {
      for (const [xPct, c] of cols) {
        this._items.push({
          x: xPct * this._w / 100,
          y: yPct * this._h / 100,
          r, mode, color: c, type: 'pin',
        });
      }
    };

    // White pin
    pinRow([[50, 'white']], 10, 'pin');

    // Coloured pins - row 1
    pinRow([
      [10, 'red'], [30, 'green'], [50, 'blue'], [70, 'pink'], [90, 'yellow'],
    ], 28, 'pin');

    // Coloured pins - row 2
    pinRow([
      [10, 'orange'], [30, 'purple'], [50, 'brown'], [70, 'grey'], [90, 'black'],
    ], 44, 'pin');

    // Line modes
    this._items.push({
      x: 50 * this._w / 100, y: 62 * this._h / 100,
      r: r * 1.2, mode: 'line', color: 'white', type: 'line',
    });
    this._items.push({
      x: 50 * this._w / 100, y: 76 * this._h / 100,
      r: r * 1.2, mode: 'line', color: 'grey', type: 'line',
    });

    // Delete mode
    this._items.push({
      x: 50 * this._w / 100, y: 91 * this._h / 100,
      r: r * 1.2, mode: 'delete', color: 'red', type: 'delete',
    });
  }

  private _draw(): void {
    const ctx = this._ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this._w, this._h);

    for (const item of this._items) {
      if (item.type === 'pin') {
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.r + 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(item.x, item.y, item.r, 0, Math.PI * 2);
        ctx.fillStyle = color[item.color];
        ctx.fill();
      } else if (item.type === 'line') {
        const hw = this._w * 0.35;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(item.x - hw, item.y);
        ctx.lineTo(item.x + hw, item.y);
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = item.r + 4;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(item.x - hw, item.y);
        ctx.lineTo(item.x + hw, item.y);
        ctx.strokeStyle = color[item.color];
        ctx.lineWidth = item.r;
        ctx.stroke();
      } else if (item.type === 'delete') {
        const s = item.r * 0.7;
        ctx.lineCap = 'round';
        ctx.lineWidth = 4;
        ctx.strokeStyle = color.red;

        ctx.beginPath();
        ctx.moveTo(item.x - s, item.y - s);
        ctx.lineTo(item.x + s, item.y + s);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(item.x + s, item.y - s);
        ctx.lineTo(item.x - s, item.y + s);
        ctx.stroke();
      }
    }
  }

  onCanvasClick(event: PointerEvent) {
    if (!this._canvas) return;
    const cr = this._canvas.getBoundingClientRect();
    const mx = (event.clientX - cr.left) / cr.width * this._w;
    const my = (event.clientY - cr.top) / cr.height * this._h;

    for (const item of this._items) {
      const dx = mx - item.x;
      const dy = my - item.y;
      if (Math.sqrt(dx * dx + dy * dy) < item.r) {
        this.dispatch('editor-select', { mode: item.mode, color: item.color }, true);
        return;
      }
    }
  }
}

export const circuitsEditor = CircuitsEditor.vConstructor
