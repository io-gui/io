//@ts-nocheck
import { Register, IoElement, ThemeSingleton, Theme } from 'io-gui';

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * `IoStyleContainer` is a container element that applies styles to the elements inside it.
 * It is used to apply styles to the elements inside it.
 */
export class IoStyleContainer extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: contents;
        font-family: monospace;
      }
      :host io-field {
        color: var(--io_colorStrong) !important;
      }
      :host io-property-link > span {
        color: var(--io_colorGreen) !important;
      }
      :host io-string[appearance=inset] {
        color: var(--io_colorRed) !important;
        padding-left: var(--io_fieldHeight) !important;
        padding-right: var(--io_fieldHeight) !important;
        border-radius: var(--io_fieldHeight) 0 var(--io_fieldHeight) 0;
        background: var(--white-noise-bg) !important;
      }
      :host io-number[appearance=inset] {
        color: var(--io_colorBlue) !important;
        padding-left: var(--io_fieldHeight) !important;
        padding-right: var(--io_fieldHeight) !important;
        transform: skew(-15deg);
        margin-left: var(--io_spacing2);
        margin-right: var(--io_spacing2);
        background: var(--white-noise-bg) !important;
      }
    `;
  }

  static get ReactiveProperties() {
    return {
      theme: {type: Theme, value: ThemeSingleton},
    };
  }

  constructor() {
    super();
    this.generateWhiteNoise();
  }

  themeMutated() {
    this.generateWhiteNoise();
  }

  generateWhiteNoise() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size for the noise pattern
    canvas.width = 128;
    canvas.height = 128;

    // Generate white noise
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    const c1 = ThemeSingleton.bgColor;
    const c2 = ThemeSingleton.bgColorStrong;
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random();
      data[i] = lerp(c1.r, c2.r, noise) * 255;     // Red
      data[i + 1] = lerp(c1.g, c2.g, noise) * 255; // Green
      data[i + 2] = lerp(c1.b, c2.b, noise) * 255; // Blue
      data[i + 3] = 255;   // Alpha
    }

    ctx.putImageData(imageData, 0, 0);

    // Convert to data URI and set as CSS variable
    const dataUri = canvas.toDataURL();
    document.documentElement.style.setProperty('--white-noise-bg', `url(${dataUri})`);
  }
}
Register(IoStyleContainer);

export const ioStyleContainer = IoStyleContainer.vConstructor;