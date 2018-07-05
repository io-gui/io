class SliderPainter {
  static get inputProperties() { return ['--slider-min', '--slider-max', '--slider-step', '--slider-value']; }
  paint(ctx, geom, properties) {
    const min = parseFloat(properties.get('--slider-min'));
    const max = parseFloat(properties.get('--slider-max'));
    const step = parseFloat(properties.get('--slider-step'));
    const value = parseFloat(properties.get('--slider-value'));

    if (isNaN(value)) return;

    let pos, snap = Math.floor(min / step) * step;
    let w = geom.width, h = geom.height;
    let handleWidth = 4

    if (((max - min) / step) < w / 3 ) {
      while (snap < (max - step)) {
        snap += step;
        pos = Math.floor(w * (snap - min) / (max - min));
        ctx.lineWidth = .5;
        ctx.strokeStyle = "#888";
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, h);
        ctx.stroke();
      }
    }

    ctx.fillStyle = "#888";
    ctx.fillRect(0, h / 2 - 2, w, 4);

    pos = handleWidth / 2 + (w - handleWidth) * (value - min) / (max - min);
    const gradient = ctx.createLinearGradient(0, 0, pos, 0);
    gradient.addColorStop(0, '#2cf');
    gradient.addColorStop(1, '#2f6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, h / 2 - 2, pos, 4);

    ctx.lineWidth = handleWidth;
    ctx.strokeStyle = "#2f6";
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, h);
    ctx.stroke();
  }
}

registerPaint('slider', SliderPainter);
