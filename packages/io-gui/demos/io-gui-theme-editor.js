import { IoElement, Register, IoThemeSingleton } from 'io-gui';
import { MenuOptions, ioOptionMenu } from 'io-menus';
import { ioButton, ioField } from 'io-inputs';
import { ioNumberSlider } from 'io-sliders';
import { ioColorRgba } from 'io-colors';

export class IoGuiThemeEditor extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      align-self: start;
      display: grid;
      grid-gap: var(--io_spacing);
      padding: var(--io_spacing3);
      grid-template-columns: auto 2fr !important;
    }
    `;
  }
  constructor(props) {
    super(props);
    this.template([
      ioOptionMenu({value: IoThemeSingleton.bind('themeID'), options: new MenuOptions([
        {label: 'Light Theme', value: 'light'},
        {label: 'Dark Theme', value: 'dark'},
      ])}),
      ioButton({label: 'Reset', action: () => IoThemeSingleton.reset() }),

      ioField({appearance: 'neutral', label: 'spacing'}),
      ioNumberSlider({value: IoThemeSingleton.bind('spacing'), min: 0, max: 20, step: 1}),

      ioField({appearance: 'neutral', label: 'lineHeight'}),
      ioNumberSlider({value: IoThemeSingleton.bind('lineHeight'), min: 10, max: 50, step: 1}),

      ioField({appearance: 'neutral', label: 'fontSize'}),
      ioNumberSlider({value: IoThemeSingleton.bind('fontSize'), min: 5, max: 20, step: 1}),

      ioField({appearance: 'neutral', label: 'borderRadius'}),
      ioNumberSlider({value: IoThemeSingleton.bind('borderRadius'), min: 0, max: 20, step: 1}),

      ioField({appearance: 'neutral', label: 'borderWidth'}),
      ioNumberSlider({value: IoThemeSingleton.bind('borderWidth'), min: 0, max: 5, step: 1}),

      ioField({appearance: 'neutral', label: 'borderColor'}),
      ioColorRgba({value: IoThemeSingleton.bind('borderColor')}),

      ioField({appearance: 'neutral', label: 'borderColorLight'}),
      ioColorRgba({value: IoThemeSingleton.bind('borderColorLight')}),

      ioField({appearance: 'neutral', label: 'borderColorDark'}),
      ioColorRgba({value: IoThemeSingleton.bind('borderColorDark')}),

      ioField({appearance: 'neutral', label: 'bgColor'}),
      ioColorRgba({value: IoThemeSingleton.bind('bgColor')}),

      ioField({appearance: 'neutral', label: 'bgColorStrong'}),
      ioColorRgba({value: IoThemeSingleton.bind('bgColorStrong')}),

      ioField({appearance: 'neutral', label: 'bgColorDimmed'}),
      ioColorRgba({value: IoThemeSingleton.bind('bgColorDimmed')}),

      ioField({appearance: 'neutral', label: 'bgColorRed'}),
      ioColorRgba({value: IoThemeSingleton.bind('bgColorRed')}),

      ioField({appearance: 'neutral', label: 'bgColorGreen'}),
      ioColorRgba({value: IoThemeSingleton.bind('bgColorGreen')}),

      ioField({appearance: 'neutral', label: 'bgColorBlue'}),
      ioColorRgba({value: IoThemeSingleton.bind('bgColorBlue')}),

      ioField({appearance: 'neutral', label: 'bgColorField'}),
      ioColorRgba({value: IoThemeSingleton.bind('bgColorField')}),

      ioField({appearance: 'neutral', label: 'color'}),
      ioColorRgba({value: IoThemeSingleton.bind('color')}),

      ioField({appearance: 'neutral', label: 'colorStrong'}),
      ioColorRgba({value: IoThemeSingleton.bind('colorStrong')}),

      ioField({appearance: 'neutral', label: 'colorDimmed'}),
      ioColorRgba({value: IoThemeSingleton.bind('colorDimmed')}),

      ioField({appearance: 'neutral', label: 'colorRed'}),
      ioColorRgba({value: IoThemeSingleton.bind('colorRed')}),

      ioField({appearance: 'neutral', label: 'colorGreen'}),
      ioColorRgba({value: IoThemeSingleton.bind('colorGreen')}),

      ioField({appearance: 'neutral', label: 'colorBlue'}),
      ioColorRgba({value: IoThemeSingleton.bind('colorBlue')}),

      ioField({appearance: 'neutral', label: 'colorWhite'}),
      ioColorRgba({value: IoThemeSingleton.bind('colorWhite')}),

      ioField({appearance: 'neutral', label: 'colorField'}),
      ioColorRgba({value: IoThemeSingleton.bind('colorField')}),


      ioField({appearance: 'neutral', label: 'gradientColorStart'}),
      ioColorRgba({value: IoThemeSingleton.bind('gradientColorStart')}),

      ioField({appearance: 'neutral', label: 'gradientColorEnd'}),
      ioColorRgba({value: IoThemeSingleton.bind('gradientColorEnd')}),

      ioField({appearance: 'neutral', label: 'shadowColor'}),
      ioColorRgba({value: IoThemeSingleton.bind('shadowColor')}),
    ]);
  }
}
Register(IoGuiThemeEditor);
export const ioGuiThemeEditor = IoGuiThemeEditor.vDOM;
