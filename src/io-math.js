/** @license
 * The MIT License
 *
 * Copyright © 2019 Aleksandar (Aki) Rodić
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * marked - a markdown parser
 * Copyright (c) 2011-2018, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
 */

/*
 GLSL Color Space Utility Functions
 (c) 2015 tobspr
 -------------------------------------------------------------------------------
 The MIT License (MIT)
 Copyright (c) 2015
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 -------------------------------------------------------------------------------
 Most formulars / matrices are from:
 https://en.wikipedia.org/wiki/SRGB
 Some are from:
 http://www.chilliant.com/rgb2hsv.html
 https://www.fourcc.org/fccyvrgb.php
 https://github.com/tobspr/GLSL-Color-Spaces/blob/master/ColorSpaces.inc.glsl
 */

import "./io-elements.js";

export {IoHsvaSv} from "./math/hsv-sv.js";
export {IoHsvaHue} from "./math/hsv-hue.js";
export {IoHsvaAlpha} from "./math/hsv-alpha.js";
export {IoColorPicker} from "./math/color-picker.js";
export {IoColorSwatch} from "./math/color-swatch.js";

export {IoVector2} from "./math/vector2.js";
export {IoVector3} from "./math/vector3.js";
export {IoVector4} from "./math/vector4.js";
export {IoMatrix2} from "./math/matrix2.js";
export {IoMatrix3} from "./math/matrix3.js";
export {IoMatrix4} from "./math/matrix4.js";
export {IoRgb} from "./math/rgb.js";
export {IoRgba} from "./math/rgba.js";
