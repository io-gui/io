import {IoElement, html} from "../../io.js";
import {convert} from "../../../lib/color-convert.js";

export const IoColorMixin = (superclass) => {
  const classConstructor = class extends superclass {
    static get Properties() {
      return {
        value: [1, 1, 1, 1],
        // Internal
        rgb: [1, 1, 1],
        hsv: [1, 1, 1],
        hsl: [1, 1, 1],
        cmyk: [1, 1, 1, 1],
        alpha: 1,
        components: {
          type: Array,
          notify: false,
        },
        // 0 - rgba
        // 1 - hsva
        // 2 - hsla
        // 3 - cmyka
        mode: 0,
      };
    }
    valueMutated() {
      this.valueChanged();
    }
    valueChanged() {
      let c = [];
      if (this.value instanceof Array) {
        for (var i = 0; i < this.value.length; i++) {
          c.push(i);
        }
      } else {
        c.push(...Object.keys(this.value));
      }

      let mode = this.mode;
      if (c.indexOf('r') !== -1) mode = 0;
      else if (c.indexOf('h') !== -1 && c.indexOf('v') !== -1) mode = 1;
      else if (c.indexOf('h') !== -1 && c.indexOf('l') !== -1) mode = 2;
      else if (c.indexOf('c') !== -1) mode = 3;

      const val = [];
      for (let i = 0; i < c.length; i++) {
        val.push(this.value[c[i]]);
      }

      let rgb;
      let hsv;
      let hsl;
      let cmyk;
      let alpha = 1;

      switch (mode) {
        case 3:
          cmyk = [val[0] * 100, val[1] * 100, val[2] * 100, val[3] * 100];
          rgb = convert.cmyk.rgb(cmyk);
          hsv = convert.rgb.hsv(convert.cmyk.rgb(cmyk));
          hsl = convert.rgb.hsl(convert.cmyk.rgb(cmyk));
          if (val[4] !== undefined) alpha = val[4] * 100;
          break;
        case 2:
          hsl = [val[0] * 360, val[1] * 100, val[2] * 100];
          rgb = convert.hsl.rgb(hsl);
          hsv = convert.hsl.hsv(hsl);
          cmyk = convert.rgb.cmyk(convert.hsl.rgb(hsl));
          if (val[3] !== undefined) alpha = val[3] * 100;
          break;
        case 1:
          hsv = [val[0] * 360, val[1] * 100, val[2] * 100];
          rgb = convert.hsv.rgb(hsv);
          hsl = convert.hsv.hsl(hsv);
          cmyk = convert.rgb.cmyk(convert.hsv.rgb(hsv));
          if (val[3] !== undefined) alpha = val[3] * 100;
          break;
        case 0:
        default:
          rgb = [val[0] * 255, val[1] * 255, val[2] * 255];
          hsv = convert.rgb.hsv(rgb);
          hsl = convert.rgb.hsl(rgb);
          cmyk = convert.rgb.cmyk(rgb);
          if (val[3] !== undefined) alpha = val[3] * 100;
          break;
      }

      this.setProperties({
        rgb: [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255],
        hsv: [hsv[0] / 360, hsv[1] / 100, hsv[2] / 100],
        hsl: [hsl[0] / 360, hsl[1] / 100, hsl[2] / 100],
        cmyk: [cmyk[0] / 100, cmyk[1] / 100, cmyk[2] / 100, cmyk[3] / 100],
        alpha: alpha / 100,
        components: c,
        mode: mode,
      });
    }
  }
  classConstructor.Register = IoElement.Register;
  return classConstructor;
}
