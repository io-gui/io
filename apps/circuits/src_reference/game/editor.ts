import color from '../app/color';
import game from './game';
import type { DrawMode } from './game';
import navigation from '../app/navigation';

interface EditorItem {
  x: number;
  y: number;
  r: number;
  mode: DrawMode;
  color: string;
  type: 'pin' | 'line' | 'delete';
}

/**
 * Editor — Canvas-based colour / tool picker overlay.
 * Click a swatch to set the draw mode and colour, then close.
 */
class Editor {
  private ctx: CanvasRenderingContext2D | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private items: EditorItem[] = [];
  private w = 0;
  private h = 0;

  init(): void {
    this.canvas = document.getElementById('editor-canvas') as HTMLCanvasElement | null;
    if (!this.canvas) return;

    const rect = this.canvas.parentElement!.getBoundingClientRect();
    this.w = rect.width * 0.85;
    this.h = rect.height * 0.85;

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.w * dpr;
    this.canvas.height = this.h * dpr;
    this.canvas.style.width = this.w + 'px';
    this.canvas.style.height = this.h + 'px';

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;
    this.ctx.scale(dpr, dpr);

    this._buildItems();
    this._draw();

    this.canvas.addEventListener('click', (e: MouseEvent) => {
      if (!this.canvas) return;
      const cr = this.canvas.getBoundingClientRect();
      const mx = (e.clientX - cr.left) / cr.width * this.w;
      const my = (e.clientY - cr.top) / cr.height * this.h;

      for (const item of this.items) {
        const dx = mx - item.x;
        const dy = my - item.y;
        if (Math.sqrt(dx * dx + dy * dy) < item.r) {
          game.drawMode = item.mode;
          game.drawColor = item.color;
          navigation.closeWin();
          return;
        }
      }
    });
  }

  /** Define the palette items. */
  private _buildItems(): void {
    const r = this.w / 12;

    const pinRow = (cols: [number, string][], yPct: number, mode: DrawMode) => {
      for (const [xPct, c] of cols) {
        this.items.push({
          x: xPct * this.w / 100,
          y: yPct * this.h / 100,
          r, mode, color: c, type: 'pin',
        });
      }
    };

    // White pin
    pinRow([[50, 'white']], 10, 'pin');

    // Coloured pins – row 1
    pinRow([
      [10, 'red'], [30, 'green'], [50, 'blue'], [70, 'pink'], [90, 'yellow'],
    ], 28, 'pin');

    // Coloured pins – row 2
    pinRow([
      [10, 'orange'], [30, 'purple'], [50, 'brown'], [70, 'grey'], [90, 'black'],
    ], 44, 'pin');

    // Line modes
    this.items.push({
      x: 50 * this.w / 100, y: 62 * this.h / 100,
      r: r * 1.2, mode: 'line', color: 'white', type: 'line',
    });
    this.items.push({
      x: 50 * this.w / 100, y: 76 * this.h / 100,
      r: r * 1.2, mode: 'line', color: 'grey', type: 'line',
    });

    // Delete mode
    this.items.push({
      x: 50 * this.w / 100, y: 91 * this.h / 100,
      r: r * 1.2, mode: 'delete', color: 'red', type: 'delete',
    });
  }

  private _draw(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.w, this.h);

    for (const item of this.items) {
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
        const hw = this.w * 0.35;
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
}

const editor = new Editor();
export default editor;
