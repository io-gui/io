class ColorPainter {
  static get inputProperties() { return ['--color-color', '--color-value']; }
  paint(ctx, geom, properties) {
    const color = properties.get('--color-color');
    const value = parseFloat(properties.get('--color-value'));

    if (isNaN(value)) return;

    const w = geom.width, h = geom.height;
    const lineHeight = 1;

    ctx.lineWidth = lineHeight;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, h - lineHeight / 2);
    ctx.lineTo(value * w, h - lineHeight / 2);
    ctx.stroke();
  }
}

registerPaint('color', ColorPainter);
