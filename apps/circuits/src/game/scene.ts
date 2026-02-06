import color from './color.js';
import type { Pin } from './pin.js';
import type { Line } from './line.js';

/**
 * Scene — manages layered HTML5 canvases and renders the game state.
 *
 * Layer stack (bottom -> top):
 *   grid   – static grid lines (redrawn on initGrid)
 *   layer0 – grey "underlines"
 *   layer1 – coloured lines + pins
 *   top    – touch marker overlay
 */

interface CanvasLayer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

export class Scene {
  layers: Record<string, CanvasLayer> = {};
  canvasWidth = 0;
  canvasHeight = 0;
  gridWidth = 0;
  gridHeight = 0;
  gridUnit = 0;
  gridOffsetX = 0;
  gridOffsetY = 0;
  markerRadius = 0;

  /** Set up layers from externally provided canvases. */
  init(canvases: Record<string, HTMLCanvasElement>): void {
    this.layers = {};
    for (const name in canvases) {
      const canvas = canvases[name];
      const ctx = canvas.getContext('2d')!;
      this.layers[name] = { canvas, ctx };
    }
  }

  /** Recalculate grid geometry and draw the static grid. */
  initGrid(gameWidth: number, gameHeight: number, containerWidth: number, containerHeight: number): void {
    this.canvasWidth = containerWidth;
    this.canvasHeight = containerHeight;
    const dpr = window.devicePixelRatio || 1;

    for (const name in this.layers) {
      const { canvas } = this.layers[name];
      canvas.width = this.canvasWidth * dpr;
      canvas.height = this.canvasHeight * dpr;
      canvas.style.width = this.canvasWidth + 'px';
      canvas.style.height = this.canvasHeight + 'px';
      this.layers[name].ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    this.gridWidth = gameWidth;
    this.gridHeight = gameHeight;

    // Calculate unit size so the grid fits with a half-unit margin
    if (this.canvasHeight / this.gridHeight > this.canvasWidth / this.gridWidth) {
      this.gridUnit = this.canvasWidth / (this.gridWidth + 1);
    } else {
      this.gridUnit = this.canvasHeight / (this.gridHeight + 1);
    }

    this.gridOffsetX = (this.canvasWidth - this.gridUnit * this.gridWidth) / 2;
    this.gridOffsetY = (this.canvasHeight - this.gridUnit * this.gridHeight) / 2;

    // --- Draw static grid ---
    const ctx = this.layers.grid.ctx;
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(
      this.gridOffsetX, this.gridOffsetY,
      this.gridWidth * this.gridUnit, this.gridHeight * this.gridUnit,
    );

    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1;

    for (let i = 0; i <= gameWidth; i++) {
      const x = i * this.gridUnit + this.gridOffsetX;
      ctx.beginPath();
      ctx.moveTo(x, this.gridOffsetY);
      ctx.lineTo(x, this.gridHeight * this.gridUnit + this.gridOffsetY);
      ctx.stroke();
    }

    for (let j = 0; j <= gameHeight; j++) {
      const y = j * this.gridUnit + this.gridOffsetY;
      ctx.beginPath();
      ctx.moveTo(this.gridOffsetX, y);
      ctx.lineTo(this.gridWidth * this.gridUnit + this.gridOffsetX, y);
      ctx.stroke();
    }

    this.markerRadius = this.canvasWidth * 0.1;
  }

  // -- Rendering --

  /** Full re-render of lines and pins on the dynamic layers. */
  render(pins: Record<number, Pin>, lines: Record<number, Line>): void {
    const ctx0 = this.layers.layer0?.ctx;
    const ctx1 = this.layers.layer1?.ctx;
    if (!ctx0 || !ctx1) return;

    ctx0.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    ctx1.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Pass 1 — strokes (outlines) behind fills
    for (const id in lines) this._drawLineStroke(lines[id]);
    for (const id in pins)  this._drawPinStroke(pins[id]);

    // Pass 2 — fills on top
    for (const id in lines) this._drawLineFill(lines[id]);
    for (const id in pins)  this._drawPinFill(pins[id]);
  }

  // -- Line drawing helpers --

  private _lineParams(line: Line) {
    const isGrey = line.c === 'grey';
    let radius = this.gridUnit / 4;
    let strokeW = 3;
    let strokeColor = 'rgba(0,0,0,1)';
    let opacity = 1;

    if (isGrey) {
      radius *= 1.4;
      strokeW *= 4;
      strokeColor = 'rgba(128,128,128,0.25)';
      opacity = 0.25;
    }

    return {
      ctx: isGrey ? this.layers.layer0.ctx : this.layers.layer1.ctx,
      radius, strokeW, strokeColor, opacity,
    };
  }

  private _buildLinePath(ctx: CanvasRenderingContext2D, positions: [number, number][]): void {
    ctx.beginPath();
    for (let i = 0; i < positions.length; i++) {
      const x = positions[i][0] * this.gridUnit + this.gridOffsetX;
      const y = positions[i][1] * this.gridUnit + this.gridOffsetY;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }

  private _drawLineStroke(line: Line): void {
    if (line.pos.length < 2) return;
    const p = this._lineParams(line);
    p.ctx.save();
    p.ctx.globalAlpha = p.opacity;
    p.ctx.lineCap = 'round';
    p.ctx.lineJoin = 'round';
    this._buildLinePath(p.ctx, line.pos);
    p.ctx.strokeStyle = p.strokeColor;
    p.ctx.lineWidth = p.radius + p.strokeW * 2;
    p.ctx.stroke();
    p.ctx.restore();
  }

  private _drawLineFill(line: Line): void {
    if (line.pos.length < 2) return;
    const p = this._lineParams(line);
    p.ctx.save();
    p.ctx.globalAlpha = p.opacity;
    p.ctx.lineCap = 'round';
    p.ctx.lineJoin = 'round';
    this._buildLinePath(p.ctx, line.pos);
    p.ctx.strokeStyle = color[line.c2] ?? '#fff';
    p.ctx.lineWidth = p.radius;
    p.ctx.stroke();
    p.ctx.restore();
  }

  // -- Pin drawing helpers --

  private _drawPinStroke(pin: Pin): void {
    const ctx = this.layers.layer1.ctx;
    const xx = pin.x * this.gridUnit + this.gridOffsetX;
    const yy = pin.y * this.gridUnit + this.gridOffsetY;
    const r = this.gridUnit / 3;
    const sw = 3;

    if (pin.isReadonly && pin.c !== 'white') {
      ctx.fillStyle = 'rgba(0,0,0,1)';
      ctx.fillRect(xx - r - sw, yy - r - sw, (r + sw) * 2, (r + sw) * 2);
    } else {
      ctx.beginPath();
      ctx.arc(xx, yy, r + sw, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,1)';
      ctx.fill();
    }
  }

  private _drawPinFill(pin: Pin): void {
    const ctx = this.layers.layer1.ctx;
    const xx = pin.x * this.gridUnit + this.gridOffsetX;
    const yy = pin.y * this.gridUnit + this.gridOffsetY;
    const r = this.gridUnit / 3;
    const fillColor = color[pin.c2] ?? '#fff';

    if (pin.isReadonly && pin.c !== 'white') {
      ctx.fillStyle = fillColor;
      ctx.fillRect(xx - r, yy - r, r * 2, r * 2);
    } else {
      ctx.beginPath();
      ctx.arc(xx, yy, r, 0, Math.PI * 2);
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
  }

  // -- Touch marker --

  drawMarker(touchX: number, touchY: number): void {
    const ctx = this.layers.top?.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    const xx = touchX * this.gridUnit + this.gridOffsetX;
    const yy = touchY * this.gridUnit + this.gridOffsetY;
    ctx.beginPath();
    ctx.arc(xx, yy, this.markerRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fill();
  }

  hideMarker(): void {
    const ctx = this.layers.top?.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }
}
