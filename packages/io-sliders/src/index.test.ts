import NumberSliderRangeElementTest from './elements/IoNumberSliderRange.test.js';
import NumberSliderElementTest from './elements/IoNumberSlider.test.js';
import SliderRangeElementTest from './elements/IoSliderRange.test.js';
import SliderElementTest from './elements/IoSlider.test.js';

export default class {
  run() {
    new NumberSliderRangeElementTest().run();
    new NumberSliderElementTest().run();
    new SliderRangeElementTest().run();
    new SliderElementTest().run();
  }
}