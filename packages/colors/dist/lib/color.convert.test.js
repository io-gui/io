import { describe, it, expect } from 'vitest';
import { hsl2rgb, rgb2hsl, rgb2hsv, hsv2rgb } from '@io-gui/colors';
describe('color.convert.test', () => {
    it('should convert rgb to hsl', () => {
        const rgb = [255, 0, 0];
        const hsl = rgb2hsl(rgb);
        expect(hsl).toEqual([0, 100, 50]);
    });
    it('should convert hsl to rgb', () => {
        const hsl = [0, 100, 50];
        const rgb = hsl2rgb(hsl);
        expect(rgb).toEqual([255, 0, 0]);
    });
    it('should convert rgb to hsv', () => {
        const rgb = [255, 0, 0];
        const hsv = rgb2hsv(rgb);
        expect(hsv).toEqual([0, 100, 100]);
    });
    it('should convert hsv to rgb', () => {
        const hsv = [0, 100, 100];
        const rgb = hsv2rgb(hsv);
        expect(rgb).toEqual([255, 0, 0]);
    });
});
//# sourceMappingURL=color.convert.test.js.map