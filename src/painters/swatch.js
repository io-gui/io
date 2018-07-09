class SwatchPainter {
  static get inputProperties() { return ['--swatch-color']; }
  paint(ctx, geom, properties) {
    const w = geom.width, h = geom.height;
    const colors = ['#fff', '#ddd'];
    const size = h / 4;

    // TODO: optimize with image?!
    for (let y = 0; y < h/size; y++) {
      for(let x = 0; x < w/size; x++) {
        ctx.beginPath();
        ctx.fillStyle = colors[(x + y) % colors.length];
        ctx.rect(x * size, y * size, size, size);
        ctx.fill();
      }
    }

    ctx.fillStyle = properties.get('--swatch-color');
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.fill();
  }
}

registerPaint('swatch', SwatchPainter);
