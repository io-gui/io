/** Screen sizing — maintains aspect ratio and exports current dimensions. */

export let width = 0;
export let height = 0;

export function resize(): void {
  height = window.innerHeight;
  width = window.innerWidth;

  // Clamp to a portrait aspect ratio (roughly 9:16)
  if (width / 3.2 > height / 4) width = height / 4 * 3.2;
  if (width / 9 < height / 16) height = width / 9 * 16;

  const screen = document.getElementById('screen');
  if (screen) {
    screen.style.width = width + 'px';
    screen.style.height = height + 'px';
  }
}
