import scene from './scene';
import game from './game';
import { getTouch, bindTouchStart, bindTouchMove, bindTouchEnd } from '../app/touches';

interface TouchState {
  x: number;
  y: number;
  drag: boolean;
}

/**
 * Plotter — translates touch / mouse input on the game canvas
 * into grid coordinates and dispatches game actions.
 */
class Plotter {
  touch: TouchState = { x: 0, y: 0, drag: false };
  x = 0;
  y = 0;
  xOld = 0;
  yOld = 0;
  randomID = 0;

  init(): void {
    this.touch = { x: 0, y: 0, drag: false };

    bindTouchStart('#canvas-top', (event: Event) => {
      event.preventDefault();
      this.randomID = Math.floor(Math.random() * 100000);
      this.touch.drag = true;
      this._initPosition(event as TouchEvent | MouseEvent);
      scene.drawMarker(this.touch.x, this.touch.y);

      if (game.drawMode === 'pin') {
        game.addPin(this.x, this.y, game.drawColor, this.randomID);
      }
      if (game.drawMode === 'line') {
        game.addLine(this.x, this.y, game.drawColor, this.randomID);
      }
      if (game.drawMode === 'delete') {
        game.deletePin(this.x, this.y);
        game.deleteLine(this.x, this.y);
      }
    });

    bindTouchMove('#canvas-top', (event: Event) => {
      event.preventDefault();
      this._updatePosition(event as TouchEvent | MouseEvent);
      scene.drawMarker(this.touch.x, this.touch.y);

      if (game.drawMode === 'line' && this.touch.drag &&
          (this.x !== this.xOld || this.y !== this.yOld)) {
        const endDrag = game.addLine(this.x, this.y, game.drawColor, this.randomID);
        if (endDrag) this.touch.drag = false;
      }
    });

    bindTouchEnd('#canvas-top', (event: Event) => {
      event.preventDefault();
      this.touch.drag = false;
      scene.hideMarker();
      game.save();
      game.updateUndoStack();
      game.checkLine(this.randomID);
      game.propagateColors();
      game.checkCompletion();
    });
  }

  // ── Position helpers ──────────────────────────────────────────────

  private _initPosition(event: TouchEvent | MouseEvent): void {
    const touch = getTouch(event);
    const canvas = document.getElementById('canvas-top');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    this.touch.x = (touch.clientX - rect.left - scene.gridOffsetX) / scene.gridUnit;
    this.touch.y = (touch.clientY - rect.top - scene.gridOffsetY) / scene.gridUnit;

    this.x = Math.round(this.touch.x);
    this.y = Math.round(this.touch.y);
    this.xOld = this.x;
    this.yOld = this.y;
  }

  private _updatePosition(event: TouchEvent | MouseEvent): void {
    const touch = getTouch(event);
    const canvas = document.getElementById('canvas-top');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    this.touch.x = (touch.clientX - rect.left - scene.gridOffsetX) / scene.gridUnit;
    this.touch.y = (touch.clientY - rect.top - scene.gridOffsetY) / scene.gridUnit;

    const distance = Math.sqrt(
      Math.pow(this.touch.x - Math.round(this.touch.x), 2) +
      Math.pow(this.touch.y - Math.round(this.touch.y), 2),
    );

    if (distance < 0.50 &&
        this.touch.x <= game.width + 0.5 && this.touch.y <= game.height + 0.5 &&
        this.touch.x >= -0.5 && this.touch.y >= -0.5) {
      this.xOld = this.x;
      this.yOld = this.y;

      this.x = Math.round(this.touch.x);
      this.y = Math.round(this.touch.y);

      if (this.x > this.xOld) this.x = this.xOld + 1;
      if (this.x < this.xOld) this.x = this.xOld - 1;
      if (this.y > this.yOld) this.y = this.yOld + 1;
      if (this.y < this.yOld) this.y = this.yOld - 1;
    }
  }
}

const plotter = new Plotter();
export default plotter;
