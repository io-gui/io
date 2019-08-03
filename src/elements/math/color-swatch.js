import {html} from "../../io.js";
import {IoGl} from "../../io-elements-core.js";
import {convert} from "../../../lib/color-convert.js";

export class IoColorSwatch extends IoGl {
  static get Style() {
    return html`<style>
      :host {
        border-radius: var(--io-border-radius);
        border: var(--io-inset-border);
        min-width: var(--io-line-height);
        min-height: var(--io-line-height);
      }
      :host[aria-invalid] {
        border: var(--io-border-error);
      }
      :host:focus {
        outline: 0;
        border-color: var(--io-color-focus);
      }
    </style>`;
  }
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
  static get GlUtils() {
    return /* glsl */`
    vec3 hue2rgb(float hue) {
      hue=fract(hue);
      float R = abs(hue * 6. - 3.) - 1.;
      float G = 2. - abs(hue * 6. - 2.);
      float B = 2. - abs(hue * 6. - 4.);
      return saturate(vec3(R,G,B));
    }
    vec3 hsv2rgb(vec3 hsv) {
      vec3 rgb = hue2rgb(hsv.r);
      return ((rgb - 1.) * hsv.g + 1.) * hsv.b;
    }
    vec3 hsl2rgb(vec3 hsl) {
      vec3 rgb = hue2rgb(hsl.x);
      float C = (1. - abs(2. * hsl.z - 1.)) * hsl.y;
      return (rgb - 0.5) * C + hsl.z;
    }
    // // Constants
    // const float HCV_EPSILON = 1e-10;
    // const float HSL_EPSILON = 1e-10;
    // const float HCY_EPSILON = 1e-10;
    //
    // const float SRGB_GAMMA = 1.0 / 2.2;
    // const float SRGB_INVERSE_GAMMA = 2.2;
    // const float SRGB_ALPHA = 0.055;
    //
    // const mat3 RGB_2_XYZ = (mat3(
    //   0.4124564, 0.3575761, 0.1804375,
    //   0.2126729, 0.7151522, 0.0721750,
    //   0.0193339, 0.1191920, 0.9503041
    // ));
    //
    // const mat3 XYZ_2_RGB = (mat3(
    //    3.2404542,-1.5371385,-0.4985314,
    //   -0.9692660, 1.8760108, 0.0415560,
    //    0.0556434,-0.2040259, 1.0572252
    // ));
    //
    // const vec3 LUMA_COEFFS = vec3(0.2126, 0.7152, 0.0722);
    //
    // float get_luminance(vec3 rgb) {
    //   return dot(LUMA_COEFFS, rgb);
    // }
    //
    // vec3 rgb_to_srgb_approx(vec3 rgb) {
    //   return pow(rgb, vec3(SRGB_GAMMA));
    // }
    //
    // vec3 srgb_to_rgb_approx(vec3 srgb) {
    //   return pow(srgb, vec3(SRGB_INVERSE_GAMMA));
    // }
    //
    // float linear_to_srgb(float channel) {
    //   if(channel <= 0.0031308)
    //     return 12.92 * channel;
    //   else
    //     return (1.0 + SRGB_ALPHA) * pow(channel, 1.0/2.4) - SRGB_ALPHA;
    // }
    //
    // float srgb_to_linear(float channel) {
    //   if (channel <= 0.04045)
    //     return channel / 12.92;
    //   else
    //     return pow((channel + SRGB_ALPHA) / (1.0 + SRGB_ALPHA), 2.4);
    // }
    //
    // vec3 rgb_to_srgb(vec3 rgb) {
    //   return vec3(
    //     linear_to_srgb(rgb.r),
    //     linear_to_srgb(rgb.g),
    //     linear_to_srgb(rgb.b)
    //   );
    // }
    //
    // vec3 srgb_to_rgb(vec3 srgb) {
    //   return vec3(
    //     srgb_to_linear(srgb.r),
    //     srgb_to_linear(srgb.g),
    //     srgb_to_linear(srgb.b)
    //   );
    // }
    //
    // vec3 rgb_to_xyz(vec3 rgb) {
    //   return RGB_2_XYZ * rgb;
    // }
    //
    // vec3 xyz_to_rgb(vec3 xyz) {
    //   return XYZ_2_RGB * xyz;
    // }
    //
    // vec3 xyz_to_xyY(vec3 xyz) {
    //   float Y = xyz.y;
    //   float x = xyz.x / (xyz.x + xyz.y + xyz.z);
    //   float y = xyz.y / (xyz.x + xyz.y + xyz.z);
    //   return vec3(x, y, Y);
    // }
    //
    // vec3 xyY_to_xyz(vec3 xyY) {
    //   float Y = xyY.z;
    //   float x = Y * xyY.x / xyY.y;
    //   float z = Y * (1.0 - xyY.x - xyY.y) / xyY.y;
    //   return vec3(x, Y, z);
    // }
    //
    // vec3 rgb_to_xyY(vec3 rgb) {
    //   vec3 xyz = rgb_to_xyz(rgb);
    //   return xyz_to_xyY(xyz);
    // }
    //
    // vec3 xyY_to_rgb(vec3 xyY) {
    //   vec3 xyz = xyY_to_xyz(xyY);
    //   return xyz_to_rgb(xyz);
    // }
    //
    // vec3 rgb_to_hcv(vec3 rgb)
    // {
    //     // Based on work by Sam Hocevar and Emil Persson
    //     vec4 P = (rgb.g < rgb.b) ? vec4(rgb.bg, -1.0, 2.0/3.0) : vec4(rgb.gb, 0.0, -1.0/3.0);
    //     vec4 Q = (rgb.r < P.x) ? vec4(P.xyw, rgb.r) : vec4(rgb.r, P.yzx);
    //     float C = Q.x - min(Q.w, Q.y);
    //     float H = abs((Q.w - Q.y) / (6. * C + HCV_EPSILON) + Q.z);
    //     return vec3(H, C, Q.x);
    // }
    //
    // vec3 hue_to_rgb(float hue)
    // {
    //     float R = abs(hue * 6. - 3.) - 1.;
    //     float G = 2. - abs(hue * 6. - 2.);
    //     float B = 2. - abs(hue * 6. - 4.);
    //     return saturate(vec3(R,G,B));
    // }
    //
    // vec3 hsv_to_rgb(vec3 hsv)
    // {
    //     vec3 rgb = hue_to_rgb(hsv.x);
    //     return ((rgb - 1.0) * hsv.y + 1.0) * hsv.z;
    // }
    //
    //
    // // Converts from HCY to linear RGB
    // vec3 hcy_to_rgb(vec3 hcy)
    // {
    //     const vec3 HCYwts = vec3(0.299, 0.587, 0.114);
    //     vec3 RGB = hue_to_rgb(hcy.x);
    //     float Z = dot(RGB, HCYwts);
    //     if (hcy.z < Z) {
    //         hcy.y *= hcy.z / Z;
    //     } else if (Z < 1.) {
    //         hcy.y *= (1. - hcy.z) / (1. - Z);
    //     }
    //     return (RGB - Z) * hcy.y + hcy.z;
    // }
    //
    //
    // // Converts from linear RGB to HSV
    // vec3 rgb_to_hsv(vec3 rgb)
    // {
    //     vec3 HCV = rgb_to_hcv(rgb);
    //     float S = HCV.y / (HCV.z + HCV_EPSILON);
    //     return vec3(HCV.x, S, HCV.z);
    // }
    //
    // // Converts from linear rgb to HSL
    // vec3 rgb_to_hsl(vec3 rgb)
    // {
    //     vec3 HCV = rgb_to_hcv(rgb);
    //     float L = HCV.z - HCV.y * 0.5;
    //     float S = HCV.y / (1. - abs(L * 2. - 1.) + HSL_EPSILON);
    //     return vec3(HCV.x, S, L);
    // }
    //
    // vec3 rgb_to_hcy(vec3 rgb)
    // {
    //     const vec3 HCYwts = vec3(0.299, 0.587, 0.114);
    //     // Corrected by David Schaeffer
    //     vec3 HCV = rgb_to_hcv(rgb);
    //     float Y = dot(rgb, HCYwts);
    //     float Z = dot(hue_to_rgb(HCV.x), HCYwts);
    //     if (Y < Z) {
    //       HCV.y *= Z / (HCY_EPSILON + Y);
    //     } else {
    //       HCV.y *= (1. - Z) / (HCY_EPSILON + 1. - Y);
    //     }
    //     return vec3(HCV.x, HCV.y, Y);
    // }
    //
    // vec3 rgb_to_ycbcr(vec3 rgb) {
    //     float y = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
    //     float cb = (rgb.b - y) * 0.565;
    //     float cr = (rgb.r - y) * 0.713;
    //     return vec3(y, cb, cr);
    // }
    //
    // vec3 ycbcr_to_rgb(vec3 yuv) {
    //     return vec3(
    //         yuv.x + 1.403 * yuv.z,
    //         yuv.x - 0.344 * yuv.y - 0.714 * yuv.z,
    //         yuv.x + 1.770 * yuv.y
    //     );
    // }
    //
    // // Additional conversions converting to rgb first and then to the desired
    // // color space.
    //
    // // To srgb
    // vec3 xyz_to_srgb(vec3 xyz)  { return rgb_to_srgb(xyz_to_rgb(xyz)); }
    // vec3 xyY_to_srgb(vec3 xyY)  { return rgb_to_srgb(xyY_to_rgb(xyY)); }
    // vec3 hue_to_srgb(float hue) { return rgb_to_srgb(hue_to_rgb(hue)); }
    // vec3 hsv_to_srgb(vec3 hsv)  { return rgb_to_srgb(hsv_to_rgb(hsv)); }
    // vec3 hsl_to_srgb(vec3 hsl)  { return rgb_to_srgb(hsl_to_rgb(hsl)); }
    // vec3 hcy_to_srgb(vec3 hcy)  { return rgb_to_srgb(hcy_to_rgb(hcy)); }
    // vec3 ycbcr_to_srgb(vec3 yuv)  { return rgb_to_srgb(ycbcr_to_rgb(yuv)); }
    //
    // // To xyz
    // vec3 srgb_to_xyz(vec3 srgb) { return rgb_to_xyz(srgb_to_rgb(srgb)); }
    // vec3 hue_to_xyz(float hue)  { return rgb_to_xyz(hue_to_rgb(hue)); }
    // vec3 hsv_to_xyz(vec3 hsv)   { return rgb_to_xyz(hsv_to_rgb(hsv)); }
    // vec3 hsl_to_xyz(vec3 hsl)   { return rgb_to_xyz(hsl_to_rgb(hsl)); }
    // vec3 hcy_to_xyz(vec3 hcy)   { return rgb_to_xyz(hcy_to_rgb(hcy)); }
    // vec3 ycbcr_to_xyz(vec3 yuv)   { return rgb_to_xyz(ycbcr_to_rgb(yuv)); }
    //
    // // To xyY
    // vec3 srgb_to_xyY(vec3 srgb) { return rgb_to_xyY(srgb_to_rgb(srgb)); }
    // vec3 hue_to_xyY(float hue)  { return rgb_to_xyY(hue_to_rgb(hue)); }
    // vec3 hsv_to_xyY(vec3 hsv)   { return rgb_to_xyY(hsv_to_rgb(hsv)); }
    // vec3 hsl_to_xyY(vec3 hsl)   { return rgb_to_xyY(hsl_to_rgb(hsl)); }
    // vec3 hcy_to_xyY(vec3 hcy)   { return rgb_to_xyY(hcy_to_rgb(hcy)); }
    // vec3 ycbcr_to_xyY(vec3 yuv)   { return rgb_to_xyY(ycbcr_to_rgb(yuv)); }
    //
    // // To HCV
    // vec3 srgb_to_hcv(vec3 srgb) { return rgb_to_hcv(srgb_to_rgb(srgb)); }
    // vec3 xyz_to_hcv(vec3 xyz)   { return rgb_to_hcv(xyz_to_rgb(xyz)); }
    // vec3 xyY_to_hcv(vec3 xyY)   { return rgb_to_hcv(xyY_to_rgb(xyY)); }
    // vec3 hue_to_hcv(float hue)  { return rgb_to_hcv(hue_to_rgb(hue)); }
    // vec3 hsv_to_hcv(vec3 hsv)   { return rgb_to_hcv(hsv_to_rgb(hsv)); }
    // vec3 hsl_to_hcv(vec3 hsl)   { return rgb_to_hcv(hsl_to_rgb(hsl)); }
    // vec3 hcy_to_hcv(vec3 hcy)   { return rgb_to_hcv(hcy_to_rgb(hcy)); }
    // vec3 ycbcr_to_hcv(vec3 yuv)   { return rgb_to_hcy(ycbcr_to_rgb(yuv)); }
    //
    // // To HSV
    // vec3 srgb_to_hsv(vec3 srgb) { return rgb_to_hsv(srgb_to_rgb(srgb)); }
    // vec3 xyz_to_hsv(vec3 xyz)   { return rgb_to_hsv(xyz_to_rgb(xyz)); }
    // vec3 xyY_to_hsv(vec3 xyY)   { return rgb_to_hsv(xyY_to_rgb(xyY)); }
    // vec3 hue_to_hsv(float hue)  { return rgb_to_hsv(hue_to_rgb(hue)); }
    // vec3 hsl_to_hsv(vec3 hsl)   { return rgb_to_hsv(hsl_to_rgb(hsl)); }
    // vec3 hcy_to_hsv(vec3 hcy)   { return rgb_to_hsv(hcy_to_rgb(hcy)); }
    // vec3 ycbcr_to_hsv(vec3 yuv)   { return rgb_to_hsv(ycbcr_to_rgb(yuv)); }
    //
    // // To HSL
    // vec3 srgb_to_hsl(vec3 srgb) { return rgb_to_hsl(srgb_to_rgb(srgb)); }
    // vec3 xyz_to_hsl(vec3 xyz)   { return rgb_to_hsl(xyz_to_rgb(xyz)); }
    // vec3 xyY_to_hsl(vec3 xyY)   { return rgb_to_hsl(xyY_to_rgb(xyY)); }
    // vec3 hue_to_hsl(float hue)  { return rgb_to_hsl(hue_to_rgb(hue)); }
    // vec3 hsv_to_hsl(vec3 hsv)   { return rgb_to_hsl(hsv_to_rgb(hsv)); }
    // vec3 hcy_to_hsl(vec3 hcy)   { return rgb_to_hsl(hcy_to_rgb(hcy)); }
    // vec3 ycbcr_to_hsl(vec3 yuv)   { return rgb_to_hsl(ycbcr_to_rgb(yuv)); }
    //
    // // To HCY
    // vec3 srgb_to_hcy(vec3 srgb) { return rgb_to_hcy(srgb_to_rgb(srgb)); }
    // vec3 xyz_to_hcy(vec3 xyz)   { return rgb_to_hcy(xyz_to_rgb(xyz)); }
    // vec3 xyY_to_hcy(vec3 xyY)   { return rgb_to_hcy(xyY_to_rgb(xyY)); }
    // vec3 hue_to_hcy(float hue)  { return rgb_to_hcy(hue_to_rgb(hue)); }
    // vec3 hsv_to_hcy(vec3 hsv)   { return rgb_to_hcy(hsv_to_rgb(hsv)); }
    // vec3 hsl_to_hcy(vec3 hsl)   { return rgb_to_hcy(hsl_to_rgb(hsl)); }
    // vec3 ycbcr_to_hcy(vec3 yuv)   { return rgb_to_hcy(ycbcr_to_rgb(yuv)); }
    //
    // // YCbCr
    // vec3 srgb_to_ycbcr(vec3 srgb) { return rgb_to_ycbcr(srgb_to_rgb(srgb)); }
    // vec3 xyz_to_ycbcr(vec3 xyz)   { return rgb_to_ycbcr(xyz_to_rgb(xyz)); }
    // vec3 xyY_to_ycbcr(vec3 xyY)   { return rgb_to_ycbcr(xyY_to_rgb(xyY)); }
    // vec3 hue_to_ycbcr(float hue)  { return rgb_to_ycbcr(hue_to_rgb(hue)); }
    // vec3 hsv_to_ycbcr(vec3 hsv)   { return rgb_to_ycbcr(hsv_to_rgb(hsv)); }
    // vec3 hsl_to_ycbcr(vec3 hsl)   { return rgb_to_ycbcr(hsl_to_rgb(hsl)); }
    // vec3 hcy_to_ycbcr(vec3 hcy)   { return rgb_to_ycbcr(hcy_to_rgb(hcy)); }
    \n\n`;
  }
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      void main(void) {
        vec2 position = vUv * uSize;

        // Alpha pattern
        vec3 alphaPattern = mix(vec3(0.5), vec3(1.0), checker(position, 5.0));

        gl_FragColor = saturate(vec4(mix(alphaPattern, uRgb.rgb, uAlpha), 1.0));
      }
    `;
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

IoColorSwatch.Register();
