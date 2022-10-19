
import NumberSliderRangeElementTest from './number-slider-range.test.js';
import NumberSliderElementTest from './number-slider.test.js';
import SliderRangeElementTest from './slider-range.test.js';
import SliderElementTest from './slider.test.js';

export default class {
  run() {
    new NumberSliderRangeElementTest().run();
    new NumberSliderElementTest().run();
    new SliderRangeElementTest().run();
    new SliderElementTest().run();
  }
}