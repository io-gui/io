import {IoNode} from "./node.js";

class IoCss extends IoNode {
  static get Properties() {
    return {
      backgroundColor: [0, 0, 0, 1],
      color: [1, 1, 1, 1],
      colorLink: [1, 1, 1, 1],
      colorFocus: [1, 1, 1, 1],
      borderWidth: 1,
    };
  }
  getCssRgba(style, property) {
    const rgba = style.getPropertyValue(property).split("(")[1].split(")")[0].split(",");
    return rgba.map(color => { return color / 255 * window.devicePixelRatio; });
  }
  getCssFloat(style, property) {
    return parseFloat(style.getPropertyValue(property)) * window.devicePixelRatio;
  }
  updateValues() {
    const cs = getComputedStyle(document.body);
    this.setProperties({
      color: this.getCssRgba(cs, '--io-color'),
      backgroundColor: this.getCssRgba(cs, '--io-background-color'),
      borderWidth: this.getCssFloat(cs, '--io-border-width'),
      colorLink: this.getCssRgba(cs, '--io-color-link'),
      colorFocus: this.getCssRgba(cs, '--io-color-focus'),
    });
    this.dispatchEvent('object-mutated', {object: this}, false, window);
  }
}
IoCss.Register();

export const IoCssSingleton = new IoCss();
IoCssSingleton.connect();
