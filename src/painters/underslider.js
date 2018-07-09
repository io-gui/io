class UndersliderPainter {
  static get inputProperties() { return ['--slider-color', '--slider-value']; }
  paint(ctx, geom, properties) {
    const color = properties.get('--slider-color');
    const value = parseFloat(properties.get('--slider-value'));

    if (isNaN(value)) return;

    const w = geom.width, h = geom.height;
    const lineHeight = 1;
    const triangleSize = 3;

    ctx.lineWidth = lineHeight;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, h - lineHeight / 2);
    ctx.lineTo(value * w, h - lineHeight / 2);
    ctx.stroke();

    if (value > 0) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(value * w - triangleSize, h);
      ctx.lineTo(value * w, h - triangleSize);
      ctx.lineTo(value * w + triangleSize, h);
      ctx.fill();
    }
  }
}

registerPaint('underslider', UndersliderPainter);
