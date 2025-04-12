import NumberSliderRangeElementTest from './elements/IoNumberSliderRange.test';
import NumberSliderElementTest from './elements/IoNumberSlider.test';
import SliderRangeElementTest from './elements/IoSliderRange.test';
import SliderElementTest from './elements/IoSlider.test';

export default class {
  run() {
    new NumberSliderRangeElementTest().run();
    new NumberSliderElementTest().run();
    new SliderRangeElementTest().run();
    new SliderElementTest().run();
  }
}