# Class: IoColorSlider

## Hierarchy

- `__class`<typeof [`IoSlider`](IoSlider.md), `this`\>

  ↳ **`IoColorSlider`**

  ↳↳ [`IoColorSliderRed`](IoColorSliderRed.md)

  ↳↳ [`IoColorSliderGreen`](IoColorSliderGreen.md)

  ↳↳ [`IoColorSliderBlue`](IoColorSliderBlue.md)

  ↳↳ [`IoColorSliderHue`](IoColorSliderHue.md)

  ↳↳ [`IoColorSliderSaturation`](IoColorSliderSaturation.md)

  ↳↳ [`IoColorSliderValue`](IoColorSliderValue.md)

  ↳↳ [`IoColorSliderLevel`](IoColorSliderLevel.md)

  ↳↳ [`IoColorSliderHs`](IoColorSliderHs.md)

  ↳↳ [`IoColorSliderSv`](IoColorSliderSv.md)

  ↳↳ [`IoColorSliderSl`](IoColorSliderSl.md)

  ↳↳ [`IoColorSliderCyan`](IoColorSliderCyan.md)

  ↳↳ [`IoColorSliderMagenta`](IoColorSliderMagenta.md)

  ↳↳ [`IoColorSliderYellow`](IoColorSliderYellow.md)

  ↳↳ [`IoColorSliderKey`](IoColorSliderKey.md)

  ↳↳ [`IoColorSliderAlpha`](IoColorSliderAlpha.md)

## Constructors

### constructor

• **new IoColorSlider**()

#### Inherited from

IoColorMixin(IoSlider).constructor

## Accessors

### GlUtils

• `Static` `get` **GlUtils**(): `string`

#### Returns

`string`

#### Overrides

IoColorMixin(IoSlider).GlUtils

#### Defined in

[elements/color/color-slider.ts:20](https://github.com/io-gui/iogui/blob/tsc/src/elements/color/color-slider.ts#L20)

___

### Properties

• `Static` `get` **Properties**(): `any`

#### Returns

`any`

#### Overrides

IoColorMixin(IoSlider).Properties

#### Defined in

[elements/color/color-slider.ts:12](https://github.com/io-gui/iogui/blob/tsc/src/elements/color/color-slider.ts#L12)

## Methods

### \_notifyValueChange

▸ **_notifyValueChange**(): `void`

#### Returns

`void`

#### Defined in

[elements/color/color-slider.ts:79](https://github.com/io-gui/iogui/blob/tsc/src/elements/color/color-slider.ts#L79)

___

### \_onKeydown

▸ **_onKeydown**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `KeyboardEvent` |

#### Returns

`void`

#### Defined in

[elements/color/color-slider.ts:61](https://github.com/io-gui/iogui/blob/tsc/src/elements/color/color-slider.ts#L61)

___

### \_onPointermoveThrottled

▸ **_onPointermoveThrottled**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Defined in

[elements/color/color-slider.ts:75](https://github.com/io-gui/iogui/blob/tsc/src/elements/color/color-slider.ts#L75)

___

### \_setDecrease

▸ **_setDecrease**(): `void`

#### Returns

`void`

#### Defined in

[elements/color/color-slider.ts:67](https://github.com/io-gui/iogui/blob/tsc/src/elements/color/color-slider.ts#L67)

___

### \_setIncrease

▸ **_setIncrease**(): `void`

#### Returns

`void`

#### Defined in

[elements/color/color-slider.ts:65](https://github.com/io-gui/iogui/blob/tsc/src/elements/color/color-slider.ts#L65)

___

### \_setMax

▸ **_setMax**(): `void`

#### Returns

`void`

#### Defined in

[elements/color/color-slider.ts:72](https://github.com/io-gui/iogui/blob/tsc/src/elements/color/color-slider.ts#L72)

___

### \_setMin

▸ **_setMin**(): `void`

#### Returns

`void`

#### Defined in

[elements/color/color-slider.ts:69](https://github.com/io-gui/iogui/blob/tsc/src/elements/color/color-slider.ts#L69)

___

### \_setValue

▸ **_setValue**(`x`, `y?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y?` | `number` |

#### Returns

`void`

#### Defined in

[elements/color/color-slider.ts:84](https://github.com/io-gui/iogui/blob/tsc/src/elements/color/color-slider.ts#L84)

___

### applyAria

▸ **applyAria**(): `void`

#### Returns

`void`

#### Defined in

[elements/color/color-slider.ts:58](https://github.com/io-gui/iogui/blob/tsc/src/elements/color/color-slider.ts#L58)

___

### modeChanged

▸ **modeChanged**(): `void`

#### Returns

`void`

#### Inherited from

IoColorMixin(IoSlider).modeChanged

#### Defined in

[elements/color/color.ts:59](https://github.com/io-gui/iogui/blob/tsc/src/elements/color/color.ts#L59)

___

### setValueFromCmyk

▸ **setValueFromCmyk**(): `void`

#### Returns

`void`

#### Inherited from

IoColorMixin(IoSlider).setValueFromCmyk

#### Defined in

[elements/color/color.ts:200](https://github.com/io-gui/iogui/blob/tsc/src/elements/color/color.ts#L200)

___

### setValueFromHsl

▸ **setValueFromHsl**(): `void`

#### Returns

`void`

#### Inherited from

IoColorMixin(IoSlider).setValueFromHsl

#### Defined in

[elements/color/color.ts:154](https://github.com/io-gui/iogui/blob/tsc/src/elements/color/color.ts#L154)

___

### setValueFromHsv

▸ **setValueFromHsv**(): `void`

#### Returns

`void`

#### Inherited from

IoColorMixin(IoSlider).setValueFromHsv

#### Defined in

[elements/color/color.ts:108](https://github.com/io-gui/iogui/blob/tsc/src/elements/color/color.ts#L108)

___

### setValueFromRgb

▸ **setValueFromRgb**(): `void`

#### Returns

`void`

#### Inherited from

IoColorMixin(IoSlider).setValueFromRgb

#### Defined in

[elements/color/color.ts:62](https://github.com/io-gui/iogui/blob/tsc/src/elements/color/color.ts#L62)

___

### valueChanged

▸ **valueChanged**(): `void`

#### Returns

`void`

#### Inherited from

IoColorMixin(IoSlider).valueChanged

#### Defined in

[elements/color/color.ts:249](https://github.com/io-gui/iogui/blob/tsc/src/elements/color/color.ts#L249)

___

### valueMutated

▸ **valueMutated**(): `void`

#### Returns

`void`

#### Overrides

IoColorMixin(IoSlider).valueMutated

#### Defined in

[elements/color/color-slider.ts:55](https://github.com/io-gui/iogui/blob/tsc/src/elements/color/color-slider.ts#L55)
