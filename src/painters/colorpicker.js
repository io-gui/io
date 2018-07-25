class ColorPickerPainter {
  static get inputProperties() { return ['--swatch-color']; }
  paint(ctx, geom, properties) {
    const w = geom.width, h = geom.height;
    const h_w = 24;
    const sv_w = w - h_w;

    const color = properties.get('--swatch-color');

    let gradient = ctx.createLinearGradient(0, 0, sv_w, 0);
    gradient.addColorStop(0, '#fff');
    gradient.addColorStop(1, color);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, sv_w, h);

    gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, sv_w, h);

    gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0/6, '#ff0000');
    gradient.addColorStop(1/6, '#ff00ff');
    gradient.addColorStop(2/6, '#0000ff');
    gradient.addColorStop(3/6, '#00ffff');
    gradient.addColorStop(4/6, '#00ff00');
    gradient.addColorStop(5/6, '#ffff00');
    gradient.addColorStop(6/6, '#ff0000');
    ctx.fillStyle = gradient;
    ctx.fillRect(sv_w, 0, w, h);
  }
}

registerPaint('colorpicker', ColorPickerPainter);
